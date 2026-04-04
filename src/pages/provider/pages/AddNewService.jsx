import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TopHeader from "../../provider/components/TopHeader";
import Sidebar from "../../provider/components/Sidebar";
import AvailabilitySettings from "../../../components/Categories/AvailabilitySettings";
import { FaTrash, FaPlus, FaImage, FaMapMarkerAlt, FaToolbox, FaDollarSign, FaInfoCircle } from 'react-icons/fa';
import { Cpu, Zap, Activity, ShieldCheck, Layers, ArrowRight, ArrowUpRight, Plus, PlusCircle, Wrench, Layout } from 'lucide-react';
import toast from "react-hot-toast";

export const AddNewServicePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [isAvailableGlobally, setIsAvailableGlobally] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [form, setForm] = useState({
    category: "",
    subCategory: "",
    service: "",
    price: "",
    priceType: "Hourly",
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

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (form.category) {
        try {
          const res = await axios.get(`http://localhost:5000/api/subcategories?category_id=${form.category}`);
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
  }, [form.category]);

  useEffect(() => {
    const fetchServices = async () => {
      if (form.subCategory) {
        try {
          const res = await axios.get("http://localhost:5000/api/services");
          if (res.data.success) {
            const filtered = res.data.data.filter(s => s.sub_category_id?.toString() === form.subCategory.toString());
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
  }, [form.subCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (form.galleryImages.length + files.length > 5) {
      toast.error("Max 5 gallery images per operation protocol.");
      return;
    }
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews(prev => [...prev, ...newPreviews]);
    setForm(prev => ({ ...prev, galleryImages: [...prev.galleryImages, ...files] }));
  };

  const removeGalleryImage = (index) => {
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    setForm(prev => ({ ...prev, galleryImages: prev.galleryImages.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.subCategory || !form.service || (!form.price && form.priceType !== "Free") || !form.description) {
      toast.error("Required operational fields missing.");
      return;
    }

    setIsLoading(true);
    let galleryNames = [];

    try {
      setIsUploading(true);
      for (const file of form.galleryImages) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post("http://localhost:5000/api/users/upload_image", formData);
        if (res.data.success) galleryNames.push(res.data.filename);
      }
      setIsUploading(false);

      const selectedService = services.find(s => s.service_id.toString() === form.service.toString());

      const payload = {
        service_name: selectedService?.name || form.service,
        category_id: parseInt(form.category),
        sub_category_id: parseInt(form.subCategory),
        pricing_type: form.priceType,
        price: form.priceType === "Free" ? 0 : parseFloat(form.price),
        description: form.description,
        availability: isAvailableGlobally ? form.availability : null,
        images: galleryNames,
      };

      const res = await axios.post("http://localhost:5000/api/provider/services/service-requests", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast.success("Intelligence request registered. Operational queue sync initiated.");
        navigate("/dashboard/service-requests");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Operational integration protocol failure.");
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  const triggerGalleryInput = () => document.getElementById("galleryInput").click();

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#FEFAF6] font-sans selection:bg-[#102C57] selection:text-white">
      <TopHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-10 overflow-auto scroll-smooth relative">
          {/* Subtle Ambient Background Mesh */}
          <div className="absolute right-0 top-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,#EADBC8_0,transparent_15%)] opacity-30 pointer-events-none"></div>

          <div className="max-w-4xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 items-start space-y-12">
            
            {/* High-Fidelity Design Header */}
            <div className="p-12 bg-white rounded-[4rem] border border-[#EADBC8]/40 shadow-2xl relative overflow-hidden group/header transition-all duration-700 hover:shadow-black/5 text-center">
               <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(135deg,rgba(16,44,87,0.03)_0%,transparent_50%)] pointer-events-none"></div>
               <div className="relative z-10">
                  <div className="flex items-center justify-center gap-4 mb-6">
                     <div className="w-14 h-14 rounded-3xl bg-[#102C57] text-[#FEFAF6] flex items-center justify-center font-black shadow-2xl group-hover/header:rotate-[-12deg] transition-transform duration-700">
                        <PlusCircle size={28} />
                     </div>
                  </div>
                  <h1 className="text-5xl font-black text-[#102C57] tracking-tighter mb-4">Request New Intelligence</h1>
                  <div className="flex items-center justify-center gap-4">
                     <Activity size={14} className="text-[#DAC0A3] animate-pulse" />
                     <p className="text-[11px] font-black uppercase text-[#DAC0A3] tracking-[0.4em]">Operational Integration Flow 1.2</p>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[4.5rem] shadow-[0_30px_90px_-20px_rgba(16,44,87,0.08)] overflow-hidden border border-[#EADBC8]/50 group/form transition-all duration-1000 animate-in zoom-in-95 fade-in duration-1000 delay-300 relative">
              {/* Decorative Corner Glows */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#102C57]/5 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#DAC0A3]/5 blur-[80px] rounded-full pointer-events-none"></div>

              {/* Dynamic Progress Indicator */}
              <div className="flex w-full border-b border-[#EADBC8]/20 h-16 bg-[#FEFAF6]/50">
                <div className="flex-1 flex items-center justify-center font-black text-[11px] uppercase tracking-[0.4em] text-[#102C57] border-r border-[#EADBC8]/20 bg-white">
                  <Zap size={14} className="mr-3 text-[#DAC0A3]" /> Operational Parameters
                </div>
                <div className="flex-1 flex items-center justify-center font-black text-[11px] uppercase tracking-[0.4em] text-[#102C57]/30">
                  Integration Protocol
                </div>
              </div>

              <div className="p-10 md:p-16 space-y-12">
                <form onSubmit={handleSubmit} className="space-y-12">
                  
                  {/* Selection Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3 flex flex-col group/field">
                      <label className="text-[11px] font-black tracking-[0.3em] text-[#102C57]/40 uppercase ml-2 group-hover/field:text-[#102C57] transition-colors">Category Hub <span className="text-[#DAC0A3]">*</span></label>
                      <div className="relative">
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          className="w-full h-16 px-8 bg-[#FEFAF6] border-2 border-[#EADBC8]/40 rounded-3xl outline-none text-[#102C57] text-xs font-black focus:border-[#102C57] focus:ring-4 focus:ring-[#102C57]/5 transition-all cursor-alias appearance-none shadow-inner group-hover/field:border-[#DAC0A3]/50"
                        >
                          <option value="">Operational Category</option>
                          {categories.filter(c => c.status === "active").map(cat => (
                            <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                          ))}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#102C57]/30 group-hover/field:text-[#102C57] transition-colors"><Layers size={14} /></div>
                      </div>
                    </div>

                    <div className="space-y-3 flex flex-col group/field">
                      <label className="text-[11px] font-black tracking-[0.3em] text-[#102C57]/40 uppercase ml-2 group-hover/field:text-[#102C57] transition-colors">Sub-Node <span className="text-[#DAC0A3]">*</span></label>
                      <div className="relative">
                        <select
                          name="subCategory"
                          value={form.subCategory}
                          onChange={handleChange}
                          disabled={!form.category}
                          className="w-full h-16 px-8 bg-[#FEFAF6] border-2 border-[#EADBC8]/40 rounded-3xl outline-none text-[#102C57] text-xs font-black focus:border-[#102C57] transition-all cursor-alias disabled:opacity-30 appearance-none shadow-inner"
                        >
                          <option value="">Integration Sub-Node</option>
                          {subCategories.filter(sc => sc.status === "active").map(sub => (
                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                          ))}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#102C57]/30"><Layout size={14} /></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 flex flex-col group/field">
                    <label className="text-[11px] font-black tracking-[0.3em] text-[#102C57]/40 uppercase ml-2 group-hover/field:text-[#102C57] transition-colors">Service Protocol <span className="text-[#DAC0A3]">*</span></label>
                    <div className="relative">
                      <select
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        disabled={!form.subCategory}
                        className="w-full h-16 px-8 bg-[#FEFAF6] border-2 border-[#EADBC8]/40 rounded-[2rem] outline-none text-[#102C57] text-xs font-black focus:border-[#102C57] transition-all cursor-alias disabled:opacity-30 appearance-none shadow-inner"
                      >
                        <option value="">Operational Protocol</option>
                        {services.map(s => (
                          <option key={s.service_id} value={s.service_id}>{s.name}</option>
                        ))}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#102C57]/30"><Cpu size={14} /></div>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="space-y-4 flex flex-col group/price">
                    <label className="text-[11px] font-black tracking-[0.3em] text-[#102C57]/40 uppercase ml-2 group-hover/price:text-[#102C57] transition-colors">Revenue Intelligence Protocol <span className="text-[#DAC0A3]">*</span></label>
                    <div className="flex flex-col md:flex-row gap-6 relative">
                      <div className="flex-1 relative group/input">
                        <div className="absolute left-7 top-1/2 -translate-y-1/2 text-[#DAC0A3] group-focus-within/input:text-[#102C57] transition-colors"><FaDollarSign size={16} /></div>
                        <input
                          name="price"
                          value={form.price}
                          onChange={handleChange}
                          placeholder="Price L.E"
                          type="number"
                          disabled={form.priceType === "Free"}
                          className="w-full h-16 pl-14 pr-8 bg-[#FEFAF6] border-2 border-[#EADBC8]/40 rounded-[2.25rem] outline-none text-[#102C57] text-lg font-black focus:border-[#102C57] transition-all shadow-inner placeholder:text-[#102C57]/10"
                        />
                      </div>
                      <div className="relative w-full md:w-[260px] shrink-0">
                        <select
                          name="priceType"
                          value={form.priceType}
                          onChange={handleChange}
                          className="w-full h-16 pl-8 pr-12 bg-white border-2 border-[#EADBC8]/40 rounded-[2rem] outline-none text-[10px] font-black uppercase tracking-[0.3em] text-[#102C57] transition-all cursor-pointer appearance-none shadow-sm hover:border-[#102C57]"
                        >
                          <option value="Hourly">PER HOUR</option>
                          <option value="Fixed">FIXED PRICE</option>
                          <option value="Free">FREE HOST</option>
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#102C57]/40"><Zap size={14} /></div>
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="space-y-4 flex flex-col group/desc">
                    <label className="text-[11px] font-black tracking-[0.3em] text-[#102C57]/40 uppercase ml-2 group-hover/desc:text-[#102C57] transition-colors">Service Intelligence Parameters <span className="text-[#DAC0A3]">*</span></label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Detail your professional approach, years of expertise, and specific workflow for this operational node..."
                      className="w-full min-h-[180px] p-10 bg-[#FEFAF6] border-2 border-[#EADBC8]/40 rounded-[3rem] outline-none text-[#102C57] text-sm font-medium focus:border-[#102C57] focus:shadow-2xl transition-all resize-none shadow-inner placeholder:text-[#102C57]/10"
                    ></textarea>
                  </div>

                  {/* Portfolio Gallery Section */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between ml-2">
                       <label className="text-[11px] font-black uppercase tracking-[0.3em] text-[#102C57]/40">Work Portfolio Visual Intelligence</label>
                       <div className="flex items-center gap-3 bg-[#FEFAF6] px-5 py-2 rounded-full border border-[#EADBC8]/30 shadow-sm animate-pulse">
                          <Activity size={10} className="text-[#DAC0A3]" />
                          <span className="text-[9px] font-black text-[#DAC0A3] uppercase tracking-widest leading-none mt-0.5">Asset Limit: 05 / 05</span>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                      <div 
                        onClick={triggerGalleryInput}
                        className="aspect-square bg-[#FEFAF6] border-2 border-dashed border-[#DAC0A3]/50 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-[#102C57] hover:bg-white transition-all transform hover:scale-105 active:scale-95 group shadow-inner relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-[#102C57]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-12 h-12 rounded-[1.25rem] bg-white border border-[#EADBC8]/30 flex items-center justify-center mb-3 group-hover:bg-[#102C57] group-hover:text-white transition-all duration-700 text-[#DAC0A3] shadow-md group-hover:rotate-12">
                          <Plus size={20} />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#102C57]/30 group-hover:text-[#102C57]">Sync Asset</span>
                        <input id="galleryInput" type="file" multiple onChange={handleGalleryChange} className="hidden" accept="image/*" />
                      </div>

                      {galleryPreviews.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-[2.5rem] overflow-hidden group shadow-xl border-4 border-white transform hover:-rotate-3 hover:scale-110 transition-all duration-500">
                          <img src={url} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                          <div className="absolute inset-0 bg-[#102C57]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <button 
                              type="button" 
                              onClick={() => removeGalleryImage(idx)} 
                              className="w-11 h-11 rounded-[1.25rem] bg-red-500 text-white flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-all duration-700 hover:rotate-90"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Availability Settings Integration */}
                  <div className="pt-6">
                    <div className="p-8 bg-[#FEFAF6] rounded-[3.5rem] border border-[#EADBC8]/40 shadow-inner group/avail relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-[#102C57]/5 rounded-full blur-[80px] group-hover/avail:bg-[#102C57]/10 transition-all duration-1000"></div>
                       <AvailabilitySettings 
                        availability={form.availability}
                        isAvailableGlobally={isAvailableGlobally}
                        onGlobalToggle={setIsAvailableGlobally}
                        onChange={(day, data) => setForm(p => ({ ...p, availability: { ...p.availability, [day]: data } }))}
                      />
                    </div>
                  </div>

                  {/* Integration Execute Intelligence */}
                  <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-10 border-t border-[#EADBC8]/20 bg-[#FEFAF6]/50 p-10 rounded-[3.5rem]">
                    <div className="flex items-center gap-6 group/footerInfo">
                       <div className="w-16 h-16 bg-white rounded-[1.75rem] flex items-center justify-center text-[#102C57] border border-[#EADBC8]/40 shadow-xl transition-all group-hover/footerInfo:scale-110 group-hover/footerInfo:rotate-[-12deg]"><ShieldCheck size={28} /></div>
                       <div>
                          <p className="text-[12px] font-black uppercase tracking-[0.4em] text-[#102C57] mb-1 leading-none">Security Protocol: Active</p>
                          <p className="text-[9px] font-black text-[#DAC0A3] uppercase tracking-[0.3em] opacity-80 leading-none mt-2 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                             Final Verification Encryption: OK
                          </p>
                       </div>
                    </div>
                    <button 
                      type="submit" 
                      disabled={isLoading || isUploading}
                      className="w-full md:w-[320px] h-18 bg-[#102C57] text-[#FEFAF6] py-8 rounded-[2rem] flex items-center justify-center gap-5 text-sm font-black uppercase tracking-[0.3em] shadow-2xl hover:shadow-[0_20px_50px_-15px_rgba(16,44,87,0.4)] transition-all transform active:scale-90 disabled:opacity-30 group/submit relative overflow-hidden h-16"
                    >
                      <div className="absolute inset-0 bg-[#DAC0A3]/20 translate-x-[-100%] group-hover/submit:translate-x-0 transition-transform duration-1000"></div>
                      <span className="relative z-10">{isLoading ? "INTEGRATING..." : "EXECUTE"}</span>
                      <ArrowUpRight size={20} className="relative z-10 group-hover/submit:rotate-45 transition-transform duration-500" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};