import Stripe from 'stripe';
import Order from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16'
});

export const createCheckoutSession = async (userId: string, cartItems: any[]): Promise<Stripe.Checkout.Session> => {
  // Fetch product details to get current prices
  const productIds = cartItems.map(item => item.product);
  const products = await Product.find({ _id: { $in: productIds } });
  
  const lineItems = cartItems.map(item => {
    const product = products.find(p => p._id.toString() === item.product.toString());
    if (!product) throw new Error(`Product ${item.product} not found`);
    
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          images: [product.images[0]] // Use first image
        },
        unit_amount: Math.round(product.price * 100) // Convert to cents
      },
      quantity: item.quantity
    };
  });

  // Create order in database with status 'pending'
  const order = new Order({
    user: userId,
    items: cartItems,
    total: cartItems.reduce((total, item) => {
      const product = products.find(p => p._id.toString() === item.product.toString());
      return total + (product?.price || 0) * item.quantity;
    }, 0),
    status: 'pending'
  });
  
  await order.save();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
    client_reference_id: order._id.toString(),
    metadata: {
      orderId: order._id.toString(),
      userId: userId
    }
  });

  // Save Stripe session ID to order
  order.stripeSessionId = session.id;
  await order.save();

  return session;
};

export const handleWebhook = async (payload: any, sig: string): Promise<void> => {
  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    throw new Error('Invalid signature');
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    await fulfillOrder(session);
  }
};

const fulfillOrder = async (session: Stripe.Checkout.Session): Promise<void> => {
  const orderId = session.metadata?.orderId;
  const userId = session.metadata?.userId;
  
  if (!orderId || !userId) {
    throw new Error('Missing metadata in session');
  }

  // Update order status to 'completed'
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  order.status = 'completed';
  order.paymentId = session.payment_intent as string;
  await order.save();

  // Clear user's cart
  await User.findByIdAndUpdate(userId, { $set: { cart: [] } });

  // Here you would typically:
  // 1. Send confirmation email
  // 2. Update inventory
  // 3. Trigger any post-purchase actions
  console.log(`Order ${orderId} fulfilled successfully`);
};

export const createPaymentIntent = async (amount: number, currency: string = 'usd'): Promise<Stripe.PaymentIntent> => {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
  });
};

export const refundPayment = async (paymentIntentId: string, amount?: number): Promise<Stripe.Refund> => {
  const refundParams: Stripe.RefundCreateParams = {
    payment_intent: paymentIntentId,
  };
  
  if (amount) {
    refundParams.amount = Math.round(amount * 100);
  }
  
  return await stripe.refunds.create(refundParams);
};
