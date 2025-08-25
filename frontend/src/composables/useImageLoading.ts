import { ref, onMounted, onUnmounted } from 'vue'

export interface ImageLoadingState {
    loading: boolean
    error: boolean
    loaded: boolean
}

export function useImageLoading() {
    const imageStates = ref<Map<string, ImageLoadingState>>(new Map())
    let observer: IntersectionObserver | null = null

    const initializeImageState = (src: string): ImageLoadingState => {
        const state = {
            loading: false,
            error: false,
            loaded: false
        }
        imageStates.value.set(src, state)
        return state
    }

    const getImageState = (src: string): ImageLoadingState => {
        return imageStates.value.get(src) || initializeImageState(src)
    }

    const setImageLoading = (src: string, loading: boolean) => {
        const state = getImageState(src)
        state.loading = loading
        imageStates.value.set(src, { ...state })
    }

    const setImageLoaded = (src: string) => {
        const state = getImageState(src)
        state.loading = false
        state.loaded = true
        state.error = false
        imageStates.value.set(src, { ...state })
    }

    const setImageError = (src: string) => {
        const state = getImageState(src)
        state.loading = false
        state.error = true
        state.loaded = false
        imageStates.value.set(src, { ...state })
    }

    const setupLazyLoading = () => {
        if (typeof window === 'undefined') return
        if ('IntersectionObserver' in window) {
            observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target as HTMLImageElement
                        const src = img.dataset.src
                        if (src) {
                            setImageLoading(src, true)
                            img.src = src
                            img.removeAttribute('data-src')
                            observer?.unobserve(img)
                        }
                    }
                })
            }, { rootMargin: '50px' })
        }
    }

    const observeImage = (element: HTMLImageElement) => {
        if (!observer) return
        observer.observe(element)
    }

    onMounted(() => {
        setupLazyLoading()
    })

    onUnmounted(() => {
        observer?.disconnect()
    })

    return {
        imageStates,
        getImageState,
        setImageLoading,
        setImageLoaded,
        setImageError,
        observeImage
    }
}
