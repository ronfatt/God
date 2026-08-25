import { CommercialProduct } from './products';
import { Storage } from '@/lib/storage';
import { TIER_CONFIGS, SubscriptionTier } from '@/premium/entitlement';

export interface CheckoutSession {
  sessionId: string;
  productId: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  currency: string;
}

export interface PaymentProvider {
  createCheckout(product: CommercialProduct): Promise<CheckoutSession>;
  verifyPurchase(sessionId: string): Promise<boolean>;
  cancelSubscription(subscriptionId: string): Promise<boolean>;
}

export class MockPaymentProvider implements PaymentProvider {
  async createCheckout(product: CommercialProduct): Promise<CheckoutSession> {
    // Simulated checkout session
    const sessionId = `chk_mock_${Date.now()}`;
    return {
      sessionId,
      productId: product.id,
      status: 'completed',
      amount: product.price,
      currency: product.currency,
    };
  }

  async verifyPurchase(sessionId: string): Promise<boolean> {
    return true;
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    const entitlement = Storage.getEntitlement();
    Storage.setEntitlement({
      ...entitlement,
      tier: 'free',
      tierName: TIER_CONFIGS.free.name,
      features: TIER_CONFIGS.free.features,
    });
    return true;
  }
}

export const activePaymentProvider = new MockPaymentProvider();
