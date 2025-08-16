<template>
  <div class="max-w-6xl mx-auto p-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Gestión de Roles</h1>
      <p class="text-gray-600">Administra los roles y permisos de usuarios</p>
    </div>

    <!-- Toast notifications are now handled by vue-toastification -->

    <!-- Action Buttons -->
    <div class="mb-6 flex gap-4">
      <button
        @click="initializeRoles"
        :disabled="loading"
        class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md"
      >
        {{ loading ? 'Cargando...' : 'Inicializar Roles por Defecto' }}
      </button>
      
      <button
        @click="showCreateForm = true"
        :disabled="loading"
        class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md"
      >
        Crear Nuevo Rol
      </button>
    </div>

    <!-- Create Role Form -->
    <div v-if="showCreateForm" class="mb-6 bg-white p-6 rounded-lg shadow-md border">
      <h3 class="text-lg font-semibold mb-4">Crear Nuevo Rol</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Rol</label>
          <select v-model="newRole.name" class="w-full border border-gray-300 rounded-md px-3 py-2">
            <option value="">Seleccionar tipo</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
            <option value="user">User</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <input
            v-model="newRole.description"
            type="text"
            class="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Descripción del rol"
          />
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button
          @click="createRole"
          :disabled="!newRole.name || loading"
          class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md"
        >
          Crear Rol
        </button>
        <button
          @click="cancelCreate"
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
        >
          Cancelar
        </button>
      </div>
    </div>

    <!-- Roles Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Roles Existentes</h2>
      </div>
      
      <div v-if="loading && roles.length === 0" class="p-6 text-center text-gray-500">
        Cargando roles...
      </div>
      
      <div v-else-if="roles.length === 0" class="p-6 text-center text-gray-500">
        No hay roles configurados. Haz clic en "Inicializar Roles por Defecto" para comenzar.
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="role in roles" :key="role.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ role.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getRoleBadgeClass(role.name)">
                  {{ role.name.toUpperCase() }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ role.description || 'Sin descripción' }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="role.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                  {{ role.is_active ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewUsersWithRole(role)"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Ver Usuarios
                </button>
                <button
                  @click="toggleRoleStatus(role)"
                  :disabled="loading"
                  class="text-yellow-600 hover:text-yellow-900 mr-4"
                >
                  {{ role.is_active ? 'Desactivar' : 'Activar' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Users with Role Modal -->
    <div v-if="showUsersModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">
              Usuarios con rol: {{ selectedRole?.name.toUpperCase() }}
            </h3>
            <button
              @click="closeUsersModal"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div v-if="usersWithRole.length === 0" class="text-center text-gray-500 py-8">
            No hay usuarios con este rol.
          </div>
          
          <div v-else class="space-y-2 max-h-60 overflow-y-auto">
            <div
              v-for="user in usersWithRole"
              :key="user.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-md"
            >
              <div>
                <div class="font-medium text-gray-900">{{ user.email }}</div>
                <div class="text-sm text-gray-500">ID: {{ user.id }}</div>
              </div>
              <button
                @click="removeUserRole(user.id, selectedRole!.id)"
                class="text-red-600 hover:text-red-800 text-sm"
              >
                Remover Rol
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { rolesApi } from '../config'
import type { Role, RoleType, User } from '../types'

const toast = useToast()

// Reactive data
const roles = ref<Role[]>([])
const loading = ref(false)
const showCreateForm = ref(false)
const showUsersModal = ref(false)
const selectedRole = ref<Role | null>(null)
const usersWithRole = ref<User[]>([])

const newRole = ref({
  name: '' as RoleType | '',
  description: ''
})

// Methods
const loadRoles = async () => {
  try {
    loading.value = true
    roles.value = await rolesApi.getAllRoles()
    toast.success('🎭 Roles cargados')
  } catch (error: any) {
    console.error('Error loading roles:', error)
    toast.error('❌ Error al cargar los roles')
  } finally {
    loading.value = false
  }
}

const initializeRoles = async () => {
  try {
    loading.value = true
    await rolesApi.initializeRoles()
    toast.success('✅ Roles inicializados correctamente')
    await loadRoles()
  } catch (error: any) {
    console.error('Error initializing roles:', error)
    toast.error('❌ Error al inicializar los roles')
  } finally {
    loading.value = false
  }
}

const createRole = async () => {
  if (!newRole.value.name) return
  
  try {
    loading.value = true
    await rolesApi.createRole({
      name: newRole.value.name as RoleType,
      description: newRole.value.description || undefined
    })
    toast.success('✅ Rol creado correctamente')
    cancelCreate()
    await loadRoles()
  } catch (error: any) {
    console.error('Error creating role:', error)
    const errorMessage = error.response?.data?.detail || 'Error al crear el rol'
    toast.error(`❌ ${errorMessage}`)
  } finally {
    loading.value = false
  }
}

const cancelCreate = () => {
  showCreateForm.value = false
  newRole.value = { name: '', description: '' }
}

const toggleRoleStatus = async (role: Role) => {
  try {
    loading.value = true
    await rolesApi.updateRole(role.id, { is_active: !role.is_active })
    const status = role.is_active ? 'desactivado' : 'activado'
    toast.success(`✅ Rol ${status} correctamente`)
    await loadRoles()
  } catch (error: any) {
    console.error('Error updating role:', error)
    const errorMessage = error.response?.data?.detail || 'Error al actualizar el rol'
    toast.error(`❌ ${errorMessage}`)
  } finally {
    loading.value = false
  }
}

const viewUsersWithRole = async (role: Role) => {
  try {
    selectedRole.value = role
    usersWithRole.value = await rolesApi.getUsersWithRole(role.id)
    showUsersModal.value = true
    toast.success(`👥 Usuarios con rol ${role.name} cargados`)
  } catch (error: any) {
    console.error('Error loading users with role:', error)
    const errorMessage = error.response?.data?.detail || 'Error al cargar usuarios con el rol'
    toast.error(`❌ ${errorMessage}`)
  }
}

const closeUsersModal = () => {
  showUsersModal.value = false
  selectedRole.value = null
  usersWithRole.value = []
}

const removeUserRole = async (userId: number, roleId: number) => {
  try {
    await rolesApi.removeRole(userId, roleId)
    toast.success('✅ Rol removido del usuario correctamente')
    // Reload users for this role
    if (selectedRole.value) {
      usersWithRole.value = await rolesApi.getUsersWithRole(selectedRole.value.id)
    }
  } catch (error: any) {
    console.error('Error removing user role:', error)
    const errorMessage = error.response?.data?.detail || 'Error al remover el rol del usuario'
    toast.error(`❌ ${errorMessage}`)
  }
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
  loadRoles()
})
</script>
