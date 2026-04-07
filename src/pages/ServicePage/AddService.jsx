import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subCategory: '',
    pricingType: '',
    maxPrice: '',
    commissionType: '',
    commissionValue: '',
    discount: '',
    status: 'Active',
    description: '',
  });

  const [errors, setErrors] = useState({});


  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }, []);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://joker-hm0k.onrender.com/api/categories', {
          headers: getAuthHeaders()
        });
        if (res.data.success) setCategories(res.data.data || []);
      } catch (err) {
        console.error("Error fetching categories");
      }
    };
    fetchCategories();
  }, [getAuthHeaders]);


  useEffect(() => {
    const fetchSub = async () => {
      if (!formData.category) {
        setSubCategories([]);
        return;
      }
      try {

        const res = await axios.get(`https://joker-hm0k.onrender.com/api/subcategories?category_id=${formData.category}`, {
          headers: getAuthHeaders()
        });

        if (res.data.success) {

          setSubCategories(res.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching subcategories");
        setSubCategories([]);
      }
    };

    fetchSub();
  }, [formData.category, getAuthHeaders]);


  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await axios.get(`https://joker-hm0k.onrender.com/api/admin/services/${id}`, {
          headers: getAuthHeaders()
        });
        if (res.data.success) {
          const s = res.data.data;
          setFormData({
            name: s.name || '',
            category: s.category_id || '',
            subCategory: s.sub_category_id || '',
            commissionType: s.commission_type || '',
            commissionValue: s.commission_value || '',
            discount: s.discount || '',
            status: s.status || 'Active',
            description: s.description || '',
            pricingType: s.pricing?.[0]?.pricing_type || s.pricing?.[0]?.type || '',
            maxPrice: s.pricing?.[0]?.max_price || '',
          });
        }
      } catch (err) {
        toast.error("Failed to load service data");
      }
    };

    if (isEditMode) {
      fetchService();
    }
  }, [id, isEditMode, getAuthHeaders]);

  const labelClass = "block text-[11px] font-black text-[#102C57] mb-2 uppercase tracking-tight";
  const inputBaseClass = "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#102C57]/10 focus:border-[#102C57] outline-none text-xs transition-all bg-[#FEFAF6] placeholder:text-[#DAC0A3]/60";
  const errorTextClass = "text-[#E72929] text-[9px] mt-1 font-black text-right uppercase tracking-wider block w-full";

  const getFieldClass = (fieldName) => {
    const hasError = errors[fieldName];
    return `${inputBaseClass} ${hasError ? 'border-[#E72929] bg-[#FFF5F5]' : 'border-[#DAC0A3]'}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "SERVICE NAME IS REQUIRED";
    if (!formData.category) newErrors.category = "CATEGORY IS REQUIRED";
    if (!formData.subCategory) newErrors.subCategory = "SUB-CATEGORY IS REQUIRED";
    if (!formData.pricingType) newErrors.pricingType = "PRICING TYPE IS REQUIRED";
    if (!formData.maxPrice) newErrors.maxPrice = "PRICE IS REQUIRED";
    if (!formData.commissionType) newErrors.commissionType = "COMMISSION TYPE IS REQUIRED";
    if (!formData.commissionValue) newErrors.commissionValue = "COMMISSION VALUE IS REQUIRED";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      name: formData.name,
      category_id: parseInt(formData.category),
      sub_category_id: parseInt(formData.subCategory),
      commission_type: formData.commissionType,
      commission_value: formData.commissionValue,
      status: formData.status,
      description: formData.description,
      discount: formData.discount ? parseFloat(formData.discount) : 0,
      pricing: [{
        pricing_type: formData.pricingType,
        type: formData.pricingType,
        max_price: parseFloat(formData.maxPrice),
        enabled: 1
      }]
    };

    try {
      const url = isEditMode
        ? `https://joker-hm0k.onrender.com/api/admin/services/${id}`
        : `https://joker-hm0k.onrender.com/api/admin/services`;

      const response = await axios({
        method: isEditMode ? 'put' : 'post',
        url: url,
        data: payload,
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        toast.success(isEditMode ? "Service updated successfully!" : "Service added successfully!");
        navigate('/admin/service/list');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-[#FEFAF6] p-2 sm:p-4 pb-20">
      <div className="bg-white rounded-[2rem] shadow-sm border border-[#EADBC8] overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-[#EADBC8] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#102C57] rounded-2xl flex items-center justify-center shadow-lg shadow-[#102C57]/20">
              <span className="text-white text-xl font-black">S</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-[#102C57] uppercase tracking-tight">
                {isEditMode ? 'Edit Service' : 'Add New Service'}
              </h2>
              <p className="text-[#DAC0A3] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Management / Service Registry</p>
            </div>
          </div>
          <div className="flex bg-[#FEFAF6] rounded-xl p-1.5 border border-[#EADBC8] w-full md:w-auto">
            <button type="button" onClick={() => setFormData({ ...formData, status: 'Active' })}
              className={`flex-1 md:px-10 py-3 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${formData.status === 'Active' ? 'bg-[#102C57] text-white shadow-xl translate-y-[-1px]' : 'text-[#102C57]/40 hover:text-[#102C57]'}`}> Active </button>
            <button type="button" onClick={() => setFormData({ ...formData, status: 'Inactive' })}
              className={`flex-1 md:px-10 py-3 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${formData.status === 'Inactive' ? 'bg-[#102C57] text-white shadow-xl translate-y-[-1px]' : 'text-[#102C57]/40 hover:text-[#102C57]'}`}> Inactive </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-8 md:p-12 space-y-12">
          {/* Section 01: Info */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#EADBC8] to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-1.5">
                <label className={labelClass}>Service Name : <span className="text-red-500">*</span></label>
                <input type="text" name="name" className={getFieldClass('name')} value={formData.name} onChange={handleChange} placeholder="e.g. Premium House Cleaning" />
                {errors.name && <span className={errorTextClass}>{errors.name}</span>}
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Select Category : <span className="text-red-500">*</span></label>
                <select name="category" className={getFieldClass('category')} value={formData.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  {categories.map((cat) => <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>)}
                </select>
                {errors.category && <span className={errorTextClass}>{errors.category}</span>}
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Select Sub-Category : <span className="text-red-500">*</span></label>
                <select name="subCategory" className={getFieldClass('subCategory')} value={formData.subCategory} onChange={handleChange} disabled={!formData.category}>
                  <option value="">Select Sub-Category</option>
                  {subCategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
                {errors.subCategory && <span className={errorTextClass}>{errors.subCategory}</span>}
              </div>
            </div>
          </div>

          {/* Section 02: Pricing */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
           
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#EADBC8] to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-1.5">
                <label className={labelClass}>Pricing Type : <span className="text-red-500">*</span></label>
                <select name="pricingType" className={getFieldClass('pricingType')} value={formData.pricingType} onChange={handleChange}>
                  <option value="">Select Pricing Type</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Hourly">Hourly</option>
                  <option value="Per Unit">Per Unit</option>
                </select>
                {errors.pricingType && <span className={errorTextClass}>{errors.pricingType}</span>}
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Max Price : <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-[#DAC0A3] font-bold text-xs">$</span>
                  <input type="number" name="maxPrice" className={`${getFieldClass('maxPrice')} pl-8`} value={formData.maxPrice} onChange={handleChange} placeholder="0.00" />
                </div>
                {errors.maxPrice && <span className={errorTextClass}>{errors.maxPrice}</span>}
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Commission Type : <span className="text-red-500">*</span></label>
                <select name="commissionType" className={getFieldClass('commissionType')} value={formData.commissionType} onChange={handleChange}>
                  <option value="">Select Type</option>
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed">Fixed</option>
                </select>
                {errors.commissionType && <span className={errorTextClass}>{errors.commissionType}</span>}
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Commission Value : <span className="text-red-500">*</span></label>
                <input type="text" name="commissionValue" className={getFieldClass('commissionValue')} value={formData.commissionValue} onChange={handleChange} placeholder="0.00" />
                {errors.commissionValue && <span className={errorTextClass}>{errors.commissionValue}</span>}
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Discount Percent (%) :</label>
                <input type="text" name="discount" className={getFieldClass('discount')} value={formData.discount} onChange={handleChange} placeholder="e.g. 10" />
              </div>
            </div>
          </div>

          {/* Section 03: Description */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
             
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#EADBC8] to-transparent"></div>
            </div>
            <textarea name="description" rows="8" className={`${inputBaseClass} border-[#DAC0A3] resize-none h-48`} value={formData.description} onChange={handleChange} placeholder="Briefly describe..."></textarea>
          </div>

          <div className="mt-12 pt-10 border-t border-[#FEFAF6] flex flex-col sm:flex-row justify-end gap-4">
            <button type="button" onClick={() => navigate('/admin/service/list')} className="px-12 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#102C57] bg-[#FEFAF6] border border-[#EADBC8]">Cancel Process</button>
            <button type="submit" className="bg-[#102C57] text-[#DAC0A3] px-16 py-4 rounded-xl font-black text-[10px] shadow-2xl hover:bg-[#1a3d75] hover:text-white transition-all uppercase tracking-[0.3em]">Confirm & Save Service</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddService;