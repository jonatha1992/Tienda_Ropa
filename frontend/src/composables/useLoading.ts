import { ref, readonly, computed } from 'vue';

// Estado global del loading
const isLoading = ref(false);
const loadingMessage = ref('');
const loadingSubmessage = ref('');
const routeLoading = ref(false);

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

  const showRouteLoading = (message: string, submessage?: string) => {
    routeLoading.value = true;
    showLoading(message, submessage);
  };
  const hideRouteLoading = () => {
    routeLoading.value = false;
    hideLoading();
  };
  const isRouteLoading = computed(() => routeLoading.value);

  return {
    isLoading: readonly(isLoading),
    loadingMessage: readonly(loadingMessage),
    loadingSubmessage: readonly(loadingSubmessage),
    isRouteLoading,
    showLoading,
    hideLoading,
    showRouteLoading,
    hideRouteLoading,
    setLoadingMessage
  };
}