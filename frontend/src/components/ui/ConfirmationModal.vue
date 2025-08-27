<template>
  <div v-if="show" class="fixed inset-0 flex items-center justify-center w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50">
    <div class="relative p-5 mx-auto bg-white border rounded-md shadow-lg w-96">
      <div class="mt-3 text-center">
        <h3 class="text-lg font-medium leading-6 text-gray-900 font-heading">{{ title }}</h3>
        <div class="py-3 mt-2 px-7">
          <p class="text-sm text-gray-500 font-body">{{ message }}</p>
        </div>
        <div class="items-center px-4 py-3">
          <button @click="$emit('cancel')" class="px-4 py-2 mr-2 text-gray-800 bg-gray-200 rounded hover:bg-gray-300 ">Cancelar</button>
          <button @click="$emit('confirm')" class="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 ">Confirmar</button>
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

