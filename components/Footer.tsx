
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const Footer: React.FC = () => {
  const { user } = useAuth();
  const footerLinks = [
    { name: 'About Us', href: '#/about' },
    { name: 'Contact', href: '#/contact' },
    { name: 'Terms of Service', href: '#/terms' },
    { name: 'Privacy Policy', href: '#/privacy' },
  ];

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    console.log(`[DEBUG] Submitting email to newsletter: ${email}`);
    setLoading(true);
    setFeedback('');

    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert({ email });

    setLoading(false);
    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        setFeedback('This email is already subscribed.');
        console.warn(`[DEBUG] Newsletter: Email already subscribed - ${email}`);
      } else {
        setFeedback('Subscription failed. Please try again.');
        console.error('[DEBUG] Newsletter subscription error:', error);
      }
    } else {
      setFeedback('Thank you for subscribing!');
      console.log(`[DEBUG] Newsletter: Successfully subscribed ${email}`);
      setEmail('');
    }
  };

  return (
    <footer className="bg-brand-primary text-brand-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <h3 className="text-2xl font-serif font-bold text-brand-accent">Scentify</h3>
            <p className="mt-2 text-sm text-gray-300 max-w-xs">Discover your signature scent through a curated collection of the world's finest fragrances.</p>
          </div>
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold tracking-wider uppercase text-gray-200">Shop</h4>
              <ul className="mt-4 space-y-2">
                <li><a href="#/shop" className="text-sm text-gray-400 hover:text-white transition-colors">All Perfumes</a></li>
                <li><a href="#/shop?category=1" className="text-sm text-gray-400 hover:text-white transition-colors">Floral</a></li>
                <li><a href="#/shop?category=2" className="text-sm text-gray-400 hover:text-white transition-colors">Woody</a></li>
                <li><a href="#/shop?category=3" className="text-sm text-gray-400 hover:text-white transition-colors">Fresh</a></li>
                 <li><a href="#/shop?category=4" className="text-sm text-gray-400 hover:text-white transition-colors">Oriental</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold tracking-wider uppercase text-gray-200">Support</h4>
              <ul className="mt-4 space-y-2">
                {footerLinks.map(link => (
                  <li key={link.name}>
                    <a href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">{link.name}</a>
                  </li>
                ))}
                 <li><a href={user ? "#/admin" : "#/login"} className="text-sm text-gray-400 hover:text-white transition-colors">Login / Admin</a></li>
              </ul>
            </div>
             <div className="col-span-2 md:col-span-1">
              <h4 className="font-semibold tracking-wider uppercase text-gray-200">Newsletter</h4>
              <p className="mt-4 text-sm text-gray-400">Subscribe for exclusive offers and new arrivals.</p>
              <form onSubmit={handleNewsletterSubmit} className="mt-4">
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-gray-800 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-accent" 
                  />
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-brand-accent hover:bg-brand-accent-hover text-brand-primary font-semibold px-4 py-2 rounded-r-md transition-colors disabled:bg-gray-500"
                  >
                    {loading ? '...' : 'Go'}
                  </button>
                </div>
                {feedback && <p className="text-sm mt-2 text-white">{feedback}</p>}
              </form>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Scentify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
