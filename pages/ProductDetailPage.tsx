
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';
import { formatCurrency } from '../lib/utils';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import DebugImage from '../components/DebugImage';
import { fixImageUrl } from '../lib/imageFixer';

interface ProductDetailPageProps {
  productId: string | null;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2QxZDVlMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPklNQUdFIFVOU1VQUE9SVEVEPC90ZXh0Pjwvc3ZnPg==';
  };

  useEffect(() => {
    if (!productId) {
      console.warn('[DEBUG] ProductDetailPage: No product ID provided.');
      setError("No product selected.");
      setLoading(false);
      return;
    }
    console.log(`[DEBUG] ProductDetailPage: Mounting for product ID: ${productId}`);

    const fetchProduct = async () => {
      setLoading(true);
      setRelatedProducts([]);
      console.log(`[DEBUG] ProductDetailPage: Fetching main product data...`);
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', productId)
        .single();

      if (error) {
        setError(error.message);
        console.error('[DEBUG] ProductDetailPage: Error fetching product:', error);
        setLoading(false);
      } else if (data) {
        const formattedData = { ...data, category_name: data.categories?.name || 'Uncategorized' };
        setProduct(formattedData as Product);
        console.log('[DEBUG] ProductDetailPage: Successfully fetched main product:', formattedData);
        fetchRelatedProducts(data.category_id, data.id);
      }
      setLoading(false);
    };

    const fetchRelatedProducts = async (categoryId: number, currentProductId: number) => {
      setLoadingRelated(true);
      console.log(`[DEBUG] ProductDetailPage: Fetching related products for category ID: ${categoryId}`);
      if (!categoryId) {
        console.warn('[DEBUG] ProductDetailPage: No category ID for related products.');
        setLoadingRelated(false);
        return;
      }
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .neq('id', currentProductId)
        .limit(4);

      if (error) {
        console.error('[DEBUG] ProductDetailPage: Error fetching related products:', error);
      } else {
        setRelatedProducts(data as Product[]);
        console.log('[DEBUG] ProductDetailPage: Successfully fetched related products:', data);
      }
      setLoadingRelated(false);
    }

    fetchProduct();
  }, [productId]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!product) return <p className="text-center text-gray-500 py-16">Product not found.</p>;

  return (
    <div className="space-y-16 md:space-y-24">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="bg-white p-4 rounded-lg border border-brand-primary/10 flex items-center justify-center">
          <DebugImage
            src={fixImageUrl(product.image_url)}
            alt={product.name}
            onError={handleImageError}
            className="max-h-[500px] w-auto object-contain rounded-md"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-brand-accent uppercase tracking-wider">{product.category_name}</p>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold mt-2">{product.name}</h1>
          <p className="text-lg text-gray-600 mt-1">{product.brand}</p>
          <p className="text-3xl lg:text-4xl font-serif text-brand-primary mt-6">{formatCurrency(product.price)}</p>
          <p className="mt-6 text-gray-700 leading-relaxed">{product.description}</p>

          <div className="mt-8 space-y-3 text-sm text-gray-600 border-t pt-6">
            <p><span className="font-semibold text-gray-800 w-24 inline-block">Top Notes:</span> {product.notes_top}</p>
            <p><span className="font-semibold text-gray-800 w-24 inline-block">Middle Notes:</span> {product.notes_middle}</p>
            <p><span className="font-semibold text-gray-800 w-24 inline-block">Base Notes:</span> {product.notes_base}</p>
          </div>

          <div className="mt-8 flex items-center space-x-4">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="w-20 p-3 border border-gray-300 rounded-md text-center focus:ring-2 focus:ring-brand-accent outline-none"
              aria-label="Quantity"
            />
            <button
              onClick={() => addToCart(product, quantity)}
              className="flex-1 bg-brand-primary text-white font-semibold py-3 px-8 rounded-md hover:bg-brand-accent hover:text-brand-primary transition-colors duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {(loadingRelated || relatedProducts.length > 0) && (
        <section>
          <h2 className="text-3xl font-serif font-bold text-center mb-10">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {loadingRelated ? (
              Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            ) : (
              relatedProducts.map(related => (
                <ProductCard key={related.id} product={related} />
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
