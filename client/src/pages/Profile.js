import { useState } from "react";
import { getUser } from "../utils/auth";
import api from "../utils/api"; 
import Toast from "../components/Toast";
import useToast from "../components/useToast";

import { 
  Save, 
  UserCircle, 
  Mail, 
  ShieldCheck, 
  BadgeCheck,
  CheckCircle2,
  Image as ImageIcon,
  UploadCloud
} from "lucide-react";

export default function Profile() {
  const user = getUser();
  const { toast, showToast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState(user?.image || "");
  const [imageError, setImageError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 🔥 10 Premium AI AVATAR OPTIONS
  const avatarSeeds = ["Felix", "Aneka", "Midnight", "Jack", "Luna", "Oliver", "Milo", "Leo", "Bella", "Zoe"];
  const avatars = avatarSeeds.map(seed => `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`);

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  // CLIENT-SIDE IMAGE COMPRESSION FOR PC UPLOAD
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 300; 
        const MAX_HEIGHT = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setImage(compressedBase64); 
        setImageError(false); 
      };
    };
  };

  // 🔥 STRICT DB SYNC ENGINE
  const saveProfile = async () => {
    setIsSaving(true);
    try {
      // 1. Force backend to update the database FIRST
      const res = await api.put("/auth/profile", { name, image });
      
      // 2. Extract the fresh data directly from Database response
      const updatedUserDB = res.data.user; 
      
      // 3. Update local storage with REAL database truth
      localStorage.setItem("user", JSON.stringify(updatedUserDB));
      
      showToast("Profile Updated Successfully! 🚀", "success");
      window.dispatchEvent(new Event('userProfileUpdated'));

    } catch (err) {
      console.error("🔥 DB SYNC ERROR:", err);
      showToast("Failed to update profile. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const roleColor = () => {
    const r = user?.role?.toLowerCase();
    if (r === 'superadmin') return 'bg-slate-900 text-amber-400 border-slate-700';
    if (r === 'admin') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (r === 'manager') return 'bg-purple-100 text-purple-700 border-purple-200';
    return 'bg-emerald-100 text-emerald-700 border-emerald-200'; 
  };

  return (
    <>
      <Toast message={toast.message} type={toast.type} />

      <div className="max-w-4xl mx-auto mt-10 px-4 pb-12 font-sans antialiased animate-fadeIn">

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300">
          
          <div className="h-40 sm:h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 relative">
            <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
          </div>

          <div className="px-6 sm:px-10 pb-10">
            
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-16 sm:-mt-20 mb-8 relative z-10">
              
              <div className="relative group w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white dark:bg-slate-800 p-1.5 shadow-xl border border-slate-100 dark:border-slate-700 mx-auto sm:mx-0 shrink-0">
                
                {image && !imageError ? (
                  <img
                    src={image}
                    className="w-full h-full rounded-full object-cover bg-slate-50 dark:bg-slate-800"
                    alt="profile"
                    onError={() => setImageError(true)} 
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-5xl font-black shadow-sm">
                    {initial}
                  </div>
                )}
                
                <input
                  type="file"
                  onChange={handleImage}
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-20 rounded-full"
                  title="Upload image from your computer"
                />
                
                <div className="absolute inset-1.5 rounded-full bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                  <UploadCloud className="text-white mb-1" size={24} />
                  <span className="text-white text-[10px] font-bold uppercase tracking-wider text-center px-2">Upload From PC</span>
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-1">
                  <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight capitalize">
                    {name}
                  </h2>
                  {user?.role && (
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border shadow-sm w-fit mx-auto sm:mx-0 flex items-center gap-1.5 ${roleColor()}`}>
                      <ShieldCheck size={14} /> {user.role}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                  <BadgeCheck size={16} className="text-blue-500" /> Professional Verified Account
                </p>
              </div>
            </div>

            <div className="mb-10 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 transition-all">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ImageIcon size={16} /> Choose an AI Avatar
              </h3>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                {avatars.map((url, i) => (
                  <div 
                    key={i} 
                    onClick={() => { setImage(url); setImageError(false); }}
                    className={`relative cursor-pointer rounded-full p-1 transition-all duration-300 hover:scale-110 ${image === url ? "ring-4 ring-blue-500 scale-110 shadow-lg" : "hover:bg-blue-100 dark:hover:bg-slate-700"}`}
                  >
                    <img src={url} alt={`avatar-${i}`} className="w-full h-full rounded-full bg-white dark:bg-slate-900 border dark:border-slate-700" />
                    {image === url && (
                      <CheckCircle2 size={16} className="absolute -top-1 -right-1 text-blue-500 bg-white dark:bg-slate-900 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-4 italic">* You can either select an AI avatar above or click the profile circle to upload from your PC.</p>
            </div>

            <div className="bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-700">
                <UserCircle size={20} className="text-indigo-600" /> Account Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative group">
                    <UserCircle size={18} className="absolute left-4 top-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 pl-11 pr-4 py-2.5 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-semibold text-slate-800 dark:text-white shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-3 text-slate-400" />
                    <input
                      value={user?.email || ""}
                      disabled
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 pl-11 pr-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-500 shadow-sm cursor-not-allowed opacity-80"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 ml-1 font-medium mt-1 italic">Email is verified and cannot be changed.</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={saveProfile}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={18} /> {isSaving ? "Saving to DB..." : "Save Changes"}
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}