<template>
  <div class="container p-4 mx-auto">
    <h1 class="mb-4 text-2xl font-bold">Administración de Productos</h1>

    <!-- Layout de dos columnas: Formulario + Vista previa -->
    <div class="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-12">
      <!-- Formulario (8 columnas) -->
      <div class="lg:col-span-8">
        <form @submit.prevent="confirmSave" class="p-6 bg-white border rounded-lg shadow-md">
          <h2 class="mb-4 text-xl font-semibold">{{ editing ? 'Editar Producto' : 'Nuevo Producto' }}</h2>

          <!-- Checkbox para producto único -->
          <div class="mb-6">
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="product.is_unique" 
                @change="onUniqueProductChange"
                class="mr-2 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              >
              <span class="text-sm font-medium text-gray-700">
                Producto único (solo una combinación de atributos)
              </span>
            </label>
            <p class="mt-1 text-xs text-gray-500">
              Si está marcado, el producto tendrá solo una combinación de color/talla. 
              Si no, podrás agregar múltiples variantes.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
              <input type="text" v-model="product.name" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                required>
            </div>
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700">Precio</label>
              <input type="number" step="0.01" v-model.number="product.price"
                class="block w-full mt-1 border-gray-300 rounded-md shadow-sm" required>
            </div>
            <div>
              <label for="genero" class="block text-sm font-medium text-gray-700">Género</label>
              <select v-model="product.genero" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm">
                <option>unisex</option>
                <option>masculino</option>
                <option>femenino</option>
              </select>
            </div>
            <div>
              <label for="estado" class="block text-sm font-medium text-gray-700">Estado</label>
              <select v-model="product.estado" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm">
                <option>nuevo</option>
                <option>usado</option>
              </select>
            </div>
            <div>
              <label for="categoria" class="block text-sm font-medium text-gray-700">Categoría</label>
              <select v-model="product.categoria" class="block w-full mt-1 border-gray-300 rounded-md shadow-sm">
                <option value="">Seleccione la categoría</option>
                <option 
                  v-for="category in availableCategories" 
                  :key="category.id" 
                  :value="category.name"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea v-model="product.description" rows="3"
                class="block w-full mt-1 border-gray-300 rounded-md shadow-sm"></textarea>
            </div>
          </div>

          <div class="mt-6">
            <label class="block text-sm font-medium text-gray-700">Imágenes</label>
            <input type="file" @change="handleFileSelect" multiple
              class="block w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            <div v-if="imagePreviews.length" class="grid grid-cols-2 gap-4 mt-4 md:grid-cols-4">
              <div v-for="(preview, index) in imagePreviews" :key="index" class="relative">
                <img :src="preview" class="object-cover w-full h-24 rounded-md" />
              </div>
            </div>
          </div>

          <!-- Sección de atributos únicos -->
          <div v-if="product.is_unique" class="mt-6">
            <h3 class="text-lg font-medium text-gray-800">Atributos del Producto Único</h3>
            <div class="grid items-center grid-cols-3 gap-4 p-4 mt-4 border rounded bg-blue-50">
              <div>
                <label class="block text-sm font-medium text-gray-700">Color</label>
                
                <!-- Combobox personalizado para colores -->
                <Combobox v-model="product.color">
                  <div class="relative mt-1">
                    <div class="relative w-full overflow-hidden text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                      <ComboboxInput
                        class="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 border-none focus:ring-0"
                        :displayValue="(color: any) => color || 'Seleccione el color'"
                        @change="product.color = $event.target.value"
                      />
                      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
                      </ComboboxButton>
                    </div>
                    <ComboboxOptions class="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ComboboxOption
                        v-for="color in availableColors"
                        as="template"
                        :key="color.id"
                        :value="color.name"
                        v-slot="{ selected, active }"
                      >
                        <li
                          :class="[
                            active ? 'bg-teal-600 text-white' : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-10 pr-4',
                          ]"
                        >
                          <div class="flex items-center">
                            <!-- Círculo de color -->
                            <div 
                              class="flex-shrink-0 w-4 h-4 mr-3 border border-gray-300 rounded-full"
                              :style="{ backgroundColor: color.hex_code }"
                            ></div>
                            <span
                              :class="[
                                selected ? 'font-medium' : 'font-normal',
                                'block truncate',
                              ]"
                            >
                              {{ color.name }}
                            </span>
                          </div>
                          <span
                            v-if="selected"
                            :class="[
                              active ? 'text-white' : 'text-teal-600',
                              'absolute inset-y-0 left-0 flex items-center pl-3',
                            ]"
                          >
                            <CheckIcon class="w-5 h-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ComboboxOption>
                    </ComboboxOptions>
                  </div>
                </Combobox>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Talle</label>
                <select 
                  v-model="product.talle" 
                  class="w-full border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Seleccione el talle</option>
                  <option 
                    v-for="size in availableSizes" 
                    :key="size.id" 
                    :value="size.name"
                  >
                    {{ size.name }}
                    <span v-if="size.numeric_size">({{ size.numeric_size }})</span>
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Stock</label>
                <input 
                  type="number" 
                  v-model.number="product.stock" 
                  min="0"
                  class="w-full border-gray-300 rounded-md shadow-sm"
                  required
                >
              </div>
            </div>
          </div>

          <!-- Sección de variantes múltiples -->
          <div v-else class="mt-6">
            <h3 class="text-lg font-medium text-gray-800">Variantes</h3>
            <div v-for="(variant, index) in product.variants" :key="index"
              class="grid items-center grid-cols-4 gap-4 p-4 mt-4 border rounded">
              
              <div>
                <label class="block mb-1 text-xs font-medium text-gray-600">Color</label>
                <select 
                  v-model="variant.color" 
                  class="w-full text-sm border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Seleccione el color</option>
                  <option 
                    v-for="color in availableColors" 
                    :key="color.id" 
                    :value="color.name"
                  >
                    {{ color.name }}
                  </option>
                </select>
                <!-- Mostrar círculo de color seleccionado para variante -->
                <div v-if="variant.color" class="flex items-center mt-1">
                  <div 
                    class="w-3 h-3 mr-1 border border-gray-300 rounded-full"
                    :style="{ backgroundColor: availableColors.find(c => c.name === variant.color)?.hex_code || '#CCCCCC' }"
                  ></div>
                  <span class="text-xs text-gray-500">{{ variant.color }}</span>
                </div>
              </div>
              
              <div>
                <label class="block mb-1 text-xs font-medium text-gray-600">Talle</label>
                <select 
                  v-model="variant.talle" 
                  class="w-full text-sm border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Seleccione el talle</option>
                  <option 
                    v-for="size in availableSizes" 
                    :key="size.id" 
                    :value="size.name"
                  >
                    {{ size.name }}
                    <span v-if="size.numeric_size">({{ size.numeric_size }})</span>
                  </option>
                </select>
              </div>
              
              <div>
                <label class="block mb-1 text-xs font-medium text-gray-600">Stock</label>
                <input 
                  type="number" 
                  v-model.number="variant.stock"
                  min="0"
                  class="w-full text-sm border-gray-300 rounded-md shadow-sm"
                >
              </div>
              
              <div class="flex items-end">
                <button type="button" @click="removeVariant(index)"
                  class="px-3 py-2 text-sm text-red-500 rounded-md hover:text-red-700 hover:bg-red-50">
                  Eliminar
                </button>
              </div>
            </div>
            <button type="button" @click="addVariant"
              class="px-4 py-2 mt-4 text-sm font-medium bg-gray-100 border rounded-md hover:bg-gray-200">
              Añadir Variante
            </button>
          </div>

          <div class="flex justify-end mt-6">
            <button type="button" @click="resetForm"
              class="px-4 py-2 mr-2 text-sm font-medium border rounded-md shadow-sm">Cancelar</button>
            <button type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700">{{
                editing ? 'Actualizar' : 'Guardar' }}</button>
          </div>
        </form>
      </div>

      <!-- Vista previa del producto (4 columnas) -->
      <div class="lg:col-span-4">
        <div class="sticky top-4">
          <div class="p-6 bg-white border rounded-lg shadow-md">
            <h3 class="mb-4 text-lg font-medium text-gray-800">Vista previa del producto</h3>
            <div class="max-w-sm mx-auto">
              <ProductCard :product="previewProduct" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 border-b">Nombre</th>
            <th class="px-4 py-2 border-b">Precio</th>
            <th class="px-4 py-2 border-b">Tipo</th>
            <th class="px-4 py-2 border-b">Stock</th>
            <th class="px-4 py-2 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.id">
            <td class="px-4 py-2 border-b">{{ p.name }}</td>
            <td class="px-4 py-2 border-b">${{ p.price }}</td>
            <td class="px-4 py-2 border-b">
              <span :class="p.is_unique ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'" 
                    class="px-2 py-1 text-xs font-medium rounded-full">
                {{ p.is_unique ? 'Único' : 'Variantes' }}
              </span>
            </td>
            <td class="px-4 py-2 border-b">
              {{ getProductStock(p) }}
            </td>
            <td class="px-4 py-2 border-b">
              <button @click="editProduct(p)" class="text-indigo-600 hover:text-indigo-900">Editar</button>
              <button @click="p.id && confirmDelete(p.id)"
                class="ml-4 text-red-600 hover:text-red-900">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ConfirmationModal :show="showModal" :title="modalTitle" :message="modalMessage" @confirm="handleConfirm"
      @cancel="handleCancel" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { storage } from '../firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from '@headlessui/vue';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/vue/24/solid';
import ConfirmationModal from '../components/ConfirmationModal.vue';
import ProductCard from '../components/ProductCard.vue';
import { useAuthStore } from '../store/auth';
import { masterDataApi } from '../api';
import { config } from '../config';
import type { Color, Category, Size } from '../types';
import apiClient from '../api';
import type { Product as GlobalProduct } from '../types';

const toast = useToast();
const authStore = useAuthStore();

// === INTERFACES ===
interface ProductVariant {
  id?: number;
  color: string | null;
  talle: string | null;
  stock: number;
}

interface ProductImage {
  id: number;
  image_url: string;
}

interface Product {
  id?: number;
  name: string;
  description: string | null;
  price: number;
  genero: string;
  estado: string;
  categoria?: string | null;
  is_unique: boolean;
  color?: string | null;
  talle?: string | null;
  stock?: number | null;
  images: ProductImage[];
  variants: ProductVariant[];
}

interface ProductCreate {
  name: string;
  description: string | null;
  price: number;
  genero: string;
  estado: string;
  categoria?: string | null;
  is_unique: boolean;
  color?: string | null;
  talle?: string | null;
  stock?: number | null;
  images: string[];
  variants: Omit<ProductVariant, 'id'>[];
}

const API_URL = config.backendUrl + '/products/';

const products = ref<Product[]>([]);
const editing = ref(false);
const product = ref<ProductCreate>({
  name: '',
  description: null,
  price: 0,
  genero: 'unisex',
  estado: 'nuevo',
  categoria: null,
  is_unique: true,
  color: null,
  talle: null,
  stock: 1, // Valor por defecto de 1
  images: [],
  variants: [],
});

const selectedFiles = ref<File[]>([]);
const imagePreviews = ref<string[]>([]);
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const confirmAction = ref<(() => void) | null>(null);

// === DATOS MAESTROS ===
const availableColors = ref<Color[]>([]);
const availableCategories = ref<Category[]>([]);
const availableSizes = ref<Size[]>([]);

// Vista previa del producto para el ProductCard
const previewProduct = computed((): GlobalProduct => {
  return {
    id: 1, // ID temporal para la vista previa
    name: product.value.name || 'Nombre del producto',
    description: product.value.description || 'Descripción del producto',
    price: product.value.price || 0,
    genero: product.value.genero,
    estado: product.value.estado,
    categoria: product.value.categoria || undefined,
    is_unique: product.value.is_unique,
    color: product.value.color || undefined,
    talle: product.value.talle || undefined,
    stock: product.value.stock || undefined,
    images: imagePreviews.value.length > 0
      ? imagePreviews.value.map((url, index) => ({ id: index, image_url: url }))
      : [{ id: 0, image_url: 'https://via.placeholder.com/300x300?text=Sin+Imagen' }],
    variants: product.value.is_unique ? [] : product.value.variants.map((v, index) => ({
      id: index,
      color: v.color || '',
      size: v.talle || '', // Mapeamos talle -> size
      stock: v.stock
    }))
  };
});

// === LÓGICA DE DATOS MAESTROS ===
async function loadMasterData() {
  try {
    console.log('📋 Cargando datos maestros...');
    console.log('🔗 URL base API:', config.backendUrl);
    
    // Cargar colores, categorías y talles usando la nueva API
    console.log('🌈 Cargando colores...');
    const colors = await masterDataApi.getColors();
    console.log('🌈 Colores recibidos:', colors);
    
    console.log('📂 Cargando categorías...');
    const categories = await masterDataApi.getCategories();
    console.log('📂 Categorías recibidas:', categories);
    
    console.log('📏 Cargando talles...');
    const sizes = await masterDataApi.getSizes();
    console.log('📏 Talles recibidos:', sizes);
    
    availableColors.value = colors;
    availableCategories.value = categories;
    availableSizes.value = sizes;
    
    console.log('✅ Datos maestros cargados:', {
      colores: availableColors.value.length,
      categorias: availableCategories.value.length,
      talles: availableSizes.value.length
    });
    
    // Debug: Verificar que los arrays reactivos se actualicen
    console.log('🔍 Arrays reactivos actualizados:', {
      availableColors: availableColors.value,
      availableCategories: availableCategories.value,
      availableSizes: availableSizes.value
    });
    
  } catch (error) {
    console.error('❌ Error cargando datos maestros:', error);
    toast.error('Error cargando datos de colores, categorías y talles');
  }
}

// --- Lógica de la API ---
async function fetchProducts() {
  if (import.meta.env.VITEST) return;
  console.log('🔄 Obteniendo productos...');

  if (!authStore.token) {
    console.warn('⚠️ No hay token de autenticación');
    return;
  }

  // Debug: verificar estado de autenticación
  try {
    console.log('🔍 Verificando estado de autenticación...');
    const debugResponse = await apiClient.get('/users/debug');
    console.log('🔍 Debug info:', debugResponse.data);
    
    const hasPermissions = debugResponse.data.has_admin_role || debugResponse.data.has_manager_role;
    console.log(`🔐 Usuario tiene permisos necesarios: ${hasPermissions}`);
    
    if (!hasPermissions) {
      toast.error('❌ No tienes permisos para gestionar productos. Contacta al administrador.');
      return;
    }
  } catch (debugError) {
    console.error('❌ Error verificando autenticación:', debugError);
  }

  try {
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
    });
    if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
    const data = await response.json();
    products.value = data;
    console.log('✅ Productos obtenidos:', data);
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    toast.error('Error al cargar productos. Verifica que el backend esté funcionando.');
  }
}

async function saveProduct() {
  console.log('💾 Guardando producto...', product.value);

  if (!authStore.token) {
    toast.error('No estás autenticado. Por favor inicia sesión.');
    return;
  }

  // Debug: verificar permisos antes de guardar
  try {
    console.log('🔍 Verificando permisos antes de guardar...');
    const debugResponse = await apiClient.get('/users/debug');
    console.log('🔍 Debug info al guardar:', debugResponse.data);
    
    const hasPermissions = debugResponse.data.has_admin_role || debugResponse.data.has_manager_role;
    console.log(`🔐 Usuario tiene permisos para guardar: ${hasPermissions}`);
    
    if (!hasPermissions) {
      toast.error('❌ No tienes permisos para gestionar productos. Tu cuenta necesita rol de Admin o Manager.');
      return;
    }
  } catch (debugError) {
    console.error('❌ Error verificando permisos:', debugError);
    toast.error('Error verificando permisos. Verifica tu autenticación.');
    return;
  }

  // Validar datos del producto
  if (product.value.is_unique) {
    if (!product.value.color && !product.value.talle) {
      toast.error('Los productos únicos deben tener al menos color o talla especificado');
      return;
    }
    if (product.value.stock === null || product.value.stock === undefined || product.value.stock < 0) {
      toast.error('Los productos únicos deben tener stock especificado');
      return;
    }
  } else {
    if (product.value.variants.length === 0) {
      toast.error('Los productos con variantes deben tener al menos una variante');
      return;
    }
    // Validar que todas las variantes tengan datos válidos
    for (const variant of product.value.variants) {
      if (variant.stock < 0) {
        toast.error('Todas las variantes deben tener stock válido');
        return;
      }
    }
  }

  try {
    // Subir imágenes a Firebase Storage si hay archivos seleccionados
    if (selectedFiles.value.length > 0) {
      console.log('📸 Subiendo imágenes a Firebase Storage...');
      const imageUrls = await uploadImages();
      product.value.images = imageUrls;
      console.log('✅ Imágenes subidas:', imageUrls);
    }

    const method = editing.value ? 'PUT' : 'POST';
    const editingProduct = editing.value ? products.value.find(p => p.name === product.value.name) : null;
    const url = editing.value ? `${API_URL}${editingProduct?.id}` : API_URL;

    console.log(`🌐 ${method} request to: ${url}`);
    console.log('📦 Payload:', product.value);

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`,
      },
      body: JSON.stringify(product.value),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const savedProduct = await response.json();
    console.log('✅ Producto guardado:', savedProduct);

    await fetchProducts();
    resetForm();
    toast.success(`🎉 Producto ${editing.value ? 'actualizado' : 'creado'} exitosamente!`);
  } catch (error) {
    console.error('❌ Error al guardar producto:', error);
    toast.error(`Error al ${editing.value ? 'actualizar' : 'crear'} producto: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

async function deleteProduct(id?: number) {
  if (!id) return;

  if (!authStore.token) {
    toast.error('❌ No estás autenticado. Por favor inicia sesión.');
    return;
  }

  console.log('🗑️ Eliminando producto ID:', id);

  try {
    const response = await apiClient.delete(`/products/${id}`);

    if (response.status === 200) {
      console.log('✅ Producto eliminado');
      await fetchProducts();
      toast.success('🎉 Producto eliminado exitosamente!');
    }
  } catch (error: any) {
    console.error('❌ Error al eliminar producto:', error);
    const errorMessage = error.response?.data?.detail || 'Error al eliminar producto';
    toast.error(`❌ ${errorMessage}`);
  }
}// --- Lógica de Imágenes ---
function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    selectedFiles.value = Array.from(target.files);
    imagePreviews.value = [];
    for (const file of selectedFiles.value) {
      imagePreviews.value.push(URL.createObjectURL(file));
    }
  }
}

async function uploadImages(): Promise<string[]> {
  console.log('📤 Subiendo', selectedFiles.value.length, 'archivos a Firebase Storage...');

  try {
    const uploadPromises = selectedFiles.value.map(async (file, index) => {
      const fileName = `${Date.now()}_${file.name}`;
      const fileRef = storageRef(storage, `products/${fileName}`);

      console.log(`📸 Subiendo archivo ${index + 1}:`, fileName);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log(`✅ Archivo ${index + 1} subido:`, downloadURL);

      return downloadURL;
    });

    const imageUrls = await Promise.all(uploadPromises);
    console.log('🎉 Todas las imágenes subidas exitosamente:', imageUrls);
    return imageUrls;
  } catch (error) {
    console.error('❌ Error al subir imágenes:', error);
    throw new Error(`Error al subir imágenes: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
}

// --- Lógica del Formulario ---
function editProduct(p: Product) {
  editing.value = true;
  product.value = {
    name: p.name,
    description: p.description,
    price: p.price,
    genero: p.genero,
    estado: p.estado,
    categoria: p.categoria || null,
    is_unique: p.is_unique,
    color: p.color || null,
    talle: p.talle || null,
    stock: p.stock || null,
    images: p.images.map((img) => img.image_url),
    variants: p.variants.map(v => ({ color: v.color, talle: v.talle, stock: v.stock }))
  };
  imagePreviews.value = p.images.map((img) => img.image_url);
  selectedFiles.value = [];
}

function addVariant() {
  if (!product.value.is_unique) {
    product.value.variants.push({ color: '', talle: '', stock: 1 }); // Stock por defecto 1
  }
}

function removeVariant(index: number) {
  if (!product.value.is_unique) {
    product.value.variants.splice(index, 1);
  }
}

function onUniqueProductChange() {
  if (product.value.is_unique) {
    // Si cambia a único, limpiar variantes y mover la primera variante (si existe) a los campos únicos
    if (product.value.variants.length > 0) {
      const firstVariant = product.value.variants[0];
      product.value.color = firstVariant.color;
      product.value.talle = firstVariant.talle;
      product.value.stock = firstVariant.stock;
    } else {
      // Si no hay variantes, poner stock por defecto a 1
      product.value.stock = 1;
    }
    product.value.variants = [];
  } else {
    // Si cambia a variantes, mover los campos únicos a una nueva variante
    if (product.value.color || product.value.talle || product.value.stock) {
      product.value.variants = [{
        color: product.value.color || null,
        talle: product.value.talle || null,
        stock: product.value.stock || 1
      }];
    } else {
      // Si no hay datos únicos, crear una variante vacía con stock 1
      product.value.variants = [{ color: '', talle: '', stock: 1 }];
    }
    product.value.color = null;
    product.value.talle = null;
    product.value.stock = null;
  }
}

function getProductStock(p: Product): number {
  if (p.is_unique) {
    return p.stock || 0;
  } else {
    return p.variants.reduce((total, variant) => total + variant.stock, 0);
  }
}

function resetForm() {
  editing.value = false;
  product.value = { 
    name: '', 
    description: null, 
    price: 0, 
    genero: 'unisex', 
    estado: 'nuevo',
    categoria: null,
    is_unique: true,
    color: null,
    talle: null,
    stock: 1, // Stock por defecto 1
    images: [], 
    variants: [] 
  };
  selectedFiles.value = [];
  imagePreviews.value = [];
}

// --- Lógica del Modal ---
function confirmSave() {
  modalTitle.value = editing.value ? 'Confirmar Actualización' : 'Confirmar Creación';
  modalMessage.value = `¿Estás seguro de que deseas ${editing.value ? 'actualizar' : 'guardar'} este producto?`;
  confirmAction.value = saveProduct;
  showModal.value = true;
}

function confirmDelete(id: number) {
  modalTitle.value = 'Confirmar Eliminación';
  modalMessage.value = '¿Estás seguro de que deseas eliminar este producto?';
  confirmAction.value = () => deleteProduct(id);
  showModal.value = true;
}

function handleConfirm() {
  if (confirmAction.value) {
    confirmAction.value();
  }
  showModal.value = false;
}

function handleCancel() {
  showModal.value = false;
}

onMounted(async () => {
  console.log('🚀 Componente montado, iniciando carga de datos...');
  console.log('🔐 Usuario Firebase:', authStore.firebaseUser);
  console.log('🎫 Token disponible:', !!authStore.token);
  
  await loadMasterData();
  await fetchProducts();
});

</script>
