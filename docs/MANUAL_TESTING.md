# Manual de Pruebas de Autenticación

Este documento describe cómo realizar pruebas manuales del sistema de autenticación Firebase integrado entre frontend y backend.

## Configuración Inicial

### 1. Configurar Variables de Entorno

#### Backend (.env)
```bash
ENVIRONMENT=development
DATABASE_URL=sqlite:///./db.sqlite3
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase_service_account.json
```

#### Frontend (.env.local)
```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project.appspot.com
VITE_MESSAGING_SENDER_ID=123456789
VITE_APP_ID=1:123456789:web:abcdef123456
```

### 2. Iniciar Servicios

```bash
# Terminal 1 - Backend
cd backend
source .venv/Scripts/activate  # Windows
# source .venv/bin/activate     # Mac/Linux
uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Pruebas Manuales

### 1. Verificar Endpoints Base

#### Backend Health Check
```bash
curl http://localhost:8000/health
# Expect: {"status": "ok"}
```

#### Frontend Loading
- Abrir http://localhost:5173
- Verificar que la página carga sin errores
- Abrir DevTools y verificar que no hay errores en consola

### 2. Pruebas de Autenticación Sin Token

#### Test 1: Endpoint Protegido Sin Autenticación
```bash
curl http://localhost:8000/api/v1/users/me
# Expect: 403 Forbidden
# {"detail": "Not authenticated"}
```

#### Test 2: Token Inválido
```bash
curl -H "Authorization: Bearer invalid_token" http://localhost:8000/api/v1/users/me
# Expect: 401 Unauthorized
# {"detail": "Invalid Firebase token"}
```

### 3. Pruebas de Autenticación en Frontend

#### Test 3: Página de Login
1. Ir a http://localhost:5173/auth
2. Verificar que aparece el formulario de login
3. Verificar que está el botón de "Continuar con Google"
4. Verificar que está el formulario email/password

#### Test 4: Registro con Email/Password
1. En la página de auth, hacer clic en "¿No tienes cuenta? Crear cuenta"
2. Ingresar email de prueba: `test@example.com`
3. Ingresar password: `password123`
4. Hacer clic en "Crear Cuenta"
5. **Resultado esperado**: 
   - Usuario creado en Firebase
   - Redirect a `/admin/products`
   - Usuario aparece en DevTools > Application > Local Storage

#### Test 5: Login con Email/Password
1. En la página de auth, asegurar que está en modo "Iniciar Sesión"
2. Ingresar el email y password del test anterior
3. Hacer clic en "Iniciar Sesión"
4. **Resultado esperado**:
   - Login exitoso
   - Redirect a `/admin/products`
   - Token válido en Local Storage

#### Test 6: Login con Google
1. En la página de auth, hacer clic en "Continuar con Google"
2. Completar el flujo de autenticación en Google
3. **Resultado esperado**:
   - Redirect automático de vuelta a la app
   - Usuario autenticado
   - Redirect a `/admin/products`

### 4. Pruebas de Integración Frontend-Backend

#### Test 7: Sincronización con Backend
1. Autenticarse en el frontend (cualquier método)
2. Abrir DevTools > Network
3. Verificar que se hace una petición a `/api/v1/users/me`
4. **Resultado esperado**:
   - Request incluye header `Authorization: Bearer <firebase_token>`
   - Response 200 con datos del usuario
   - Usuario creado/actualizado en base de datos del backend

#### Test 8: Verificar Token en Requests
1. Con usuario autenticado, ir a `/admin/products`
2. Abrir DevTools > Network
3. Realizar cualquier acción que haga un request al backend
4. **Resultado esperado**:
   - Todos los requests incluyen `Authorization: Bearer <token>`
   - Responses son exitosas (200, 201, etc.)

### 5. Pruebas de Manejo de Errores

#### Test 9: Token Expirado
1. Autenticarse normalmente
2. Esperar 1 hora (o manipular token en DevTools)
3. Intentar hacer una acción que requiera backend
4. **Resultado esperado**:
   - Request falla con 401
   - Usuario es deslogueado automáticamente
   - Redirect a página de login

#### Test 10: Backend No Disponible
1. Autenticarse normalmente
2. Parar el servidor backend
3. Intentar hacer una acción que requiera backend
4. **Resultado esperado**:
   - Request falla
   - Error manejado gracefully
   - Usuario permanece logueado (solo Firebase)

### 6. Pruebas de Estado Persistente

#### Test 11: Refresh de Página
1. Autenticarse normalmente
2. Refrescar la página (F5)
3. **Resultado esperado**:
   - Usuario permanece autenticado
   - No se requiere login nuevamente
   - Estado de auth se restaura correctamente

#### Test 12: Nueva Tab/Ventana
1. Autenticarse en una tab
2. Abrir nueva tab con la misma URL
3. **Resultado esperado**:
   - Nueva tab reconoce la autenticación existente
   - No se requiere login

### 7. Pruebas de Logout

#### Test 13: Logout Manual
1. Autenticarse normalmente
2. Hacer clic en botón de logout (si existe)
3. **Resultado esperado**:
   - Usuario deslogueado de Firebase
   - Estado de auth limpiado
   - Redirect a página principal o login

#### Test 14: Logout por Token Inválido
1. Autenticarse normalmente
2. Manipular el token en DevTools para hacerlo inválido
3. Intentar hacer una petición al backend
4. **Resultado esperado**:
   - Backend rechaza el token
   - Frontend detecta el error 401
   - Logout automático

## Validaciones de Base de Datos

### Verificar Usuario en Backend
```sql
-- SQLite
SELECT * FROM user WHERE firebase_uid = 'uid_from_firebase';

-- Verificar que el usuario tiene:
-- - firebase_uid correcto
-- - email correcto
-- - is_active = true
-- - campos creados automáticamente
```

## Debugging

### Logs Importantes

#### Frontend (DevTools Console)
```javascript
// Verificar estado de auth
console.log('Auth Store:', useAuthStore())

// Verificar Firebase user
console.log('Firebase User:', auth.currentUser)

// Verificar token
auth.currentUser?.getIdToken().then(token => console.log('Token:', token))
```

#### Backend (Terminal)
- Logs de FastAPI aparecen automáticamente
- Verificar requests a `/users/me`
- Verificar headers de Authorization

### Problemas Comunes

1. **CORS Errors**: Verificar configuración en `main.py`
2. **Firebase Config**: Verificar variables de entorno
3. **Database Errors**: Verificar conexión y migraciones
4. **Token Errors**: Verificar service account JSON

## Automatización

Para automatizar estas pruebas, usar los scripts creados:

```bash
# Windows
.\scripts\run_auth_tests.ps1

# Mac/Linux
./scripts/run_auth_tests.sh
```

## Reportar Issues

Al reportar problemas, incluir:
1. Pasos exactos para reproducir
2. Logs de frontend (DevTools Console)
3. Logs de backend (Terminal)
4. Screenshots si es relevante
5. Información del navegador
6. Variables de entorno (sin valores sensibles)
