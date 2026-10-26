import { useCallback } from 'react';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { supabase } from '../lib/supabase';


export function useStripe() {
  const createCheckoutSession = useCallback(async (productId: keyof typeof STRIPE_PRODUCTS) => {
    try {
      const product = STRIPE_PRODUCTS[productId];
      if (!product) throw new Error('Invalid product');

      if (!supabase) throw new Error('Checkout is not available right now. Please try again later.');

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