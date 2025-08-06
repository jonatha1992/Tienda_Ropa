
import axios from 'axios';
import { auth } from './firebase';
import type { Role, RoleType, User } from './types';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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
  }
};

export default apiClient;
