import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

// Professional Toast configuration matching website branding
const toastOptions = {
    position: 'top-right' as const,
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false,
    transition: 'Vue-Toastification__fade',
    maxToasts: 2,
    newestOnTop: true,
    filterBeforeCreate: (toast: any, toasts: any[]) => {
        if (toasts.filter(t => t.type === toast.type).length !== 0) {
            // Prevent spam of same type
            return false;
        }
        return toast;
    }
}

app.use(router)
app.use(pinia)
app.use(Toast, toastOptions)

// Initialize cart from localStorage after Pinia is ready
app.mount('#app')

// Initialize cart with session management when app starts
if (typeof window !== 'undefined') {
    // Import cart store after pinia is initialized
    import('./store/cart').then(({ useCartStore }) => {
        const cartStore = useCartStore()
        cartStore.initializeCart()
    })
}
