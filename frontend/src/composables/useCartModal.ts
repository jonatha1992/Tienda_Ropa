import { ref, onMounted, onUnmounted } from 'vue'

const isCartModalOpen = ref(false)

export function useCartModal() {
  const openCartModal = () => {
    isCartModalOpen.value = true
    // Bloquear scroll del body
    document.body.classList.add('overflow-hidden')
  }

  const closeCartModal = () => {
    isCartModalOpen.value = false
    // Restaurar scroll del body
    document.body.classList.remove('overflow-hidden')
  }

  const toggleCartModal = () => {
    if (isCartModalOpen.value) {
      closeCartModal()
    } else {
      openCartModal()
    }
  }

  // Cerrar con tecla ESC
  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isCartModalOpen.value) {
      closeCartModal()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleEscKey)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscKey)
    // Limpiar en caso de que el componente se desmonte con modal abierto
    document.body.classList.remove('overflow-hidden')
  })

  return {
    isCartModalOpen,
    openCartModal,
    closeCartModal,
    toggleCartModal
  }
}