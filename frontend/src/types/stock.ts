/**
 * Item para verificación de stock
 */
export interface StockCheckItem {
  /** ID del producto */
  product_id: number;
  /** ID de la variante (opcional para productos con variantes) */
  variant_id?: number;
  /** Cantidad solicitada */
  quantity: number;
}

/**
 * Resultado de verificación de stock para un ítem
 */
export interface StockCheckResultItem extends Omit<StockCheckItem, 'quantity'> {
  /** Indica si el producto/variante está disponible */
  available: boolean;
  /** Stock disponible */
  available_stock: number;
  /** Cantidad solicitada */
  requested_quantity: number;
  /** Indica si hay suficiente stock para la cantidad solicitada */
  has_enough_stock: boolean;
}

/**
 * Respuesta de verificación de stock
 */
export interface StockCheckResponse {
  /** Resultados de la verificación para cada ítem */
  items: StockCheckResultItem[];
  /** Indica si todos los ítems tienen suficiente stock */
  all_available: boolean;
}
