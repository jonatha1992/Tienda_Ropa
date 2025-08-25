import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js';

export function isNonEmptyTrimmed(value: string | undefined | null) {
    if (value === undefined || value === null) return false;
    return String(value).trim().length > 0;
}

export function isValidPhone(phone: string, country: string = 'AR') {
    if (!phone) return false;
    try {
        const parsed = parsePhoneNumberFromString(phone, country as CountryCode);
        return parsed ? parsed.isValid() : false;
    } catch (e) {
        return false;
    }
}

export function formatE164(phone: string, country: string = 'AR') {
    if (!phone) return phone;
    try {
        const parsed = parsePhoneNumberFromString(phone, country as CountryCode);
        if (parsed && parsed.isValid()) return parsed.number; // E.164
        return phone;
    } catch (e) {
        return phone;
    }
}

// Simple postal code validator. Argentina common pattern: 4 digits (for many zones),
// accept 4-8 digits to be more permissive (some international). Returns normalized string.
export function isValidPostalCode(postal: string, country: string = 'AR') {
    if (!postal) return false;
    const p = String(postal).trim();
    if (country === 'AR') {
        // Accept 4 digits (most common) or 4-8 numeric chars
        return /^[0-9]{4,8}$/.test(p);
    }
    // Generic: allow alphanumeric 3-10 chars
    return /^[A-Za-z0-9 \-]{3,10}$/.test(p);
}

export function asYouType(phone: string, country: string = 'AR') {
    try {
        return new AsYouType(country as CountryCode).input(phone);
    } catch (e) {
        return phone;
    }
}

export const validationMessages = {
    phone: 'Ingresa un telÃ©fono vÃ¡lido (ej: +54 9 11 1234-5678).',
    postal: 'Ingresa un cÃ³digo postal vÃ¡lido (solo nÃºmeros, 4-8 dÃ­gitos para AR).',
    required: 'Este campo es obligatorio.'
};

export default {
    isNonEmptyTrimmed,
    isValidPhone,
    formatE164,
    isValidPostalCode,
    asYouType,
    validationMessages
};
