/**
 * Example: How to Display Inventory in Your Product Detail Page
 * 
 * This snippet shows how to use the inventory data that's now available
 * from Stripe metadata via the Netlify function.
 */

import React, { useState } from 'react';
import type { Product } from './store/types';

interface InventoryDisplayProps {
  product: Product;
}

export function InventoryDisplay({ product }: InventoryDisplayProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Check if inventory tracking is enabled for this product
  const hasInventory = product.inventory && Object.keys(product.inventory).length > 0;

  return (
    <div className="space-y-4">
      {/* Size Selection with Inventory Info */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Select Size
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {product.sizes.map((size) => {
              const stock = hasInventory ? (product.inventory![size] || 0) : null;
              const isOutOfStock = stock === 0;
              const isLowStock = stock !== null && stock > 0 && stock <= 5;
              
              return (
                <button
                  key={size}
                  disabled={isOutOfStock}
                  onClick={() => setSelectedSize(size)}
                  className={`
                    relative px-4 py-3 border-2 rounded-lg transition-all
                    ${isOutOfStock 
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50' 
                      : 'border-gray-300 hover:border-gray-900'}
                    ${selectedSize === size 
                      ? 'border-black bg-black text-white' 
                      : 'text-gray-900'}
                  `}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-medium">{size}</span>
                    
                    {/* Show stock status if inventory is tracked */}
                    {hasInventory && (
                      <>
                        {isOutOfStock && (
                          <span className="text-xs text-red-600 mt-1">
                            Out
                          </span>
                        )}
                        {isLowStock && (
                          <span className="text-xs text-orange-600 mt-1">
                            {stock} left
                          </span>
                        )}
                        {stock !== null && stock > 5 && (
                          <span className="text-xs text-green-600 mt-1">
                            In Stock
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Warning message if size not selected */}
          {product.sizes.length > 0 && !selectedSize && (
            <p className="text-sm text-gray-500 mt-2">
              Please select a size
            </p>
          )}
        </div>
      )}

      {/* Global Inventory Status */}
      {hasInventory && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Availability
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {Object.entries(product.inventory!).map(([size, stock]) => (
              <div key={size} className="flex justify-between">
                <span className="text-gray-600">Size {size}:</span>
                <span className={`font-medium ${
                  stock === 0 ? 'text-red-600' :
                  stock <= 5 ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  {stock === 0 ? 'Out of Stock' : `${stock} available`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add to Cart Button - Disabled if out of stock */}
      {product.sizes && product.sizes.length > 0 && (
        <button
          disabled={!selectedSize || (hasInventory && product.inventory![selectedSize] === 0)}
          className={`
            w-full py-3 px-6 rounded-lg font-medium transition-all
            ${!selectedSize || (hasInventory && product.inventory![selectedSize] === 0)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800'}
          `}
        >
          {!selectedSize 
            ? 'Select a Size' 
            : hasInventory && product.inventory![selectedSize] === 0
            ? 'Out of Stock'
            : 'Add to Cart'}
        </button>
      )}
    </div>
  );
}

/**
 * Alternative: Simple Badge Display
 */
export function SimpleInventoryBadge({ product }: { product: Product }) {
  const hasInventory = product.inventory && Object.keys(product.inventory).length > 0;
  
  if (!hasInventory) return null;

  const totalStock = Object.values(product.inventory!).reduce((sum, stock) => sum + stock, 0);
  const isLowStock = totalStock > 0 && totalStock <= 10;
  const isOutOfStock = totalStock === 0;

  return (
    <div className="inline-flex items-center">
      {isOutOfStock ? (
        <span className="px-3 py-1 text-xs font-medium text-red-800 bg-red-100 rounded-full">
          Out of Stock
        </span>
      ) : isLowStock ? (
        <span className="px-3 py-1 text-xs font-medium text-orange-800 bg-orange-100 rounded-full">
          Low Stock ({totalStock} left)
        </span>
      ) : (
        <span className="px-3 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
          In Stock
        </span>
      )}
    </div>
  );
}

/**
 * For Store Grid/List - Show quick availability
 */
export function ProductCardInventoryBadge({ product }: { product: Product }) {
  const hasInventory = product.inventory && Object.keys(product.inventory).length > 0;
  
  if (!hasInventory) return null;

  const totalStock = Object.values(product.inventory!).reduce((sum, stock) => sum + stock, 0);

  if (totalStock === 0) {
    return (
      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
        Sold Out
      </div>
    );
  }

  if (totalStock <= 10) {
    return (
      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
        {totalStock} Left
      </div>
    );
  }

  return null; // Don't show anything if plenty of stock
}

