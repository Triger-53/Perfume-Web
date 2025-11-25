
import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import AiHelper from './components/AiHelper';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import Spinner from './components/Spinner';

const pages: { [key: string]: React.ComponentType<any> } = {
  '/': HomePage,
  '/shop': ShopPage,
  '/product': ProductDetailPage,
  '/cart': CartPage,
  '/about': AboutPage,
  '/contact': ContactPage,
  '/terms': TermsPage,
  '/privacy': PrivacyPage,
  '/login': LoginPage,
  '/admin': AdminPage,
};

const AppContent: React.FC = () => {
  const [route, setRoute] = useState('/');
  const [productId, setProductId] = useState<string | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      const [path, query] = hash.split('?');
      let newRoute = path || '/';

      // Protected route logic
      if (newRoute === '/admin' && !user) {
        console.log('[DEBUG] Unauthorized access to /admin, redirecting to /login');
        window.location.hash = '/login';
        return;
      }

      setRoute(newRoute);

      if (newRoute === '/product' && query) {
        const params = new URLSearchParams(query);
        setProductId(params.get('id'));
      } else {
        setProductId(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [user]); // Rerun on user state change

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
  }

  const CurrentPage = pages[route] || HomePage;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <CurrentPage productId={productId} />
      </main>
      <Footer />
      <AiHelper />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
