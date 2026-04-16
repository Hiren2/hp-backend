import { useEffect, useState } from "react";
import api from "../utils/api";
import GlobalLoader from "../components/GlobalLoader";
import EmptyState from "../components/EmptyState";
import Toast from "../components/Toast";
import useToast from "../components/useToast";

import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Image as ImageIcon,
  Tag,
  DollarSign,
  AlignLeft,
  Settings,
  Link as LinkIcon
} from "lucide-react";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const { toast, showToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  
  // 🔥 IMAGE FIX: Added imageUrl state for permanent links
  const [image, setImage] = useState(null); 
  const [imageUrl, setImageUrl] = useState(""); 
  
  const [category, setCategory] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
    imageUrl: "", // Fixed edit state for URL
    category: ""
  });

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const f = services.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(f);
  }, [search, services]);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data);
      setFiltered(res.data);
    } catch {
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD ================= */
  const addService = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);

      // 🔥 FIX: Backend ko URL bhej do directly agar diya hai, warna file
      if (imageUrl) {
          formData.append("image", imageUrl);
      } else if (image) {
          formData.append("image", image);
      }

      await api.post("/services", formData);

      setName("");
      setPrice("");
      setDescription("");
      setImage(null);
      setImageUrl("");
      setCategory("");
      setShowForm(false);

      fetchServices();
      showToast("Service added successfully ✅", "success");
    } catch {
      showToast("Failed to add service", "error");
    }
  };

  /* ================= EDIT ================= */
  const startEdit = (s) => {
    setEditingId(s._id);
    
    // Check if the existing image is a URL or a file path
    const isLink = s.image && s.image.startsWith("http") && !s.image.includes("localhost") && !s.image.includes("uploads");
    
    setEditData({
      name: s.name,
      price: s.price,
      description: s.description || "",
      image: null,
      imageUrl: isLink ? s.image : "", 
      category: s.category || ""
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    try {
      const formData = new FormData();

      formData.append("name", editData.name);
      formData.append("price", editData.price);
      formData.append("description", editData.description);
      formData.append("category", editData.category);

      if (editData.imageUrl) {
        formData.append("image", editData.imageUrl);
      } else if (editData.image) {
        formData.append("image", editData.image);
      }

      await api.put(`/services/${id}`, formData);

      setEditingId(null);
      fetchServices();
      showToast("Service updated ✨", "success");
    } catch {
      showToast("Update failed", "error");
    }
  };

  /* ================= DELETE ================= */
  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service? This action cannot be undone.")) return;

    try {
      await api.delete(`/services/${id}`);
      fetchServices();
      showToast("Service deleted 🗑️", "success");
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  if (loading) return <GlobalLoader text="Loading service catalog..." />;

  return (
    <>
      <Toast message={toast.message} type={toast.type} />

      <div className="max-w-7xl mx-auto mt-8 px-4 pb-12 space-y-6 font-sans antialiased animate-fadeIn">

        {/* 🔥 PREMIUM HERO HEADER */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white p-6 sm:p-8 rounded-[1.5rem] shadow-xl shadow-blue-500/20 overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3 tracking-tight">
              <span className="text-3xl drop-shadow-md">🛠️</span> Service Catalog
            </h1>
            <p className="text-indigo-100 mt-1.5 text-sm sm:text-base font-medium">
              Manage, edit, and deploy platform services efficiently.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="relative z-10 flex items-center gap-2 bg-white text-indigo-600 px-5 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {showForm ? (
              <><X size={18} /> Close Panel</>
            ) : (
              <><Plus size={18} /> Add New Service</>
            )}
          </button>
        </div>

        {/* 🔍 SEARCH BAR */}
        <div className="bg-white/80 backdrop-blur-xl p-4 rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100">
          <div className="relative w-full group">
            <Search size={18} className="absolute left-4 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              placeholder="Search services by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 pl-11 pr-4 py-2.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* 📝 ADD NEW SERVICE FORM */}
        {showForm && (
          <form onSubmit={addService} className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-[1.5rem] shadow-lg border border-slate-100 animate-fadeIn border-t-4 border-t-indigo-500">
            <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
              <Settings size={18} className="text-indigo-600" /> Create Service Profile
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 ml-1">Service Name</label>
                <div className="relative group">
                  <Tag size={16} className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input value={name} onChange={(e)=>setName(e.target.value)} required placeholder="e.g. Premium Consulting" className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"/>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 ml-1">Price (₹)</label>
                <div className="relative group">
                  <DollarSign size={16} className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  <input value={price} onChange={(e)=>setPrice(e.target.value)} type="number" required placeholder="0.00" className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm font-medium"/>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 ml-1">Category</label>
                <div className="relative group">
                  <AlignLeft size={16} className="absolute left-3.5 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input value={category} onChange={(e)=>setCategory(e.target.value)} required placeholder="e.g. IT, Maintenance" className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"/>
                </div>
              </div>

              {/* 🔥 IMAGE UPLOAD OR URL (THE FIX) */}
              <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <label className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 ml-1 flex justify-between">
                  <span>Cover Image</span>
                  <span className="text-slate-400">Best approach: Use Image Link</span>
                </label>
                
                <div className="flex flex-col gap-2 mt-1">
                  <div className="relative group">
                    <LinkIcon size={14} className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type="url" 
                      value={imageUrl} 
                      onChange={(e) => { setImageUrl(e.target.value); setImage(null); }} 
                      placeholder="Paste Image URL here (Recommended)" 
                      className="w-full bg-white border border-slate-200 pl-9 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-xs font-medium"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-[10px] font-bold text-slate-400">OR</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                  </div>

                  <div className="relative group">
                    <ImageIcon size={14} className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type="file" 
                      onChange={(e) => { setImage(e.target.files[0]); setImageUrl(""); }} 
                      className="w-full bg-white border border-slate-200 pl-9 pr-4 py-1.5 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-xs font-medium file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                    />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 ml-1">Description</label>
                <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Describe the service details..." rows="3" className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium resize-none"/>
              </div>

            </div>

            <div className="mt-6 flex justify-end">
              <button type="submit" className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all hover:-translate-y-0.5">
                <Check size={18} /> Deploy Service
              </button>
            </div>
          </form>
        )}

        {/* 📦 SERVICES GRID */}
        {filtered.length === 0 ? (
          <div className="pt-8">
            <EmptyState title="No services found" description="Adjust your search or add a new service to the catalog." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filtered.map((s) => (
              <div
                key={s._id}
                className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden group flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                
                {/* Image Section */}
                <div className="relative h-40 overflow-hidden bg-slate-100 p-2 pb-0">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-full object-cover rounded-t-xl group-hover:scale-105 transition duration-500"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=800&q=80" }}
                  />
                  {s.category && (
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                        {s.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  {editingId === s._id ? (
                    
                    /* 🔥 INLINE EDIT FORM */
                    <div className="flex flex-col gap-3 animate-fadeIn">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-1">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Editing Service</span>
                      </div>
                      <input value={editData.name} onChange={(e)=>setEditData({...editData, name:e.target.value})} placeholder="Name" className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                      <input value={editData.price} onChange={(e)=>setEditData({...editData, price:e.target.value})} placeholder="Price" type="number" className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                      <input value={editData.category} onChange={(e)=>setEditData({...editData, category:e.target.value})} placeholder="Category" className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                      
                      {/* Edit Image Field */}
                      <input 
                        type="url" 
                        value={editData.imageUrl} 
                        onChange={(e)=>setEditData({...editData, imageUrl:e.target.value, image:null})} 
                        placeholder="Paste Image URL" 
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none" 
                      />
                      <input type="file" onChange={(e)=>setEditData({...editData, image:e.target.files[0], imageUrl:""})} className="text-xs w-full file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:bg-indigo-50 file:text-indigo-600" />
                      
                      <textarea value={editData.description} onChange={(e)=>setEditData({...editData, description:e.target.value})} placeholder="Description" rows="2" className="w-full bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none" />
                      
                      <div className="flex gap-2 mt-2">
                        <button onClick={()=>saveEdit(s._id)} className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-500 text-white py-2 rounded-lg text-xs font-bold hover:bg-emerald-600 transition">
                          <Check size={14}/> Save
                        </button>
                        <button onClick={cancelEdit} className="flex-1 flex items-center justify-center gap-1.5 bg-slate-200 text-slate-700 py-2 rounded-lg text-xs font-bold hover:bg-slate-300 transition">
                          <X size={14}/> Cancel
                        </button>
                      </div>
                    </div>

                  ) : (
                    
                    /* 🔥 NORMAL VIEW */
                    <>
                      <div className="flex-1">
                        <h2 className="text-lg font-bold text-slate-800 line-clamp-1 mb-1">
                          {s.name}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
                          {s.description || "No description provided."}
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-bold text-indigo-600">₹</span>
                          <span className="text-xl font-extrabold text-slate-800 tracking-tight">{s.price}</span>
                        </div>

                        {/* Premium Icon Action Buttons */}
                        <div className="flex gap-2">
                          <button 
                            onClick={()=>startEdit(s)} 
                            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 hover:scale-105 transition-all"
                            title="Edit Service"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={()=>deleteService(s._id)} 
                            className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 hover:scale-105 transition-all"
                            title="Delete Service"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </>

                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  );
}