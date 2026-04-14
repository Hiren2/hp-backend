import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import api from "../utils/api"; // 🔥 Ensure this path points to your API instance
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import Toast from "../components/Toast";
import useToast from "../components/useToast";
import { 
  MapPin, CreditCard, Smartphone, Truck, User, Phone, Receipt, ShieldCheck, ArrowRight, CheckCircle, XCircle, Loader2, Lock, Tag, TicketPercent, X
} from "lucide-react";

export default function Checkout() {
  const { cart, clearCart, appliedCoupon, setAppliedCoupon } = useCart();
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 🔥 UPI STATE MANAGEMENT
  const [upiId, setUpiId] = useState("");
  const [upiState, setUpiState] = useState("input");
  const [timer, setTimer] = useState(300); 

  const [couponInput, setCouponInput] = useState("");
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [liveOffers, setLiveOffers] = useState([]); 
  
  const [isFirstOrder, setIsFirstOrder] = useState(false);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const orderRes = await api.get("/orders/my"); 
        if (orderRes.data && orderRes.data.length === 0) {
          setIsFirstOrder(true);
          setCouponInput("WELCOME100"); 
        }

        const couponRes = await api.get("/coupons/active");
        if (couponRes.data && Array.isArray(couponRes.data)) {
          setLiveOffers(couponRes.data);
        }
      } catch (error) {
        console.warn("Failed to load live coupons or order history.");
      }
    };
    fetchCheckoutData();
  }, []);

  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [showGateway, setShowGateway] = useState(false);
  const [gatewayState, setGatewayState] = useState("loading");

  const [address, setAddress] = useState({ fullName: "", phone: "", street: "", city: "", state: "", pincode: "" });

  const subtotal = cart.reduce((sum, i) => sum + i.price, 0);
  
  let discountAmount = 0;
  if (appliedCoupon) {
    let eligibleSubtotal = subtotal;

    if (appliedCoupon.applicableCategory && appliedCoupon.applicableCategory.toLowerCase() !== "all") {
      eligibleSubtotal = cart
        .filter(item => item.category && item.category.toLowerCase() === appliedCoupon.applicableCategory.toLowerCase())
        .reduce((sum, i) => sum + i.price, 0);
    }

    if (appliedCoupon.type === "percent") {
      discountAmount = Math.round(eligibleSubtotal * (appliedCoupon.value / 100));
      const maxCap = appliedCoupon.maxDiscount ? appliedCoupon.maxDiscount : 10000;
      if (discountAmount > maxCap) discountAmount = maxCap;
    } else {
      discountAmount = appliedCoupon.value;
      if (discountAmount > 10000) discountAmount = 10000; 
    }
    if (discountAmount > eligibleSubtotal) discountAmount = eligibleSubtotal; 
  }

  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal > 0 ? Math.round(discountedSubtotal * 0.18) : 0; 
  const delivery = discountedSubtotal === 0 ? 0 : discountedSubtotal > 1000 ? 0 : 49;
  const total = discountedSubtotal + tax + delivery;

  // 🔥 5 MINUTE TIMER
  useEffect(() => {
    if (upiState !== "waiting") return;
    setTimer(300);
    const t = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) { 
          clearInterval(t); 
          setUpiState("input"); 
          showToast("UPI Request Expired. Please try again. ⏳", "error");
          return 0; 
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [upiState]);

  // ✅ ADDRESS VALIDATION LOGIC
  const isAddressValid = address.fullName.trim().length > 2 && address.phone.length === 10 && address.street.trim() !== "" && address.city.trim() !== "" && address.state.trim() !== "" && address.pincode.length >= 6;

  const isValidExpiry = (exp) => {
    if (exp.length !== 5) return false;
    const [mm, yy] = exp.split('/');
    const month = parseInt(mm, 10);
    const year = parseInt(`20${yy}`, 10);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (month < 1 || month > 12) return false;
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    return true;
  };

  const isCardValid = cardDetails.number.length === 19 && isValidExpiry(cardDetails.expiry) && cardDetails.cvv.length === 3 && cardDetails.name.trim().length > 2;

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").substring(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
    setCardDetails({ ...cardDetails, number: formatted });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (value.length >= 3) value = `${value.substring(0, 2)}/${value.substring(2)}`;
    setCardDetails({ ...cardDetails, expiry: value });
  };

  const handleCardNameChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z\s]/g, "").toUpperCase();
    setCardDetails({ ...cardDetails, name: value });
  };

  const handleApplyCoupon = (codeToApply) => {
    const code = codeToApply || couponInput;
    if (!code) { showToast("Please enter a coupon code", "error"); return; }
    
    if (code.toUpperCase() === "WELCOME100" && !isFirstOrder) {
      showToast("WELCOME100 is only valid for your first ever order! ❌", "error");
      return;
    }

    const validCoupon = liveOffers.find(c => c.code === code.toUpperCase());
    
    if (validCoupon) {
      if (validCoupon.applicableCategory && validCoupon.applicableCategory.toLowerCase() !== "all") {
        const hasEligibleItem = cart.some(item => item.category && item.category.toLowerCase() === validCoupon.applicableCategory.toLowerCase());
        if (!hasEligibleItem) {
          showToast(`This coupon is only valid for '${validCoupon.applicableCategory}' services ❌`, "error");
          return;
        }
      }
      setAppliedCoupon(validCoupon);
      setCouponInput("");
      setShowOffersModal(false);
      showToast(`'${validCoupon.code}' applied successfully! 🎉`, "success");
    } else {
      showToast("Invalid or expired coupon code ❌", "error");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    showToast("Coupon removed", "success");
  };

  // 🔥 UPDATED: UPI VERIFICATION WITH STRICT ADDRESS CHECK
  const handleVerifyUpi = () => {
    if (!isAddressValid) {
      showToast("Pehle delivery details (Address) fill karo! 🏠", "error");
      return;
    }
    if (!upiId.includes('@') || upiId.length < 5) {
      showToast("Please enter a valid UPI ID (e.g. name@bank) ❌", "error");
      return;
    }
    setUpiState("verifying");
    setTimeout(() => {
      setUpiState("waiting");
      showToast("UPI Verified! Payment Request Sent ✅", "success");
    }, 1500); 
  };

  const initiatePayment = () => {
    if (!isAddressValid) { showToast("Please provide complete valid address details 🏠", "error"); return; }
    if (!method) { showToast("Select a payment method 💳", "error"); return; }
    
    if (method === "upi" && upiState !== "waiting") { 
        showToast("Please Verify your UPI ID first to send a request! 📱", "error"); 
        return; 
    }
    
    if (method === "card" && !isCardValid) { showToast("Invalid Card Details. Check Number, Expiry, or CVV 🔒", "error"); return; }

    if (method === "cod") {
      processFinalOrder("cod");
    } else {
      setShowGateway(true);
      setGatewayState("loading");
      setTimeout(() => setGatewayState("ready"), 1500);
    }
  };

  const simulatePayment = (status) => {
    setGatewayState("processing");
    setTimeout(() => {
      if (status === "success") {
        setGatewayState("success");
        setTimeout(() => { setShowGateway(false); processFinalOrder("success"); }, 2000);
      } else {
        setGatewayState("failed");
      }
    }, 2000);
  };

  const processFinalOrder = async (paymentResult) => {
    setLoading(true);
    try {
      for (let item of cart) {
        const res = await api.post("/orders", {
          serviceId: item._id,
          address,
          paymentMethod: method === "cod" ? "cod" : "Online",
          couponCode: appliedCoupon ? appliedCoupon.code : null, 
          discountValue: discountAmount 
        });

        if (paymentResult === "success") {
          await api.post("/orders/payment", { orderId: res.data._id, status: "success" });
        }
      }
      clearCart();
      showToast("Order Placed Successfully 🎉", "success");
      setTimeout(() => navigate("/my-orders"), 1500);
    } catch {
      showToast("Order processing failed ❌", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast message={toast.message} type={toast.type} />
      <div className="max-w-7xl mx-auto mt-8 px-4 pb-12 font-sans antialiased animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Secure Checkout</h1>
          <p className="text-slate-500 font-medium">Finalize your request and get started instantly.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <MapPin className="text-blue-600" size={20} /> Delivery Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Input icon={<User size={16}/>} label="Full Name" value={address.fullName} onChange={(val) => setAddress({...address, fullName: val})} />
                <Input icon={<Phone size={16}/>} label="Phone Number" value={address.phone} onChange={(val) => setAddress({...address, phone: val.replace(/\D/g, "").substring(0, 10)})} />
                <div className="md:col-span-2">
                  <Input icon={<MapPin size={16}/>} label="Street / Area" value={address.street} onChange={(val) => setAddress({...address, street: val})} />
                </div>
                <Input label="City" value={address.city} onChange={(val) => setAddress({...address, city: val})} />
                <Input label="State" value={address.state} onChange={(val) => setAddress({...address, state: val})} />
                <Input label="Pincode" value={address.pincode} onChange={(val) => setAddress({...address, pincode: val.replace(/\D/g, "").substring(0, 6)})} />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <CreditCard className="text-indigo-600" size={20} /> Payment Method
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <PaymentOption value="upi" current={method} set={setMethod} label="UPI / QR" icon={<Smartphone />} />
                <PaymentOption value="card" current={method} set={setMethod} label="Credit/Debit Card" icon={<CreditCard />} />
                <PaymentOption value="cod" current={method} set={setMethod} label="Cash on Delivery" icon={<Truck />} />
              </div>

              {method === "upi" && (
                <div className="mt-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-200 animate-fadeIn">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-700">Pay via UPI</h3>
                    <div className="flex gap-2">
                      <div className="w-8 h-5 bg-green-600 rounded flex items-center justify-center text-[8px] text-white font-bold tracking-widest">UPI</div>
                    </div>
                  </div>

                  {upiState === "input" && (
                    <div className="space-y-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Enter UPI ID</label>
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                          <input 
                            type="text" 
                            value={upiId} 
                            onChange={(e) => setUpiId(e.target.value.toLowerCase())} 
                            placeholder="e.g. hiren@okicici" 
                            className="flex-1 bg-white border border-slate-200 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-semibold"
                          />
                          <button 
                            onClick={handleVerifyUpi} 
                            className="px-8 py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-slate-900/20"
                          >
                            Verify & Pay
                          </button>
                        </div>
                      </div>
                      
                      <div className="relative flex items-center py-4">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">OR</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                      </div>

                      <div className="text-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">Scan to Pay Instantly</p>
                        <div className="inline-block p-2 border-2 border-slate-100 rounded-xl">
                          <QRCodeCanvas value={`upi://pay?pa=demo@upi&pn=H&P Solutions&am=${total}`} size={140} className="rounded-lg"/>
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-2">
                           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                           <span className="text-[10px] font-bold text-slate-400">QR Code is active</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {upiState === "verifying" && (
                    <div className="py-12 text-center animate-pulse">
                      <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto mb-4" />
                      <p className="font-bold text-slate-600 text-lg">Verifying UPI ID...</p>
                      <p className="text-xs text-slate-400 mt-1">Connecting to bank servers</p>
                    </div>
                  )}

                  {upiState === "waiting" && (
                    <div className="text-center py-6 animate-fadeIn">
                      <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-5 relative">
                        <Smartphone size={40} className="animate-bounce" />
                        <span className="absolute top-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px]">1</span>
                      </div>
                      <h3 className="font-black text-2xl text-slate-800 mb-2">Approve Payment</h3>
                      <p className="text-sm font-medium text-slate-600 mb-1">A request of <strong>₹{total}</strong> has been sent to</p>
                      <p className="text-md font-bold text-indigo-600 mb-6 bg-indigo-50 inline-block px-4 py-1.5 rounded-full">{upiId}</p>
                      
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 max-w-xs mx-auto relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-100">
                           <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${(timer / 300) * 100}%` }}></div>
                        </div>
                        <div className="text-4xl font-mono font-black text-slate-800 mb-1">
                          {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Remaining</p>
                        <p className="text-xs text-slate-500 mt-4 leading-relaxed">Open your UPI app (GPay, PhonePe, Paytm, etc.) and enter your PIN to approve.</p>
                      </div>

                      <div className="border-t border-slate-200 pt-6 mt-2">
                        <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">Having trouble? Scan alternate QR</p>
                        <div className="bg-white p-2 rounded-xl shadow-sm inline-block border border-slate-100">
                          <QRCodeCanvas value={`upi://pay?pa=${upiId}&pn=H&P Solutions&am=${total}`} size={100} className="rounded-lg"/>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {method === "card" && (
                <div className="mt-8 p-6 bg-slate-50/50 rounded-2xl border border-slate-200 animate-fadeIn">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-700">Enter Card Details</h3>
                    <div className="flex gap-2">
                      <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-[8px] text-white font-bold italic">VISA</div>
                      <div className="w-8 h-5 bg-orange-500 rounded flex items-center justify-center text-[8px] text-white font-bold">MC</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Card Number</label>
                      <div className="relative group">
                        <CreditCard className="absolute left-3 top-3.5 text-slate-400" size={16} />
                        <input type="text" value={cardDetails.number} onChange={handleCardNumberChange} placeholder="0000 0000 0000 0000" className="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-semibold tracking-widest" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Expiry Date</label>
                        <input type="text" value={cardDetails.expiry} onChange={handleExpiryChange} placeholder="MM/YY" className="w-full bg-white border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-semibold tracking-widest text-center" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">CVV</label>
                        <div className="relative group">
                          <Lock className="absolute right-3 top-3.5 text-slate-400" size={16} />
                          <input type="password" maxLength="3" value={cardDetails.cvv} onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "") })} placeholder="•••" className="w-full bg-white border border-slate-200 pl-4 pr-10 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-semibold tracking-widest text-center" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Name on Card</label>
                      <input type="text" value={cardDetails.name} onChange={handleCardNameChange} placeholder="e.g. JOHN DOE" className="w-full bg-white border border-slate-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-semibold" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 sticky top-24">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Receipt className="text-purple-600" size={20} /> Order Summary
              </h2>
              <div className="space-y-4 max-h-[200px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
                {cart.map((i) => (
                  <div key={i._id} className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-medium">{i.name}</span>
                    <span className="font-bold text-slate-800">₹{i.price}</span>
                  </div>
                ))}
              </div>

              <div className="mb-6 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                {!appliedCoupon ? (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold text-blue-800 uppercase flex items-center gap-1.5 whitespace-nowrap">
                        <Tag size={14} /> Offers & Coupons
                      </span>
                      <button onClick={() => setShowOffersModal(true)} className="text-[11px] sm:text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap">
                        View Latest Offers
                      </button>
                    </div>
                    {isFirstOrder && (
                      <p className="text-[10px] text-emerald-600 font-bold mb-2 uppercase animate-pulse">🎉 First Order Bonus Available!</p>
                    )}
                    <div className="flex gap-2 w-full">
                      <input 
                        type="text" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Have a coupon code?" 
                        className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg border border-blue-200 outline-none focus:ring-2 focus:ring-blue-500/20 uppercase"
                      />
                      <button onClick={() => handleApplyCoupon()} className="shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors">
                        Apply
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                        <CheckCircle size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-emerald-800 uppercase">'{appliedCoupon.code}' APPLIED</p>
                        <p className="text-[10px] text-emerald-600 font-medium">You saved ₹{discountAmount} on eligible items!</p>
                      </div>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors uppercase whitespace-nowrap ml-2">
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-sm">
                <div className="flex justify-between text-slate-500">
                  <span>Base Subtotal</span><span>₹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-medium animate-fadeIn">
                    <span>Coupon Discount</span><span>- ₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>GST (18%)</span><span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Charges</span>
                  <span className={delivery === 0 ? "text-emerald-500 font-bold" : ""}>
                    {delivery === 0 ? "FREE" : `₹${delivery}`}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 text-lg font-extrabold text-slate-800 border-t border-slate-100 mt-2">
                  <span>Total Payable</span>
                  <span className="text-2xl text-blue-600 tracking-tight">₹{total}</span>
                </div>
              </div>

              <button
                disabled={loading}
                onClick={initiatePayment} 
                className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
              >
                {loading ? "Processing..." : (
                  <>
                    {method === "upi" && upiState !== "waiting" ? "Verify UPI to Proceed" : "Confirm Payment"}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showOffersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2"><TicketPercent size={20} /> Live Platform Offers</h3>
              <button onClick={() => setShowOffersModal(false)} className="text-white/80 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
              {liveOffers.map((offer) => (
                <div key={offer.code} className="border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-xl p-4 flex justify-between items-center relative overflow-hidden group hover:border-blue-400 transition-colors">
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-r-2 border-dashed border-blue-200 group-hover:border-blue-400 transition-colors"></div>
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-l-2 border-dashed border-blue-200 group-hover:border-blue-400 transition-colors"></div>
                  
                  <div className="pl-4">
                    <p className="font-extrabold text-blue-800 text-lg tracking-tight">{offer.title}</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{offer.desc}</p>
                    <div className="flex flex-wrap gap-2 items-center mt-3">
                      <div className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-[10px] font-black tracking-widest rounded uppercase">
                        CODE: {offer.code}
                      </div>
                      <div className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-[10px] font-black tracking-widest rounded uppercase">
                        CAT: {offer.applicableCategory || "ALL"}
                      </div>
                    </div>
                  </div>
                  
                  <button onClick={() => handleApplyCoupon(offer.code)} className="pr-2 font-bold text-sm text-blue-600 hover:text-indigo-700 transition-colors">
                    APPLY
                  </button>
                </div>
              ))}
              {liveOffers.length === 0 && (
                <p className="text-center text-slate-500 font-medium py-4">No active offers available currently.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {showGateway && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" size={20} />
                <span className="font-bold text-slate-700">H&P Secure Pay</span>
              </div>
              <span className="font-bold text-lg text-slate-800">₹{total}</span>
            </div>

            <div className="p-8 text-center">
              {gatewayState === "loading" && (
                <div className="py-8">
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                  <p className="font-bold text-slate-600">Initializing Secure Connection...</p>
                  <p className="text-xs text-slate-400 mt-1">Do not refresh the page</p>
                </div>
              )}

              {gatewayState === "ready" && (
                <div className="py-2 animate-fadeIn">
                  <p className="font-medium text-slate-600 mb-6">Simulation Controls (For Presentation):</p>
                  <div className="space-y-3">
                    <button onClick={() => simulatePayment('success')} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors shadow-sm">
                      Simulate Successful Payment
                    </button>
                    <button onClick={() => simulatePayment('failed')} className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-3 rounded-xl transition-colors border border-rose-200">
                      Simulate Payment Failure
                    </button>
                  </div>
                </div>
              )}

              {gatewayState === "processing" && (
                <div className="py-8 animate-pulse">
                  <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                  <p className="font-bold text-slate-600">Processing Payment securely...</p>
                </div>
              )}

              {gatewayState === "success" && (
                <div className="py-6 animate-slideUp">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                  </div>
                  <p className="font-black text-xl text-slate-800">Payment Successful!</p>
                  <p className="text-sm font-medium text-slate-500 mt-2">Redirecting to order confirmation...</p>
                </div>
              )}

              {gatewayState === "failed" && (
                <div className="py-6 animate-slideUp">
                  <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle size={32} />
                  </div>
                  <p className="font-black text-xl text-slate-800 mb-2">Payment Declined</p>
                  <p className="text-sm font-medium text-slate-500 mb-6">Insufficient funds or incorrect card details.</p>
                  <button onClick={() => setGatewayState("ready")} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors">
                    Try Again
                  </button>
                </div>
              )}
            </div>

            {gatewayState === "ready" && (
               <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center">
                 <button onClick={() => setShowGateway(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">
                   Cancel Transaction
                 </button>
               </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Input({ icon, label, value, onChange }) {
  return (
    <div className="space-y-1.5 flex-1">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">{label}</label>
      <div className="relative group">
        {icon && <div className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors">{icon}</div>}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${label}`}
          className={`w-full bg-slate-50/50 border border-slate-200 ${icon ? 'pl-10' : 'px-4'} py-3 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-semibold`}
        />
      </div>
    </div>
  );
}

function PaymentOption({ label, value, current, set, icon }) {
  const active = current === value;
  return (
    <div
      onClick={() => set(value)}
      className={`flex flex-col items-center justify-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300
      ${active ? "bg-blue-50 border-blue-500 text-blue-600 shadow-sm" : "bg-white border-slate-100 text-slate-400 hover:border-blue-200"}`}
    >
      <div className={`${active ? "text-blue-600" : "text-slate-400"} mb-2`}>{icon}</div>
      <span className="text-xs font-bold uppercase tracking-wide text-center">{label}</span>
    </div>
  );
}