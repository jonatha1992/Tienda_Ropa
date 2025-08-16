<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Administración de Productos</h1>
            <p class="mt-1 text-sm text-gray-500">Gestiona el catálogo de productos y sus variantes</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">

    <!-- Layout de dos columnas: Formulario + Vista previa -->
    <div class="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-12">
      <!-- Formulario (8 columnas) -->
      <div class="lg:col-span-8">
        <form @submit.prevent="confirmSave" class="p-8 bg-white border-2 border-gray-200 shadow-lg rounded-xl">
          <h2 class="mb-6 text-2xl font-bold text-gray-800">{{ editing ? 'Editar Producto' : 'Nuevo Producto' }}</h2>

          <!-- Checkbox para producto único -->
          <div class="mb-6">
            <label class="flex items-center">
              <input 
                type="checkbox" 
                v-model="product.is_unique" 
                @change="onUniqueProductChange"
                class="mr-2 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              >
              <span class="text-sm font-semibold text-gray-700">
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
              <label for="name" class="block mb-2 text-sm font-semibold text-gray-700">Nombre</label>
              <input 
                type="text" 
                v-model="product.name" 
                placeholder="Nombre del producto"
                class="w-full px-4 py-3 mt-1 text-sm leading-5 text-gray-900 transition-all duration-200 bg-white border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                required
              >
            </div>
            <div>
              <label for="price" class="block mb-2 text-sm font-semibold text-gray-700">Precio</label>
              <div class="relative mt-1">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                  <span class="text-sm text-gray-500">$</span>
                </div>
                <input 
                  type="number" 
                  step="0.01" 
                  v-model.number="product.price"
                  placeholder="0.00"
                  class="w-full py-3 pl-8 pr-3 text-sm leading-5 text-gray-900 transition-all duration-200 bg-white border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" 
                  required
                >
              </div>
            </div>
          </div>

          <!-- Sección de descuento -->
          <div class="mt-6">
            <div class="flex items-center mb-4">
              <input 
                type="checkbox" 
                v-model="product.has_discount" 
                @change="onDiscountChange"
                class="mr-2 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              >
              <label class="text-sm font-semibold text-gray-700">
                Aplicar descuento al producto
              </label>
            </div>
            
            <div v-if="product.has_discount" class="p-5 border-2 border-yellow-200 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50">
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label for="discount_percentage" class="block mb-2 text-sm font-semibold text-gray-700">Porcentaje de descuento (%)</label>
                  <div class="relative mt-1">
                    <input 
                      type="number" 
                      min="1" 
                      max="100" 
                      step="1"
                      v-model.number="product.discount_percentage"
                      placeholder="Ej: 20"
                      class="w-full py-3 pl-3 pr-10 text-sm leading-5 text-gray-900 transition-all duration-200 bg-white border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500" 
                      required
                    >
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span class="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                </div>
                
                <div v-if="product.discount_percentage && product.price" class="flex flex-col justify-end">
                  <div class="p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                    <div class="mb-1 text-xs text-gray-500">Vista previa del descuento:</div>
                    <div class="text-sm">
                      <span class="text-gray-400 line-through">${{ product.price.toFixed(2) }}</span>
                      <span class="ml-2 font-semibold text-green-600">${{ getDiscountedPrice().toFixed(2) }}</span>
                    </div>
                    <div class="mt-1 text-xs text-gray-500">
                      Ahorras: ${{ getDiscountAmount().toFixed(2) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sección de atributos de producto en tres columnas -->
          <div class="mt-6">
            <h3 class="mb-4 text-lg font-semibold text-gray-800">Atributos del Producto</h3>
            <div class="grid items-start grid-cols-1 gap-6 p-6 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 md:grid-cols-3">
              <div>
                <label for="genero" class="block mb-2 text-sm font-semibold text-gray-700">Género</label>
                <Combobox v-model="product.genero">
                  <div class="relative mt-1">
                    <div class="relative w-full overflow-hidden text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                      <ComboboxInput
                        class="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 transition-all duration-200 bg-white border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        :displayValue="(genero: any) => genero ? genero.charAt(0).toUpperCase() + genero.slice(1) : 'Seleccione el género'"
                        @change="product.genero = $event.target.value"
                        placeholder="Género del producto"
                      />
                      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
                      </ComboboxButton>
                    </div>
                    <ComboboxOptions class="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ComboboxOption
                        v-for="genero in ['unisex', 'masculino', 'femenino']"
                        as="template"
                        :key="genero"
                        :value="genero"
                        v-slot="{ selected, active }"
                      >
                        <li
                          :class="[
                            active ? 'bg-teal-600 text-white' : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-10 pr-4',
                          ]"
                        >
                          <span
                            :class="[
                              selected ? 'font-medium' : 'font-normal',
                              'block truncate',
                            ]"
                          >
                            {{ genero.charAt(0).toUpperCase() + genero.slice(1) }}
                          </span>
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
                <label for="estado" class="block mb-2 text-sm font-semibold text-gray-700">Estado</label>
                <Combobox v-model="product.estado">
                  <div class="relative mt-1">
                    <div class="relative w-full overflow-hidden text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                      <ComboboxInput
                        class="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 transition-all duration-200 bg-white border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        :displayValue="(estado: any) => estado ? estado.charAt(0).toUpperCase() + estado.slice(1) : 'Seleccione el estado'"
                        @change="product.estado = $event.target.value"
                        placeholder="Estado del producto"
                      />
                      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
                      </ComboboxButton>
                    </div>
                    <ComboboxOptions class="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ComboboxOption
                        v-for="estado in ['nuevo', 'usado']"
                        as="template"
                        :key="estado"
                        :value="estado"
                        v-slot="{ selected, active }"
                      >
                        <li
                          :class="[
                            active ? 'bg-teal-600 text-white' : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-10 pr-4',
                          ]"
                        >
                          <span
                            :class="[
                              selected ? 'font-medium' : 'font-normal',
                              'block truncate',
                            ]"
                          >
                            {{ estado.charAt(0).toUpperCase() + estado.slice(1) }}
                          </span>
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
                <label for="categoria" class="block mb-2 text-sm font-semibold text-gray-700">Categoría</label>
                <Combobox v-model="product.categoria">
                  <div class="relative mt-1">
                    <div class="relative w-full overflow-hidden text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                      <ComboboxInput
                        ref="uniqueCategoryInput"
                        class="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 transition-all duration-200 bg-white border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        :displayValue="(categoria: any) => categoria && categoria !== 'Seleccione la categoría' ? categoria : ''"
                        @change="updateCategorySearch($event.target.value)"
                        @focus="clearCategorySearch($event.target)"
                        placeholder="Buscar categoría..."
                      />
                      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
                      </ComboboxButton>
                    </div>
                    <ComboboxOptions class="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ComboboxOption
                        v-for="category in filteredCategories"
                        as="template"
                        :key="category.id"
                        :value="category.name"
                        v-slot="{ selected, active }"
                      >
                        <li
                          :class="[
                            active ? 'bg-teal-600 text-white' : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-10 pr-4',
                          ]"
                        >
                          <span
                            :class="[
                              selected ? 'font-medium' : 'font-normal',
                              'block truncate',
                            ]"
                          >
                            {{ category.name }}
                          </span>
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
            </div>
            <div class="mt-6">
              <label for="description" class="block mb-2 text-sm font-semibold text-gray-700">Descripción</label>
              <textarea 
                v-model="product.description" 
                rows="4"
                placeholder="Describe las características del producto..."
                class="w-full px-4 py-3 mt-1 text-sm leading-5 text-gray-900 transition-all duration-200 bg-white border-2 border-gray-200 rounded-lg shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              ></textarea>
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
            <h3 class="text-lg font-semibold text-gray-800">Atributos del Producto Único</h3>
            <div class="grid items-start grid-cols-1 gap-6 p-6 border-2 border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 md:grid-cols-3">
              <div>
                <label class="block mb-2 text-sm font-semibold text-gray-700">Color</label>
                
                <!-- Combobox personalizado para colores -->
                <Combobox v-model="product.color">
                  <div class="relative mt-1">
                    <div class="relative w-full overflow-hidden text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                      <ComboboxInput
                        ref="uniqueColorInput"
                        class="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 transition-all duration-200 bg-white border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        :displayValue="(color: any) => color && color !== 'Seleccione el color' ? color : ''"
                        @change="updateColorSearch($event.target.value)"
                        @focus="clearColorSearch($event.target)"
                        placeholder="Buscar color..."
                      />
                      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
                      </ComboboxButton>
                    </div>
                    <ComboboxOptions class="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ComboboxOption
                        v-for="color in filteredColors"
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
                <label class="block mb-2 text-sm font-semibold text-gray-700">Talle</label>
                
                <!-- Combobox personalizado para talles -->
                <Combobox v-model="product.talle">
                  <div class="relative mt-1">
                    <div class="relative w-full overflow-hidden text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                      <ComboboxInput
                        ref="uniqueSizeInput"
                        class="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 transition-all duration-200 bg-white border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        :displayValue="(talle: any) => talle && talle !== 'Seleccione el talle' ? talle : ''"
                        @change="updateSizeSearch($event.target.value)"
                        @focus="clearSizeSearch($event.target)"
                        placeholder="Buscar talle..."
                      />
                      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
                      </ComboboxButton>
                    </div>
                    <ComboboxOptions class="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ComboboxOption
                        v-for="size in filteredSizes"
                        as="template"
                        :key="size.id"
                        :value="size.name"
                        v-slot="{ selected, active }"
                      >
                        <li
                          :class="[
                            active ? 'bg-teal-600 text-white' : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-10 pr-4',
                          ]"
                        >
                          <span
                            :class="[
                              selected ? 'font-medium' : 'font-normal',
                              'block truncate',
                            ]"
                          >
                            {{ size.name }}
                            <span v-if="size.numeric_size" class="text-gray-500">({{ size.numeric_size }})</span>
                          </span>
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
                <label class="block mb-2 text-sm font-semibold text-gray-700">Stock</label>
                <div class="relative mt-1">
                  <input 
                    type="number" 
                    v-model.number="product.stock" 
                    min="0"
                    step="1"
                    placeholder="Cantidad en stock"
                    class="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 transition-all duration-200 bg-white border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  >
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span class="text-xs text-gray-400">unidades</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sección de variantes múltiples -->
          <div v-else class="mt-6">
            <h3 class="text-lg font-semibold text-gray-800">Variantes</h3>
            <div v-for="(variant, index) in product.variants" :key="index"
              class="grid items-end grid-cols-1 gap-6 p-6 mt-4 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 md:grid-cols-7 ">
              
              <div class="md:col-span-2">
                <label class="block mb-2 text-sm font-semibold text-gray-700">Color</label>
                
                <!-- Combobox personalizado para colores en variantes -->
                <Combobox v-model="variant.color">
                  <div class="relative mt-1">
                    <div class="relative w-full overflow-hidden text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                      <ComboboxInput
                        class="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 transition-all duration-200 bg-white border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        :displayValue="(color: any) => color && color !== 'Seleccione el color' ? color : ''"
                        @change="updateVariantColorSearch($event.target.value, index)"
                        @focus="clearVariantColorSearch($event.target, index)"
                        placeholder="Buscar color..."
                      />
                      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
                      </ComboboxButton>
                    </div>
                    <ComboboxOptions class="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ComboboxOption
                        v-for="color in filteredColors"
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
              
              <div class="md:col-span-2">
                <label class="block mb-2 text-sm font-semibold text-gray-700">Talle</label>
                
                <!-- Combobox personalizado para talles en variantes -->
                <Combobox v-model="variant.talle">
                  <div class="relative mt-1">
                    <div class="relative w-full overflow-hidden text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                      <ComboboxInput
                        class="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 transition-all duration-200 bg-white border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        :displayValue="(talle: any) => talle && talle !== 'Seleccione el talle' ? talle : ''"
                        @change="updateVariantSizeSearch($event.target.value, index)"
                        @focus="clearVariantSizeSearch($event.target, index)"
                        placeholder="Buscar talle..."
                      />
                      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
                      </ComboboxButton>
                    </div>
                    <ComboboxOptions class="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <ComboboxOption
                        v-for="size in filteredSizes"
                        as="template"
                        :key="size.id"
                        :value="size.name"
                        v-slot="{ selected, active }"
                      >
                        <li
                          :class="[
                            active ? 'bg-teal-600 text-white' : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-10 pr-4',
                          ]"
                        >
                          <span
                            :class="[
                              selected ? 'font-medium' : 'font-normal',
                              'block truncate',
                            ]"
                          >
                            {{ size.name }}
                            <span v-if="size.numeric_size" class="text-gray-500">({{ size.numeric_size }})</span>
                          </span>
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
              
              <div class="md:col-span-2">
                <label class="block mb-2 text-sm font-semibold text-gray-700">Stock</label>
                <div class="relative mt-1">
                  <input 
                    type="number" 
                    v-model.number="variant.stock"
                    min="0"
                    step="1"
                    placeholder="Cantidad en stock"
                    class="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 transition-all duration-200 bg-white border-2 border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span class="text-xs text-gray-400">unidades</span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-start justify-start md:col-span-1">
                <button type="button" @click="removeVariant(index)"
                  class="flex items-center px-3 py-2 text-sm font-semibold text-red-600 transition-all duration-200 border-2 border-red-200 rounded-lg bg-red-50 hover:text-red-700 hover:bg-red-100 hover:border-red-300"
                  title="Eliminar variante">
                  <TrashIcon class="w-4 h-4 md:hidden" />
                  <span class="items-center hidden md:flex">
                    <TrashIcon class="w-4 h-4 mr-2" />
                  </span>
                </button>
              </div>
            </div>
            <button type="button" @click="addVariant"
              class="px-6 py-3 mt-6 text-sm font-semibold text-gray-700 transition-all duration-200 border-2 border-gray-300 rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 hover:border-gray-400">
              Añadir Variante
            </button>
          </div>

          <div class="flex justify-end mt-6">
            <button type="button" @click="resetForm"
              class="px-6 py-3 mr-3 text-sm font-semibold text-gray-700 transition-all duration-200 bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:border-gray-400">Cancelar</button>
            <button type="submit"
              class="px-6 py-3 text-sm font-semibold text-white transition-all duration-200 transform border border-transparent rounded-lg shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105">{{
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
            <th class="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase border-b">Imagen</th>
            <th class="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase border-b">Nombre</th>
            <th class="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase border-b">Precio</th>
            <th class="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase border-b">Descuento</th>
            <th class="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase border-b">Tipo</th>
            <th class="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase border-b">Stock</th>
            <th class="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase border-b">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="p in products" :key="p.id" class="hover:bg-gray-50">
            <!-- Imagen miniatura -->
            <td class="px-4 py-3 text-center border-b">
              <div class="flex justify-center">
                <img 
                  :src="p.images && p.images[0] ? p.images[0].image_url : 'https://firebasestorage.googleapis.com/v0/b/m-vintage.firebasestorage.app/o/modelo_card.jpg?alt=media&token=bfeea622-2abf-4d84-b570-96659c605f8a'" 
                  :alt="p.name"
                  class="object-cover w-12 h-12 rounded-md shadow-sm"
                >
              </div>
            </td>
            <!-- Nombre -->
            <td class="px-4 py-3 text-center border-b">
              <div class="text-sm font-medium text-gray-900">{{ p.name }}</div>
            </td>
            <!-- Precio -->
            <td class="px-4 py-3 text-center border-b">
              <div v-if="p.has_discount && p.discount_percentage" class="text-sm">
                <div class="text-xs text-gray-500 line-through">${{ p.price.toFixed(2) }}</div>
                <div class="font-semibold text-green-600">${{ (p.price * (1 - p.discount_percentage / 100)).toFixed(2) }}</div>
              </div>
              <div v-else class="text-sm font-semibold text-gray-900">${{ p.price.toFixed(2) }}</div>
            </td>
            <!-- Descuento -->
            <td class="px-4 py-3 text-center border-b">
              <div v-if="p.has_discount" class="flex justify-center">
                <span class="inline-flex px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 rounded-full">
                  {{ p.discount_percentage }}% OFF
                </span>
              </div>
              <div v-else class="text-xs text-gray-400">Sin descuento</div>
            </td>
            <!-- Tipo -->
            <td class="px-4 py-3 text-center border-b">
              <div class="flex justify-center">
                <span :class="p.is_unique ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'" 
                      class="inline-flex px-2 py-1 text-xs font-medium rounded-full">
                  {{ p.is_unique ? 'Único' : 'Variantes' }}
                </span>
              </div>
            </td>
            <!-- Stock -->
            <td class="px-4 py-3 text-center border-b">
              <div class="text-sm font-medium text-gray-900">{{ getProductStock(p) }}</div>
            </td>
            <!-- Acciones -->
            <td class="px-4 py-3 text-center border-b">
              <div class="flex justify-center space-x-2">
                <button 
                  @click="editProduct(p)" 
                  class="p-2 text-indigo-600 transition-colors duration-200 rounded-md hover:text-indigo-900 hover:bg-indigo-50"
                  title="Editar producto"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button 
                  @click="p.id && confirmDelete(p.id)"
                  class="p-2 text-red-600 transition-colors duration-200 rounded-md hover:text-red-900 hover:bg-red-50"
                  title="Eliminar producto"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ConfirmationModal :show="showModal" :title="modalTitle" :message="modalMessage" @confirm="handleConfirm"
      @cancel="handleCancel" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { storage } from '../config/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from 'browser-image-compression';
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOptions, ComboboxOption } from '@headlessui/vue';
import { ChevronUpDownIcon, CheckIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/solid';
import ConfirmationModal from '../components/ConfirmationModal.vue';
import ProductCard from '../components/ProductCard.vue';
import { useAuthStore } from '../store/auth';
import { useLoading } from '../composables/useLoading';
import { masterDataApi, config, apiClient } from '../config/index';
import type { Color, Category, Size } from '../types';
import type { Product as GlobalProduct } from '../types';

const toast = useToast();
const authStore = useAuthStore();
const { showLoading, hideLoading } = useLoading();

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
  has_discount: boolean;
  discount_percentage?: number | null;
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
  has_discount: boolean;
  discount_percentage?: number | null;
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
  has_discount: false,
  discount_percentage: null,
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

// === BÚSQUEDA EN SELECTS ===
const colorSearchQuery = ref('');
const sizeSearchQuery = ref('');
const categorySearchQuery = ref('');

// === REFS PARA INPUTS ===
// colorInputRefs y sizeInputRefs removidos - no se utilizaban

// === COMPUTED PARA FILTRADO ===
const filteredColors = computed(() => {
  if (!colorSearchQuery.value) return availableColors.value;
  return availableColors.value.filter(color =>
    color.name.toLowerCase().includes(colorSearchQuery.value.toLowerCase())
  );
});

const filteredSizes = computed(() => {
  if (!sizeSearchQuery.value) return availableSizes.value;
  return availableSizes.value.filter(size =>
    size.name.toLowerCase().includes(sizeSearchQuery.value.toLowerCase())
  );
});

const filteredCategories = computed(() => {
  if (!categorySearchQuery.value) return availableCategories.value;
  return availableCategories.value.filter(category =>
    category.name.toLowerCase().includes(categorySearchQuery.value.toLowerCase())
  );
});

// === FUNCIONES DE BÚSQUEDA ===
const updateColorSearch = (query: string) => {
  colorSearchQuery.value = query;
  // Si encuentra una coincidencia exacta, asignar al producto
  const exactMatch = availableColors.value.find(color => 
    color.name.toLowerCase() === query.toLowerCase()
  );
  if (exactMatch) {
    product.value.color = exactMatch.name;
  }
};

const updateSizeSearch = (query: string) => {
  sizeSearchQuery.value = query;
  // Si encuentra una coincidencia exacta, asignar al producto
  const exactMatch = availableSizes.value.find(size => 
    size.name.toLowerCase() === query.toLowerCase()
  );
  if (exactMatch) {
    product.value.talle = exactMatch.name;
  }
};

const updateVariantColorSearch = (query: string, variantIndex: number) => {
  // Si encuentra una coincidencia exacta, asignar a la variante
  const exactMatch = availableColors.value.find(color => 
    color.name.toLowerCase() === query.toLowerCase()
  );
  if (exactMatch && product.value.variants[variantIndex]) {
    product.value.variants[variantIndex].color = exactMatch.name;
  }
};

const updateVariantSizeSearch = (query: string, variantIndex: number) => {
  // Si encuentra una coincidencia exacta, asignar a la variante
  const exactMatch = availableSizes.value.find(size => 
    size.name.toLowerCase() === query.toLowerCase()
  );
  if (exactMatch && product.value.variants[variantIndex]) {
    product.value.variants[variantIndex].talle = exactMatch.name;
  }
};

const updateCategorySearch = (query: string) => {
  categorySearchQuery.value = query;
  // Si encuentra una coincidencia exacta, asignar al producto
  const exactMatch = availableCategories.value.find(category => 
    category.name.toLowerCase() === query.toLowerCase()
  );
  if (exactMatch) {
    product.value.categoria = exactMatch.name;
  }
};

const clearColorSearch = (inputElement?: HTMLInputElement) => {
  colorSearchQuery.value = '';
  if (inputElement) {
    inputElement.value = '';
    // Limpiar también el modelo si no hay valor seleccionado válido
    if (!product.value.color || product.value.color === 'Seleccione el color') {
      product.value.color = null;
    }
  }
};

const clearSizeSearch = (inputElement?: HTMLInputElement) => {
  sizeSearchQuery.value = '';
  if (inputElement) {
    inputElement.value = '';
    // Limpiar también el modelo si no hay valor seleccionado válido
    if (!product.value.talle || product.value.talle === 'Seleccione el talle') {
      product.value.talle = null;
    }
  }
};

const clearCategorySearch = (inputElement?: HTMLInputElement) => {
  categorySearchQuery.value = '';
  if (inputElement) {
    inputElement.value = '';
    // Limpiar también el modelo si no hay valor seleccionado válido
    if (!product.value.categoria || product.value.categoria === 'Seleccione la categoría') {
      product.value.categoria = null;
    }
  }
};

const clearVariantColorSearch = (inputElement: HTMLInputElement, variantIndex: number) => {
  colorSearchQuery.value = '';
  if (inputElement) {
    inputElement.value = '';
    // Limpiar también el modelo de la variante si no hay valor seleccionado válido
    if (product.value.variants[variantIndex] && 
        (!product.value.variants[variantIndex].color || 
         product.value.variants[variantIndex].color === 'Seleccione el color')) {
      product.value.variants[variantIndex].color = '';
    }
  }
};

const clearVariantSizeSearch = (inputElement: HTMLInputElement, variantIndex: number) => {
  sizeSearchQuery.value = '';
  if (inputElement) {
    inputElement.value = '';
    // Limpiar también el modelo de la variante si no hay valor seleccionado válido
    if (product.value.variants[variantIndex] && 
        (!product.value.variants[variantIndex].talle || 
         product.value.variants[variantIndex].talle === 'Seleccione el talle')) {
      product.value.variants[variantIndex].talle = '';
    }
  }
};

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
    has_discount: product.value.has_discount,
    discount_percentage: product.value.discount_percentage,
    discounted_price: product.value.has_discount && product.value.discount_percentage 
      ? getDiscountedPrice() 
      : undefined,
    discount_amount: product.value.has_discount && product.value.discount_percentage 
      ? getDiscountAmount() 
      : undefined,
    images: imagePreviews.value.length > 0
      ? imagePreviews.value.map((url, index) => ({ id: index, image_url: url }))
      : [{ id: 0, image_url: 'https://firebasestorage.googleapis.com/v0/b/m-vintage.firebasestorage.app/o/modelo_card.jpg?alt=media&token=bfeea622-2abf-4d84-b570-96659c605f8a' }],
    variants: product.value.is_unique ? [] : product.value.variants.map((v, index) => ({
      id: index,
      color_id: 0, // Placeholder ID
      size_id: 0, // Placeholder ID
      image_url: '',
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
  
  showLoading(
    editing.value ? 'Actualizando producto...' : 'Agregando producto...',
    'Por favor espera mientras procesamos tu solicitud'
  );

  if (!authStore.token) {
    toast.error('No estás autenticado. Por favor inicia sesión.');
    hideLoading();
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
      hideLoading();
      return;
    }
  } catch (debugError) {
    console.error('❌ Error verificando permisos:', debugError);
    toast.error('Error verificando permisos. Verifica tu autenticación.');
    hideLoading();
    return;
  }

  // Validar datos del producto
  if (product.value.is_unique) {
    if (!product.value.color && !product.value.talle) {
      toast.error('Los productos únicos deben tener al menos color o talla especificado');
      hideLoading();
      return;
    }
    if (product.value.stock === null || product.value.stock === undefined || product.value.stock < 0) {
      toast.error('Los productos únicos deben tener stock especificado');
      hideLoading();
      return;
    }
  } else {
    if (product.value.variants.length === 0) {
      toast.error('Los productos con variantes deben tener al menos una variante');
      hideLoading();
      return;
    }
    // Validar que todas las variantes tengan datos válidos
    for (const variant of product.value.variants) {
      if (variant.stock < 0) {
        toast.error('Todas las variantes deben tener stock válido');
        hideLoading();
        return;
      }
    }
  }

  // Validar campos de descuento
  if (product.value.has_discount) {
    if (!product.value.discount_percentage || product.value.discount_percentage <= 0 || product.value.discount_percentage > 100) {
      toast.error('El porcentaje de descuento debe estar entre 1 y 100');
      hideLoading();
      return;
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
  } finally {
    hideLoading();
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
    // Filtrar solo imágenes soportadas
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const validFiles = Array.from(target.files).filter(file => 
      supportedTypes.includes(file.type)
    );
    
    if (validFiles.length !== target.files.length) {
      toast.warning(`Se ignoraron ${target.files.length - validFiles.length} archivos no soportados`);
    }
    
    selectedFiles.value = validFiles;
    imagePreviews.value = [];
    for (const file of selectedFiles.value) {
      imagePreviews.value.push(URL.createObjectURL(file));
    }
  }
}

async function compressToWebP(file: File): Promise<File> {
  console.log('🔄 Comprimiendo imagen a WebP:', file.name);
  
  const options = {
    maxSizeMB: 1,                    // Máximo 1MB
    useWebWorker: true,              // Usar Web Worker para no bloquear UI
    fileType: 'image/webp',          // Convertir a WebP
    initialQuality: 0.85,            // Calidad inicial 85%
    maxWidthOrHeight: 1920,          // Redimensionar si es muy grande
  };
  
  try {
    const compressedFile = await imageCompression(file, options);
    console.log('✅ Imagen comprimida:', {
      original: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
      compressed: `${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`,
      reduction: `${(((file.size - compressedFile.size) / file.size) * 100).toFixed(1)}%`
    });
    return compressedFile;
  } catch (error) {
    console.error('❌ Error comprimiendo imagen:', error);
    throw error;
  }
}

async function uploadImages(): Promise<string[]> {
  console.log('📤 Subiendo y comprimiendo', selectedFiles.value.length, 'archivos...');

  try {
    const uploadPromises = selectedFiles.value.map(async (file, index) => {
      // NUEVO: Comprimir y convertir a WebP
      const compressedFile = await compressToWebP(file);
      
      // Generar nombre con extensión .webp
      const originalName = file.name.replace(/\.[^/.]+$/, ''); // Remover extensión original
      const fileName = `${Date.now()}_${originalName}.webp`;
      const fileRef = storageRef(storage, `products/${fileName}`);

      console.log(`📸 Subiendo archivo ${index + 1}:`, fileName);
      const snapshot = await uploadBytes(fileRef, compressedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log(`✅ Archivo ${index + 1} subido:`, downloadURL);

      return downloadURL;
    });

    const imageUrls = await Promise.all(uploadPromises);
    console.log('🎉 Todas las imágenes comprimidas y subidas exitosamente:', imageUrls);
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
    has_discount: p.has_discount,
    discount_percentage: p.discount_percentage,
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
    has_discount: false,
    discount_percentage: null,
    images: [], 
    variants: [] 
  };
  selectedFiles.value = [];
  imagePreviews.value = [];
}

// --- Lógica de Descuentos ---
function onDiscountChange() {
  if (!product.value.has_discount) {
    product.value.discount_percentage = null;
  }
}

function getDiscountedPrice(): number {
  if (product.value.has_discount && product.value.discount_percentage && product.value.price) {
    const discountAmount = product.value.price * (product.value.discount_percentage / 100);
    return product.value.price - discountAmount;
  }
  return product.value.price || 0;
}

function getDiscountAmount(): number {
  if (product.value.has_discount && product.value.discount_percentage && product.value.price) {
    return product.value.price * (product.value.discount_percentage / 100);
  }
  return 0;
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
