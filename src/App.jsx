import React, { useState } from 'react';
import { ShoppingCart, Star, CheckCircle, XCircle, PlusCircle, Package, ImageIcon, Trash2, ArrowLeft, Store } from 'lucide-react';

/**
 * Child Component: ProductCard
 */
const ProductCard = ({ product, onAddToCart }) => {
  const { name, price, inStock, rating, imageUrl } = product;
  
  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img 
          src={imageUrl || "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500&q=80"} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold text-gray-700">{rating}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{name}</h3>
        <p className="text-2xl font-extrabold text-blue-600 mb-3">₹{Number(price).toLocaleString()}</p>

        <div className="mb-4">
          {inStock ? (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-green-50 text-green-600 text-xs font-bold uppercase tracking-wider">
              <CheckCircle className="w-3.5 h-3.5" /> In Stock
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider">
              <XCircle className="w-3.5 h-3.5" /> Out of Stock
            </div>
          )}
        </div>

        <button 
          onClick={() => onAddToCart(product)}
          disabled={!inStock}
          className={`mt-auto w-full py-3.5 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-sm
            ${!inStock 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95'}`}
        >
          <ShoppingCart className="w-4.5 h-4.5" /> Add to Cart
        </button>
      </div>
    </div>
  );
};

/**
 * Main Parent Component: App
 */
export default function App() {
  // Navigation State: 'store' or 'cart'
  const [view, setView] = useState('store');
  
  // Products State
  const [products, setProducts] = useState([
    { id: 1, name: "Modern Laptop Pro", price: 55000, inStock: true, rating: "4.8", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80" },
    { id: 2, name: "Wireless Headphones", price: 2000, inStock: false, rating: "4.2", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80" }
  ]);

  // Cart State
  const [cart, setCart] = useState([]);

  // Form States
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newRating, setNewRating] = useState("4.0");
  const [newStock, setNewStock] = useState(true);

  // File Upload Handler (Base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result); // Base64 string set kar rahe hain
      };
      reader.readAsDataURL(file);
    }
  };

  const addProduct = (e) => {
    e.preventDefault();
    if (!newName || !newPrice) return;
    const newProduct = {
      id: Date.now(),
      name: newName,
      price: newPrice,
      inStock: newStock,
      rating: newRating,
      imageUrl: newImage || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
    };
    setProducts([newProduct, ...products]);
    setNewName(""); setNewPrice(""); setNewImage(""); setNewRating("4.0");
  };

  const addToCart = (product) => {
    setCart([...cart, { ...product, cartId: Date.now() }]);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const cartTotal = cart.reduce((total, item) => total + Number(item.price), 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white border-b sticky top-0 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('store')}>
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Store className="w-6 h-6" />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight">TECHSTORE</span>
          </div>
          
          <button 
            onClick={() => setView(view === 'store' ? 'cart' : 'store')}
            className="relative p-3 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
          >
            <ShoppingCart className="w-6 h-6 text-slate-700" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {view === 'store' ? (
        <div className="max-w-6xl mx-auto py-12 px-4">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-slate-900">Store Inventory</h1>
            <p className="text-slate-500 mt-2">Upload products and manage your stock</p>
          </header>

          {/* Form to Add Product */}
          <div className="bg-white p-8 rounded-3xl shadow-lg mb-16 max-w-2xl mx-auto border border-slate-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-800">
              <PlusCircle className="w-6 h-6 text-blue-500" /> Add New Item
            </h2>
            <form onSubmit={addProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" placeholder="Product Name" value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400" required
                />
                <input 
                  type="number" placeholder="Price (₹)" value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400" required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">Product Image</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 p-4 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                    <ImageIcon className="w-5 h-5 text-slate-400" />
                    <span className="text-sm text-slate-500 font-medium">Click to Upload Image</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {newImage && (
                    <img src={newImage} className="w-16 h-16 object-cover rounded-lg border" alt="Preview" />
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                <span className="text-sm font-medium text-slate-600">Stock Status:</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setNewStock(true)} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${newStock ? 'bg-green-600 text-white' : 'bg-white border'}`}>IN STOCK</button>
                  <button type="button" onClick={() => setNewStock(false)} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${!newStock ? 'bg-red-600 text-white' : 'bg-white border'}`}>OUT</button>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                <Package className="w-5 h-5" /> PUBLISH PRODUCT
              </button>
            </form>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(p => <ProductCard key={p.id} product={p} onAddToCart={addToCart} />)}
          </div>
        </div>
      ) : (
        /* CART VIEW */
        <div className="max-w-3xl mx-auto py-12 px-4">
          <button onClick={() => setView('store')} className="flex items-center gap-2 text-blue-600 font-bold mb-8 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </button>
          
          <h1 className="text-3xl font-black text-slate-900 mb-8">Your Shopping Cart</h1>
          
          {cart.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed">
              <ShoppingCart className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Your cart is empty!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.cartId} className="bg-white p-4 rounded-2xl shadow-sm border flex gap-4 items-center">
                  <img src={item.imageUrl} className="w-20 h-20 object-cover rounded-xl" alt={item.name} />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <p className="text-blue-600 font-bold">₹{Number(item.price).toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.cartId)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              
              <div className="mt-8 bg-white p-6 rounded-3xl shadow-lg border-2 border-blue-100">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-slate-500 font-medium">Total Amount:</span>
                  <span className="text-3xl font-black text-slate-900">₹{cartTotal.toLocaleString()}</span>
                </div>
                <button className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200">
                  CHECKOUT NOW
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}