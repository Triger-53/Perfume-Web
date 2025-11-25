
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import DebugImage from '../components/DebugImage';

import { fixImageUrl } from '../lib/imageFixer';

const WhyChooseUsCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 text-center group">
    <div className="mx-auto bg-brand-accent/10 text-brand-accent rounded-full h-16 w-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="font-serif text-xl font-semibold mb-3 text-brand-primary">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const CategoryCard: React.FC<{ name: string, href: string, imageUrl: string }> = ({ name, href, imageUrl }) => (
  <a href={href} className="relative aspect-[3/4] w-full rounded-xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300">
    <DebugImage src={fixImageUrl(imageUrl)} alt={name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
    <div className="relative h-full flex items-end justify-center p-6">
      <div className="text-center transform transition-transform duration-300 group-hover:-translate-y-2">
        <h3 className="text-white text-2xl font-serif font-bold drop-shadow-lg tracking-wide">{name}</h3>
        <span className="inline-block mt-2 text-white/0 group-hover:text-white/90 text-sm font-medium border-b border-white/50 pb-0.5 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">Shop Now</span>
      </div>
    </div>
  </a>
);

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: categoriesData, error: categoriesError } = await supabase.from('categories').select('*').order('name');
      if (categoriesError) console.error('[DEBUG] HomePage: Error fetching categories:', categoriesError);
      else setCategories(categoriesData as Category[]);

      const { data: productsData, error: productsError } = await supabase.from('products').select('*').order('created_at', { ascending: false }).limit(4);
      if (productsError) setError(productsError.message);
      else setFeaturedProducts(productsData as Product[]);

      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-24 md:space-y-32 pb-12">
      {/* Hero Section */}
      <section className="relative bg-brand-light/30 rounded-3xl overflow-hidden p-8 md:p-12 lg:p-16">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="relative grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left space-y-6">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-accent/10 text-brand-accent text-sm font-semibold tracking-wider uppercase mb-2">New Collection 2024</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-primary leading-tight">
              Your Signature Scent, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Discovered.</span>
            </h1>
            <p className="max-w-xl mx-auto md:mx-0 text-lg md:text-xl text-gray-600 leading-relaxed">
              Explore our curated collection of luxury perfumes from world-renowned artisans. Find the perfect fragrance that speaks to your soul.
            </p>
            <div className="pt-4">
              <a href="#/shop" className="inline-flex items-center justify-center bg-brand-primary text-white font-semibold py-4 px-10 rounded-full hover:bg-brand-accent hover:text-brand-primary shadow-lg hover:shadow-brand-accent/30 transition-all duration-300 transform hover:-translate-y-1">
                Explore Collection
              </a>
            </div>
          </div>
          <div className="hidden md:block relative">
            <div className="absolute inset-0 bg-brand-accent/20 rounded-full filter blur-3xl transform translate-y-10 scale-90"></div>
            <DebugImage src={fixImageUrl("https://i.imgur.com/E3l9V1s.jpg")} alt="Perfume bottles on display" className="relative rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary mb-4">Why Choose Scentify?</h2>
          <p className="text-gray-600">We go beyond just selling perfumes. We offer an experience tailored to your unique preferences.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <WhyChooseUsCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>} title="Curated Selection" description="Every fragrance is hand-picked by our experts for its quality, longevity, and uniqueness." />
          <WhyChooseUsCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0" /></svg>} title="AI-Powered Discovery" description="Our smart assistant analyzes your preferences to help you find the perfect scent match instantly." />
          <WhyChooseUsCard icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>} title="Authenticity Guaranteed" description="We source directly from authorized distributors. 100% genuine products, guaranteed." />
        </div>
      </section>

      {/* Categories Section - Responsive Grid */}
      <section>
        <div className="flex justify-between items-end mb-10 px-2">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary">Shop by Category</h2>
            <p className="text-gray-600 mt-2">Find your favorite olfactory family.</p>
          </div>
          <a href="#/shop" className="hidden md:inline-flex items-center text-brand-primary font-semibold hover:text-brand-accent transition-colors">
            View All <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map(cat => (
            <CategoryCard key={cat.id} name={cat.name} href={`#/shop?category=${cat.id}`} imageUrl={cat.image_url} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <a href="#/shop" className="inline-flex items-center text-brand-primary font-semibold hover:text-brand-accent transition-colors">
            View All Categories <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-serif font-bold text-center mb-10">New Arrivals</h2>
        {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">{Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}</div> : error ? <p className="text-center text-red-500">Could not load products: {error}</p> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
