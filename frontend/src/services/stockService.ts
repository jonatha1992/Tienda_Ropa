import axios from 'axios';
import type { StockCheckItem, StockCheckResponse } from '@/types/stock';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const stockService = {
  /**
   * Verifica el stock de múltiples productos/variantes
   * @param items Array de ítems a verificar
   * @returns Promise con el resultado de la verificación de stock
   */
  async checkStock(items: StockCheckItem[]): Promise<StockCheckResponse> {
    try {
      const response = await axios.post<StockCheckResponse>(
        `${API_URL}/api/v1/products/check-stock/`,
        items,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al verificar el stock:', error);
      // En caso de error, asumimos que no hay stock disponible
      return {
        items: items.map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          available: false,
          available_stock: 0,
          requested_quantity: item.quantity,
          has_enough_stock: false,
        })),
        all_available: false,
      };
    }
  },
};

export default stockService;
