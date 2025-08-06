<template>
  <div class="container p-4 mx-auto">
    <h1 class="mb-4 text-2xl font-bold">Administración de Productos</h1>

    <!-- Layout de dos columnas: Formulario + Vista previa -->
    <div class="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-12">
      <!-- Formulario (8 columnas) -->
      <div class="lg:col-span-8">
        <form @submit.prevent="confirmSave" class="p-6 bg-white border rounded-lg shadow-md">
          <h2 class="mb-4 text-xl font-semibold">{{ editing ? 'Editar Producto' : 'Nuevo Producto' }}</h2>

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

          <div class="mt-6">
            <h3 class="text-lg font-medium text-gray-800">Variantes</h3>
            <div v-for="(variant, index) in product.variants" :key="index"
              class="grid items-center grid-cols-4 gap-4 p-4 mt-4 border rounded">
              <input type="text" v-model="variant.color" placeholder="Color"
                class="border-gray-300 rounded-md shadow-sm">
              <input type="text" v-model="variant.talle" placeholder="Talle"
                class="border-gray-300 rounded-md shadow-sm">
              <input type="number" v-model.number="variant.stock" placeholder="Stock"
                class="border-gray-300 rounded-md shadow-sm">
              <button type="button" @click="removeVariant(index)"
                class="text-red-500 hover:text-red-700">Eliminar</button>
            </div>
            <button type="button" @click="addVariant"
              class="px-4 py-2 mt-4 text-sm font-medium bg-gray-100 border rounded-md hover:bg-gray-200">Añadir
              Variante</button>
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
            <th class="px-4 py-2 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p.id">
            <td class="px-4 py-2 border-b">{{ p.name }}</td>
            <td class="px-4 py-2 border-b">{{ p.price }}</td>
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
import ConfirmationModal from '../components/ConfirmationModal.vue';
import ProductCard from '../components/ProductCard.vue';
import { useAuthStore } from '../store/auth';
import apiClient from '../api';

const toast = useToast();
const authStore = useAuthStore();

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
  images: ProductImage[];
  variants: ProductVariant[];
}

interface ProductCreate {
  name: string;
  description: string | null;
  price: number;
  genero: string;
  estado: string;
  images: string[];
  variants: Omit<ProductVariant, 'id'>[];
}

// Tipo para ProductCard (compatible con el tipo global)
interface ProductCardType {
  id: number;
  name: string;
  description: string;
  price: number;
  images: { image_url: string }[];
  variants: { color: string; size: string; stock: number }[];
}

const API_URL = 'http://localhost:8000/api/v1/products/';

const products = ref<Product[]>([]);
const editing = ref(false);
const product = ref<ProductCreate>({
  name: '',
  description: null,
  price: 0,
  genero: 'unisex',
  estado: 'nuevo',
  images: [],
  variants: [],
});

const selectedFiles = ref<File[]>([]);
const imagePreviews = ref<string[]>([]);
const showModal = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');
const confirmAction = ref<(() => void) | null>(null);

// Vista previa del producto para el ProductCard
const previewProduct = computed((): ProductCardType => ({
  id: 1, // ID temporal para la vista previa
  name: product.value.name || 'Nombre del producto',
  description: product.value.description || 'Descripción del producto',
  price: product.value.price || 0,
  images: imagePreviews.value.length > 0
    ? imagePreviews.value.map(url => ({ image_url: url }))
    : [{ image_url: 'https://via.placeholder.com/300x300?text=Sin+Imagen' }],
  variants: product.value.variants.map(v => ({
    color: v.color || '',
    size: v.talle || '',
    stock: v.stock || 0
  }))
}));

// --- Lógica de la API ---
async function fetchProducts() {
  if (import.meta.env.VITEST) return;
  console.log('🔄 Obteniendo productos...');

  if (!authStore.token) {
    console.warn('⚠️ No hay token de autenticación');
    return;
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
    alert('Error al cargar productos. Verifica que el backend esté funcionando.');
  }
}

async function saveProduct() {
  console.log('💾 Guardando producto...', product.value);

  if (!authStore.token) {
    alert('No estás autenticado. Por favor inicia sesión.');
    return;
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
    alert(`Producto ${editing.value ? 'actualizado' : 'creado'} exitosamente!`);
  } catch (error) {
    console.error('❌ Error al guardar producto:', error);
    alert(`Error al ${editing.value ? 'actualizar' : 'crear'} producto: ${error instanceof Error ? error.message : 'Error desconocido'}`);
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
    images: p.images.map((img) => img.image_url),
    variants: p.variants.map(v => ({ color: v.color, talle: v.talle, stock: v.stock }))
  };
  imagePreviews.value = p.images.map((img) => img.image_url);
  selectedFiles.value = [];
}

function addVariant() {
  product.value.variants.push({ color: '', talle: '', stock: 0 });
}

function removeVariant(index: number) {
  product.value.variants.splice(index, 1);
}

function resetForm() {
  editing.value = false;
  product.value = { name: '', description: null, price: 0, genero: 'unisex', estado: 'nuevo', images: [], variants: [] };
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

onMounted(fetchProducts);

</script>
