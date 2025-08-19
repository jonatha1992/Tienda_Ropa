import { defineStore } from 'pinia';
import type { Product, ProductVariant, Color, Size } from '../types';
import { useCartNotification } from '../composables/useCartNotification';

export interface CartItem {
  id: string; // Unique identifier for cart item
  product: Product;
  variant?: {
    variant: ProductVariant;
    color: Color;
    size: Size;
  };
  quantity: number;
  selectedColor?: Color; // For unique products
  selectedSize?: Size; // For unique products
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    lastSaved: null as number | null, // Timestamp when cart was last saved
    sessionTimeout: 20 * 60 * 1000, // 20 minutes in milliseconds
  }),
  
  getters: {
    // Calculate total price considering discounts
    totalPrice: (state) => {
      return state.items.reduce((total, item) => {
        const price = item.product.has_discount && item.product.discounted_price 
          ? item.product.discounted_price 
          : item.product.price;
        return total + (price * item.quantity);
      }, 0);
    },
    
    // Calculate total price without discounts
    totalOriginalPrice: (state) => {
      return state.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    },
    
    // Calculate total savings
    totalSavings: (state) => {
      return state.items.reduce((total, item) => {
        if (item.product.has_discount && item.product.discount_amount) {
          return total + (item.product.discount_amount * item.quantity);
        }
        return total;
      }, 0);
    },
    
    itemCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    // Check if cart is empty
    isEmpty: (state) => state.items.length === 0,
    
    // Get items with discount
    discountedItems: (state) => {
      return state.items.filter(item => item.product.has_discount);
    }
  },
  
  actions: {
    // Generate unique ID for cart item
    generateCartItemId(product: Product, variantId?: number, colorId?: number, sizeId?: number): string {
      if (product.is_unique) {
        return `${product.id}-${colorId || 'no-color'}-${sizeId || 'no-size'}`;
      } else {
        return `${product.id}-variant-${variantId}`;
      }
    },
    
    addToCart(
      product: Product, 
      quantity: number = 1,
      variantInfo?: { variant: ProductVariant; color: Color; size: Size },
      uniqueProductInfo?: { color?: Color; size?: Size }
    ) {
      // Check session validity before adding
      if (!this.isSessionValid()) {
        console.log('⏰ Cart session expired, clearing before adding new item');
        this.clearCart();
      }
      let cartItemId: string;
      
      if (product.is_unique) {
        // For unique products, use color and size if provided
        cartItemId = this.generateCartItemId(
          product, 
          undefined, 
          uniqueProductInfo?.color?.id,
          uniqueProductInfo?.size?.id
        );
      } else {
        // For variant products, use variant ID
        if (!variantInfo) {
          throw new Error('Variant information is required for non-unique products');
        }
        cartItemId = this.generateCartItemId(product, variantInfo.variant.id);
      }

      // Check if item already exists in cart
      const existingItemIndex = this.items.findIndex(item => item.id === cartItemId);

      if (existingItemIndex >= 0) {
        // Update quantity of existing item instead of incrementing
        this.items[existingItemIndex].quantity = quantity;
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          id: cartItemId,
          product,
          quantity,
          variant: variantInfo,
          selectedColor: uniqueProductInfo?.color,
          selectedSize: uniqueProductInfo?.size
        };
        
        this.items.push(newItem);
      }
      
      // Save to localStorage
      this.saveToStorage();
      
      // Show notification
      const { showNotification } = useCartNotification();
      if (variantInfo) {
        showNotification(product, quantity, variantInfo);
      } else {
        showNotification(product, quantity);
      }
    },
    
    removeFromCart(cartItemId: string) {
      this.items = this.items.filter(item => item.id !== cartItemId);
      this.saveToStorage();
    },
    
    updateQuantity(cartItemId: string, quantity: number) {
      const itemIndex = this.items.findIndex(item => item.id === cartItemId);

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          this.items.splice(itemIndex, 1);
        } else {
          this.items[itemIndex].quantity = quantity;
        }
        this.saveToStorage();
      }
    },
    
    clearCart() {
      this.items = [];
      this.saveToStorage();
    },
    
    // Persistence methods
    saveToStorage() {
      if (typeof window !== 'undefined') {
        const cartData = {
          items: this.items,
          timestamp: Date.now()
        };
        localStorage.setItem('cart', JSON.stringify(cartData));
        this.lastSaved = Date.now();
      }
    },
    
    loadFromStorage() {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('cart');
        if (saved) {
          try {
            const cartData = JSON.parse(saved);
            
            // Handle legacy format (just items array)
            if (Array.isArray(cartData)) {
              console.log('🔄 Converting legacy cart format');
              this.items = this.validateCartItems(cartData);
              this.saveToStorage(); // Save in new format
              return;
            }
            
            // Handle new format with timestamp
            if (cartData && typeof cartData === 'object' && cartData.items) {
              const now = Date.now();
              const timeDiff = now - (cartData.timestamp || 0);
              
              // Check if cart has expired (20 minutes)
              if (timeDiff > this.sessionTimeout) {
                console.log('⏰ Cart session expired, clearing cart');
                this.clearStorage();
                this.items = [];
                return;
              }
              
              // Load valid cart
              this.items = this.validateCartItems(cartData.items);
              this.lastSaved = cartData.timestamp;
              
              // If we filtered out invalid items, save the cleaned cart
              if (this.items.length !== cartData.items.length) {
                console.log('🧹 Cleaned invalid cart items');
                this.saveToStorage();
              }
            } else {
              console.log('🗑️ Invalid cart data format, clearing...');
              this.clearStorage();
              this.items = [];
            }
          } catch (error) {
            console.error('Error loading cart from storage:', error);
            this.clearStorage();
            this.items = [];
          }
        } else {
          this.items = [];
        }
      }
    },
    
    // Validate stock availability
    validateStock() {
      const itemsToRemove: string[] = [];
      
      this.items.forEach(item => {
        let availableStock = 0;
        
        if (item.product.is_unique) {
          availableStock = item.product.stock || 0;
        } else if (item.variant) {
          availableStock = item.variant.variant.stock;
        }
        
        if (availableStock === 0) {
          itemsToRemove.push(item.id);
        } else if (item.quantity > availableStock) {
          // Adjust quantity to available stock
          this.updateQuantity(item.id, availableStock);
        }
      });
      
      // Remove items with no stock
      itemsToRemove.forEach(itemId => {
        this.removeFromCart(itemId);
      });
    },
    
    // Get item price (considering discounts)
    getItemPrice(item: CartItem): number {
      return item.product.has_discount && item.product.discounted_price 
        ? item.product.discounted_price 
        : item.product.price;
    },
    
    // Get item total price
    getItemTotal(item: CartItem): number {
      return this.getItemPrice(item) * item.quantity;
    },
    
    // Debug function to check cart state
    debugCart() {
      console.log('🛒 Cart Debug Info:');
      console.log('Items array:', this.items);
      console.log('Items length:', this.items.length);
      console.log('Item count:', this.itemCount);
      console.log('Is empty:', this.isEmpty);
      console.log('LocalStorage cart:', localStorage.getItem('cart'));
    },
    
    // Validate cart items helper method
    validateCartItems(items: any[]): CartItem[] {
      if (!Array.isArray(items)) return [];
      
      return items.filter(item => 
        item && 
        typeof item === 'object' && 
        item.id && 
        item.product && 
        typeof item.quantity === 'number' && 
        item.quantity > 0
      );
    },
    
    // Check if cart session is still valid
    isSessionValid(): boolean {
      if (!this.lastSaved) return true; // No timestamp means fresh session
      
      const now = Date.now();
      const timeDiff = now - this.lastSaved;
      return timeDiff <= this.sessionTimeout;
    },
    
    // Clear localStorage cart data
    clearStorage() {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart');
        this.lastSaved = null;
        console.log('🗑️ Cart localStorage cleared');
      }
    },
    
    // Initialize cart - call this on app startup
    initializeCart() {
      this.loadFromStorage();
      
      // Set up periodic session validation (every 5 minutes)
      if (typeof window !== 'undefined') {
        setInterval(() => {
          if (!this.isSessionValid() && !this.isEmpty) {
            console.log('⏰ Cart session expired during use, clearing cart');
            this.clearCart();
          }
        }, 5 * 60 * 1000); // Check every 5 minutes
      }
    }
  },
});
