import axios from 'axios';
import { auth } from './firebase';
import { config } from './app';
import type { Role, RoleType, User, UserWithRoles, Color, Category, Size, Product } from '../types';
import type { StockCheckItem, StockCheckResponse } from '../types/stock';

const apiClient = axios.create({
  baseURL: config.backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('❌ Error getting Firebase token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Solo loguear errores que no sean 401 (ya que son esperados cuando no hay usuario autenticado)
    if (error.response && error.response.status !== 401) {
      console.error(`❌ API error: ${error.response.status} ${error.config.method?.toUpperCase()} ${error.config.url}`);
    }
    return Promise.reject(error);
  }
);

// API functions for roles
export const rolesApi = {
  // Get all roles
  async getAllRoles(): Promise<Role[]> {
    const response = await apiClient.get('/roles/');
    return response.data;
  },

  // Get role by ID
  async getRole(id: number): Promise<Role> {
    const response = await apiClient.get(`/roles/${id}`);
    return response.data;
  },

  // Create new role
  async createRole(role: { name: RoleType; description?: string }): Promise<Role> {
    const response = await apiClient.post('/roles/', role);
    return response.data;
  },

  // Update role
  async updateRole(id: number, updates: Partial<Role>): Promise<Role> {
    const response = await apiClient.put(`/roles/${id}`, updates);
    return response.data;
  },

  // Delete role
  async deleteRole(id: number): Promise<void> {
    await apiClient.delete(`/roles/${id}`);
  },

  // Initialize default roles
  async initializeRoles(): Promise<void> {
    await apiClient.post('/roles/initialize');
  },

  // Assign role to user
  async assignRole(userId: number, roleId: number): Promise<void> {
    await apiClient.post('/roles/assign', {
      user_id: userId,
      role_id: roleId
    });
  },

  // Remove role from user
  async removeRole(userId: number, roleId: number): Promise<void> {
    await apiClient.delete(`/roles/assign/${userId}/${roleId}`);
  },

  // Get user roles
  async getUserRoles(userId: number): Promise<Role[]> {
    const response = await apiClient.get(`/roles/user/${userId}`);
    return response.data;
  },

  // Get my roles
  async getMyRoles(): Promise<Role[]> {
    const response = await apiClient.get('/roles/me/roles');
    return response.data;
  },

  // Get users with specific role
  async getUsersWithRole(roleId: number): Promise<User[]> {
    const response = await apiClient.get(`/roles/${roleId}/users`);
    return response.data;
  }
};

// API functions for users
export const usersApi = {
  // Get current user info
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  // Get all users with roles
  async getAllUsers(): Promise<UserWithRoles[]> {
    const response = await apiClient.get('/users/');
    return Array.isArray(response.data) ? response.data : [];
  },

  // Create new user
  async createUser(userData: {
    email: string;
    password: string;
    username?: string;
    role_id: number;
  }): Promise<any> {
    const response = await apiClient.post('/users/create', userData);
    return response.data;
  }
};

// API functions for master data (colors, categories, sizes)
export const masterDataApi = {
  // Get all colors
  async getColors(): Promise<Color[]> {
    const response = await apiClient.get('/colors');
    return response.data;
  },

  // Get all categories
  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  // Get categories that have products with stock (for navbar)
  async getCategoriesWithStock(): Promise<Category[]> {
    const response = await apiClient.get('/categories/with-stock');
    return response.data;
  },

  // Get all sizes
  async getSizes(): Promise<Size[]> {
    const response = await apiClient.get('/sizes');
    return response.data;
  }
};

// API functions for products
export const productsApi = {
  // Get all products
  async getProducts(): Promise<Product[]> {
    const response = await apiClient.get('/products/');
    return response.data;
  },

  // Get product by ID
  async getProduct(id: number): Promise<Product> {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Create new product
  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const response = await apiClient.post('/products/', product);
    return response.data;
  },

  // Update product
  async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    const response = await apiClient.put(`/products/${id}`, updates);
    return response.data;
  },

  // Delete product
  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },

  // Check stock for multiple products/variants
  async checkStock(items: StockCheckItem[]): Promise<StockCheckResponse> {
    const response = await apiClient.post('/products/check-stock/', items);
    return response.data;
  }
};

// API functions for payments
export const paymentsApi = {
  // Create MercadoPago preference for an order
  async createPreference(orderId: number): Promise<any> {
    const response = await apiClient.post('/payments/create-preference', null, {
      params: { order_id: orderId }
    });
    return response.data;
  },

  // Get payment status for an order
  async getPaymentStatus(orderId: number): Promise<any> {
    const response = await apiClient.get(`/payments/status/${orderId}`);
    return response.data;
  }
};

// API functions for orders
export const ordersApi = {
  // Create new order
  async createOrder(orderData: any): Promise<any> {
    const response = await apiClient.post('/orders/', orderData);
    return response.data;
  },

  // Get all orders
  async getOrders(): Promise<any[]> {
    const response = await apiClient.get('/orders/');
    return response.data;
  },

  // Get all orders with customer info (for admin)
  async getOrdersWithCustomerInfo(): Promise<any[]> {
    const response = await apiClient.get('/orders/admin');
    return response.data;
  },

  // Get order by ID
  async getOrder(id: number): Promise<any> {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  // Update order
  async updateOrder(id: number, updates: any): Promise<any> {
    const response = await apiClient.put(`/orders/${id}`, updates);
    return response.data;
  },

  // Delete order
  async deleteOrder(id: number): Promise<void> {
    await apiClient.delete(`/orders/${id}`);
  },

  // Get orders for a specific customer
  async getCustomerOrders(customerId: number): Promise<any[]> {
    const response = await apiClient.get(`/orders/customer/${customerId}`);
    return response.data;
  },

  // Get orders for the authenticated user
  async getMyOrders(): Promise<any[]> {
    const response = await apiClient.get('/orders/my-orders');
    return response.data;
  },

  // Admin functions
  // Get orders with filters for admin panel
  async getOrdersWithFilters(filters: any): Promise<any[]> {
    const response = await apiClient.get('/orders/admin/filtered', { params: filters });
    return response.data;
  },

  // Get admin statistics
  async getAdminStats(): Promise<any> {
    const response = await apiClient.get('/orders/admin/stats');
    return response.data;
  },

  // Verify bank transfer
  async verifyTransfer(orderId: number, verified: boolean, adminNotes: string): Promise<any> {
    const response = await apiClient.post(`/orders/${orderId}/verify-transfer`, {
      verified,
      admin_notes: adminNotes
    });
    return response.data;
  },

  // Schedule delivery for cash orders
  async scheduleDelivery(orderId: number, scheduledDate: Date, timeSlot: string, notes: string): Promise<any> {
    const response = await apiClient.post(`/orders/${orderId}/schedule-delivery`, {
      scheduled_date: scheduledDate.toISOString(),
      time_slot: timeSlot,
      notes
    });
    return response.data;
  },

  // Mark order as delivered
  async markAsDelivered(orderId: number, deliveryNotes: string): Promise<any> {
    const response = await apiClient.post(`/orders/${orderId}/mark-delivered`, {
      delivery_notes: deliveryNotes
    });
    return response.data;
  },

  // Update order status (admin)
  async updateOrderStatus(orderId: number, statusData: { status: string; adminNotes?: string }): Promise<any> {
    const response = await apiClient.put(`/orders/${orderId}/status`, statusData);
    return response.data;
  },

  // Update order shipping (admin)
  async updateOrderShipping(orderId: number, shippingData: {
    trackingNumber: string;
    shippingProvider: string;
    estimatedDelivery?: string;
    shippingNotes?: string;
  }): Promise<any> {
    const response = await apiClient.put(`/orders/${orderId}/shipping`, shippingData);
    return response.data;
  },

  // Bulk mark orders as shipped
  async bulkMarkAsShipped(orderIds: number[]): Promise<any> {
    const response = await apiClient.post('/admin/shipping/bulk-actions/mark-shipped', orderIds);
    return response.data;
  },

  // Admin shipping functions
  // Get shipping statistics
  async getShippingStatistics(): Promise<any> {
    const response = await apiClient.get('/admin/shipping/statistics');
    return response.data;
  },

  // Get shipping providers
  async getShippingProviders(): Promise<any[]> {
    const response = await apiClient.get('/admin/shipping/providers');
    return response.data.providers;
  },

  // Update shipping info for order
  async updateShippingInfo(orderId: number, shippingData: any): Promise<any> {
    const response = await apiClient.put(`/admin/shipping/orders/${orderId}/shipping-info`, shippingData);
    return response.data;
  },

  // Mark order as shipped
  async markOrderAsShipped(orderId: number): Promise<any> {
    const response = await apiClient.post(`/admin/shipping/orders/${orderId}/mark-shipped`, {
      send_notification: true
    });
    return response.data;
  }
};

// API functions for customers
export const customersApi = {
  // Create new customer
  async createCustomer(customerData: any): Promise<any> {
    const response = await apiClient.post('/customers/', customerData);
    return response.data;
  },

  // Get all customers
  async getCustomers(): Promise<any[]> {
    const response = await apiClient.get('/customers/');
    return response.data;
  },

  // Get customer by ID
  async getCustomer(id: number): Promise<any> {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data;
  },

  // Update customer
  async updateCustomer(id: number, updates: any): Promise<any> {
    const response = await apiClient.put(`/customers/${id}`, updates);
    return response.data;
  },

  // Delete customer
  async deleteCustomer(id: number): Promise<void> {
    await apiClient.delete(`/customers/${id}`);
  },

  // Get customer data for authenticated user
  async getMyCustomerData(): Promise<any> {
    const response = await apiClient.get('/customers/my-data');
    return response.data;
  }
};

// API functions for order items
export const orderItemsApi = {
  // Create new order item
  async createOrderItem(orderItemData: any): Promise<any> {
    const response = await apiClient.post('/order-items/', orderItemData);
    return response.data;
  },

  // Get all order items
  async getOrderItems(): Promise<any[]> {
    const response = await apiClient.get('/order-items/');
    return response.data;
  },

  // Get order item by ID
  async getOrderItem(id: number): Promise<any> {
    const response = await apiClient.get(`/order-items/${id}`);
    return response.data;
  },

  // Update order item
  async updateOrderItem(id: number, updates: any): Promise<any> {
    const response = await apiClient.put(`/order-items/${id}`, updates);
    return response.data;
  },

  // Delete order item
  async deleteOrderItem(id: number): Promise<void> {
    await apiClient.delete(`/order-items/${id}`);
  }
};

export default apiClient;