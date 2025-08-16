"""
Tests para el módulo de pagos con MercadoPago
"""
import pytest
from unittest.mock import Mock, patch
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine, SQLModel
from sqlmodel.pool import StaticPool

from app.main import app
from app.db.session import get_session
from app.models.order import Order, PaymentMethod, PaymentStatus
from app.models.customer import Customer
from app.controllers.payments_controller import PaymentsController


# Test database setup
@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_customer(session: Session):
    """Crear un cliente de prueba"""
    customer = Customer(
        name="Juan Pérez",
        email="juan@example.com",
        phone="1234567890",
        address="Calle Falsa 123"
    )
    session.add(customer)
    session.commit()
    session.refresh(customer)
    return customer


@pytest.fixture
def sample_order(session: Session, sample_customer: Customer):
    """Crear una orden de prueba"""
    order = Order(
        customer_id=sample_customer.id,
        total=1500.0,
        payment_method=PaymentMethod.MERCADOPAGO,
        payment_status=PaymentStatus.PENDING
    )
    session.add(order)
    session.commit()
    session.refresh(order)
    return order


class TestPaymentsController:
    """Tests para PaymentsController"""
    
    def test_init_without_token(self):
        """Test inicialización sin token de MercadoPago"""
        with patch('app.controllers.payments_controller.settings.MERCADOPAGO_ACCESS_TOKEN', None):
            controller = PaymentsController()
            assert controller.sdk is None
    
    @patch('app.controllers.payments_controller.mercadopago.SDK')
    def test_init_with_token(self, mock_sdk):
        """Test inicialización con token de MercadoPago"""
        with patch('app.controllers.payments_controller.settings.MERCADOPAGO_ACCESS_TOKEN', 'test_token'):
            controller = PaymentsController()
            mock_sdk.assert_called_once_with('test_token')
    
    @patch('app.controllers.payments_controller.mercadopago.SDK')
    def test_create_preference_success(self, mock_sdk, session: Session, sample_order: Order):
        """Test creación exitosa de preferencia"""
        # Mock SDK response
        mock_preference = Mock()
        mock_preference.create.return_value = {
            "status": 201,
            "response": {
                "id": "test_preference_id",
                "init_point": "https://mercadopago.com/test",
                "sandbox_init_point": "https://sandbox.mercadopago.com/test"
            }
        }
        mock_sdk.return_value.preference.return_value = mock_preference
        
        with patch('app.controllers.payments_controller.settings.MERCADOPAGO_ACCESS_TOKEN', 'test_token'):
            controller = PaymentsController()
            result = controller.create_preference(sample_order.id, session)
        
        assert result["preference_id"] == "test_preference_id"
        assert result["init_point"] == "https://mercadopago.com/test"
        assert result["order_id"] == sample_order.id
        
        # Verificar que la orden se actualizó
        session.refresh(sample_order)
        assert sample_order.mercadopago_preference_id == "test_preference_id"
        assert sample_order.payment_status == PaymentStatus.PENDING_PAYMENT
    
    def test_create_preference_no_sdk(self, session: Session, sample_order: Order):
        """Test creación de preferencia sin SDK configurado"""
        controller = PaymentsController()
        controller.sdk = None
        
        with pytest.raises(Exception) as exc_info:
            controller.create_preference(sample_order.id, session)
        
        assert "MercadoPago no configurado" in str(exc_info.value)
    
    def test_create_preference_order_not_found(self, session: Session):
        """Test creación de preferencia con orden inexistente"""
        with patch('app.controllers.payments_controller.settings.MERCADOPAGO_ACCESS_TOKEN', 'test_token'):
            controller = PaymentsController()
            
            with pytest.raises(Exception) as exc_info:
                controller.create_preference(999, session)
            
            assert "Orden no encontrada" in str(exc_info.value)
    
    @patch('app.controllers.payments_controller.mercadopago.SDK')
    def test_process_webhook_success(self, mock_sdk, session: Session, sample_order: Order):
        """Test procesamiento exitoso de webhook"""
        # Mock SDK response
        mock_payment = Mock()
        mock_payment.get.return_value = {
            "status": 200,
            "response": {
                "id": "test_payment_id",
                "status": "approved",
                "external_reference": str(sample_order.id),
                "payment_method_id": "visa",
                "payment_type_id": "credit_card"
            }
        }
        mock_sdk.return_value.payment.return_value = mock_payment
        
        webhook_data = {
            "type": "payment",
            "data": {"id": "test_payment_id"}
        }
        
        with patch('app.controllers.payments_controller.settings.MERCADOPAGO_ACCESS_TOKEN', 'test_token'):
            controller = PaymentsController()
            result = controller.process_webhook(webhook_data, session)
        
        assert result["status"] == "success"
        assert result["order_id"] == str(sample_order.id)
        
        # Verificar que la orden se actualizó
        session.refresh(sample_order)
        assert sample_order.payment_status == PaymentStatus.APPROVED
        assert sample_order.mercadopago_payment_id == "test_payment_id"
    
    def test_process_webhook_invalid_type(self, session: Session):
        """Test webhook con tipo inválido"""
        with patch('app.controllers.payments_controller.settings.MERCADOPAGO_ACCESS_TOKEN', 'test_token'):
            controller = PaymentsController()
            
            webhook_data = {"type": "merchant_order"}
            result = controller.process_webhook(webhook_data, session)
            
            assert result["status"] == "ignored"
            assert result["reason"] == "not_payment_notification"
    
    def test_get_payment_status(self, session: Session, sample_order: Order):
        """Test obtención de estado de pago"""
        with patch('app.controllers.payments_controller.settings.MERCADOPAGO_ACCESS_TOKEN', 'test_token'):
            controller = PaymentsController()
            result = controller.get_payment_status(sample_order.id, session)
        
        assert result["order_id"] == sample_order.id
        assert result["payment_method"] == sample_order.payment_method
        assert result["payment_status"] == sample_order.payment_status
        assert result["total"] == sample_order.total


class TestPaymentsAPI:
    """Tests para endpoints de pagos"""
    
    def test_create_preference_endpoint(self, client: TestClient, sample_order: Order):
        """Test endpoint de creación de preferencia"""
        with patch('app.routes.payments.payments_controller.create_preference') as mock_create:
            mock_create.return_value = {
                "preference_id": "test_id",
                "init_point": "https://test.com",
                "order_id": sample_order.id
            }
            
            # Mock authentication
            with patch('app.core.security.get_current_user', return_value={"id": 1}):
                response = client.post(
                    f"/api/v1/payments/create-preference?order_id={sample_order.id}"
                )
        
        assert response.status_code == 200
        data = response.json()
        assert data["preference_id"] == "test_id"
        assert data["init_point"] == "https://test.com"
    
    def test_webhook_endpoint(self, client: TestClient):
        """Test endpoint de webhook"""
        webhook_data = {
            "type": "payment",
            "data": {"id": "test_payment_id"}
        }
        
        with patch('app.routes.payments.payments_controller.process_webhook') as mock_process:
            mock_process.return_value = {"status": "success"}
            
            response = client.post("/api/v1/payments/webhook", json=webhook_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
    
    def test_payment_status_endpoint(self, client: TestClient, sample_order: Order):
        """Test endpoint de estado de pago"""
        with patch('app.routes.payments.payments_controller.get_payment_status') as mock_status:
            mock_status.return_value = {
                "order_id": sample_order.id,
                "payment_status": "approved"
            }
            
            # Mock authentication
            with patch('app.core.security.get_current_user', return_value={"id": 1}):
                response = client.get(f"/api/v1/payments/status/{sample_order.id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["order_id"] == sample_order.id
        assert data["payment_status"] == "approved"


class TestOrdersIntegration:
    """Tests de integración con órdenes"""
    
    def test_create_order_with_mercadopago(self, client: TestClient, sample_customer: Customer):
        """Test creación de orden con MercadoPago"""
        order_data = {
            "customer_id": sample_customer.id,
            "total": 1500.0,
            "payment_method": "mercadopago"
        }
        
        with patch('app.routes.orders.payments_controller.create_preference') as mock_create:
            mock_create.return_value = {
                "preference_id": "test_id",
                "init_point": "https://test.com"
            }
            
            # Mock authentication
            with patch('app.core.security.get_current_user', return_value={"id": 1}):
                response = client.post("/api/v1/orders/", json=order_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "order" in data
        assert "payment_preference" in data
        assert data["order"]["payment_method"] == "mercadopago"
        assert data["order"]["payment_status"] == "pending_payment"
    
    def test_create_order_with_transfer(self, client: TestClient, sample_customer: Customer):
        """Test creación de orden con transferencia"""
        order_data = {
            "customer_id": sample_customer.id,
            "total": 1500.0,
            "payment_method": "transfer"
        }
        
        # Mock authentication
        with patch('app.core.security.get_current_user', return_value={"id": 1}):
            response = client.post("/api/v1/orders/", json=order_data)
        
        assert response.status_code == 200
        data = response.json()
        assert "order" in data
        assert data["order"]["payment_method"] == "transfer"
        assert data["order"]["payment_status"] == "pending"
        assert "payment_preference" not in data
