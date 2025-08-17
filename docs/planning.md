# Plan de Desarrollo - Tienda_Ropa

## Tareas Pendientes

### Backend

- [ ] **Proceso de Pago:**
    - [x] Modificar la integración de Mercado Pago para incluir el nro. de orden en el título del producto.
    - [x] Implementar webhook para recibir notificaciones de pago de Mercado Pago y actualizar el estado del pedido y decrementar el stock.

### Frontend

- [x] **Stock:**
    - [x] Mostrar etiqueta "Sin stock" superpuesta en la imagen del producto.
    - [x] Deshabilitar el botón de compra para productos sin stock.

- [x] **Sistema de Emails (Gmail SMTP):**
    - [ ] Implementar verificación de email en el proceso de registro.
    - [x] Configurar templates de email para confirmación de cuenta.
    - [x] **Formulario de Contacto**: Usar Gmail SMTP backend
        - [x] Crear endpoint backend para recibir mensajes de contacto
        - [x] Plantilla HTML para emails de contacto
        - [x] Conectar formulario frontend con API de emails
        - [x] Configurar Gmail SMTP para envío automático de consultas

- [x] **Vista de Pedidos para Usuario:**
    - [x] Crear OrdersView.vue para mostrar historial de pedidos
    - [x] Crear OrderDetailView.vue para detalles específicos de pedido
    - [x] Implementar API endpoint para obtener pedidos del usuario
    - [x] Integrar con sistema de autenticación
    - [x] Añadir navegación desde emails de confirmación

- [x] **Arquitectura y Configuración:**
    - [x] **CRÍTICO**: Resolver duplicación de archivos de configuración:
        - No existía duplicación real entre `config.ts` y `config/app.ts`
        - Configuración ya estaba unificada en directorio `config/`
        - Todas las importaciones actualizadas para usar configuración unificada
    - [x] Verificar que todos los imports usen la configuración unificada

## Hecho

### Backend

- [x] **Autenticación:**
    - [x] Implementar registro de usuarios.
    - [x] Implementar login de usuarios con JWT.
    - [x] Implementar roles de usuario (cliente, admin).
- [x] **Productos:**
    - [x] CRUD de productos.
    - [x] API para listar productos con paginación y filtros.
    - [x] API para obtener detalles de un producto.
- [x] **Stock:**
    - [x] Añadir atributo de `stock` al modelo de producto.
    - [x] API para verificar el stock de un producto.
    - [x] Decrementar el stock después de una compra exitosa.
- [x] **Carrito de Compras:**
    - [x] API para agregar productos al carrito.
    - [x] API para ver el contenido del carrito.
    - [x] API para eliminar productos del carrito.
    - [x] API para vaciar el carrito.
- [x] **Proceso de Pago:**
    - [x] Integración con pasarela de pagos (ej. Stripe, MercadoPago).
    - [x] API para procesar pagos.
    - [x] API para guardar historial de órdenes.
- [x] **Admin:**
    - [x] API para gestionar usuarios.
    - [x] API para gestionar productos.
    - [x] API para ver órdenes.
- [x] **Sistema de Emails:**
    - [x] Configuración Gmail SMTP en settings.py
    - [x] Servicio mailer con Jinja2 para templates
    - [x] API endpoints para emails de bienvenida y notificaciones
    - [x] Templates HTML responsivos para emails
    - [x] Integración con FastAPI y CORS configurado

### Frontend

- [x] **Autenticación:**
    - [x] Conectar vistas de registro y login con el backend.
    - [x] Guardar token JWT en el estado (Pinia).
    - [x] Proteger rutas que requieran autenticación.
- [x] **Productos:**
    - [x] Conectar `CollectionView` y `ProductDetailView` con la API del backend.
    - [x] Implementar filtros y paginación en la vista de colección.
- [x] **Carrito de Compras:**
    - [x] Conectar `CartView` y `ShoppingCart` con la API del backend.
- [x] **Proceso de Pago:**
    - [x] Conectar `CheckoutView` con la API de pagos.
    - [x] Al enviar la información a Mercado Pago, incluir el nro. de orden de compra en el título del producto.
- [x] **Admin:**
    - [x] Conectar vistas de admin con las APIs correspondientes.
- [x] **UI/UX Componentes:**
    - [x] **DeliveryProgress Component**: Implementado componente de progreso de entrega
        - [x] 3 pasos: Carrito → Entrega → Pago
        - [x] Círculos numerados con estados dinámicos
        - [x] Líneas de progreso animadas
        - [x] Iconos de check para pasos completados
        - [x] Integrado en CheckoutView.vue
        - [x] Responsive design (mobile/desktop)
        - [x] Consistente con fuentes definidas en styles.css (Lato family)
        - [x] Animaciones suaves con Tailwind CSS
