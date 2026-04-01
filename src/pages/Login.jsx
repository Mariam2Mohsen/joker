import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaKey, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import Logo from '../assets/Logo.jpeg';

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
  
      const response = await axios.post('https://joker-hm0k.onrender.com/api/users/user_login', {
        Email: formData.email,
        Password: formData.password
      });

      
      const { user, token, success } = response.data;

      if (success) {
       
        if (user.role !== 1 && user.role !== 2) {
          setError('Access denied. Only admins can login here.');
          setLoading(false);
          return;
        }

        localStorage.setItem('token', token);
        localStorage.setItem('adminInfo', JSON.stringify(user));

        navigate('/admin');
      }
    } catch (err) {
      console.error("Login Error Details:", err.response?.data);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFAF6] flex items-center justify-center p-4 md:p-10 font-sans antialiased">
      <div className="w-full max-w-5xl bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(16,44,87,0.15)] flex flex-col md:flex-row overflow-hidden min-h-[600px] border border-[#EADBC8]/30">

        {/* Left Column: Welcome Section */}
        <div className="md:w-6/12 bg-[#102C57] p-10 md:p-16 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-12 tracking-tight">
            Welcome Back
          </h1>

          <div className="p-6 mb-12 transform hover:scale-105 transition-transform duration-500">
            <img
              src={Logo}
              alt="Logo"
              className="h-32 w-auto object-contain mx-auto rounded-3xl shadow-2xl"
            />
            <p className="mt-2 text-white/50 font-black uppercase text-[10px] tracking-[0.5em]">JoKeR System</p>
          </div>

          <p className="text-white/60 text-sm leading-relaxed max-w-xs font-medium tracking-wide">
            Login to access the secure administration dashboard.
          </p>
        </div>

        {/* Right Column: Form Section */}
        <div className="md:w-6/12 bg-white p-10 md:p-16 flex flex-col justify-center relative">
          
          <div className="flex items-center gap-6 mb-12">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#EADBC8]"></div>
            <h2 className="text-[11px] font-black text-[#102C57] uppercase tracking-[0.4em] whitespace-nowrap">Admin Authentication</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#EADBC8]"></div>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-[11px] font-black rounded-lg uppercase tracking-wider animate-bounce-short">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              {/* Email Field */}
              <div className="group relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#DAC0A3] group-focus-within:text-[#102C57] transition-all">
                  <FaEnvelope size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full bg-[#FEFAF6] border border-[#EADBC8] rounded-2xl py-5 pl-14 pr-4 text-xs font-bold outline-none transition-all focus:ring-4 focus:ring-[#102C57]/5 focus:border-[#102C57] text-[#102C57]"
                />
              </div>

              {/* Password Field */}
              <div className="group relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#DAC0A3] group-focus-within:text-[#102C57] transition-all">
                  <FaKey size={18} />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full bg-[#FEFAF6] border border-[#EADBC8] rounded-2xl py-5 pl-14 pr-4 text-xs font-bold outline-none transition-all focus:ring-4 focus:ring-[#102C57]/5 focus:border-[#102C57] text-[#102C57]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#102C57] text-[#EADBC8] rounded-2xl py-5 font-black text-[11px] shadow-2xl shadow-[#102C57]/30 flex items-center justify-center gap-3 group hover:bg-[#1a3d75] transition-all transform active:scale-[0.98] uppercase tracking-[0.3em] ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1'}`}
            >
              {loading ? 'Authenticating...' : 'Sign In To Dashboard'}
              {!loading && <FaArrowRight className="text-[10px] group-hover:translate-x-1.5 transition-transform" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;