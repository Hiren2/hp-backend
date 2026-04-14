import { useNavigate, Link } from "react-router-dom";
import { 
  ShoppingBag, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Receipt,
  ShoppingCart
} from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  // NOTE: Make sure you have removeFromCart in your CartContext!
  const { cart, removeFromCart } = useCart(); 
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, i) => sum + i.price, 0);
  const tax = subtotal > 0 ? Math.round(subtotal * 0.18) : 0;
  const delivery = subtotal === 0 ? 0 : subtotal > 1000 ? 0 : 49;
  const total = subtotal + tax + delivery;

  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 pb-12 font-sans antialiased animate-fadeIn">
      
      {/* 🔥 PREMIUM HERO HEADER */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-6 sm:p-8 rounded-[1.5rem] shadow-xl shadow-blue-500/20 overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3 tracking-tight">
              <span className="text-3xl drop-shadow-md">🛒</span> Your Cart
            </h1>
            <p className="text-blue-100 mt-1.5 text-sm sm:text-base font-medium">
              Review your selected services before checkout.
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: CART ITEMS */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ShoppingBag size={20} className="text-blue-600" /> 
              Selected Services
            </h2>
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold">
              {cart.length} Item(s)
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <ShoppingCart size={32} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">Your cart is empty</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
                Looks like you haven't added any services yet. Explore our marketplace to get started.
              </p>
              <Link 
                to="/services"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
              >
                Browse Services <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-200 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors text-base">
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-500 font-medium mt-0.5">
                      Standard Plan
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className="font-extrabold text-slate-800 text-lg tracking-tight">
                      ₹{item.price}
                    </span>
                    <button
                      onClick={() => removeFromCart && removeFromCart(item._id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove from cart"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: PRICE SUMMARY */}
        <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 h-fit lg:sticky lg:top-24">

          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 pb-4 border-b border-slate-100">
            <Receipt size={20} className="text-indigo-600" /> 
            Price Details
          </h2>

          {cart.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8 font-medium">
              Add items to your cart to see the price summary.
            </p>
          ) : (
            <>
              <div className="space-y-3.5 text-sm font-medium text-slate-600">
                <Row label="Subtotal" value={subtotal} />
                <Row label="Tax (18%)" value={tax} />
                <Row 
                  label="Delivery Option" 
                  value={delivery === 0 ? <span className="text-emerald-500 font-bold">Free</span> : delivery} 
                />

                <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between items-center">
                  <span className="text-base font-bold text-slate-800">Total Amount</span>
                  <span className="text-2xl font-extrabold text-blue-600 tracking-tight">
                    ₹{total}
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-8 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5"
              >
                Proceed to Payment <ArrowRight size={18} />
              </button>

              {/* Trust Badge */}
              <div className="mt-5 flex items-center justify-center gap-2 text-slate-400 text-xs font-semibold">
                <ShieldCheck size={14} className="text-emerald-500" />
                Secure & Encrypted Checkout
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>
      <span className="font-semibold text-slate-800">
        {typeof value === "number" ? `₹${value}` : value}
      </span>
    </div>
  );
}