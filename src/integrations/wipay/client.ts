import axios from 'axios';

interface WIPayConfig {
  apiKey: string;
  merchantId: string;
  environment: 'sandbox' | 'production';
}

interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customerEmail: string;
  customerName: string;
  returnUrl: string;
  cancelUrl: string;
  metadata?: Record<string, any>;
}

interface PaymentResponse {
  transactionId: string;
  paymentUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

class WIPayClient {
  private apiKey: string;
  private merchantId: string;
  private baseUrl: string;

  constructor(config: WIPayConfig) {
    this.apiKey = config.apiKey;
    this.merchantId = config.merchantId;
    this.baseUrl = config.environment === 'production'
      ? 'https://api.wipaytt.com/v1'
      : 'https://sandbox.wipaytt.com/v1';
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'X-Merchant-ID': this.merchantId
    };
  }

  async createPayment(payment: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/payments`,
        {
          amount: payment.amount,
          currency: payment.currency,
          description: payment.description,
          customer: {
            email: payment.customerEmail,
            name: payment.customerName
          },
          return_url: payment.returnUrl,
          cancel_url: payment.cancelUrl,
          metadata: payment.metadata
        },
        { headers: this.getHeaders() }
      );

      return {
        transactionId: response.data.transaction_id,
        paymentUrl: response.data.payment_url,
        status: 'pending'
      };
    } catch (error) {
      console.error('WIPay payment creation error:', error);
      throw new Error('Failed to create payment');
    }
  }

  async getPaymentStatus(transactionId: string): Promise<PaymentResponse> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/payments/${transactionId}`,
        { headers: this.getHeaders() }
      );

      return {
        transactionId: response.data.transaction_id,
        paymentUrl: response.data.payment_url,
        status: response.data.status
      };
    } catch (error) {
      console.error('WIPay payment status check error:', error);
      throw new Error('Failed to check payment status');
    }
  }

  async refundPayment(transactionId: string, amount?: number): Promise<void> {
    try {
      await axios.post(
        `${this.baseUrl}/payments/${transactionId}/refund`,
        { amount },
        { headers: this.getHeaders() }
      );
    } catch (error) {
      console.error('WIPay refund error:', error);
      throw new Error('Failed to process refund');
    }
  }
}

export default WIPayClient; 