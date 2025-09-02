import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useAuth } from '../contexts/AuthContext';
import { useNotificationStore } from '../stores/notificationStore';
import { StripeService } from '../services/stripeService';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  ArrowLeft,
  Shield,
  MapPin
} from 'lucide-react';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  saveInfo: boolean;
}

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  brand: string;
  expMonth: number;
  expYear: number;
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { addNotification } = useNotificationStore();
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'shipping' | 'payment' | 'review' | 'complete'>('shipping');
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    saveInfo: true,
  });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [newCard, setNewCard] = useState({
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
  });
  const [orderSummary, setOrderSummary] = useState<any>(null);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/shop');
      return;
    }
    
    // Pre-fill form with user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
      }));
    }
    
    loadPaymentMethods();
  }, [items, user, navigate]);

  const loadPaymentMethods = async () => {
    try {
      const methods = await StripeService.getSavedPaymentMethods();
      setPaymentMethods(methods);
      if (methods.length > 0) {
        setSelectedPaymentMethod(methods[0].id);
      }
    } catch (error) {
      console.log('No saved payment methods');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCard(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateShippingForm = (): boolean => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    for (const field of required) {
      if (!formData[field as keyof CheckoutForm]) {
        addNotification({
          type: 'error',
          title: 'Validation Error',
          message: `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          duration: 3000,
        });
        return false;
      }
    }
    return true;
  };

  const validatePaymentForm = (): boolean => {
    if (!selectedPaymentMethod && !newCard.number) {
      addNotification({
        type: 'error',
        title: 'Payment Required',
        message: 'Please select a payment method or enter card details',
        duration: 3000,
      });
      return false;
    }
    
    if (newCard.number && (!newCard.expMonth || !newCard.expYear || !newCard.cvc)) {
      addNotification({
        type: 'error',
        title: 'Card Details Required',
        message: 'Please complete all card details',
        duration: 3000,
      });
      return false;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (step === 'shipping' && validateShippingForm()) {
      setStep('payment');
    } else if (step === 'payment' && validatePaymentForm()) {
      setStep('review');
    }
  };

  const handlePreviousStep = () => {
    if (step === 'payment') {
      setStep('shipping');
    } else if (step === 'review') {
      setStep('payment');
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {
      // Create checkout session
      const session = await StripeService.createCheckoutSession(
        items,
        `${window.location.origin}/checkout?success=true`,
        `${window.location.origin}/checkout?canceled=true`
      );

      // Redirect to Stripe checkout
      await StripeService.redirectToCheckout(session.id);
      
      // If we get here, checkout was successful
      setOrderSummary({
        orderId: session.id,
        items,
        total: getTotalPrice(),
        shipping: {
          name: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      });
      
      setStep('complete');
      clearCart();
      
      addNotification({
        type: 'success',
        title: 'Order Placed!',
        message: 'Your order has been successfully placed',
        duration: 5000,
      });
      
    } catch (error) {
      console.error('Checkout error:', error);
      addNotification({
        type: 'error',
        title: 'Checkout Failed',
        message: 'There was an error processing your order. Please try again.',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== 'complete') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart to continue shopping</p>
          <button
            onClick={() => navigate('/shop')}
            className="btn btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase securely</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {['shipping', 'payment', 'review', 'complete'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step === stepName 
                    ? 'border-primary-600 bg-primary-600 text-white' 
                    : step === 'complete' || ['shipping', 'payment', 'review'].indexOf(step) > index
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 bg-white text-gray-500'
                }`}>
                  {step === 'complete' || ['shipping', 'payment', 'review'].indexOf(step) > index ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 3 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    ['shipping', 'payment', 'review'].indexOf(step) > index ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-16">
            <span className={`text-sm ${step === 'shipping' ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>
              Shipping
            </span>
            <span className={`text-sm ${step === 'payment' ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>
              Payment
            </span>
            <span className={`text-sm ${step === 'review' ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>
              Review
            </span>
            <span className={`text-sm ${step === 'complete' ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>
              Complete
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Form */}
            {step === 'shipping' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                  Shipping Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="input w-full"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Save this information for next time
                    </span>
                  </label>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={handleNextStep}
                    className="btn btn-primary w-full"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Payment Form */}
            {step === 'payment' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
                  Payment Method
                </h2>
                
                {/* Saved Payment Methods */}
                {paymentMethods.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Payment Methods</h3>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <label key={method.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={selectedPaymentMethod === method.id}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <div className="ml-3">
                            <div className="flex items-center">
                              <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                              <span className="font-medium text-gray-900">
                                {method.brand} ending in {method.last4}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              Expires {method.expMonth}/{method.expYear}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* New Card Form */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Card</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="number"
                        value={newCard.number}
                        onChange={handleCardInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="input w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Month
                      </label>
                      <select
                        name="expMonth"
                        value={newCard.expMonth}
                        onChange={handleCardInputChange}
                        className="input w-full"
                      >
                        <option value="">Month</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                          <option key={month} value={month.toString().padStart(2, '0')}>
                            {month.toString().padStart(2, '0')}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Year
                      </label>
                      <select
                        name="expYear"
                        value={newCard.expYear}
                        onChange={handleCardInputChange}
                        className="input w-full"
                      >
                        <option value="">Year</option>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVC
                      </label>
                      <input
                        type="text"
                        name="cvc"
                        value={newCard.cvc}
                        onChange={handleCardInputChange}
                        placeholder="123"
                        maxLength={4}
                        className="input w-full"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={handlePreviousStep}
                    className="btn btn-secondary flex-1"
                  >
                    Back to Shipping
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="btn btn-primary flex-1"
                  >
                    Continue to Review
                  </button>
                </div>
              </div>
            )}

            {/* Review Order */}
            {step === 'review' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>
                
                <div className="space-y-6">
                  {/* Shipping Information */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Shipping Information</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                      <p className="text-gray-600">{formData.address}</p>
                      <p className="text-gray-600">{formData.city}, {formData.state} {formData.zipCode}</p>
                      <p className="text-gray-600">{formData.country}</p>
                      <p className="text-gray-600">{formData.phone}</p>
                      <p className="text-gray-600">{formData.email}</p>
                    </div>
                  </div>
                  
                  {/* Payment Method */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Method</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {selectedPaymentMethod ? (
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
                          <span>Saved payment method</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 mr-2 text-primary-600" />
                          <span>New card ending in {newCard.number.slice(-4)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <img
                              src={item.image || '/placeholder-product.jpg'}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg mr-3"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-medium text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={handlePreviousStep}
                    className="btn btn-secondary flex-1"
                  >
                    Back to Payment
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}

            {/* Order Complete */}
            {step === 'complete' && orderSummary && (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for your purchase. Your order has been successfully placed.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <p className="font-medium text-gray-900">Order ID: {orderSummary.orderId}</p>
                  <p className="text-gray-600">Total: ${orderSummary.total.toFixed(2)}</p>
                </div>
                
                <div className="flex space-x-4 justify-center">
                  <button
                    onClick={() => navigate('/shop')}
                    className="btn btn-primary"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => navigate('/profile')}
                    className="btn btn-secondary"
                  >
                    View Orders
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {step !== 'complete' && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${(getTotalPrice() * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${(getTotalPrice() * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Security Badges */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 mr-1" />
                      Secure Checkout
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-1" />
                      SSL Encrypted
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
