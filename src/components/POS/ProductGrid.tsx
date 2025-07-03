/**
 * Product grid component for POS interface
 */

import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Scan } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  barcode: string;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductGrid = ({ products, onAddToCart }: ProductGridProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {products.map(product => (
        <Card 
          key={product.id} 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
          onClick={() => onAddToCart(product)}
        >
          <CardContent className="p-4">
            <div className="aspect-square bg-gradient-to-br from-blue-50 to-green-50 rounded-lg mb-3 overflow-hidden relative">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Scan className="w-8 h-8" />
                </div>
              )}
              {product.stock <= 10 && (
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive" className="text-xs">
                    Minim
                  </Badge>
                </div>
              )}
            </div>
            <h3 className="font-medium text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
              {product.name}
            </h3>
            <p className="text-lg font-bold text-green-600 mb-1">
              {formatCurrency(product.price)}
            </p>
            <div className="flex justify-between items-center">
              <Badge 
                variant={product.stock > 10 ? "secondary" : "destructive"}
                className="text-xs"
              >
                Stok: {product.stock}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;