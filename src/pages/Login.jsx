import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Logo from "../components/UI/Logo";
import { Input } from "../components/UI/Input";
import { useNotification } from "../hooks/useNotification";
import Button from "../components/UI/Button";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotification();

  const validateForm = () => {
    const newErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Invalid email format";
    if (!form.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/user_login",
        {
          Email: form.email,
          Password: form.password,
        },
      );

      const { token, user } = res.data; // تأكد أن الـ API بيرجع user مع role

      // تخزين البيانات في localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email: form.email,
          role: user?.Role || user?.role, // حفظ نوع المستخدم
          userId: user?.user_id || user?.id,
          fullName: user?.Full_Name || user?.fullName,
        }),
      );

      notifySuccess("Welcome Back!");

      // التوجيه حسب نوع المستخدم
      // بعد تسجيل الدخول وتخزين localStorage
      if (user?.role === 4) {
        navigate("/provider/services"); // توجيه الـ Provider للوحة التحكم
      } else {
        navigate("/dash"); // Customer أو أي دور آخر
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      if (err.response?.data?.message) notifyError(err.response.data.message);
      else notifyError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFAF6] flex items-center justify-center p-6 selection:bg-[#102C57]/10">
      <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[550px]">
        {/* Left Side */}
        <div className="bg-[#102C57] md:w-[50%] p-12 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-12 tracking-tight">
            Welcome Back
          </h1>
          <div className=" w-32 h-32 flex items-center justify-center rounded-sm shadow-xl mb-12">
            <Link
              to="/"
              className="inline-block hover:scale-105 transition-transform duration-500"
            >
              <Logo className="h-24 w-auto" />
            </Link>
          </div>
          <p className="text-[#FEFAF6]/90 text-sm font-medium leading-relaxed max-w-[240px] mx-auto">
            Login to access your personalized
            <br />
            home services dashboard.
          </p>
        </div>

        {/* Right Side */}
        <div className="bg-white flex-1 p-10 md:p-14 flex flex-col justify-center">
          <div className="mb-10 flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-[#EADBC8]"></div>
            <span className="text-xs font-black uppercase tracking-[0.4em] text-[#102C57]">
              User Login
            </span>
            <div className="h-[1px] w-12 bg-[#EADBC8]"></div>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5 max-w-sm mx-auto w-full"
          >
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full h-12 pl-12 pr-4 bg-white border ${errors.email ? "border-red-400" : "border-[#EADBC8]"} rounded-xl outline-none text-[#102C57] text-sm font-bold focus:border-[#102C57] transition-all placeholder:text-[#102C57]/30 placeholder:font-medium`}
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1 block pl-2">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`w-full h-12 pl-12 pr-4 bg-white border ${errors.password ? "border-red-400" : "border-[#EADBC8]"} rounded-xl outline-none text-[#102C57] text-sm font-bold focus:border-[#102C57] transition-all placeholder:text-[#102C57]/30 placeholder:font-medium`}
              />
              {errors.password && (
                <span className="text-red-500 text-xs mt-1 block pl-2">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#102C57] text-white rounded-xl font-black uppercase tracking-[0.3em] text-[11px] shadow-md hover:shadow-xl transition-all disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "LOGIN"
              )}
            </button>
          </form>

          {/* Signup Links */}
          <div className="mt-8 max-w-sm mx-auto w-full text-center">
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#102C57]/40 font-black mb-5">
              DON'T HAVE ACCOUNT?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/signup-customer"
                className="group py-3.5 rounded-3xl border border-[#EADBC8]/60 hover:border-[#DAC0A3] transition-all flex flex-col items-center justify-center bg-white hover:bg-[#DAC0A3]/50"
              >
                <span className="text-[9px] font-black text-[#102C57] uppercase tracking-widest mb-1.5">
                  CUSTOMER
                </span>
                <span className="text-[8px] font-black text-[#102C57] uppercase tracking-widest group-hover:text-blue-600 transition-colors">
                  Join Now →
                </span>
              </Link>
              <Link
                to="/signup-provider"
                className="group py-3.5 rounded-3xl border border-[#EADBC8]/60 hover:border-[#DAC0A3] transition-all flex flex-col items-center justify-center bg-white hover:bg-[#DAC0A3]/50"
              >
                <span className="text-[9px] font-black text-[#102C57] uppercase tracking-widest mb-1.5">
                  PROVIDER
                </span>
                <span className="text-[8px] font-black text-[#102C57] uppercase tracking-widest group-hover:text-blue-600 transition-colors">
                  Join Now →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
