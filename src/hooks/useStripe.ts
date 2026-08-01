import { loadStripe } from '@stripe/stripe-js';
import { useCallback } from 'react';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { supabase } from '../lib/supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export function useStripe() {
  const createCheckoutSession = useCallback(async (productId: keyof typeof STRIPE_PRODUCTS) => {
    try {
      const product = STRIPE_PRODUCTS[productId];
      if (!product) throw new Error('Invalid product');

      const response = await supabase.functions.invoke('stripe-checkout', {
        body: {
          price_id: product.priceId,
          success_url: `${window.location.origin}/checkout/success`,
          cancel_url: `${window.location.origin}/checkout/cancel`,
          mode: product.mode,
        },
      });

      // Check if response.data exists and has the url property
      if (!response.data || !response.data.url) {
        console.error('Invalid response from stripe-checkout:', response);
        throw new Error('Failed to create checkout session - invalid response');
      }

      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }, []);

  return { createCheckoutSession };
}