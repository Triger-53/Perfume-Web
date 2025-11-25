
import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="border border-brand-primary/10 rounded-lg overflow-hidden bg-white p-4">
      <div className="animate-pulse">
        <div className="bg-gray-200 aspect-w-1 aspect-h-1 w-full"></div>
        <div className="mt-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <div className="mt-6 h-9 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
