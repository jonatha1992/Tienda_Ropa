import { ref, readonly } from 'vue';

// Estado global del loading
const isLoading = ref(false);
const loadingMessage = ref('');
const loadingSubmessage = ref('');

export function useLoading() {
  const showLoading = (message: string, submessage?: string) => {
    loadingMessage.value = message;
    loadingSubmessage.value = submessage || '';
    isLoading.value = true;
  };

  const hideLoading = () => {
    isLoading.value = false;
    loadingMessage.value = '';
    loadingSubmessage.value = '';
  };

  const setLoadingMessage = (message: string, submessage?: string) => {
    loadingMessage.value = message;
    loadingSubmessage.value = submessage || '';
  };

  return {
    isLoading: readonly(isLoading),
    loadingMessage: readonly(loadingMessage),
    loadingSubmessage: readonly(loadingSubmessage),
    showLoading,
    hideLoading,
    setLoadingMessage
  };
}