
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<{ category: string, search: string }>({ category: '', search: '' });

  useEffect(() => {
    console.log('[DEBUG] ShopPage: Fetching categories...');
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) {
        console.error('[DEBUG] ShopPage: Error fetching categories:', error);
      } else {
        setCategories(data as Category[]);
        console.log('[DEBUG] ShopPage: Successfully fetched categories:', data);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const params = new URLSearchParams(window.location.hash.split('?')[1]);
      const category = params.get('category') || '';
      const search = params.get('search') || '';
      console.log(`[DEBUG] ShopPage: Hash changed. New filters - Category: ${category}, Search: ${search}`);
      setFilter({ category, search });
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial call

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams(window.location.hash.split('?')[1]);
      const category = params.get('category') || '';
      const search = params.get('search') || '';
      console.log(`[DEBUG] ShopPage: Fetching products with filters - Category: ${category}, Search: ${search}`);

      let query = supabase.from('products').select('*, categories(name)');

      if (category) {
        query = query.eq('category_id', category);
      }
      if (search) {
        query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%`);
      }

      const { data, error } = await query.order('name');

      if (error) {
        setError(error.message);
        console.error('[DEBUG] ShopPage: Error fetching products:', error);
      } else {
        const formattedData = data.map((p: any) => ({ ...p, category_name: p.categories?.name || 'Uncategorized' }));
        setProducts(formattedData as Product[]);
        console.log('[DEBUG] ShopPage: Successfully fetched products:', formattedData);
      }
      setLoading(false);
    };

    fetchProducts();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    }
  }, [window.location.hash]);

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold">Our Collection</h1>
        {filter.search && <p className="mt-2 text-lg text-gray-600">Showing results for: <span className="font-semibold text-brand-primary">"{filter.search}"</span></p>}
      </div>

      <div className="mb-8 border-b border-gray-200">
        <div className="flex space-x-4 sm:space-x-8 overflow-x-auto pb-0 -mx-4 px-4">
          <a href="#/shop" className={`flex-shrink-0 px-1 py-3 text-sm sm:text-base font-medium transition-colors border-b-2 ${!filter.category ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>All</a>
          {categories.map(cat => (
            <a key={cat.id} href={`#/shop?category=${cat.id}`} className={`flex-shrink-0 px-1 py-3 text-sm sm:text-base font-medium transition-colors border-b-2 ${filter.category === String(cat.id) ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
              {cat.name}
            </a>
          ))}
        </div>
      </div>

      {error && <p className="text-center text-red-500 py-16">Could not load products: {error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
        ) : products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <p className="text-xl text-gray-500">No products found.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
            <a href="#/shop" className="mt-6 inline-block bg-brand-primary text-white font-semibold py-2 px-6 rounded-md hover:bg-brand-accent hover:text-brand-primary transition-colors">
              Clear Filters
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
