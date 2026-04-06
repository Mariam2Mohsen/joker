import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/UI/Input";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Logo from "../components/UI/Logo";
import AvailabilitySettings from "../components/Categories/AvailabilitySettings";
import { findUserByEmail, getLocalData, saveLocalData } from "../utils/storage";
import { USER_ROLES, STATUS } from "../utils/constants";
import { useNotification } from "../hooks/useNotification";
import axios from "axios";

const ProviderSignup = () => {
  const navigate = useNavigate();
  const { notifySuccess, notifyError } = useNotification();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [isAvailableGlobally, setIsAvailableGlobally] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
    serviceArea: "",
    profileImage: null,
    category: "",
    subCategory: "",
    service: "",
    price: "",
    priceType: "Hourly", // ✅ Changed from "hour" to "Hourly" (matches DB enum)
    description: "",
    availability: {
      Sun: { available: false, slots: [{ from: "09:00", to: "17:00" }] },
      Mon: { available: true, slots: [{ from: "09:00", to: "17:00" }] },
      Tue: { available: true, slots: [{ from: "09:00", to: "17:00" }] },
      Wed: { available: true, slots: [{ from: "09:00", to: "17:00" }] },
      Thu: { available: true, slots: [{ from: "09:00", to: "17:00" }] },
      Fri: { available: true, slots: [{ from: "09:00", to: "17:00" }] },
      Sat: { available: false, slots: [{ from: "09:00", to: "17:00" }] },
    },
    galleryImages: [],
  });
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [errors, setErrors] = useState({});

  // ✅ جلب Categories من الـ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://joker-hm0k.onrender.com/api/categories");
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // ✅ جلب Sub-Categories عند اختيار Category
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (formData.category) {
        try {
          const res = await axios.get(
            `https://joker-hm0k.onrender.com/api/subcategories?category_id=${formData.category}`,
          );
          if (res.data.success) {
            setSubCategories(res.data.data);
          }
        } catch (err) {
          console.error("Failed to fetch sub-categories:", err);
        }
      } else {
        setSubCategories([]);
      }
    };

    fetchSubCategories();
  }, [formData.category]);

  // ✅ جلب Services من الـ API وفلترتها حسب Sub-Category
  useEffect(() => {
    const fetchServices = async () => {
      if (formData.subCategory) {
        try {
          const res = await axios.get("https://joker-hm0k.onrender.com/api/services");
          if (res.data.success) {
            const filtered = res.data.data.filter(
              (s) =>
                s.sub_category_id?.toString() ===
                formData.subCategory.toString(),
            );
            setServices(filtered);
          }
        } catch (err) {
          console.error("Failed to fetch services:", err);
        }
      } else {
        setServices([]);
      }
    };

    fetchServices();
  }, [formData.subCategory]);

const handleChange = (e) => {
  const { name, value } = e.target;
  let finalValue = value;

 
  if (name === 'phone') {
    const onlyNums = value.replace(/\D/g, '');
    if (onlyNums.length <= 11) {
      finalValue = onlyNums;
     
      if (onlyNums.length > 0 && onlyNums.length < 11) {
        setErrors(prev => ({ ...prev, phone: "Phone number must be 11 digits" }));
      } else {
        setErrors(prev => ({ ...prev, phone: "" }));
      }
    } else {
      return; 
    }
  }

 
  if (name === 'password') {
    if (value.length > 0 && value.length < 6) {
      setErrors(prev => ({ ...prev, password: "Password must be at least 6 characters" }));
    } else {
      setErrors(prev => ({ ...prev, password: "" }));
    }
    
    if (formData.confirmPassword && value !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
  }

 
  if (name === 'confirmPassword') {
    if (value !== formData.password) {
      setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
  }

  setFormData((prev) => ({ ...prev, [name]: finalValue }));
  
};

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.phone) newErrors.phone = "Phone number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (formData.galleryImages.length + files.length > 5) {
      notifyError("You can upload a maximum of 5 gallery images.");
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    setFormData((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, ...files],
    }));
  };

  const removeGalleryImage = (index) => {
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
  };

  const triggerFileInput = () => {
    document.getElementById("profileImageInput").click();
  };

  const triggerGalleryInput = () => {
    document.getElementById("galleryInput").click();
  };

  const handleSignUp = async (isSkipping = false) => {
    if (!validateStep1()) return;

    if (
      !isSkipping &&
      (!formData.category || !formData.subCategory || !formData.service)
    ) {
      notifyError("Please select a category, sub-category, and service.");
      return;
    }

    setIsLoading(true);
    let uploadedFileName = "";

    // Upload Profile Image
    if (formData.profileImage) {
      setIsUploading(true);
      const formDataImage = new FormData();
      formDataImage.append("image", formData.profileImage);

      try {
        const uploadRes = await axios.post(
          "https://joker-hm0k.onrender.com/api/users/upload_image",
          formDataImage,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        if (uploadRes.data.success) {
          uploadedFileName = uploadRes.data.filename;
        } else {
          throw new Error(uploadRes.data.message || "Upload failed");
        }
      } catch (err) {
        console.error(err.response?.data || err.message);
        notifyError("Profile image upload failed.");
        setIsLoading(false);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    // Upload Gallery Images
    let galleryFileNames = [];
    if (formData.galleryImages.length > 0) {
      setIsUploading(true);
      try {
        for (const file of formData.galleryImages) {
          const galleryFormData = new FormData();
          galleryFormData.append("image", file);
          const uploadRes = await axios.post(
            "https://joker-hm0k.onrender.com/api/users/upload_image",
            galleryFormData,
            { headers: { "Content-Type": "multipart/form-data" } },
          );
          if (uploadRes.data.success) {
            galleryFileNames.push(uploadRes.data.filename);
          }
        }
      } catch (err) {
        console.error("Gallery upload failed", err);
        notifyError("Some gallery images failed to upload.");
      }
      setIsUploading(false);
    }

    try {
      // ✅ Prepare payload matching your backend structure
      // The backend expects prices array with pricing_type and price
      const pricingData =
        !isSkipping && formData.price
          ? [
              {
                pricing_type: formData.priceType, // Now sends "Hourly", "Fixed", or "Free"
                price:
                  formData.priceType === "Free"
                    ? 0
                    : parseFloat(formData.price),
              },
            ]
          : [];

      const payload = {
        Full_Name: `${formData.firstName} ${formData.lastName}`,
        Email: formData.email,
        Password: formData.password,
        Role: "provider",
        Address: formData.location || (isSkipping ? "Unknown Address" : ""),
        City: formData.serviceArea || (isSkipping ? "Unknown City" : ""),
        phone_number: formData.phone,
        profileImage: uploadedFileName,
        services: isSkipping
          ? []
          : [
              {
                service_id: parseInt(formData.service),
                description: formData.description,
                availability: formData.availability,
                serviceImage: uploadedFileName,
                galleryImages: galleryFileNames,
                prices: pricingData, // ✅ Will be stored in provider_service_prices table
              },
            ],
      };

      console.log("📤 Sending payload:", JSON.stringify(payload, null, 2));

      const res = await axios.post(
        "https://joker-hm0k.onrender.com/api/users/user_signup",
        payload,
      );

      if (res.data.success) {
        notifySuccess("Application submitted successfully!");
        setIsSuccess(true);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        throw new Error(res.data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      notifyError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFAF6] flex flex-col items-center py-12 px-4 relative overflow-hidden font-sans selection:bg-[#102C57] selection:text-white">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#EADBC8]/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#EADBC8]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-4xl relative z-10 flex flex-col items-center">
        <div className="text-center mb-0 relative w-full flex flex-col items-center">
          <Link
            to="/login"
            className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl text-[#102C57] hover:scale-110 transition-transform"
            title="Back to Login"
          >
            ←
          </Link>
          <Link
            to="/"
            className="inline-block hover:scale-110 transition-transform cursor-pointer mb-2"
          >
            <Logo className="h-14 w-auto drop-shadow-md" />
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-[#102C57] mt-2 mb-8">
            Provider Sign Up
          </h1>
        </div>

        <div className="w-full bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(16,44,87,0.06)] overflow-hidden border border-[#EADBC8]/50">
          <div className="flex w-full border-b border-[#EADBC8]/20 h-14">
            <button
              onClick={() => setStep(1)}
              className={`flex-1 flex items-center justify-center font-black text-xs uppercase tracking-widest transition-all duration-500
                  ${step === 1 ? "bg-[#102C57] text-[#FEFAF6]" : "bg-[#FEFAF6] text-[#102C57]/40 hover:text-[#102C57]"}`}
            >
              1. Basic Information
            </button>
            <button
              onClick={() =>
                step === 2 || validateStep1() ? setStep(2) : null
              }
              className={`flex-1 flex items-center justify-center font-black text-xs uppercase tracking-widest transition-all duration-500
                  ${step === 2 ? "bg-[#102C57] text-[#FEFAF6]" : "bg-[#FEFAF6] text-[#102C57]/40 hover:text-[#102C57]"}`}
            >
              2. Services Information
            </button>
          </div>

          <div className="p-8 md:p-12">
            {step === 1 ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    placeholder="First Name"
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    placeholder="Last Name"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="Email Address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="Password"
                  />
                  <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    placeholder="Confirm Password"
                  />
                </div>

                <div className="pt-4">
                  <h2 className="text-[#102C57] font-black uppercase text-[11px] tracking-[0.3em] border-b border-[#EADBC8]/40 pb-2 mb-6 text-center md:text-left">
                    Business Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Phone Number"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      placeholder="Phone Number"
                    />
                    <Input
                      label="Service Area"
                      name="serviceArea"
                      value={formData.serviceArea}
                      onChange={handleChange}
                      placeholder="City, Hub, District"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <Input
                    label="Physical Address"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Address"
                  />
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#102C57]">
                    Profile Image
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="profileImageInput"
                    />
                    <div
                      className="flex-1 h-12 px-4 bg-[#FEFAF6] border-2 border-[#EADBC8]/60 rounded-xl flex items-center text-[#102C57] text-sm font-medium truncate cursor-pointer"
                      onClick={triggerFileInput}
                    >
                      {formData.profileImage
                        ? formData.profileImage.name
                        : "Choose Image"}
                    </div>
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="h-12 px-8 bg-[#102C57] text-[#FEFAF6] text-[10px] font-black uppercase tracking-widest rounded-lg hover:shadow-lg transition-all"
                    >
                      Browse
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-8">
                  <button
                    onClick={() => validateStep1() && setStep(2)}
                    className="flex items-center gap-2 bg-[#102C57] text-[#FEFAF6] px-10 py-4 font-black uppercase text-[11px] tracking-widest rounded-xl hover:shadow-[0_10px_20px_-10px_rgba(16,44,87,0.5)] transition-all group"
                  >
                    Next Step{" "}
                    <span className="group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7 items-start">
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[10px] font-black tracking-widest text-[#102C57]">
                      Category <span className="text-red-500 text-sm">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full h-12 px-4 bg-white border border-[#EADBC8] rounded-xl outline-none text-[#102C57] text-sm font-medium focus:border-[#102C57] transition-all cursor-pointer appearance-none"
                      >
                        <option value="">Select Category</option>
                        {categories
                          .filter((c) => c.status === "active")
                          .map((cat) => (
                            <option
                              key={cat.category_id}
                              value={cat.category_id}
                            >
                              {cat.name}
                            </option>
                          ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#102C57]">
                        <svg
                          width="14"
                          height="8"
                          viewBox="0 0 14 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 1L7 7L13 1"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[10px] font-black tracking-widest text-[#102C57]">
                      Sub-category{" "}
                      <span className="text-red-500 text-sm">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleChange}
                        disabled={!formData.category}
                        className="w-full h-12 px-4 bg-white border border-[#EADBC8] rounded-xl outline-none text-[#102C57] text-sm font-medium focus:border-[#102C57] transition-all cursor-pointer disabled:opacity-50 disabled:bg-[#FEFAF6] appearance-none"
                      >
                        <option value="">Select Sub-category</option>
                        {subCategories
                          .filter(
                            (sc) =>
                              sc.category_id?.toString() ===
                                formData.category.toString() &&
                              sc.status === "active",
                          )
                          .map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name}
                            </option>
                          ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#102C57]">
                        <svg
                          width="14"
                          height="8"
                          viewBox="0 0 14 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 1L7 7L13 1"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[10px] font-black tracking-widest text-[#102C57]">
                      Service <span className="text-red-500 text-sm">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        disabled={!formData.subCategory}
                        className="w-full h-12 px-4 bg-white border border-[#EADBC8] rounded-xl outline-none text-[#102C57] text-sm font-medium focus:border-[#102C57] transition-all cursor-pointer disabled:opacity-50 disabled:bg-[#FEFAF6] appearance-none"
                      >
                        <option value="">Select Service</option>
                        {services.map((s) => (
                          <option key={s.service_id} value={s.service_id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#102C57]">
                        <svg
                          width="14"
                          height="8"
                          viewBox="0 0 14 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 1L7 7L13 1"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[10px] font-black tracking-widest text-[#102C57] uppercase">
                      PRICE <span className="text-red-500 text-sm">*</span>
                    </label>
                    <div className="flex gap-2 relative">
                      <input
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="E.g. 50"
                        type="number"
                        step="0.01"
                        className="flex-1 w-full h-12 px-4 bg-white border border-[#EADBC8] rounded-xl outline-none text-[#102C57] text-sm font-medium focus:border-[#102C57] transition-all placeholder:text-[#102C57]/30"
                      />
                      <div className="relative w-[120px] shrink-0">
                        <select
                          name="priceType"
                          value={formData.priceType}
                          onChange={handleChange}
                          className="w-full h-12 pl-4 pr-8 bg-[#FEFAF6] border border-[#EADBC8] rounded-xl outline-none text-[#102C57] text-[10px] font-black uppercase tracking-widest focus:border-[#102C57] transition-all cursor-pointer appearance-none"
                        >
                          <option value="Hourly">Per Hour</option>
                          <option value="Fixed">Fixed Price</option>
                          <option value="Free">Free</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#102C57]">
                          <svg
                            width="10"
                            height="6"
                            viewBox="0 0 14 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1 1L7 7L13 1"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2 flex flex-col">
                    <label className="text-[10px] font-black tracking-widest text-[#102C57] uppercase">
                      Service Description <span className="text-red-500 text-sm">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Provide a detailed description of your services, expertise, and what customers can expect..."
                      className="w-full min-h-[150px] p-6 bg-[#FEFAF6] border-2 border-[#EADBC8]/30 rounded-[2rem] outline-none text-[#102C57] text-sm font-medium focus:border-[#102C57] focus:ring-8 focus:ring-[#102C57]/5 transition-all resize-none shadow-inner placeholder:text-[#102C57]/20"
                    ></textarea>
                  </div>

                  <div className="md:col-span-2 space-y-6 pt-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-black uppercase tracking-[0.2em] text-[#102C57]">
                        Work Portfolio & Gallery
                      </label>
                      <span className="text-[9px] font-black text-[#DAC0A3] uppercase tracking-widest bg-[#FEFAF6] px-3 py-1 rounded-full border border-[#EADBC8]">
                        Max 5 Photos
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
                      {/* Upload Button */}
                      <div
                        onClick={triggerGalleryInput}
                        className="aspect-square bg-[#FEFAF6] border-2 border-dashed border-[#DAC0A3] rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-[#102C57] hover:bg-white transition-all transform hover:scale-105 active:scale-95 group shadow-sm"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-[#102C57]/5 flex items-center justify-center mb-3 group-hover:bg-[#102C57] group-hover:text-white transition-all">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#102C57]/40 group-hover:text-[#102C57]">
                          Add New
                        </span>
                        <input
                          id="galleryInput"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryChange}
                          className="hidden"
                        />
                      </div>

                      {/* Previews */}
                      {galleryPreviews.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-square rounded-[2rem] overflow-hidden group shadow-md border-4 border-white transform hover:-rotate-3 hover:scale-110 transition-all duration-300"
                        >
                          <img
                            src={url}
                            alt={`Gallery ${idx}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-[#102C57]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => removeGalleryImage(idx)}
                              className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-xl transform scale-50 group-hover:scale-100 transition-all duration-300"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <AvailabilitySettings
                    availability={formData.availability}
                    isAvailableGlobally={isAvailableGlobally}
                    onGlobalToggle={(val) => {
                      setIsAvailableGlobally(val);
                      if (!val) {
                        setFormData((prev) => ({
                          ...prev,
                          availability: Object.fromEntries(
                            Object.keys(prev.availability).map((d) => [
                              d,
                              { ...prev.availability[d], available: false },
                            ]),
                          ),
                        }));
                      }
                    }}
                    onChange={(day, data) =>
                      setFormData((prev) => ({
                        ...prev,
                        availability: { ...prev.availability, [day]: data },
                      }))
                    }
                  />
                </div>

                <div className="flex justify-center md:justify-end items-center gap-4 pt-6 border-t border-[#EADBC8]/30">
                  <button
                    onClick={() => handleSignUp(true)}
                    disabled={isLoading || isUploading}
                    className="px-8 py-3.5 bg-white border border-[#EADBC8] text-[#102C57] font-black uppercase text-[10px] tracking-widest rounded-[0.8rem] hover:border-[#102C57] transition-all font-sans"
                  >
                    SKIP FOR LATER
                  </button>
                  <button
                    onClick={() => handleSignUp(false)}
                    disabled={isLoading || isUploading}
                    className="flex items-center justify-center min-w-[200px] bg-[#102C57] text-white px-8 py-3.5 font-black uppercase text-[10px] tracking-widest rounded-[0.8rem] shadow-[0_4px_10px_rgba(16,44,87,0.2)] hover:shadow-[0_8px_20px_rgba(16,44,87,0.3)] transition-all disabled:opacity-70 font-sans"
                  >
                    {isUploading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : isSuccess ? (
                      "APPLICATION SUBMITTED!"
                    ) : (
                      "SUBMIT APPLICATION"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center text-[11px] font-black uppercase tracking-[0.3em] flex flex-col gap-5 items-center">
          <p className="text-[#102C57]/60">
            Already have an account?
            <Link
              to="/login"
              className="text-blue-600 hover:text-[#102C57] ml-2 transition-colors border-b-2 border-blue-600/20"
            >
              Sign In
            </Link>
          </p>

          <div className="flex items-center gap-4 opacity-20">
            <div className="w-12 h-[1px] bg-[#102C57]"></div>
            <span className="text-[10px]">OR</span>
            <div className="w-12 h-[1px] bg-[#102C57]"></div>
          </div>

          <Link
            to="/signup-customer"
            className="text-[#102C57] hover:text-blue-600 transition-all flex items-center gap-2 group"
          >
            Want to Sign Up as Customer?{" "}
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>

      <style>{`
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #DAC0A3; border-radius: 10px; }
        `}</style>
    </div>
  );
};

export default ProviderSignup;
