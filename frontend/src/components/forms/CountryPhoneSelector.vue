<template>
  <div class="relative">
    <label :for="inputId" class="block text-sm font-medium font-body text-body-text">
      {{ label }}
    </label>
    <div class="flex mt-1 rounded-md shadow-sm">
      <!-- Country Code Selector -->
      <div class="relative">
        <select
          v-model="selectedCountry"
          @change="onCountryChange"
          class="h-full py-2 pl-3 text-sm bg-transparent border border-gray-300 rounded-l-md pr-7 focus:border-black focus:ring-black"
        >
          <option 
            v-for="country in countries" 
            :key="country.code" 
            :value="country.code"
            class="font-body"
          >
            {{ country.flag }} {{ country.dialCode }}
          </option>
        </select>
      </div>
      
      <!-- Phone Input -->
      <input
        :id="inputId"
        v-model="phoneNumber"
        @input="onPhoneInput"
        type="tel"
        :required="required"
        :placeholder="placeholder"
        class="flex-1 block w-full min-w-0 px-3 py-2 border border-l-0 border-gray-300 rounded-none rounded-r-md focus:border-black focus:ring-black"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

interface Props {
  modelValue: string;
  countryCode: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  inputId?: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'update:countryCode', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Teléfono',
  placeholder: 'Número de teléfono',
  required: true,
  inputId: 'phone'
});

const emit = defineEmits<Emits>();

const countries: Country[] = [
  { code: 'AR', name: 'Argentina', flag: '', dialCode: '+54' },
  { code: 'UY', name: 'Uruguay', flag: '', dialCode: '+598' },
  { code: 'CL', name: 'Chile', flag: '', dialCode: '+56' },
  { code: 'BR', name: 'Brasil', flag: '', dialCode: '+55' },
  { code: 'PY', name: 'Paraguay', flag: '', dialCode: '+595' },
  { code: 'BO', name: 'Bolivia', flag: '', dialCode: '+591' },
  { code: 'PE', name: 'Perú', flag: '', dialCode: '+51' },
  { code: 'EC', name: 'Ecuador', flag: '', dialCode: '+593' },
  { code: 'CO', name: 'Colombia', flag: '', dialCode: '+57' },
  { code: 'VE', name: 'Venezuela', flag: '', dialCode: '+58' }
];

const selectedCountry = ref(props.countryCode);
const phoneNumber = ref(props.modelValue);

const currentCountry = computed(() => 
  countries.find(c => c.code === selectedCountry.value) || countries[0]
);

const onCountryChange = () => {
  emit('update:countryCode', selectedCountry.value);
};

const onPhoneInput = () => {
  emit('update:modelValue', phoneNumber.value);
};

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  phoneNumber.value = newValue;
});

watch(() => props.countryCode, (newValue) => {
  selectedCountry.value = newValue;
});
</script>
