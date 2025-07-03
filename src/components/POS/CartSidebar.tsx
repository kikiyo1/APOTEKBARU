/**
 * Shopping cart sidebar component for POS
 */

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  X, 
  User,
  CreditCard
} from 'lucide-react';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  image?: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  type: 'reguler' | 'member';
}

interface CartSidebarProps {
  cart: CartItem[];
  selectedCustomer: Customer | null;
  discount: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onSelectCustomer: () => void;
  onDiscountChange: (discount: number) => void;
  onCheckout: () => void;
}

const CartSidebar = ({
  cart,
  selectedCustomer,
  discount,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSelectCustomer,
  onDiscountChange,
  onCheckout
}: CartSidebarProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (subtotal * discount) / 100;
  const tax = (subtotal - discountAmount) * 0.1; // 10% tax
  const total = subtotal - discountAmount + tax;

  return (
    <div className="w-96 bg-white border-l flex flex-col h-full">
      {/* Cart Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-green-50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center text-gray-800">
            <ShoppingCart className="w-5 h-5 mr-2 text-green-600" />
            Keranjang ({cart.length})
          </h2>
          {cart.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearCart}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Customer Selection */}
      <div className="p-4 border-b bg-gray-50">
        <Button 
          variant="outline" 
          className="w-full justify-start hover:bg-blue-50"
          onClick={onSelectCustomer}
        >
          <User className="w-4 h-4 mr-2" />
          {selectedCustomer ? (
            <div className="text-left">
              <span className="font-medium">{selectedCustomer.name}</span>
              <Badge 
                variant={selectedCustomer.type === 'member' ? 'default' : 'secondary'}
                className="ml-2 text-xs"
              >
                {selectedCustomer.type}
              </Badge>
            </div>
          ) : (
            'Pilih Pelanggan (Opsional)'
          )}
        </Button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-auto">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-lg font-medium mb-1">Keranjang Kosong</p>
            <p className="text-sm text-center">Pilih produk untuk mulai transaksi</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {cart.map(item => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm line-clamp-2 flex-1 pr-2">{item.name}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
                    <p className="font-bold text-green-600">{formatCurrency(item.total)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="border-t bg-white">
          {/* Discount */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Diskon (%):</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
                  className="w-20 h-8"
                  min="0"
                  max="100"
                />
                <Badge variant="outline" className="text-xs">
                  -{formatCurrency(discountAmount)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Diskon ({discount}%):</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>Pajak (10%):</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2 text-green-600">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="p-4">
            <Button 
              className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 shadow-lg"
              onClick={onCheckout}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Bayar {formatCurrency(total)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;