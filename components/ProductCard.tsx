
import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/utils';
import DebugImage from './DebugImage';
import { fixImageUrl } from '../lib/imageFixer';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2QxZDVlMCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiPklNQUdFIFVOU1VQUE9SVEVEPC90ZXh0Pjwvc3ZnPg==';
  };

  return (
    <div className="group relative border border-gray-100 rounded-xl overflow-hidden bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full">
      <a href={`#/product?id=${product.id}`} className="block flex-grow">
        <div className="bg-brand-light/50 p-6 relative overflow-hidden">
          <div className="aspect-w-1 aspect-h-1 w-full">
            <DebugImage
              src={fixImageUrl(product.image_url)}
              alt={product.name}
              onError={handleImageError}
              className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-110 drop-shadow-sm"
            />
          </div>
          {/* Quick view overlay or similar could go here */}
        </div>
        <div className="p-5 text-center">
          <h3 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-1">{product.brand}</h3>
          <p className="font-serif text-lg font-semibold text-brand-primary truncate group-hover:text-brand-accent transition-colors">{product.name}</p>
          <p className="mt-2 text-base font-medium text-gray-900">{formatCurrency(product.price)}</p>
        </div>
      </a>
      <div className="p-4 pt-0 border-t-0">
        <button
          onClick={() => addToCart(product, 1)}
          className="w-full bg-brand-primary text-white py-3 px-4 rounded-lg text-sm font-semibold hover:bg-brand-accent hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent transition-all duration-300 flex items-center justify-center space-x-2 transform active:scale-95"
          aria-label={`Add ${product.name} to cart`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
