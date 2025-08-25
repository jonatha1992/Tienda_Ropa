<template>
  <div class="relative">
    <label :for="inputId" class="font-body block text-sm font-medium text-body-text">
      {{ label }}
    </label>
    <div class="mt-1 flex rounded-md shadow-sm">
      <!-- Country Code Selector -->
      <div class="relative">
        <select
          v-model="selectedCountry"
          @change="onCountryChange"
          class="h-full rounded-l-md border border-gray-300 bg-transparent py-2 pl-3 pr-7 text-sm focus:border-black focus:ring-black"
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
        class="flex-1 min-w-0 block w-full rounded-none rounded-r-md border border-l-0 border-gray-300 px-3 py-2 focus:border-black focus:ring-black"
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
  label: 'TelÃ©fono',
  placeholder: 'NÃºmero de telÃ©fono',
  required: true,
  inputId: 'phone'
});

const emit = defineEmits<Emits>();

const countries: Country[] = [
  { code: 'AR', name: 'Argentina', flag: 'ðŸ‡¦ðŸ‡·', dialCode: '+54' },
  { code: 'UY', name: 'Uruguay', flag: 'ðŸ‡ºðŸ‡¾', dialCode: '+598' },
  { code: 'CL', name: 'Chile', flag: 'ðŸ‡¨ðŸ‡±', dialCode: '+56' },
  { code: 'BR', name: 'Brasil', flag: 'ðŸ‡§ðŸ‡·', dialCode: '+55' },
  { code: 'PY', name: 'Paraguay', flag: 'ðŸ‡µðŸ‡¾', dialCode: '+595' },
  { code: 'BO', name: 'Bolivia', flag: 'ðŸ‡§ðŸ‡´', dialCode: '+591' },
  { code: 'PE', name: 'PerÃº', flag: 'ðŸ‡µðŸ‡ª', dialCode: '+51' },
  { code: 'EC', name: 'Ecuador', flag: 'ðŸ‡ªðŸ‡¨', dialCode: '+593' },
  { code: 'CO', name: 'Colombia', flag: 'ðŸ‡¨ðŸ‡´', dialCode: '+57' },
  { code: 'VE', name: 'Venezuela', flag: 'ðŸ‡»ðŸ‡ª', dialCode: '+58' }
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
