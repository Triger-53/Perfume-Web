
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<{ error: string | null, success: boolean }>({ error: null, success: false });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormState({ error: null, success: false });
    console.log('[DEBUG] ContactPage: Submitting form data:', formData);

    const { error } = await supabase
      .from('contact_messages')
      .insert([formData]);

    setLoading(false);
    if (error) {
      setFormState({ error: 'Could not send message. Please try again later.', success: false });
      console.error('[DEBUG] ContactPage: Error sending contact message:', error);
    } else {
      setFormState({ error: null, success: true });
      console.log('[DEBUG] ContactPage: Message sent successfully.');
      setFormData({ name: '', email: '', message: '' }); // Clear form on success
    }
  };

  const resetForm = () => {
    setFormState({ error: null, success: false });
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif font-bold mb-8 text-center">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-12 bg-brand-light p-8 rounded-lg">
        <div>
          <h2 className="text-2xl font-serif font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have a question about our products, an order, or just want to say hello? We'd love to hear from you. Fill out the form or reach out to us directly.
          </p>
          <div className="space-y-4">
            <p><strong>Email:</strong> <a href="mailto:support@scentify.example.com" className="hover:text-brand-accent">support@scentify.example.com</a></p>
            <p><strong>Phone:</strong> +91 98765 43210</p>
            <p><strong>Address:</strong> 123 Fragrance Lane, Perfume City, Mumbai</p>
          </div>
        </div>
        <div>
          {formState.success ? (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md flex flex-col items-center text-center h-full justify-center">
              <p className="font-bold text-lg">Message Sent!</p>
              <p className="mt-1">Thank you for reaching out. We will get back to you shortly.</p>
              <button 
                onClick={resetForm}
                className="mt-6 bg-brand-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-brand-accent hover:text-brand-primary transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea id="message" rows={4} value={formData.message} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent"></textarea>
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-primary text-white font-semibold py-3 rounded-md hover:bg-brand-accent hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
              {formState.error && <p className="text-red-500 text-sm mt-2">{formState.error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
