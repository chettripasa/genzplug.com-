import express from 'express';
import { handleWebhook } from '../services/stripe.service';
import { createCheckoutSession } from '../services/stripe.service';
import { auth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Create checkout session
router.post('/create-checkout-session', auth, async (req: AuthRequest, res) => {
  try {
    const { cartItems } = req.body;
    
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart items are required' });
    }

    const session = await createCheckoutSession(req.user._id.toString(), cartItems);
    
    res.json({
      sessionId: session.id,
      url: session.url
    });
  } catch (error: any) {
    console.error('Checkout session error:', error);
    res.status(500).json({ message: error.message || 'Failed to create checkout session' });
  }
});

// Note: This endpoint must not use bodyParser middleware
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;

  try {
    await handleWebhook(req.body, sig);
    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

export default router;
