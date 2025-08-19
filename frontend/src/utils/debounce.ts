/**
 * Debounce función - retrasa la ejecución hasta que pasen `wait` milisegundos sin llamadas
 * @param func - Función a ejecutar
 * @param wait - Tiempo de espera en milisegundos
 * @returns Función debounced
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
}

/**
 * Throttle función - limita la ejecución a una vez cada `limit` milisegundos
 * @param func - Función a ejecutar
 * @param limit - Límite de tiempo en milisegundos
 * @returns Función throttled
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastFunc: NodeJS.Timeout | null = null;
  let lastRan: number = 0;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      lastRan = Date.now();
      inThrottle = true;
    } else {
      if (lastFunc) {
        clearTimeout(lastFunc);
      }
      
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * Debounce con cancelación - permite cancelar la ejecución pendiente
 * @param func - Función a ejecutar
 * @param wait - Tiempo de espera en milisegundos
 * @returns Objeto con función debounced y método cancel
 */
export function debounceCancelable<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): {
  debounced: (...args: Parameters<T>) => void;
  cancel: () => void;
} {
  let timeout: NodeJS.Timeout | null = null;

  const cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  const debounced = (...args: Parameters<T>) => {
    cancel();
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };

  return { debounced, cancel };
}

/**
 * Leading debounce - ejecuta inmediatamente y luego debounce
 * @param func - Función a ejecutar
 * @param wait - Tiempo de espera en milisegundos
 * @returns Función debounced con leading edge
 */
export function debounceLeading<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let callOnTrailingEdge = true;

  return (...args: Parameters<T>) => {
    const callNow = callOnTrailingEdge && !timeout;
    
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      timeout = null;
      if (callOnTrailingEdge) func(...args);
    }, wait);

    if (callNow) {
      callOnTrailingEdge = false;
      func(...args);
    }
  };
}

/**
 * Memoización con debounce - cachea resultados y limpia después de inactividad
 * @param func - Función a memoizar
 * @param wait - Tiempo antes de limpiar caché
 * @returns Función memoizada con debounce
 */
export function memoizeWithDebounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 60000
): T {
  const cache = new Map<string, ReturnType<T>>();
  let timeout: NodeJS.Timeout | null = null;

  const clearCache = () => {
    cache.clear();
    timeout = null;
  };

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);
    cache.set(key, result);

    // Reset timeout para limpiar caché
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(clearCache, wait);

    return result;
  }) as T;
}

// Utilidades específicas para casos comunes
export const searchDebounce = <T extends (...args: any[]) => any>(func: T) => 
  debounce(func, 300);

export const scrollThrottle = <T extends (...args: any[]) => any>(func: T) => 
  throttle(func, 16); // ~60fps

export const resizeThrottle = <T extends (...args: any[]) => any>(func: T) => 
  throttle(func, 100);

export const apiCallDebounce = <T extends (...args: any[]) => any>(func: T) => 
  debounce(func, 500);