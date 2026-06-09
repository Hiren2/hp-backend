import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import Toast from "../components/Toast";
import useToast from "../components/useToast";
import { 
  MapPin, CreditCard, Smartphone, Truck, User, Phone, Receipt, ShieldCheck, ArrowRight, CheckCircle, XCircle, Loader2, Lock, Tag, TicketPercent, X, ChevronDown, Check
} from "lucide-react";


const INDIA_LOCATIONS = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Raigarh"],
  "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi", "Central Delhi"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar"],
  "Haryana": ["Chandigarh", "Faridabad", "Gurugram", "Rohtak", "Panipat"],
  "Himachal Pradesh": ["Shimla", "Solan", "Dharamshala", "Mandi", "Palampur"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad", "Navi Mumbai"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Brahmapur", "Sambalpur"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Noida", "Prayagraj"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur"],
  "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Siliguri", "Asansol"]
};

export default function Checkout() {
  const { cart, clearCart, appliedCoupon, setAppliedCoupon } = useCart();
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

  const [method, setMethod] = useState("");
  const [loading, setLoading] = useState(false);
  
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
  const [isFlipped, setIsFlipped] = useState(false); 
  
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

  const isAddressValid = address.fullName.trim().length > 2 && address.phone.length === 10 && address.street.trim() !== "" && address.city.trim() !== "" && address.state.trim() !== "" && address.pincode.length === 6;

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

  const handleVerifyUpi = () => {
    if (!isAddressValid) {
      showToast("Please Fill out the delivery details (Address) first! 🏠", "error");
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
      <div className="max-w-7xl mx-auto mt-8 px-4 pb-20 font-sans antialiased animate-fadeIn">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Lock className="text-emerald-500" size={32} /> Secure Checkout
          </h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">Finalize your request through our encrypted payment gateway.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Left Column: Address & Payment */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Address Section */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><MapPin size={22} /></div>
                Delivery Coordinates
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Input 
                  icon={<User size={18}/>} 
                  label="Full Name" 
                  value={address.fullName} 
                  onChange={(val) => setAddress({...address, fullName: val.replace(/[^a-zA-Z\s]/g, "")})} 
                />
                
                <Input 
                  icon={<Phone size={18}/>} 
                  label="Phone Number" 
                  value={address.phone} 
                  onChange={(val) => setAddress({...address, phone: val.replace(/\D/g, "").substring(0, 10)})} 
                />
                
                <div className="md:col-span-2">
                  <Input 
                    icon={<MapPin size={18}/>} 
                    label="Street / Area Detail" 
                    value={address.street} 
                    onChange={(val) => setAddress({...address, street: val})} 
                  />
                </div>

                <SelectInput 
                  icon={<MapPin size={18}/>} 
                  label="State / Province" 
                  value={address.state} 
                  onChange={(val) => setAddress({...address, state: val, city: ""})} 
                  options={Object.keys(INDIA_LOCATIONS).sort()} 
                  placeholder="Select Region" 
                />
                
                <SelectInput 
                  icon={<MapPin size={18}/>} 
                  label="City" 
                  value={address.city} 
                  onChange={(val) => setAddress({...address, city: val})} 
                  options={address.state ? INDIA_LOCATIONS[address.state].sort() : []} 
                  disabled={!address.state}
                  placeholder={address.state ? "Select City" : "Select State First"} 
                />

                <div className="md:col-span-2">
                  <Input 
                    icon={<MapPin size={18}/>} 
                    label="Postal Code (PIN)" 
                    value={address.pincode} 
                    onChange={(val) => setAddress({...address, pincode: val.replace(/\D/g, "").substring(0, 6)})} 
                  />
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><CreditCard size={22} /></div>
                Payment Method
              </h2>
              
              <div className="grid sm:grid-cols-3 gap-5">
                <PaymentOption value="upi" current={method} set={setMethod} label="UPI / QR" icon={<Smartphone />} />
                <PaymentOption value="card" current={method} set={setMethod} label="Credit/Debit" icon={<CreditCard />} />
                <PaymentOption value="cod" current={method} set={setMethod} label="Cash on Delivery" icon={<Truck />} />
              </div>

              {/* UPI Form */}
              {method === "upi" && (
                <div className="mt-8 p-8 bg-slate-50/80 rounded-[1.5rem] border border-slate-200 animate-fadeIn">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-black text-slate-800 text-lg">Pay via Fast UPI</h3>
                    <div className="w-10 h-6 bg-green-600 rounded-md flex items-center justify-center text-[9px] text-white font-black tracking-widest shadow-sm">UPI</div>
                  </div>

                  {upiState === "input" && (
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Virtual Payment Address (VPA)</label>
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                          <input 
                            type="text" 
                            value={upiId} 
                            onChange={(e) => setUpiId(e.target.value.toLowerCase())} 
                            placeholder="e.g. yourname@okbank" 
                            className="flex-1 bg-white border border-slate-200 px-5 py-4 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-base font-bold text-slate-700"
                          />
                          <button 
                            onClick={handleVerifyUpi} 
                            className="px-8 py-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-sm transition-all shadow-[0_4px_15px_rgba(15,23,42,0.2)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.3)] hover:-translate-y-0.5"
                          >
                            Verify & Pay
                          </button>
                        </div>
                      </div>
                      
                      <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-black uppercase tracking-widest">OR</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                      </div>

                      <div className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-xs font-black text-slate-500 mb-5 uppercase tracking-widest">Scan to Pay Instantly</p>
                        <div className="inline-block p-3 border-2 border-slate-100 rounded-xl shadow-inner">
                          <QRCodeCanvas value={`upi://pay?pa=demo@upi&pn=H&P Solutions&am=${total}`} size={160} className="rounded-lg"/>
                        </div>
                        <div className="mt-5 flex items-center gap-2">
                           <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                           <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Awaiting Scan</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {upiState === "verifying" && (
                    <div className="py-16 text-center animate-pulse">
                      <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-5" />
                      <p className="font-black text-slate-800 text-xl">Verifying Network Identity...</p>
                      <p className="text-sm text-slate-500 mt-2 font-medium">Establishing secure bank handshake</p>
                    </div>
                  )}

                  {upiState === "waiting" && (
                    <div className="text-center py-10 animate-fadeIn">
                      <div className="w-24 h-24 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 relative shadow-inner">
                        <Smartphone size={40} className="animate-bounce" />
                        <span className="absolute top-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white text-[10px] shadow-sm">1</span>
                      </div>
                      <h3 className="font-black text-3xl text-slate-800 mb-3">Approve Payment</h3>
                      <p className="text-base font-medium text-slate-600 mb-2">A secure request of <strong className="text-slate-800">₹{total}</strong> was sent to</p>
                      <p className="text-lg font-black text-indigo-600 mb-8 bg-white border border-indigo-100 shadow-sm inline-block px-5 py-2 rounded-xl">{upiId}</p>
                      
                      <div className="bg-white p-8 rounded-[1.5rem] shadow-sm border border-slate-100 mb-8 max-w-sm mx-auto relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
                           <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${(timer / 300) * 100}%` }}></div>
                        </div>
                        <div className="text-5xl font-mono font-black text-slate-800 mb-2 mt-2 tracking-tight">
                          {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Session Expires</p>
                        <p className="text-sm text-slate-500 mt-5 leading-relaxed font-medium">Open your UPI application (GPay, PhonePe, Paytm) and authenticate with your secure PIN.</p>
                      </div>

                      <div className="border-t border-slate-200 pt-8">
                        <p className="text-[11px] font-black text-slate-400 mb-5 uppercase tracking-widest">Fallback QR Code</p>
                        <div className="bg-white p-2 rounded-xl shadow-sm inline-block border border-slate-100">
                          <QRCodeCanvas value={`upi://pay?pa=${upiId}&pn=H&P Solutions&am=${total}`} size={120} className="rounded-lg"/>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Ultra Premium Card Form */}
              {method === "card" && (
                <div className="mt-8 p-8 bg-slate-50/80 rounded-[1.5rem] border border-slate-200 animate-fadeIn">
                  
                  {/* Premium Flip Card UI */}
                  <div className="relative w-full max-w-[380px] h-[220px] mx-auto mb-10" style={{ perspective: '1000px' }}>
                    <div 
                      className="w-full h-full relative transition-transform duration-700 ease-in-out shadow-[0_20px_50px_rgba(15,23,42,0.3)] rounded-2xl" 
                      style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                    >
                      {/* Card Front */}
                      <div 
                        className="absolute w-full h-full bg-[#0A0D14] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] rounded-2xl text-white p-7 flex flex-col justify-between border border-white/10" 
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="w-14 h-10 bg-yellow-500/80 rounded-md overflow-hidden relative shadow-sm border border-yellow-300/30">
                            <div className="absolute top-0 left-0 w-full h-full grid grid-cols-2 gap-px p-px">
                              <div className="bg-yellow-300/20 rounded-tl-sm"></div><div className="bg-yellow-300/20 rounded-tr-sm"></div>
                              <div className="bg-yellow-300/20 rounded-bl-sm"></div><div className="bg-yellow-300/20 rounded-br-sm"></div>
                            </div>
                          </div>
                          <span className="font-black italic text-slate-300 tracking-wider text-xl">H&P<span className="text-blue-500 text-xs align-top">PLATINUM</span></span>
                        </div>
                        <div>
                          <p className="font-mono text-2xl tracking-[0.2em] text-slate-100 mb-3 drop-shadow-md">
                            {cardDetails.number || "•••• •••• •••• ••••"}
                          </p>
                          <div className="flex justify-between text-xs font-mono uppercase text-slate-400">
                            <div className="flex flex-col">
                              <span className="text-[9px] tracking-widest text-slate-500">Card Holder</span>
                              <span className="text-slate-100 font-bold truncate max-w-[180px] text-sm mt-0.5 tracking-wider">
                                {cardDetails.name || "YOUR NAME"}
                              </span>
                            </div>
                            <div className="flex flex-col text-right">
                              <span className="text-[9px] tracking-widest text-slate-500">Valid Thru</span>
                              <span className="text-slate-100 font-bold text-sm mt-0.5 tracking-wider">
                                {cardDetails.expiry || "MM/YY"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Back */}
                      <div 
                        className="absolute w-full h-full bg-[#0A0D14] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] rounded-2xl flex flex-col pt-8 border border-white/10" 
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <div className="w-full h-12 bg-black/90 mb-6"></div>
                        <div className="px-7">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 text-right">CVV Authorization</p>
                          <div className="w-full h-12 bg-white rounded-lg flex items-center justify-end px-4">
                            <span className="text-black font-mono font-black text-lg">{cardDetails.cvv || "•••"}</span>
                          </div>
                          <p className="text-[8px] text-slate-500 mt-5 leading-relaxed text-center font-medium">
                            This card is issued securely by H&P Solutions Auth Network. Found cards should be destroyed immediately.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* End Card UI */}

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Card Number</label>
                      <div className="relative group">
                        <CreditCard className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        <input 
                          type="text" 
                          value={cardDetails.number} 
                          onChange={handleCardNumberChange} 
                          placeholder="0000 0000 0000 0000" 
                          className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-base font-bold tracking-[0.1em] text-slate-800" 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Expiry Date</label>
                        <input 
                          type="text" 
                          value={cardDetails.expiry} 
                          onChange={handleExpiryChange} 
                          placeholder="MM/YY" 
                          className="w-full bg-white border border-slate-200 px-4 py-3.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-base font-bold tracking-widest text-center text-slate-800" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Security Code (CVV)</label>
                        <div className="relative group">
                          <Lock className="absolute right-4 top-3.5 text-slate-400" size={20} />
                          <input 
                            type="password" 
                            maxLength="3" 
                            value={cardDetails.cvv} 
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "") })} 
                            onFocus={() => setIsFlipped(true)}
                            onBlur={() => setIsFlipped(false)}
                            placeholder="•••" 
                            className="w-full bg-white border border-slate-200 pl-4 pr-12 py-3.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-base font-bold tracking-[0.2em] text-center text-slate-800" 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Cardholder Name</label>
                      <input 
                        type="text" 
                        value={cardDetails.name} 
                        onChange={handleCardNameChange} 
                        placeholder="e.g. JOHN DOE" 
                        className="w-full bg-white border border-slate-200 px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-base font-bold text-slate-800" 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Invoice / Summary */}
          <div className="lg:col-span-4">
            <div className="bg-slate-50 p-8 rounded-[2rem] shadow-md border border-slate-200 sticky top-28">
              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3 pb-4 border-b border-slate-200">
                <Receipt className="text-indigo-600" size={22} /> Digital Invoice
              </h2>
              
              <div className="space-y-4 max-h-[250px] overflow-y-auto mb-8 pr-2 custom-scrollbar">
                {cart.map((i) => (
                  <div key={i._id} className="flex justify-between items-start text-sm">
                    <span className="text-slate-600 font-bold leading-tight max-w-[70%]">{i.name}</span>
                    <span className="font-black text-slate-800">₹{i.price}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="mb-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                {!appliedCoupon ? (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <span className="text-[11px] font-black text-slate-500 uppercase flex items-center gap-1.5 tracking-widest">
                        <Tag size={14} /> Promotional Codes
                      </span>
                      <button onClick={() => setShowOffersModal(true)} className="text-[11px] font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest">
                        View Offers
                      </button>
                    </div>
                    {isFirstOrder && (
                      <p className="text-[10px] text-emerald-600 font-black mb-3 uppercase tracking-widest animate-pulse flex items-center gap-1"><CheckCircle size={12}/> First Order Bonus Eligible!</p>
                    )}
                    <div className="flex gap-2 w-full">
                      <input 
                        type="text" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="ENTER CODE" 
                        className="flex-1 min-w-0 px-4 py-2.5 text-sm font-bold rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-400 uppercase tracking-wider"
                      />
                      <button onClick={() => handleApplyCoupon()} className="shrink-0 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs tracking-widest uppercase font-black rounded-xl transition-all shadow-sm">
                        Apply
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                        <Check size={18} />
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-emerald-800 uppercase tracking-widest">'{appliedCoupon.code}' APPLIED</p>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">Saved ₹{discountAmount} on items!</p>
                      </div>
                    </div>
                    <button onClick={handleRemoveCoupon} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Remove Coupon">
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-4 pt-4 text-sm border-t-2 border-dashed border-slate-200">
                <div className="flex justify-between text-slate-500 font-bold">
                  <span>Gross Total</span><span>₹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-black animate-fadeIn">
                    <span>Discount</span><span>- ₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500 font-bold">
                  <span>Taxes (GST 18%)</span><span>₹{tax}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-bold">
                  <span>Logistics Charge</span>
                  <span className={delivery === 0 ? "text-emerald-500 font-black" : ""}>
                    {delivery === 0 ? "FREE" : `₹${delivery}`}
                  </span>
                </div>
                <div className="flex justify-between items-end pt-6 border-t-2 border-dashed border-slate-200 mt-4">
                  <div className="flex flex-col">
                     <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Net Payable</span>
                  </div>
                  <span className="text-3xl font-black text-slate-800 tracking-tight">₹{total}</span>
                </div>
              </div>

              <button
                disabled={loading}
                onClick={initiatePayment} 
                className="w-full mt-10 bg-blue-600 text-white py-4.5 rounded-xl font-black text-lg tracking-wide uppercase flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:hover:translate-y-0"
                style={{ padding: '1.1rem 0' }}
              >
                {loading ? "Processing..." : (
                  <>
                    {method === "upi" && upiState !== "waiting" ? "Verify UPI First" : "Authorize Payment"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Offers Modal */}
      {showOffersModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-slideUp">
            <div className="bg-slate-50 px-8 py-6 flex justify-between items-center border-b border-slate-100">
              <h3 className="text-slate-800 font-black text-xl flex items-center gap-2"><TicketPercent size={24} className="text-indigo-500" /> Live Promotions</h3>
              <button onClick={() => setShowOffersModal(false)} className="text-slate-400 hover:text-slate-700 transition-colors bg-white p-2 rounded-full shadow-sm border border-slate-100">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-8 space-y-5 max-h-[450px] overflow-y-auto bg-slate-50/50">
              {liveOffers.map((offer) => (
                <div key={offer.code} className="bg-white border-2 border-dashed border-indigo-200 rounded-2xl p-5 flex flex-col relative overflow-hidden group hover:border-indigo-400 transition-colors shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                       <p className="font-black text-slate-800 text-lg tracking-tight">{offer.title}</p>
                       <p className="text-xs text-slate-500 mt-1 font-bold">{offer.desc}</p>
                     </div>
                     <div className="inline-block px-3 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black tracking-widest rounded-lg border border-indigo-100">
                       {offer.applicableCategory || "ALL CATS"}
                     </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100">
                     <span className="font-mono text-lg font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">{offer.code}</span>
                     <button onClick={() => handleApplyCoupon(offer.code)} className="px-5 py-2 font-black text-xs text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors uppercase tracking-widest">
                       Apply Now
                     </button>
                  </div>
                </div>
              ))}
              {liveOffers.length === 0 && (
                <div className="text-center py-10">
                   <p className="text-slate-400 font-bold">No active promotional campaigns currently.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gateway Simulation Modal */}
      {showGateway && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0B0F19]/80 backdrop-blur-xl px-4">
          <div className="bg-[#151C2C] w-full max-w-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-fadeIn border border-white/10">
            <div className="bg-[#0A0D14] px-8 py-6 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-emerald-400" size={24} />
                <span className="font-black text-white text-lg">H&P SecureAuth</span>
              </div>
              <span className="font-black text-xl text-white">₹{total}</span>
            </div>

            <div className="p-10 text-center">
              {gatewayState === "loading" && (
                <div className="py-10">
                  <Loader2 className="w-14 h-14 text-blue-500 animate-spin mx-auto mb-6" />
                  <p className="font-black text-white text-xl">Initializing Secure Pipeline...</p>
                  <p className="text-sm text-slate-400 mt-2 font-medium">Do not close this window</p>
                </div>
              )}

              {gatewayState === "ready" && (
                <div className="py-4 animate-fadeIn">
                  <p className="font-bold text-slate-400 text-sm mb-6 uppercase tracking-widest">Select Simulation Path</p>
                  <div className="space-y-4">
                    <button onClick={() => simulatePayment('success')} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                      Simulate Approved Transaction
                    </button>
                    <button onClick={() => simulatePayment('failed')} className="w-full bg-transparent hover:bg-white/5 text-rose-400 border-2 border-rose-500/50 font-black py-4 rounded-xl transition-all">
                      Simulate Declined Transaction
                    </button>
                  </div>
                </div>
              )}

              {gatewayState === "processing" && (
                <div className="py-10 animate-pulse">
                  <Loader2 className="w-14 h-14 text-indigo-400 animate-spin mx-auto mb-6" />
                  <p className="font-black text-white text-xl">Authorizing Funds...</p>
                  <p className="text-sm text-slate-400 mt-2 font-medium">Communicating with banking node</p>
                </div>
              )}

              {gatewayState === "success" && (
                <div className="py-10 animate-slideUp">
                  <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                    <CheckCircle size={40} />
                  </div>
                  <p className="font-black text-2xl text-white">Authorization Success</p>
                  <p className="text-sm font-medium text-slate-400 mt-3">Routing payload to order system...</p>
                </div>
              )}

              {gatewayState === "failed" && (
                <div className="py-8 animate-slideUp">
                  <div className="w-20 h-20 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/30">
                    <XCircle size={40} />
                  </div>
                  <p className="font-black text-2xl text-white mb-2">Transaction Denied</p>
                  <p className="text-sm font-medium text-slate-400 mb-8 px-4">Gateway rejected the payload. Please verify funds or credentials.</p>
                  <button onClick={() => setGatewayState("ready")} className="w-full bg-white text-[#0B0F19] font-black py-4 rounded-xl transition-all hover:bg-slate-200">
                    Retry Connection
                  </button>
                </div>
              )}
            </div>

            {gatewayState === "ready" && (
               <div className="bg-[#0A0D14] px-6 py-4 border-t border-white/5 text-center">
                 <button onClick={() => setShowGateway(false)} className="text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                   Abort Session
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
    <div className="space-y-2 flex-1">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        {icon && <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors">{icon}</div>}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${label}`}
          className={`w-full bg-slate-50 border border-slate-200 ${icon ? 'pl-12' : 'px-5'} py-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-bold text-slate-800 placeholder-slate-400`}
        />
      </div>
    </div>
  );
}

function SelectInput({ icon, label, value, onChange, options, disabled, placeholder }) {
  return (
    <div className="space-y-2 flex-1">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        {icon && <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors z-10">{icon}</div>}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full bg-slate-50 border border-slate-200 ${icon ? 'pl-12' : 'px-5'} py-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-bold text-slate-800 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <option value="" disabled hidden>{placeholder}</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
           <ChevronDown size={18} />
        </div>
      </div>
    </div>
  );
}

function PaymentOption({ label, value, current, set, icon }) {
  const active = current === value;
  return (
    <div
      onClick={() => set(value)}
      className={`flex flex-col items-center justify-center p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300
      ${active ? "bg-blue-50 border-blue-500 text-blue-600 shadow-sm transform -translate-y-1" : "bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:bg-slate-50"}`}
    >
      <div className={`${active ? "text-blue-600 scale-110" : "text-slate-400"} mb-3 transition-transform duration-300`}>{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest text-center">{label}</span>
    </div>
  );
}