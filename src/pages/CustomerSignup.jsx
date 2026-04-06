import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input } from '../components/UI/Input';
import { useNotification } from '../hooks/useNotification';
import Logo from '../components/UI/Logo';

const CustomerSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { notifySuccess, notifyError } = useNotification();

  const validateForm = () => {
    const newErrors = {};
    if (!form.firstName?.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName?.trim()) newErrors.lastName = "Last name is required";
    if (!form.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!form.password?.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
   if (!form.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (form.phone.length < 11) {
      newErrors.phone = "Phone number must be exactly 11 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await axios.post(
        "https://joker-hm0k.onrender.com/api/users/user_signup",
        {
          Full_Name: `${form.firstName} ${form.lastName}`,
          Email: form.email,
          Password: form.password,
          Role: "customer",
          Address: form.address || null,
          City: form.city || null,
          phone_number: form.phone,
        }
      );

      notifySuccess("Account created successfully!");
      setIsSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error(err.response?.data || err.message);

      if (err.response?.status === 409) {
        setErrors({ email: "Email already exists" });
        notifyError("Email already exists!");
      } else if (err.response?.data?.message) {
        notifyError(err.response.data.message);
      } else {
        notifyError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#FEFAF6] flex flex-col items-center py-12 px-4 relative overflow-hidden font-sans selection:bg-[#102C57] selection:text-white">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#EADBC8]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#EADBC8]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-0 relative w-full flex flex-col items-center">
          <Link to="/login" className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl text-[#102C57] hover:scale-110 transition-transform" title="Back to Login">
            ←
          </Link>
          <Link to="/" className="inline-block hover:scale-110 transition-transform cursor-pointer mb-2">
            <Logo className="h-14 w-auto drop-shadow-md" />
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-[#102C57] mt-2 mb-8">
            Customer Sign Up
          </h1>
        </div>

        {/* Form Container with Tabs Appearance */}
        <div className="w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(16,44,87,0.06)] overflow-hidden border border-[#EADBC8]/50">
          <div className="flex w-full border-b border-[#EADBC8]/20 h-14 bg-[#102C57]">
            <div className="flex-1 flex items-center justify-center font-black text-xs uppercase tracking-widest text-[#FEFAF6]">
              1. Customer Information
            </div>
          </div>

          <form onSubmit={handleSignUp} className="p-8 md:p-12 space-y-8">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="First Name" required placeholder="First Name" value={form.firstName || ''} error={errors.firstName} onChange={e => { setForm({ ...form, firstName: e.target.value }); if (errors.firstName) setErrors({ ...errors, firstName: null }) }} />
                <Input label="Last Name" required placeholder="Last Name" value={form.lastName || ''} error={errors.lastName} onChange={e => { setForm({ ...form, lastName: e.target.value }); if (errors.lastName) setErrors({ ...errors, lastName: null }) }} />
              </div>

              <div className="grid grid-cols-1 gap-6">
                <Input label="Email Address" type="email" required placeholder="Email Address" value={form.email || ''} error={errors.email} onChange={e => { setForm({ ...form, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: null }) }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Password" type="password" required placeholder="Password" value={form.password || ''} error={errors.password}onChange={e => { 
                  const val = e.target.value;
                  setForm({ ...form, password: val }); 

                
                  if (val.length > 0 && val.length < 6) {
                    setErrors(prev => ({ ...prev, password: "Password must be at least 6 characters" }));
                  } else {
                    setErrors(prev => ({ ...prev, password: null }));
                  }
                }} 
              />
                <Input label="Confirm Password" type="password" required placeholder="Confirm Password" value={form.confirmPassword || ''} error={errors.confirmPassword} onChange={e => { 
                    const val = e.target.value;
                    setForm({ ...form, confirmPassword: val }); 

                   
                    if (val !== form.password) {
                      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
                    } else {
                      setErrors(prev => ({ ...prev, confirmPassword: null }));
                    }
                  }} 
                />
              </div>

              <div className="pt-4">
                <h2 className="text-[#102C57] font-black uppercase text-[11px] tracking-[0.3em] border-b border-[#EADBC8]/40 pb-2 mb-6">
                  Contact Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Phone Number" 
                    required 
                    placeholder="Phone Number" 
                    value={form.phone || ''} 
                    error={errors.phone} 
                    onChange={e => { 
                      const val = e.target.value.replace(/\D/g, '');
                      
                      if (val.length <= 11) {
                        setForm({ ...form, phone: val }); 
                        if (errors.phone) setErrors({ ...errors, phone: null });
                        if (val.length > 0 && val.length < 11) {
                          setErrors(prev => ({ ...prev, phone: "Phone number must be 11 digits" }));
                        } else {
                          setErrors(prev => ({ ...prev, phone: null }));
                        }
                      }
                    }}
                  />
                  <Input label="City" placeholder="City" value={form.city || ''} error={errors.city} onChange={e => { setForm({ ...form, city: e.target.value }); if (errors.city) setErrors({ ...errors, city: null }) }} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <Input label="Full Address" placeholder="Address" value={form.address || ''} error={errors.address} onChange={e => { setForm({ ...form, address: e.target.value }); if (errors.address) setErrors({ ...errors, address: null }) }} />
              </div>

              <div className="flex justify-end pt-8">
                <button
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className="flex items-center justify-center min-w-[200px] bg-[#102C57] text-[#FEFAF6] px-12 py-4 font-black uppercase text-[11px] tracking-widest rounded-xl hover:shadow-[0_10px_20px_-10px_rgba(16,44,87,0.5)] transition-all disabled:opacity-70 group"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-[#FEFAF6] border-t-transparent rounded-full animate-spin"></div>
                  ) : isSuccess ? (
                    <span className="flex items-center gap-2 animate-pulse">Account Ready</span>
                  ) : (
                    <span className="flex items-center gap-2">Create Account <span className="group-hover:translate-x-1 transition-transform">→</span></span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-12 text-center text-[11px] font-black uppercase tracking-[0.3em] flex flex-col gap-5 items-center">
          <p className="text-[#102C57]/60">
            Already have an account?
            <Link to="/login" className="text-blue-600 hover:text-[#102C57] ml-2 transition-colors border-b-2 border-blue-600/20">Sign In</Link>
          </p>

          <div className="flex items-center gap-4 opacity-20">
            <div className="w-12 h-[1px] bg-[#102C57]"></div>
            <span className="text-[10px]">OR</span>
            <div className="w-12 h-[1px] bg-[#102C57]"></div>
          </div>

          <Link to="/signup-provider" className="text-[#102C57] hover:text-blue-600 transition-all flex items-center gap-2 group">
            Want to Sign Up as Provider? <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerSignup;