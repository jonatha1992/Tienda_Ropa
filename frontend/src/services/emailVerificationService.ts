import emailjs from '@emailjs/browser';
import { config } from '../config/index';
import api from '../config/api';

// Configuración de Email.js
const EMAILJS_SERVICE_ID = 'your_service_id'; // Reemplazar con tu Service ID
const EMAILJS_TEMPLATE_ID = 'your_template_id'; // Reemplazar con tu Template ID
const EMAILJS_PUBLIC_KEY = 'your_public_key'; // Reemplazar con tu Public Key

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

export interface EmailVerificationData {
  to_email: string;
  to_name: string;
  verification_code: string;
  verification_link: string;
}

class EmailVerificationService {
  private static instance: EmailVerificationService;

  private constructor() {
    // Inicializar Email.js
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  public static getInstance(): EmailVerificationService {
    if (!EmailVerificationService.instance) {
      EmailVerificationService.instance = new EmailVerificationService();
    }
    return EmailVerificationService.instance;
  }

  /**
   * Genera un código de verificación de 6 dígitos
   */
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Genera un token único para el enlace de verificación
   */
  generateVerificationToken(): string {
    return btoa(Date.now().toString() + Math.random().toString()).replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * Envía email de verificación usando Email.js
   */
  async sendVerificationEmail(userData: {
    email: string;
    name: string;
    verificationCode?: string;
    verificationToken?: string;
  }): Promise<boolean> {
    try {
      const verificationCode = userData.verificationCode || this.generateVerificationCode();
      const verificationToken = userData.verificationToken || this.generateVerificationToken();
      
      // URL de verificación (ajustar según tu dominio)
      const verificationLink = `${window.location.origin}/auth/verify-email?token=${verificationToken}&email=${encodeURIComponent(userData.email)}`;

      const templateParams: EmailVerificationData = {
        to_email: userData.email,
        to_name: userData.name,
        verification_code: verificationCode,
        verification_link: verificationLink
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      console.log('Email enviado exitosamente:', response);
      
      // Guardar datos de verificación en localStorage temporalmente
      localStorage.setItem('email_verification_pending', JSON.stringify({
        email: userData.email,
        code: verificationCode,
        token: verificationToken,
        timestamp: Date.now()
      }));

      return true;
    } catch (error) {
      console.error('Error enviando email de verificación:', error);
      return false;
    }
  }

  /**
   * Verifica el código de verificación
   */
  verifyCode(email: string, inputCode: string): boolean {
    try {
      const pendingData = localStorage.getItem('email_verification_pending');
      if (!pendingData) return false;

      const data = JSON.parse(pendingData);
      
      // Verificar que no haya expirado (30 minutos)
      const thirtyMinutes = 30 * 60 * 1000;
      if (Date.now() - data.timestamp > thirtyMinutes) {
        localStorage.removeItem('email_verification_pending');
        return false;
      }

      // Verificar email y código
      if (data.email === email && data.code === inputCode) {
        localStorage.removeItem('email_verification_pending');
        localStorage.setItem('email_verified', JSON.stringify({
          email: email,
          verified_at: Date.now()
        }));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error verificando código:', error);
      return false;
    }
  }

  /**
   * Verifica el token del enlace de verificación
   */
  verifyToken(email: string, token: string): boolean {
    try {
      const pendingData = localStorage.getItem('email_verification_pending');
      if (!pendingData) return false;

      const data = JSON.parse(pendingData);
      
      // Verificar que no haya expirado (24 horas para enlaces)
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (Date.now() - data.timestamp > twentyFourHours) {
        localStorage.removeItem('email_verification_pending');
        return false;
      }

      // Verificar email y token
      if (data.email === email && data.token === token) {
        localStorage.removeItem('email_verification_pending');
        localStorage.setItem('email_verified', JSON.stringify({
          email: email,
          verified_at: Date.now()
        }));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error verificando token:', error);
      return false;
    }
  }

  /**
   * Verifica si un email ya fue verificado
   */
  isEmailVerified(email: string): boolean {
    try {
      const verifiedData = localStorage.getItem('email_verified');
      if (!verifiedData) return false;

      const data = JSON.parse(verifiedData);
      return data.email === email;
    } catch (error) {
      console.error('Error verificando estado de email:', error);
      return false;
    }
  }

  /**
   * Reenvía el email de verificación
   */
  async resendVerificationEmail(email: string, name: string): Promise<boolean> {
    // Limpiar verificación pendiente anterior
    localStorage.removeItem('email_verification_pending');
    
    return await this.sendVerificationEmail({ email, name });
  }
}

// Exportar instancia singleton
export const emailVerificationService = EmailVerificationService.getInstance();
