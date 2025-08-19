import { ref } from 'vue'
import type { Product, ProductVariant } from '../types'

interface NotificationProductData {
  image: string
  name: string
  quantity: number
  price: number
  variant?: {
    color: string
    size: string
  }
}

const isNotificationVisible = ref(false)
const productData = ref<NotificationProductData | null>(null)
let autoHideTimer: number | null = null

export function useCartNotification() {
  const showNotification = (
    product: Product, 
    quantity: number, 
    selectedVariant?: ProductVariant
  ) => {
    // Preparar datos del producto para la notificación
    const price = product.has_discount ? product.discounted_price : product.price
    const image = product.images && product.images.length > 0 
      ? product.images[0].image_url 
      : '/placeholder-image.jpg'

    productData.value = {
      image,
      name: product.name,
      quantity,
      price,
      variant: selectedVariant ? {
        color: selectedVariant.color.name,
        size: selectedVariant.size.name
      } : undefined
    }

    isNotificationVisible.value = true
    
    // Auto hide después de 3 segundos
    if (autoHideTimer) clearTimeout(autoHideTimer)
    autoHideTimer = window.setTimeout(() => {
      hideNotification()
    }, 3000)
  }

  const hideNotification = () => {
    isNotificationVisible.value = false
    if (autoHideTimer) {
      clearTimeout(autoHideTimer)
      autoHideTimer = null
    }
  }

  return {
    isNotificationVisible,
    productData,
    showNotification,
    hideNotification
  }
}