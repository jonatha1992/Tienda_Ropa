# Scripts de Testing para Autenticación

Este directorio contiene scripts para ejecutar y gestionar las pruebas de autenticación.

## Scripts Disponibles

### Backend Tests
```bash
# Ejecutar todas las pruebas del backend
python -m pytest backend/tests/ -v

# Ejecutar solo tests de autenticación
python -m pytest backend/tests/test_auth_firebase.py -v
python -m pytest backend/tests/test_users_auth_endpoints.py -v
python -m pytest backend/tests/test_user_controller.py -v

# Ejecutar tests de integración
python -m pytest backend/tests/test_auth_integration.py -v

# Ejecutar con coverage
python -m pytest backend/tests/ --cov=app --cov-report=html
```

### Frontend Tests
```bash
# Ejecutar todas las pruebas del frontend
cd frontend ; npm test

# Ejecutar tests específicos
cd frontend && npm test auth.store.test.ts
cd frontend && npm test Auth.component.test.ts
cd frontend && npm test auth.e2e.test.ts

# Ejecutar en modo watch
cd frontend && npm test -- --watch

# Ejecutar con coverage
cd frontend && npm test -- --coverage
```

## Configuración

### Variables de Entorno para Tests
Crear un archivo `.env.test` en el backend:
```
ENVIRONMENT=test
DATABASE_URL=sqlite:///./test.db
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase_service_account.json
```

### Configuración Firebase para Tests
1. Usar emulador de Firebase Auth para tests:
```bash
firebase emulators:start --only auth
```

2. O usar mocks (como se hace actualmente)

## Estructura de Tests

### Backend
- `test_auth_firebase.py`: Tests unitarios para verificación de tokens Firebase
- `test_users_auth_endpoints.py`: Tests de endpoints con autenticación
- `test_user_controller.py`: Tests de controladores de usuario
- `test_auth_integration.py`: Tests de integración completos

### Frontend
- `auth.store.test.ts`: Tests del store de autenticación
- `Auth.component.test.ts`: Tests del componente de login
- `auth.e2e.test.ts`: Tests end-to-end del flujo completo

## Comandos Útiles

### Limpiar y reconstruir tests
```bash
# Backend
cd backend
rm -rf .pytest_cache
rm -rf __pycache__
rm -f test.db

# Frontend
cd frontend
rm -rf node_modules/.cache
npm ci
```

### Debugging Tests
```bash
# Backend con debugger
python -m pytest backend/tests/test_auth_firebase.py::TestFirebaseAuth::test_verify_firebase_token_success -v -s

# Frontend con debug info
cd frontend && npm test -- --reporter=verbose
```

## CI/CD Integration

Los tests están configurados para ejecutarse en GitHub Actions. Ver `.github/workflows/test.yml` para la configuración completa.

### Local CI Simulation
```bash
# Simular el pipeline completo
./scripts/run_all_tests.sh
```
