export interface PaymentRequest {
  amount: number;
  orderInfo: string;
  orderType?: string;
  language?: string;
}

export interface PaymentResponse {
  code: string;
  message: string;
  paymentUrl?: string;
}

export interface TransactionStatus {
  code: string;
  message: string;
  transactionId?: string;
  amount?: number;
  orderInfo?: string;
  bankCode?: string;
  payDate?: string;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}