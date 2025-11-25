
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

type AuthMode = 'signIn' | 'signUp';

const LoginPage: React.FC = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === 'signIn') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else window.location.hash = '/admin';
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage('Success! Please check your email for a confirmation link.');
    }
    setLoading(false);
  };

  if (user) {
    window.location.hash = '/admin';
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex border-b mb-6">
          <button
            onClick={() => setMode('signIn')}
            className={`w-1/2 py-3 text-center font-semibold transition-colors ${mode === 'signIn' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-500'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signUp')}
            className={`w-1/2 py-3 text-center font-semibold transition-colors ${mode === 'signUp' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-500'}`}
          >
            Sign Up
          </button>
        </div>
        <h1 className="text-3xl font-serif font-bold text-center mb-6">
          {mode === 'signIn' ? 'Admin Login' : 'Create Account'}
        </h1>
        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-brand-accent focus:border-brand-accent"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-primary text-white font-semibold py-3 rounded-md hover:bg-brand-accent hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-colors disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : (mode === 'signIn' ? 'Sign In' : 'Sign Up')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
