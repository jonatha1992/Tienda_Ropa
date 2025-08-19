// Sistema de caché inteligente con TTL (Time To Live)
interface CacheItem<T> {
  data: T;
  expires: number;
}

class SmartCache {
  private cache = new Map<string, CacheItem<any>>();

  /**
   * Guardar datos en caché con TTL
   * @param key - Clave del caché
   * @param value - Valor a guardar
   * @param ttlMs - Tiempo de vida en milisegundos (por defecto 5 minutos)
   */
  set<T>(key: string, value: T, ttlMs = 300000): void {
    this.cache.set(key, {
      data: value,
      expires: Date.now() + ttlMs
    });
  }

  /**
   * Obtener datos del caché
   * @param key - Clave del caché
   * @returns Los datos o null si no existe o expiró
   */
  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }

    // Verificar si expiró
    if (Date.now() > cached.expires) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  /**
   * Verificar si una clave existe y no ha expirado
   * @param key - Clave del caché
   * @returns true si existe y es válida
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Eliminar una clave específica del caché
   * @param key - Clave a eliminar
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Limpiar todo el caché
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Obtener el número de elementos en caché
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Limpiar elementos expirados
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }
}

// Instancias específicas de caché para diferentes tipos de datos
export const authCache = new SmartCache();
export const masterDataCache = new SmartCache();
export const apiCache = new SmartCache();

// Función para limpiar todas las cachés
export function clearAllCaches(): void {
  authCache.clear();
  masterDataCache.clear();
  apiCache.clear();
}

// Auto-limpieza cada 10 minutos
if (typeof window !== 'undefined') {
  setInterval(() => {
    authCache.cleanup();
    masterDataCache.cleanup();
    apiCache.cleanup();
  }, 600000); // 10 minutos
}

export default SmartCache;