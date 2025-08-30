import { loadStripe, Stripe } from '@stripe/stripe-js';
import { CartItem } from '../types';

// Load Stripe (replace with your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface CheckoutSession {
  id: string;
  url: string;
  status: string;
}

export class StripeService {
  private static async getStripe(): Promise<Stripe> {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Failed to load Stripe');
    }
    return stripe;
  }

  // Create a payment intent for the cart
  static async createPaymentIntent(items: CartItem[]): Promise<PaymentIntent> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Create a checkout session
  static async createCheckoutSession(items: CartItem[], successUrl: string, cancelUrl: string): Promise<CheckoutSession> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
            price: item.product.price,
            name: item.product.name,
            images: item.product.images,
          })),
          success_url: successUrl,
          cancel_url: cancelUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  // Process payment with card
  static async processPayment(paymentIntentId: string, paymentMethod: any): Promise<any> {
    try {
      const stripe = await this.getStripe();
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        paymentIntentId,
        {
          payment_method: paymentMethod,
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      return paymentIntent;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  // Redirect to Stripe Checkout
  static async redirectToCheckout(sessionId: string): Promise<void> {
    try {
      const stripe = await this.getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  }

  // Get payment status
  static async getPaymentStatus(paymentIntentId: string): Promise<any> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/status/${paymentIntentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get payment status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  }

  // Get user's payment history
  static async getPaymentHistory(): Promise<any[]> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/history`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get payment history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting payment history:', error);
      throw error;
    }
  }

  // Setup payment method for future use
  static async setupPaymentMethod(paymentMethod: any): Promise<any> {
    try {
      const stripe = await this.getStripe();
      
      const { error, setupIntent } = await stripe.confirmCardSetup(
        paymentMethod.id,
        {
          payment_method: paymentMethod,
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      return setupIntent;
    } catch (error) {
      console.error('Error setting up payment method:', error);
      throw error;
    }
  }

  // Get saved payment methods
  static async getSavedPaymentMethods(): Promise<any[]> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/methods`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get saved payment methods');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting saved payment methods:', error);
      throw error;
    }
  }

  // Delete saved payment method
  static async deletePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/methods/${paymentMethodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete payment method');
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  }
}
