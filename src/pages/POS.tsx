/**
 * Point of Sale (POS) page - Classic desktop interface like the screenshot
 */

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import NotificationToast from '../components/POS/NotificationToast';
import { useToast } from '../hooks/useToast';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { printReceipt } from '../utils/printReceipt';
import { useAuthStore } from '../store/authStore';
import { useTransactionStore } from '../store/transactionStore';
import { storageManager } from '../utils/storage';
import { 
  ShoppingCart, 
  Scan, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  User,
  CreditCard,
  Banknote,
  Smartphone,
  Calculator,
  Printer,
  X,
  Check,
  Keyboard,
  Clock,
  Star,
  QrCode,
  Wallet
} from 'lucide-react';

interface CartItem {
  id: string;
  productId: string;
  kode: string;
  pid: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
  image?: string;
}

interface Product {
  id: string;
  kode: string;
  pid: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
  barcode: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  type: 'reguler' | 'member';
}

const POS = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [showCustomerSelect, setShowCustomerSelect] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer' | 'qris' | 'ewallet'>('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [globalDiscount, setGlobalDiscount] = useState(0);
  const [note, setNote] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const barcodeInputRef = useRef<HTMLInputElement>(null);
  const { toasts, removeToast, success, error, warning, info } = useToast();
  const { user } = useAuthStore();
  const { addTransaction } = useTransactionStore();

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNewTransaction: clearCart,
    onPayment: () => cart.length > 0 && setShowPayment(true),
    onClearCart: clearCart,
    onSearch: () => barcodeInputRef.current?.focus(),
    onBarcodeFocus: () => barcodeInputRef.current?.focus(),
  });

  // Update time every second and monitor connection
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Mock data - Updated with PID and Kode
  useEffect(() => {
    const mockProducts = [
      {
        id: '1',
        kode: '0101001',
        pid: '8552241211001',
        name: 'PARACETAMOL 500MG',
        price: 3000,
        stock: 150,
        category: 'Analgesik',
        barcode: '8552241211001',
        image: 'https://pub-cdn.sider.ai/u/U08XHO687Y9/web-coder/686554e3235f86442e440465/resource/56948bc8-3a3b-45f0-aac4-9ec39be6889c.jpg'
      },
      {
        id: '2',
        kode: '0101002',
        pid: '8974544512110',
        name: 'AMOXICILLIN 250MG',
        price: 8000,
        stock: 75,
        category: 'Antibiotik',
        barcode: '8974544512110',
        image: 'https://pub-cdn.sider.ai/u/U08XHO687Y9/web-coder/686554e3235f86442e440465/resource/0cd6762c-a9d4-47e2-8283-9ad7638cf725.jpg'
      },
      {
        id: '3',
        kode: '0101003',
        pid: '8487958748523',
        name: 'VITAMIN C 500MG',
        price: 15000,
        stock: 120,
        category: 'Vitamin',
        barcode: '8487958748523',
        image: 'https://pub-cdn.sider.ai/u/U08XHO687Y9/web-coder/686554e3235f86442e440465/resource/bf49658d-cf9b-49e9-8f1e-4994be31b319.jpg'
      },
      {
        id: '4',
        kode: '0101004',
        pid: '8974512345678',
        name: 'OBH COMBI BATUK',
        price: 25000,
        stock: 50,
        category: 'Sirup',
        barcode: '8974512345678',
        image: 'https://pub-cdn.sider.ai/u/U08XHO687Y9/web-coder/686554e3235f86442e440465/resource/11facad4-02a8-4c7a-9530-8cc616241f62.jpg'
      },
      {
        id: '5',
        kode: '0101005',
        pid: '8487123456789',
        name: 'BETADINE 15ML',
        price: 18000,
        stock: 30,
        category: 'Antiseptik',
        barcode: '8487123456789',
        image: 'https://pub-cdn.sider.ai/u/U08XHO687Y9/web-coder/686554e3235f86442e440465/resource/246c0cc1-ef6f-4c8d-b04f-5c54ac6c98b6.jpg'
      },
      {
        id: '6',
        kode: '0101008',
        pid: '8487958748523',
        name: 'KIPAS ANGIN SEKAI',
        price: 220000,
        stock: 15,
        category: 'Elektronik',
        barcode: '0101008',
        image: 'https://pub-cdn.sider.ai/u/U08XHO687Y9/web-coder/686554e3235f86442e440465/resource/93c2a669-e156-4740-9fbe-548251143a5c.jpg'
      }
    ];
    
    setProducts(mockProducts);
  }, []);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.total - (item.total * item.discount / 100)), 0);
  const globalDiscountAmount = (subtotal * globalDiscount) / 100;
  const total = subtotal - globalDiscountAmount;
  const change = parseFloat(amountPaid) - total;
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Add to cart
  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.stock <= 0) {
      error('Stok Habis', `${product.name} tidak tersedia`);
      return;
    }

    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        warning('Stok Terbatas', `Maksimal ${product.stock} item`);
        return;
      }
      updateCartQuantity(existingItem.id, existingItem.quantity + quantity);
    } else {
      const newItem: CartItem = {
        id: Date.now().toString(),
        productId: product.id,
        kode: product.kode,
        pid: product.pid,
        name: product.name,
        price: product.price,
        quantity: quantity,
        discount: 0,
        total: product.price * quantity,
        image: product.image
      };
      setCart([...cart, newItem]);
      success('Ditambahkan', `${product.name} x${quantity}`);
    }
    
    // Clear current product display
    setCurrentProduct(null);
    setBarcodeInput('');
  };

  // Update cart quantity
  const updateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart(cart.map(item => 
      item.id === itemId 
        ? { ...item, quantity: newQuantity, total: item.price * newQuantity }
        : item
    ));
  };

  // Update item discount
  const updateItemDiscount = (itemId: string, discount: number) => {
    setCart(cart.map(item => 
      item.id === itemId 
        ? { ...item, discount: discount }
        : item
    ));
  };

  // Remove from cart
  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
    info('Item Dihapus', 'Item telah dihapus dari keranjang');
  };

  // Clear cart
  function clearCart() {
    if (cart.length > 0) {
      setCart([]);
      setSelectedCustomer(null);
      setGlobalDiscount(0);
      setNote('');
      setCurrentProduct(null);
      setBarcodeInput('');
      info('Transaksi Dibatalkan', 'Keranjang telah dikosongkan');
    }
  }

  // Handle barcode scan/search
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    
    const product = products.find(p => 
      p.barcode === barcodeInput || 
      p.kode === barcodeInput ||
      p.pid === barcodeInput ||
      p.name.toLowerCase().includes(barcodeInput.toLowerCase())
    );
    
    if (product) {
      setCurrentProduct(product);
      // Auto add to cart if Enter is pressed again
    } else {
      error('Produk Tidak Ditemukan', `Kode: ${barcodeInput}`);
      setBarcodeInput('');
    }
  };

  // Add current product to cart
  const addCurrentProductToCart = () => {
    if (currentProduct) {
      addToCart(currentProduct);
    }
  };

  // Process payment
  const processPayment = async () => {
    if (cart.length === 0) {
      error('Transaksi Gagal', 'Keranjang kosong!');
      return;
    }

    if (paymentMethod === 'cash' && parseFloat(amountPaid) < total) {
      error('Pembayaran Kurang', `Kurang ${formatCurrency(total - parseFloat(amountPaid))}`);
      return;
    }

    // Generate transaction number
    const transactionNumber = `TRX${Date.now()}`;
    
    // Prepare receipt data
    const receiptData = {
      transactionNumber,
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        total: item.total - (item.total * item.discount / 100)
      })),
      subtotal,
      globalDiscount,
      globalDiscountAmount,
      total,
      paymentMethod: paymentMethod === 'cash' ? 'Tunai' : 
                     paymentMethod === 'card' ? 'Kartu' : 
                     paymentMethod === 'transfer' ? 'Transfer' :
                     paymentMethod === 'qris' ? 'QRIS' : 'E-Wallet',
      amountPaid: parseFloat(amountPaid) || total,
      change,
      cashier: user?.name || 'Kasir',
      customer: selectedCustomer?.name,
      timestamp: new Date()
    };

    const transactionData = {
      transactionNumber,
      cashierId: user?.id || '1',
      patientId: selectedCustomer?.id,
      items: cart.map(item => ({
        id: item.id,
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        total: item.total - (item.total * item.discount / 100)
      })),
      subtotal,
      discount: globalDiscount,
      tax: 0,
      total,
      paymentMethod: paymentMethod as any,
      amountPaid: parseFloat(amountPaid) || total,
      change,
      createdAt: new Date(),
      cashierName: user?.name
    };

    // Save transaction to store and local/cloud storage
    addTransaction(transactionData);
    
    // Save to offline/online storage
    try {
      await storageManager.saveTransaction(transactionData);
      success('Data Tersimpan', isOnline ? 'Tersinkron ke cloud' : 'Tersimpan offline');
    } catch (error) {
      warning('Gagal Simpan', 'Data hanya tersimpan lokal');
    }

    // Auto print receipt to thermal printer
    try {
      await printReceipt(receiptData);
      success('Transaksi Berhasil!', `No: ${transactionNumber} - Struk dicetak`);
      
      // Also open cash drawer if available
      setTimeout(() => {
        info('Laci Kas Terbuka', 'Ambil uang kembalian');
      }, 500);
    } catch (error) {
      success('Transaksi Berhasil!', `No: ${transactionNumber}`);
      warning('Print Gagal', 'Struk tidak tercetak - periksa printer');
    }

    // Reset for next transaction
    clearCart();
    setShowPayment(false);
    setAmountPaid('');
    setPaymentMethod('cash');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const formatNumber = (amount: number) => {
    return new Intl.NumberFormat('id-ID').format(amount);
  };

  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-green-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">APOTEK SEHAT BERSAMA</h1>
            <p className="text-sm">JL. KESEHATAN SEJAHTERA NO.123 - JAKARTA</p>
            <p className="text-sm">Telp. (021) 7005000</p>
          </div>
          <div className="text-right text-sm">
            <div className="flex items-center justify-end space-x-2 mb-1">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-xs font-bold">
                {isOnline ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <p>User login: <span className="text-yellow-300 font-bold">{user?.username}</span> [{user?.role}]</p>
            <p>Time login: {currentTime.toLocaleString('id-ID')}</p>
            <p>Last login: {currentTime.toLocaleDateString('id-ID')}</p>
          </div>
        </div>
      </div>

      {/* Shortcut Bar */}
      <div className="bg-gray-200 px-4 py-2 text-sm">
        <div className="flex justify-between items-center">
          <div>
            Tekan: [F4] LookUp Barang / [+] Pembayaran / [-] Hapus item terakhir / [F9] Batalkan Transaksi / [F10] Logout
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Left Panel */}
        <div className="flex-1 p-4 space-y-4">
          {/* Barcode Input */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-blue-700 mb-2">
                    Barcode / Kode Barang:
                  </label>
                  <form onSubmit={handleBarcodeSubmit}>
                    <Input
                      ref={barcodeInputRef}
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      className="w-full h-12 text-lg border-2 border-blue-300"
                      placeholder="Scan atau ketik kode..."
                      autoFocus
                    />
                  </form>
                </div>

                {/* Current Product Display */}
                {currentProduct && (
                  <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold">{currentProduct.kode}</p>
                        <p className="text-xl font-bold text-blue-700">{currentProduct.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {formatNumber(currentProduct.price)}
                        </p>
                        <Button 
                          onClick={addCurrentProductToCart}
                          className="mt-2 bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Tambah
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Transaction Table */}
          <Card className="flex-1">
            <CardContent className="p-0">
              <div className="bg-blue-600 text-white">
                <table className="w-full">
                  <thead>
                    <tr className="text-center">
                      <th className="p-2 border-r border-blue-400">NO</th>
                      <th className="p-2 border-r border-blue-400">KODE</th>
                      <th className="p-2 border-r border-blue-400">PID</th>
                      <th className="p-2 border-r border-blue-400">NAMA BARANG</th>
                      <th className="p-2 border-r border-blue-400">QTY</th>
                      <th className="p-2 border-r border-blue-400">@HARGA</th>
                      <th className="p-2 border-r border-blue-400">DISC</th>
                      <th className="p-2">SUBTOTAL</th>
                    </tr>
                  </thead>
                </table>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <tbody>
                    {cart.map((item, index) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 text-center border-r">{String(index + 1).padStart(2, '0')}</td>
                        <td className="p-2 text-center border-r font-mono">{item.kode}</td>
                        <td className="p-2 text-center border-r font-mono text-xs">{item.pid}</td>
                        <td className="p-2 border-r font-semibold">{item.name}</td>
                        <td className="p-2 text-center border-r">
                          <div className="flex items-center justify-center space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="p-2 text-right border-r">{formatNumber(item.price)}</td>
                        <td className="p-2 text-center border-r">
                          <Input
                            type="number"
                            value={item.discount}
                            onChange={(e) => updateItemDiscount(item.id, parseFloat(e.target.value) || 0)}
                            className="w-16 h-6 text-center"
                            min="0"
                            max="100"
                          />
                        </td>
                        <td className="p-2 text-right font-bold">
                          {formatNumber(item.total - (item.total * item.discount / 100))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Summary */}
        <div className="w-80 p-4">
          <Card>
            <CardContent className="p-4">
              {/* Summary Info */}
              <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded mb-4">
                <div className="text-center space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold">Item:[{cart.length}], Qty:[{totalQty}]</span>
                  </div>
                  {currentProduct && (
                    <div className="text-lg font-bold text-blue-700">
                      {currentProduct.name}
                    </div>
                  )}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-3">
                <div className="bg-gray-100 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">SUB TOTAL</span>
                    <span className="text-xl font-bold">{formatNumber(subtotal)}</span>
                  </div>
                </div>

                <div className="bg-gray-100 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">DISKON</span>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={globalDiscount}
                        onChange={(e) => setGlobalDiscount(parseFloat(e.target.value) || 0)}
                        className="w-20 h-8 text-center"
                        min="0"
                        max="100"
                      />
                      <span>%</span>
                    </div>
                  </div>
                  <div className="text-right text-red-600 font-bold">
                    -{formatNumber(globalDiscountAmount)}
                  </div>
                </div>

                <div className="bg-green-100 border-2 border-green-500 p-3 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">TOTAL</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatNumber(total)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button 
                    onClick={() => setShowPayment(true)}
                    disabled={cart.length === 0}
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg font-bold"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    BAYAR [+]
                  </Button>
                  
                  <Button 
                    onClick={clearCart}
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    BATALKAN [F9]
                  </Button>

                  <Button 
                    onClick={() => setShowCustomerSelect(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {selectedCustomer ? selectedCustomer.name : 'Pilih Customer'}
                  </Button>

                  {/* Storage Status */}
                  <div className="bg-gray-50 p-2 rounded text-xs">
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>{isOnline ? 'Online' : 'Offline'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span>Data:</span>
                      <span className="text-blue-600">
                        {isOnline ? 'Cloud + Local' : 'Local Only'}
                      </span>
                    </div>
                  </div>

                  {/* Sync Button */}
                  {!isOnline && (
                    <Button 
                      onClick={async () => {
                        try {
                          await storageManager.forceSyncNow();
                          success('Sync Berhasil', 'Data tersinkron ke cloud');
                        } catch (error) {
                          error('Sync Gagal', 'Periksa koneksi internet');
                        }
                      }}
                      variant="outline"
                      className="w-full text-orange-600 border-orange-300"
                      disabled={!isOnline}
                    >
                      <Smartphone className="w-4 h-4 mr-2" />
                      Sync ke Cloud
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pembayaran</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium mb-2">Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <Button
                  variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('cash')}
                  className="flex flex-col h-16"
                >
                  <Banknote className="w-5 h-5 mb-1" />
                  <span className="text-xs">Tunai</span>
                </Button>
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('card')}
                  className="flex flex-col h-16"
                >
                  <CreditCard className="w-5 h-5 mb-1" />
                  <span className="text-xs">Kartu</span>
                </Button>
                <Button
                  variant={paymentMethod === 'transfer' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('transfer')}
                  className="flex flex-col h-16"
                >
                  <Smartphone className="w-5 h-5 mb-1" />
                  <span className="text-xs">Transfer</span>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={paymentMethod === 'qris' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('qris')}
                  className="flex flex-col h-16"
                >
                  <QrCode className="w-5 h-5 mb-1" />
                  <span className="text-xs">QRIS</span>
                </Button>
                <Button
                  variant={paymentMethod === 'ewallet' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('ewallet')}
                  className="flex flex-col h-16"
                >
                  <Wallet className="w-5 h-5 mb-1" />
                  <span className="text-xs">E-Wallet</span>
                </Button>
              </div>
            </div>

            {/* Total */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-xl font-bold">
                <span>Total Bayar:</span>
                <span className="text-green-600">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Amount Paid (for cash) */}
            {paymentMethod === 'cash' && (
              <div>
                <label className="block text-sm font-medium mb-2">Jumlah Bayar</label>
                <Input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  placeholder="Masukkan jumlah uang"
                  className="text-lg h-12"
                />
                {parseFloat(amountPaid) >= total && (
                  <div className="mt-2 p-2 bg-green-50 rounded text-green-700">
                    <div className="flex justify-between">
                      <span>Kembalian:</span>
                      <span className="font-bold">{formatCurrency(change)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Amount Buttons for Cash */}
            {paymentMethod === 'cash' && (
              <div className="grid grid-cols-4 gap-2">
                {[50000, 100000, 200000, 500000].map(amount => (
                  <Button
                    key={amount}
                    variant="outline"
                    onClick={() => setAmountPaid(amount.toString())}
                    className="text-xs"
                  >
                    {formatCurrency(amount)}
                  </Button>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowPayment(false)} className="flex-1">
                Batal
              </Button>
              <Button onClick={processPayment} className="flex-1 bg-green-600 hover:bg-green-700">
                <Check className="w-4 h-4 mr-2" />
                Bayar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Selection Modal */}
      <Dialog open={showCustomerSelect} onOpenChange={setShowCustomerSelect}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pilih Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                setSelectedCustomer(null);
                setShowCustomerSelect(false);
              }}
            >
              Customer Umum
            </Button>
            {/* Add customer list here */}
          </div>
        </DialogContent>
      </Dialog>

      {/* Toast Notifications */}
      <NotificationToast toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default POS;