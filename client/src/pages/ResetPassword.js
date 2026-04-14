import { useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import api from "../api/api";
import Toast from "../components/Toast";
import useToast from "../components/useToast";

export default function ResetPassword(){
  const {state} = useLocation();
  const nav = useNavigate();
  const {toast,showToast}=useToast();

  const email = state?.email;

  const [pw,setPw]=useState("");
  const [cpw,setCpw]=useState("");

  const submit = async(e)=>{
    e.preventDefault();

    if(pw !== cpw){
      showToast("Passwords do not match","error");
      return;
    }

    await api.post("/auth/reset-password-dob",{email,newPassword:pw});
    showToast("Password updated ✅","success");
    setTimeout(()=>nav("/login"),900);
  };

  return (
    <>
    <Toast message={toast.message} type={toast.type}/>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-10 rounded-2xl shadow-xl w-96 space-y-5">
        <h2 className="text-2xl font-bold text-center">Set New Password</h2>

        <input type="password" required placeholder="New password"
          value={pw} onChange={e=>setPw(e.target.value)}
          className="w-full border p-3 rounded-lg"/>

        <input type="password" required placeholder="Confirm password"
          value={cpw} onChange={e=>setCpw(e.target.value)}
          className="w-full border p-3 rounded-lg"/>

        <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold">
          Update Password
        </button>
      </form>
    </div>
    </>
  );
}
