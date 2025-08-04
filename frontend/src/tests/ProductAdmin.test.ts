import { render, screen, fireEvent } from '@testing-library/vue';
import { describe, it, expect } from 'vitest';
import App from '../App.vue';
import router from '../router';

describe('ProductAdmin Navigation', () => {
  it('navigates to the admin page when the admin link is clicked', async () => {
    render(App, {
      global: {
        plugins: [router],
      },
    });

    // Espera a que el enrutador esté listo
    await router.isReady();

    // Busca el enlace "Admin"
    const adminLink = screen.getByText('Admin');
    expect(adminLink).toBeTruthy();

    // Simula un clic en el enlace
    await fireEvent.click(adminLink);

    // Verifica que la página de administración de productos se haya cargado
    const pageTitle = await screen.findByText('Administración de Productos');
    expect(pageTitle).toBeTruthy();
  });
});
