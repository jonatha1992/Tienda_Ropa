// Tipos de pago
export type PaymentMethod = 'credit_card' | 'debit_card' | 'mercadopago' | 'bank_transfer' | 'cash' | 'other' | 'transfer';
export type PaymentStatus = 'pending' | 'approved' | 'in_process' | 'rejected' | 'refunded' | 'cancelled' | 'in_mediation' | 'charged_back' | 'pending_payment';
