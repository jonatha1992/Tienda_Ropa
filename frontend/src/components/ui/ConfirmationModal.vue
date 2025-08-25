<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
    <div class="relative mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3 text-center">
        <h3 class="text-lg leading-6 font-heading font-medium text-gray-900">{{ title }}</h3>
        <div class="mt-2 px-7 py-3">
          <p class="text-sm font-body text-gray-500">{{ message }}</p>
        </div>
        <div class="items-center px-4 py-3">
          <button @click="$emit('cancel')" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 mr-2 font-body">Cancelar</button>
          <button @click="$emit('confirm')" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-body">Confirmar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  show: boolean;
  title: string;
  message: string;
}

defineProps<Props>();
defineEmits(['confirm', 'cancel']);
</script>

