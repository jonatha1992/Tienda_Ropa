# Plan de Desarrollo - Tienda_Ropa

## Tareas Pendientes

### Backend

- [ ] **Proceso de Pago:**
    - [ ] Modificar la integración de Mercado Pago para incluir el nro. de orden en el título del producto.
    - [ ] Implementar webhook para recibir notificaciones de pago de Mercado Pago y actualizar el estado del pedido.

### Frontend

- [ ] **Stock:**
    - [ ] Mostrar etiqueta "Sin stock" superpuesta en la imagen del producto.
    - [ ] Deshabilitar el botón de compra para productos sin stock.

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
