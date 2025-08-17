import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

// Toast configuration
const toastOptions = {
    position: 'top-right' as const,
    timeout: 4000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false
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
