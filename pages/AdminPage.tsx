
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Product, Category } from '../types';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/Spinner';

const AdminPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState<Partial<Product>>({
    name: '', brand: '', description: '', price: 0, image_url: '', category_id: undefined, stock: 100, notes_top: '', notes_middle: '', notes_base: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    const { data: productsData, error: productsError } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (productsError) addToast('Error fetching products', 'error');
    else setProducts(productsData);

    const { data: categoriesData, error: categoriesError } = await supabase.from('categories').select('*').order('name');
    if (categoriesError) addToast('Error fetching categories', 'error');
    else setCategories(categoriesData);

    setLoading(false);
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { name, brand, price, category_id } = formState;
    if (!name || !brand || !price || !category_id) {
      addToast('Please fill all required fields.', 'error');
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from('products').insert([formState]);

    if (error) {
      addToast(`Error adding product: ${error.message}`, 'error');
    } else {
      addToast('Product added successfully!', 'success');
      setFormState({ name: '', brand: '', description: '', price: 0, image_url: '', category_id: undefined, stock: 100, notes_top: '', notes_middle: '', notes_base: '' });
      fetchProductsAndCategories(); // Refresh product list
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <h1 className="text-4xl font-serif font-bold mb-8">Admin Dashboard</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-serif font-semibold mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" value={formState.name} onChange={handleInputChange} placeholder="Product Name" required className="p-2 border rounded w-full" />
              <input name="brand" value={formState.brand} onChange={handleInputChange} placeholder="Brand" required className="p-2 border rounded w-full" />
            </div>
            <textarea name="description" value={formState.description} onChange={handleInputChange} placeholder="Description" className="p-2 border rounded w-full h-24"></textarea>
            <input name="image_url" value={formState.image_url} onChange={handleInputChange} placeholder="Image URL" required className="p-2 border rounded w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="price" type="number" value={formState.price} onChange={handleInputChange} placeholder="Price" required className="p-2 border rounded w-full" />
              <select name="category_id" value={formState.category_id} onChange={handleInputChange} required className="p-2 border rounded w-full bg-white">
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              <input name="stock" type="number" value={formState.stock} onChange={handleInputChange} placeholder="Stock" required className="p-2 border rounded w-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="notes_top" value={formState.notes_top} onChange={handleInputChange} placeholder="Top Notes" className="p-2 border rounded w-full" />
              <input name="notes_middle" value={formState.notes_middle} onChange={handleInputChange} placeholder="Middle Notes" className="p-2 border rounded w-full" />
              <input name="notes_base" value={formState.notes_base} onChange={handleInputChange} placeholder="Base Notes" className="p-2 border rounded w-full" />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-brand-primary text-white font-semibold py-3 rounded-md hover:bg-brand-accent hover:text-brand-primary transition-colors disabled:bg-gray-400">
              {isSubmitting ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </div>
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-serif font-semibold mb-4">Existing Products</h2>
          <div className="bg-white p-4 rounded-lg shadow-md max-h-[600px] overflow-y-auto">
            {loading ? <Spinner /> : (
              <ul className="space-y-3">
                {products.map(p => (
                  <li key={p.id} className="flex items-center space-x-3 text-sm">
                    <img src={p.image_url} alt={p.name} className="w-10 h-10 object-contain rounded bg-gray-100" />
                    <div className="flex-grow">
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-gray-500">{p.brand}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
