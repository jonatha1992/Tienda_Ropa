<template>
  <div class="space-y-6">
    <!-- Search and Filters -->
    <div class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          @input="searchUsers"
          type="text"
          placeholder="Buscar usuarios por email..."
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        @click="loadUsers"
        :disabled="loading"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md"
      >
        {{ loading ? 'Cargando...' : 'Actualizar Lista' }}
      </button>
    </div>

    <!-- Alert Messages -->
    <!-- Toast notifications are now handled by vue-toastification -->

    <!-- Users Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">
          Usuarios del Sistema ({{ filteredUsers.length }})
        </h3>
      </div>
      
      <div v-if="loading && users.length === 0" class="p-6 text-center text-gray-500">
        Cargando usuarios...
      </div>
      
      <div v-else-if="filteredUsers.length === 0" class="p-6 text-center text-gray-500">
        {{ searchQuery ? 'No se encontraron usuarios con esa búsqueda' : 'No hay usuarios registrados' }}
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span class="text-sm font-medium text-gray-700">
                        {{ getUserInitials(user.email) }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.email }}</div>
                    <div class="text-sm text-gray-500">ID: {{ user.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="role in user.roles || []"
                    :key="role.id"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getRoleBadgeClass(role.name)"
                  >
                    {{ role.name.toUpperCase() }}
                  </span>
                  <span v-if="!user.roles || user.roles.length === 0" class="text-xs text-gray-500">
                    Sin roles asignados
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Activo
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="manageUserRoles(user)"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Gestionar Roles
                </button>
                <button
                  @click="viewUserDetails(user)"
                  class="text-green-600 hover:text-green-900"
                >
                  Ver Detalles
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Role Management Modal -->
    <div v-if="showRoleModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">
              Gestionar Roles: {{ selectedUser?.email }}
            </h3>
            <button
              @click="closeRoleModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <!-- Current Roles -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Roles Actuales</h4>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="role in selectedUser?.roles || []"
                :key="role.id"
                class="inline-flex items-center px-3 py-1 text-sm rounded-full"
                :class="getRoleBadgeClass(role.name)"
              >
                {{ role.name.toUpperCase() }}
                <button
                  @click="removeUserRole(selectedUser!.id, role.id)"
                  class="ml-2 text-current hover:text-red-600"
                >
                  ×
                </button>
              </span>
              <span v-if="!selectedUser?.roles || selectedUser.roles.length === 0" class="text-sm text-gray-500">
                Sin roles asignados
              </span>
            </div>
          </div>
          
          <!-- Add Role -->
          <div class="mb-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Agregar Rol</h4>
            <div class="flex gap-2">
              <select v-model="selectedRoleToAdd" class="flex-1 border border-gray-300 rounded-md px-3 py-2">
                <option value="">Seleccionar rol</option>
                <option
                  v-for="role in availableRoles"
                  :key="role.id"
                  :value="role.id"
                >
                  {{ role.name.toUpperCase() }} - {{ role.description }}
                </option>
              </select>
              <button
                @click="addUserRole"
                :disabled="!selectedRoleToAdd || loading"
                class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { rolesApi, usersApi } from '../api'
import type { Role, UserWithRoles } from '../types'

const toast = useToast()

// Reactive data
const users = ref<UserWithRoles[]>([])
const roles = ref<Role[]>([])
const loading = ref(false)
const searchQuery = ref('')
const showRoleModal = ref(false)
const selectedUser = ref<UserWithRoles | null>(null)
const selectedRoleToAdd = ref<number | ''>('')

// Computed
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  return users.value.filter(user => 
    user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const availableRoles = computed(() => {
  if (!selectedUser.value) return roles.value
  const userRoleIds = (selectedUser.value.roles || []).map(r => r.id)
  return roles.value.filter(role => !userRoleIds.includes(role.id))
})

// Methods
const loadUsers = async () => {
  try {
    loading.value = true
    // This is a placeholder - you'll need to implement a users endpoint
    // For now, we'll just show the current user
    const currentUser = await usersApi.getCurrentUser()
    const userRoles = await rolesApi.getMyRoles()
    
    users.value = [{
      ...currentUser,
      roles: userRoles
    }]
    toast.success('👥 Usuarios cargados correctamente')
  } catch (error: any) {
    console.error('Error loading users:', error)
    const errorMessage = error.response?.data?.detail || 'Error al cargar usuarios'
    toast.error(`❌ ${errorMessage}`)
  } finally {
    loading.value = false
  }
}

const loadRoles = async () => {
  try {
    roles.value = await rolesApi.getAllRoles()
    toast.success('🎭 Roles cargados correctamente')
  } catch (error: any) {
    console.error('Error loading roles:', error)
    const errorMessage = error.response?.data?.detail || 'Error al cargar roles'
    toast.error(`❌ ${errorMessage}`)
  }
}

const searchUsers = () => {
  // Implement search logic if needed
}

const manageUserRoles = async (user: UserWithRoles) => {
  selectedUser.value = user
  showRoleModal.value = true
  selectedRoleToAdd.value = ''
  
  // Load user's current roles
  try {
    const userRoles = await rolesApi.getUserRoles(user.id)
    selectedUser.value.roles = userRoles
  } catch (error) {
    console.error('Error loading user roles:', error)
  }
}

const closeRoleModal = () => {
  showRoleModal.value = false
  selectedUser.value = null
  selectedRoleToAdd.value = ''
}

const addUserRole = async () => {
  if (!selectedUser.value || !selectedRoleToAdd.value) return
  
  try {
    await rolesApi.assignRole(selectedUser.value.id, selectedRoleToAdd.value as number)
    toast.success('✅ Rol asignado correctamente')
    
    // Reload user roles
    const userRoles = await rolesApi.getUserRoles(selectedUser.value.id)
    selectedUser.value.roles = userRoles
    selectedRoleToAdd.value = ''
    
    // Update users list
    await loadUsers()
  } catch (error: any) {
    console.error('Error assigning role:', error)
    const errorMessage = error.response?.data?.detail || 'Error al asignar el rol'
    toast.error(`❌ ${errorMessage}`)
  }
}

const removeUserRole = async (userId: number, roleId: number) => {
  try {
    await rolesApi.removeRole(userId, roleId)
    toast.success('✅ Rol removido correctamente')
    
    // Reload user roles
    if (selectedUser.value) {
      const userRoles = await rolesApi.getUserRoles(selectedUser.value.id)
      selectedUser.value.roles = userRoles
    }
    
    // Update users list
    await loadUsers()
  } catch (error: any) {
    console.error('Error removing role:', error)
    const errorMessage = error.response?.data?.detail || 'Error al remover el rol'
    toast.error(`❌ ${errorMessage}`)
  }
}

const viewUserDetails = (user: UserWithRoles) => {
  alert(`Detalles del usuario:\nEmail: ${user.email}\nID: ${user.id}\nRoles: ${(user.roles || []).map(r => r.name).join(', ') || 'Sin roles'}`)
}

const getUserInitials = (email: string) => {
  return email.split('@')[0].substring(0, 2).toUpperCase()
}

const getRoleBadgeClass = (roleName: string) => {
  const classes = {
    admin: 'bg-red-100 text-red-800',
    manager: 'bg-blue-100 text-blue-800',
    employee: 'bg-yellow-100 text-yellow-800',
    user: 'bg-gray-100 text-gray-800'
  }
  return classes[roleName as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

// Lifecycle
onMounted(() => {
  loadUsers()
  loadRoles()
})
</script>
