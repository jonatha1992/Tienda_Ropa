/**
 * Servicio de notificaciones por email usando EmailJS
 * Permite enviar emails automáticos para confirmaciones de pago,
 * fallos de pago y confirmaciones de pedidos.
 */
import emailjs from '@emailjs/browser';

// Configuración EmailJS desde variables de entorno
const EMAIL_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  templates: {
    paymentSuccess: import.meta.env.VITE_EMAILJS_TEMPLATE_SUCCESS || '',
    paymentFailed: import.meta.env.VITE_EMAILJS_TEMPLATE_FAILED || '',
    orderConfirmation: import.meta.env.VITE_EMAILJS_TEMPLATE_ORDER || '',
    transferInstructions: import.meta.env.VITE_EMAILJS_TEMPLATE_TRANSFER || '',
    deliveryScheduled: import.meta.env.VITE_EMAILJS_TEMPLATE_DELIVERY || ''
  }
};

export interface EmailData {
  to_email: string;
  customer_name: string;
  order_id: number;
  total_amount: number;
  payment_method: string;
  additional_data?: Record<string, any>;
}

export interface TransferEmailData extends EmailData {
  bank_info?: {
    bank_name: string;
    cbu: string;
    alias: string;
    holder_name: string;
  };
}

export interface DeliveryEmailData extends EmailData {
  delivery_info?: {
    address: string;
    scheduled_date: string;
    time_slot: string;
    zone: string;
  };
}

class EmailService {
  private isConfigured: boolean = false;

  constructor() {
    this.initializeEmailJS();
  }

  private initializeEmailJS(): void {
    if (!EMAIL_CONFIG.serviceId || !EMAIL_CONFIG.publicKey) {
      console.warn('⚠️ EmailJS no configurado. Variables de entorno faltantes.');
      this.isConfigured = false;
      return;
    }

    try {
      emailjs.init(EMAIL_CONFIG.publicKey);
      this.isConfigured = true;
      console.log('✅ EmailJS configurado correctamente');
    } catch (error) {
      console.error('❌ Error configurando EmailJS:', error);
      this.isConfigured = false;
    }
  }

  private checkConfiguration(): boolean {
    if (!this.isConfigured) {
      console.warn('📧 EmailJS no está configurado. Email no enviado.');
      return false;
    }
    return true;
  }

  /**
   * Envía email de confirmación de pago exitoso
   */
  async sendPaymentSuccessEmail(data: EmailData): Promise<boolean> {
    if (!this.checkConfiguration()) return false;

    try {
      const templateParams = {
        to_email: data.to_email,
        customer_name: data.customer_name,
        order_id: data.order_id,
        total_amount: data.total_amount.toLocaleString('es-AR', {
          style: 'currency',
          currency: 'ARS'
        }),
        payment_method: this.getPaymentMethodText(data.payment_method),
        success_message: '¡Tu pago ha sido procesado exitosamente!',
        next_steps: 'Tu pedido será preparado y enviado en los próximos días hábiles.',
        ...data.additional_data
      };

      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templates.paymentSuccess,
        templateParams
      );

      console.log('✅ Email de pago exitoso enviado:', response);
      return true;
    } catch (error) {
      console.error('❌ Error enviando email de pago exitoso:', error);
      return false;
    }
  }

  /**
   * Envía email de notificación de pago fallido
   */
  async sendPaymentFailedEmail(data: EmailData): Promise<boolean> {
    if (!this.checkConfiguration()) return false;

    try {
      const templateParams = {
        to_email: data.to_email,
        customer_name: data.customer_name,
        order_id: data.order_id,
        total_amount: data.total_amount.toLocaleString('es-AR', {
          style: 'currency',
          currency: 'ARS'
        }),
        payment_method: this.getPaymentMethodText(data.payment_method),
        failure_message: 'Tu pago no pudo ser procesado correctamente.',
        retry_instructions: 'Puedes intentar nuevamente o contactarnos para asistencia.',
        support_email: 'soporte@m-vintage.com',
        ...data.additional_data
      };

      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templates.paymentFailed,
        templateParams
      );

      console.log('✅ Email de pago fallido enviado:', response);
      return true;
    } catch (error) {
      console.error('❌ Error enviando email de pago fallido:', error);
      return false;
    }
  }

  /**
   * Envía email de confirmación general de pedido
   */
  async sendOrderConfirmationEmail(data: EmailData): Promise<boolean> {
    if (!this.checkConfiguration()) return false;

    try {
      const templateParams = {
        to_email: data.to_email,
        customer_name: data.customer_name,
        order_id: data.order_id,
        total_amount: data.total_amount.toLocaleString('es-AR', {
          style: 'currency',
          currency: 'ARS'
        }),
        payment_method: this.getPaymentMethodText(data.payment_method),
        confirmation_message: 'Tu pedido ha sido confirmado exitosamente.',
        tracking_info: 'Te notificaremos sobre el estado de tu pedido.',
        ...data.additional_data
      };

      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templates.orderConfirmation,
        templateParams
      );

      console.log('✅ Email de confirmación de pedido enviado:', response);
      return true;
    } catch (error) {
      console.error('❌ Error enviando email de confirmación:', error);
      return false;
    }
  }

  /**
   * Envía email con instrucciones de transferencia bancaria
   */
  async sendTransferInstructionsEmail(data: TransferEmailData): Promise<boolean> {
    if (!this.checkConfiguration()) return false;

    try {
      const templateParams = {
        to_email: data.to_email,
        customer_name: data.customer_name,
        order_id: data.order_id,
        total_amount: data.total_amount.toLocaleString('es-AR', {
          style: 'currency',
          currency: 'ARS'
        }),
        bank_name: data.bank_info?.bank_name || '',
        cbu: data.bank_info?.cbu || '',
        alias: data.bank_info?.alias || '',
        holder_name: data.bank_info?.holder_name || '',
        reference: `ORD-${data.order_id}`,
        instructions: 'Realiza la transferencia incluyendo la referencia para identificar tu pago.',
        verification_info: 'Verificaremos tu pago y te notificaremos la confirmación.',
        ...data.additional_data
      };

      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templates.transferInstructions,
        templateParams
      );

      console.log('✅ Email de instrucciones de transferencia enviado:', response);
      return true;
    } catch (error) {
      console.error('❌ Error enviando email de transferencia:', error);
      return false;
    }
  }

  /**
   * Envía email de entrega programada
   */
  async sendDeliveryScheduledEmail(data: DeliveryEmailData): Promise<boolean> {
    if (!this.checkConfiguration()) return false;

    try {
      const templateParams = {
        to_email: data.to_email,
        customer_name: data.customer_name,
        order_id: data.order_id,
        total_amount: data.total_amount.toLocaleString('es-AR', {
          style: 'currency',
          currency: 'ARS'
        }),
        delivery_address: data.delivery_info?.address || '',
        scheduled_date: data.delivery_info?.scheduled_date || '',
        time_slot: data.delivery_info?.time_slot || '',
        delivery_zone: data.delivery_info?.zone || '',
        preparation_info: 'Ten el monto exacto en efectivo y tu DNI disponible.',
        contact_info: 'Nos contactaremos contigo antes de la entrega.',
        ...data.additional_data
      };

      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templates.deliveryScheduled,
        templateParams
      );

      console.log('✅ Email de entrega programada enviado:', response);
      return true;
    } catch (error) {
      console.error('❌ Error enviando email de entrega:', error);
      return false;
    }
  }

  /**
   * Convierte código de método de pago a texto legible
   */
  private getPaymentMethodText(method: string): string {
    const methodTexts: Record<string, string> = {
      'mercadopago': 'MercadoPago',
      'transfer': 'Transferencia Bancaria',
      'cash': 'Efectivo Contra Entrega'
    };
    return methodTexts[method] || method;
  }

  /**
   * Verifica si EmailJS está configurado correctamente
   */
  isReady(): boolean {
    return this.isConfigured;
  }

  /**
   * Obtiene la configuración actual (sin claves sensibles)
   */
  getConfig(): object {
    return {
      isConfigured: this.isConfigured,
      hasServiceId: !!EMAIL_CONFIG.serviceId,
      hasPublicKey: !!EMAIL_CONFIG.publicKey,
      availableTemplates: Object.keys(EMAIL_CONFIG.templates).filter(
        key => !!EMAIL_CONFIG.templates[key as keyof typeof EMAIL_CONFIG.templates]
      )
    };
  }
}

// Exportar instancia única del servicio
export const emailService = new EmailService();