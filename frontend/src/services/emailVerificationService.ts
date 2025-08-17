import api from '../config/api';

export interface WelcomeEmailRequest {
  to: string;
  display_name?: string;
}

export interface NotificationEmailRequest {
  to: string;
  title: string;
  message: string;
  action_url?: string;
}

export interface OrderConfirmationEmailRequest {
  to: string;
  order_number: string;
  order_date: string;
  customer_name: string;
  order_items: any[];
  subtotal: number;
  discount?: number;
  shipping_cost: number;
  total: number;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  delivery_notes?: string;
  payment_method_text: string;
  payment_instructions?: string;
}

export interface ContactEmailRequest {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  subject: string;
  message: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface EmailResponse {
  message: string;
  [key: string]: any;
}

class EmailService {
  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(request: WelcomeEmailRequest): Promise<EmailResponse> {
    try {
      const response = await api.post('/emails/welcome', request);
      return response.data;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw new Error('Error al enviar email de bienvenida');
    }
  }

  /**
   * Send notification email
   */
  async sendNotificationEmail(request: NotificationEmailRequest): Promise<EmailResponse> {
    try {
      const response = await api.post('/emails/notify', request);
      return response.data;
    } catch (error) {
      console.error('Error sending notification email:', error);
      throw new Error('Error al enviar email de notificación');
    }
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmationEmail(request: OrderConfirmationEmailRequest): Promise<EmailResponse> {
    try {
      const response = await api.post('/emails/order-confirmation', request);
      return response.data;
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      throw new Error('Error al enviar email de confirmación de pedido');
    }
  }

  /**
   * Send contact form email
   */
  async sendContactEmail(request: ContactEmailRequest): Promise<EmailResponse> {
    try {
      const response = await api.post('/emails/contact', request);
      return response.data;
    } catch (error) {
      console.error('Error sending contact email:', error);
      throw new Error('Error al enviar mensaje de contacto');
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;
