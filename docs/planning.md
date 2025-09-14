# Plan de Desarrollo - mvintage

## Tareas Pendientes

### Backend

- [ ] **Proceso de Pago:**
    - [x] Modificar la integración de Mercado Pago para incluir el nro. de orden en el título del producto.
    - [x] Implementar webhook para recibir notificaciones de pago de Mercado Pago y actualizar el estado del pedido y decrementar el stock.

### Frontend

<<<<<<< HEAD
=======
- [ ] **Checkout Simplificado (Patrón Bohme Clothes):**
    - [x] Eliminar estado de loading innecesario de cotización de envíos
    - [x] Reducir espaciado y padding del formulario de dirección
    - [x] Ajustar ancho del input de código postal para 4-6 caracteres
    - [x] Rediseñar formulario siguiendo patrón Bohme: Nombre, Apellido, Teléfono
    - [x] Separar campos de dirección: Calle, Número, Departamento, Barrio, Ciudad
    - [x] Implementar modal para editar código postal con autocompletado de ciudad
    - [ ] **PENDIENTE**: Actualizar variables reactivas en CheckoutView para nuevos campos
    - [ ] **PENDIENTE**: Corregir errores de TypeScript en props y emits
    - [ ] **PENDIENTE**: Simplificar flujo a 3 pasos: Carrito → Entrega → Pago

>>>>>>> dev
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
- [x] **Sistema de Permisos:**
    - [x] **CRÍTICO**: Corrección de validación de roles en endpoint /users/debug
        - Problema: Búsqueda de "ADMIN" (mayúsculas) en roles "admin" (minúsculas) causaba falsos negativos
        - Solución: Cambio a comparación exacta con .lower() en backend/app/routes/users.py:195-196
        - Resultado: Usuarios admin/manager ahora pueden crear/editar productos correctamente
        - No requirió cambios en base de datos ni sistema principal de seguridad

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

## Sistema de Seguimiento de Envíos y Gestión Admin (Próxima Fase)

### Objetivo Principal
Crear un sistema completo de seguimiento que genere **confianza total** en los clientes, eliminando cualquier sensación de "página de estafa". Los usuarios deben poder ver y rastrear sus compras en tiempo real.

### Backend - Modelos y API

- [ ] **Actualizar Modelo Order:**
    - [ ] Agregar campo `tracking_number` (VARCHAR 255, nullable)
    - [ ] Agregar campo `shipping_provider` (VARCHAR 100, nullable) - 'correo-argentino', 'oca', 'andreani'
    - [ ] Agregar campo `shipped_at` (TIMESTAMP nullable)
    - [ ] Crear migración Alembic para nuevos campos

- [ ] **API Endpoints Admin:**
    - [ ] `PUT /api/v1/admin/orders/{id}/shipping` - Actualizar info de envío
    - [ ] `GET /api/v1/admin/orders?status=pending_shipment` - Pedidos listos para enviar
    - [ ] `POST /api/v1/admin/orders/{id}/mark-shipped` - Marcar como enviado
    - [ ] Validaciones para formatos de tracking numbers

- [ ] **Controladores y Lógica:**
    - [ ] `OrderController.update_shipping_info()`
    - [ ] `OrderController.mark_as_shipped()`
    - [ ] Notificaciones automáticas por email cuando se marca como enviado
    - [ ] Sistema de estados: pending → approved → shipped → delivered

### Frontend Admin - Panel de Gestión

- [ ] **AdminOrdersView.vue - Gestión Principal:**
    - [ ] Vista principal con filtros por estado de envío
    - [ ] Filtros: "Listos para Enviar", "Enviados", "Todos", "Problemáticos"
    - [ ] Contador de pedidos pendientes de envío
    - [ ] Tabla responsive con información clave de pedidos

- [ ] **Componente ShippingManager.vue:**
    - [ ] Selector de proveedor (Correo Argentino, OCA, Andreani)
    - [ ] Input validado para número de tracking
    - [ ] Botón "Marcar como Enviado" con confirmación
    - [ ] Preview de información que verá el cliente
    - [ ] Bulk actions para múltiples pedidos

- [ ] **Navegación y UX Admin:**
    - [ ] Agregar "Gestión de Envíos" al menú admin existente
    - [ ] Badge con contador de pedidos pendientes de envío
    - [ ] Notificaciones push para pedidos que necesitan atención
    - [ ] Dashboard con KPIs: tiempo promedio de procesamiento, provider más usado

### Frontend Cliente - Experiencia de Usuario

- [ ] **Mejorar Navbar.vue:**
    - [ ] Agregar menú desplegable "Mi Cuenta" para usuarios autenticados
    - [ ] Links: "Mis Pedidos", "Mi Perfil", "Cerrar Sesión"
    - [ ] Quitar "Cerrar Sesión" suelto y organizarlo en menú
    - [ ] Badge de notificaciones para pedidos enviados

- [ ] **Crear AccountDashboard.vue:**
    - [ ] Vista `/account/dashboard` como hub principal del usuario  
    - [ ] Último pedido realizado con estado actual
    - [ ] Accesos rápidos a "Mis Pedidos", "Mi Perfil"
    - [ ] Información de contacto/soporte visible
    - [ ] Diseño que inspire confianza y profesionalismo

- [ ] **Mejorar OrderDetailView.vue:**
    - [ ] Timeline visual de estados: Confirmado → Pagado → Enviado → Entregado
    - [ ] Sección destacada con número de tracking cuando esté disponible
    - [ ] Enlaces directos a páginas de seguimiento (Correo, OCA, Andreani)
    - [ ] Botón "Copiar tracking" con feedback visual
    - [ ] Información de soporte: WhatsApp, email, claramente visible
    - [ ] Estados con iconos y colores diferenciados

- [ ] **Mejorar OrdersView.vue:**
    - [ ] Filtros por estado de envío (Todos, Pendientes, Enviados, Entregados)
    - [ ] Búsqueda por número de pedido
    - [ ] Preview de tracking number en lista de pedidos
    - [ ] Estado "Enviado" con ícono especial y fecha
    - [ ] Mejor presentación visual de estados con progress bars

- [ ] **Flujo Post-Compra:**
    - [ ] Modificar CheckoutView.vue para redirigir a `/orders/{id}` después del éxito
    - [ ] En lugar de ir a home, mostrar inmediatamente el pedido creado
    - [ ] Mensaje de éxito con enlace destacado al pedido
    - [ ] Información clara sobre próximos pasos

### Sistema de Roles y Navegación

- [ ] **Reestructurar Navegación:**
    - [ ] Proteger todas las rutas `/account/*` con autenticación
    - [ ] Guards de ruta para verificar ownership de pedidos
    - [ ] Redirecciones automáticas si no autenticado

- [ ] **Vista de Perfil:**
    - [ ] `/account/profile` para datos personales del usuario
    - [ ] Historial resumido de compras
    - [ ] Configuraciones de notificaciones (email, WhatsApp)
    - [ ] Datos de facturación y envío guardados

### Integraciones Externas (Fase Avanzada)

- [ ] **APIs de Seguimiento:**
    - [ ] Integración con API de Correo Argentino para estado automático
    - [ ] Integración con OCA y Andreani si disponible
    - [ ] Cache de estados de seguimiento (actualizar cada 4 horas)
    - [ ] Webhook receivers para actualizaciones automáticas

- [ ] **Notificaciones Automáticas:**
    - [ ] Email cuando pedido es marcado como enviado
    - [ ] WhatsApp opcional con número de tracking
    - [ ] Notificaciones push en la web app
    - [ ] Recordatorios de seguimiento después de X días

### Testing y QA

- [ ] **Tests Backend:**
    - [ ] Unit tests para nuevos endpoints de shipping
    - [ ] Integration tests para flujo completo de envío
    - [ ] Tests de validación de tracking numbers
    - [ ] Tests de permisos admin vs cliente

- [ ] **Tests Frontend:**
    - [ ] E2E test del flujo completo: compra → admin carga tracking → cliente ve seguimiento
    - [ ] Tests de componentes admin (ShippingManager, AdminOrders)
    - [ ] Tests de navegación y guards de rutas
    - [ ] Tests responsive en móvil y desktop

## Métricas de Éxito

### Para el Negocio
- [ ] **Reducir consultas de soporte** por estado de pedidos en 80%
- [ ] **Incrementar confianza del cliente** - medido por surveys post-compra
- [ ] **Reducir abandonos post-compra** - clientes que no vuelven después del primer pedido
- [ ] **Mejorar tiempo de procesamiento** - desde pago confirmado hasta marcado como enviado

### Para la Experiencia
- [ ] **Cliente ve su pedido inmediatamente** después de comprarlo
- [ ] **Acceso fácil a "Mis Pedidos"** desde cualquier página (navbar)
- [ ] **Número de tracking visible y funcional** en menos de 24hs post-envío
- [ ] **Enlaces de seguimiento que funcionan** en páginas de correos
- [ ] **Información de soporte siempre visible** en vistas de pedidos

## Fases de Implementación

### **Fase 1: Fundamentos (Semana 1-2)**
1. Actualizar modelos y crear APIs
2. Vista admin básica para cargar tracking
3. Mejorar OrderDetail para mostrar tracking
4. Agregar navegación "Mi Cuenta"

### **Fase 2: Experiencia Completa (Semana 3-4)** 
1. Dashboard de usuario
2. Timeline visual de estados
3. Redirección post-compra
4. Panel admin completo con filtros

### **Fase 3: Automatización (Semana 5-6)**
1. Integraciones con APIs de correos
2. Notificaciones automáticas
3. Reportes y analytics
4. Optimizaciones de UX

## Documentación Relacionada
- Ver `docs/shipping-system.md` para detalles técnicos
- Ver `docs/user-experience.md` para flujos de usuario  
- Ver `docs/admin-workflows.md` para procesos administrativos
