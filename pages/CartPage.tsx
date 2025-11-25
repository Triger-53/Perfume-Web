
import React from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/utils';
import { fixImageUrl } from '../lib/imageFixer';

// IMPORTANT: The user provided this key directly.
// In a real-world application, this should NEVER be hardcoded.
// Use environment variables like process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.
const RAZORPAY_KEY_ID = 'rzp_live_RL4t8lq29IQAcb';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    if (!RAZORPAY_KEY_ID) {
      alert("Payment gateway is not configured.");
      return;
    }
    // For INR, the amount is in paise (100 paise = 1 Rupee)
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: cartTotal * 100,
      currency: "INR",
      name: "Scentify",
      description: "Perfume Purchase",
      image: fixImageUrl("https://i.imgur.com/5Q20j2s.png"), // Uses local logo via imageFixer
      handler: function (response: any) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        clearCart();
        window.location.hash = '#/';
      },
      prefill: {
        name: "Test User",
        email: "test.user@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Scentify Corporate Office",
      },
      theme: {
        color: "#1a1a1a",
      },
      // Razorpay automatically shows relevant payment methods like UPI for INR transactions.
      // No special configuration is needed to enable UPI.
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      alert(`Payment failed: ${response.error.description}. Reason: ${response.error.reason}`);
    });
    rzp.open();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-serif font-bold mb-8 text-center">Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-brand-light rounded-lg flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-xl text-gray-600 font-semibold">Your cart is empty.</p>
          <p className="text-gray-500 mt-1">Looks like you haven't added any scents yet.</p>
          <a href="#/shop" className="mt-6 inline-block bg-brand-primary text-white font-semibold py-3 px-8 rounded-md hover:bg-brand-accent hover:text-brand-primary transition-colors">
            Continue Shopping
          </a>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.product.id} className="flex flex-col sm:flex-row items-center bg-white p-4 border rounded-lg shadow-sm">
                <img src={fixImageUrl(item.product.image_url)} alt={item.product.name} className="w-24 h-24 object-cover rounded-md mb-4 sm:mb-0" />
                <div className="flex-grow sm:ml-6 text-center sm:text-left">
                  <h2 className="font-semibold text-lg">{item.product.name}</h2>
                  <p className="text-sm text-gray-500">{item.product.brand}</p>
                  <p className="text-lg font-medium text-brand-primary sm:hidden mt-2">{formatCurrency(item.product.price)}</p>
                </div>
                <div className="flex items-center space-x-4 mt-4 sm:mt-0 sm:ml-6">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                    min="1"
                    className="w-16 p-1 border rounded-md text-center"
                    aria-label={`Quantity for ${item.product.name}`}
                  />
                  <p className="text-lg font-medium text-brand-primary hidden sm:block w-24 text-right">{formatCurrency(item.product.price * item.quantity)}</p>
                  <button onClick={() => removeFromCart(item.product.id)} className="text-gray-400 hover:text-red-600 transition-colors" aria-label={`Remove ${item.product.name} from cart`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-brand-light p-6 rounded-lg sticky top-24">
              <h2 className="text-2xl font-serif font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-xl border-t pt-4 mt-4">
                <span>Total</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-brand-primary text-white font-semibold py-3 rounded-md hover:bg-brand-accent hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
