
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';
import { useToast } from '../context/ToastContext';

const Header: React.FC = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#/' },
    { name: 'Shop', href: '#/shop' },
    { name: 'About', href: '#/about' },
    { name: 'Contact', href: '#/contact' },
  ];

  const handleLogout = async () => {
    await logout();
    addToast("You have been logged out.", 'info');
    window.location.hash = '/';
  };

  useEffect(() => {
    const closeMenuOnHashChange = () => setIsMenuOpen(false);
    window.addEventListener('hashchange', closeMenuOnHashChange);
    return () => window.removeEventListener('hashchange', closeMenuOnHashChange);
  }, []);

  return (
    <header className="bg-brand-secondary/80 backdrop-blur-md sticky top-0 z-40 border-b border-brand-primary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#/" className="flex items-center gap-2 text-3xl font-serif font-bold text-brand-primary tracking-wider">
            <img src="/logo.svg" alt="Scentify Logo" className="h-10 w-10" />
            Scentify
          </a>
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map(link => (
              <a key={link.name} href={link.href} className="text-sm font-medium tracking-wider text-brand-primary hover:text-brand-accent transition-colors duration-200">
                {link.name.toUpperCase()}
              </a>
            ))}
            {user && (
              <a href="#/admin" className="text-sm font-medium tracking-wider text-brand-accent hover:text-brand-primary transition-colors duration-200">
                ADMIN
              </a>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <SearchBar />
            </div>
            <a href="#/cart" className="relative group" aria-label="Shopping Cart">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-primary group-hover:text-brand-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-brand-accent rounded-full">
                  {cartCount}
                </span>
              )}
            </a>
            {user && (
              <button onClick={handleLogout} title="Logout" className="hidden lg:block p-2 text-gray-500 hover:text-brand-accent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2" aria-label="Open menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        <div className="md:hidden pb-4">
          <SearchBar />
        </div>
      </div>
      {/* Mobile Menu */}
      <div className={`absolute top-full left-0 w-full bg-brand-secondary/95 backdrop-blur-lg lg:hidden transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <nav className="flex flex-col items-center space-y-6 p-8">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="text-lg font-medium tracking-wider text-brand-primary hover:text-brand-accent transition-colors duration-200">
              {link.name}
            </a>
          ))}
          {user && (
            <>
              <a href="#/admin" className="text-lg font-medium tracking-wider text-brand-accent hover:text-brand-primary transition-colors duration-200">ADMIN</a>
              <button onClick={handleLogout} className="text-lg font-medium tracking-wider text-gray-600 hover:text-brand-primary transition-colors duration-200">LOGOUT</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
