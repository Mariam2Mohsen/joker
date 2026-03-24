import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

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

  // Error styling
  const errorTextClass = "text-[#E72929] text-[9px] mt-1 font-black text-right uppercase tracking-wider block w-full";
  const labelClass = "block text-[11px] font-black text-[#102C57] mb-2 uppercase tracking-tight";
  const inputBaseClass = "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#102C57]/10 focus:border-[#102C57] outline-none text-xs transition-all bg-[#FEFAF6] placeholder:text-[#DAC0A3]/60";

  const getFieldClass = (fieldName) => {
    const hasError = errors[fieldName];
    return `${inputBaseClass} ${hasError ? 'border-[#E72929] bg-[#FFF5F5]' : 'border-[#DAC0A3]'}`;
  };

  // Load data for edit mode
  useEffect(() => {
    if (isEditMode) {
      const saved = localStorage.getItem('admin_services');
      if (saved) {
        const services = JSON.parse(saved);
        const serviceToEdit = services.find(s => s.id === parseInt(id));
        if (serviceToEdit) {
          setFormData({
            ...serviceToEdit,
            name: serviceToEdit.name || '',
          });
        }
      }
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fill all required fields");
      return;
    }

    const saved = localStorage.getItem('admin_services');
    let services = saved ? JSON.parse(saved) : [];

    if (isEditMode) {
      services = services.map(s => s.id === parseInt(id) ? { ...formData, id: parseInt(id) } : s);
      toast.success("Service updated successfully");
    } else {
      const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
      services.push({ ...formData, id: newId });
      toast.success("Service added successfully");
    }

    localStorage.setItem('admin_services', JSON.stringify(services));
    navigate('/admin/service/list');
  };

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-[#FEFAF6] p-2 sm:p-4 pb-20">
      <div className="bg-white rounded-[2rem] shadow-sm border border-[#EADBC8] overflow-hidden">
        {/* Page Header Area */}
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
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: 'Active' })}
              className={`flex-1 md:px-10 py-3 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${
                formData.status === 'Active' ? 'bg-[#102C57] text-white shadow-xl translate-y-[-1px]' : 'text-[#102C57]/40 hover:text-[#102C57]'
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, status: 'Inactive' })}
              className={`flex-1 md:px-10 py-3 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${
                formData.status === 'Inactive' ? 'bg-[#102C57] text-white shadow-xl translate-y-[-1px]' : 'text-[#102C57]/40 hover:text-[#102C57]'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        {/* Content Area */}
        <form onSubmit={handleSubmit} noValidate className="p-8 md:p-12 space-y-12">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-[#FEFAF6] border border-[#EADBC8] flex items-center justify-center text-[10px] font-black text-[#102C57]">01</span>
              <h3 className="text-xs font-black text-[#102C57] uppercase tracking-[0.2em]">Service Information</h3>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#EADBC8] to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-1.5">
                <label className={labelClass}>Service Name : <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Premium House Cleaning"
                  className={getFieldClass('name')}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span className={errorTextClass}>{errors.name}</span>}
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Select Category : <span className="text-red-500">*</span></label>
                <select
                  name="category"
                  className={getFieldClass('category')}
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Installation">Installation</option>
                  <option value="Renovation">Renovation</option>
                  <option value="Programing">Programing</option>
                  <option value="Home Services">Home Services</option>
                </select>
                {errors.category && <span className={errorTextClass}>{errors.category}</span>}
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Select Sub-Category : <span className="text-red-500">*</span></label>
                <select
                  name="subCategory"
                  className={getFieldClass('subCategory')}
                  value={formData.subCategory}
                  onChange={handleChange}
                >
                  <option value="">Select Sub-Category</option>
                  <option value="General">General</option>
                  <option value="Deep Clean">Deep Clean</option>
                  <option value="Repair">Repair</option>
                  <option value="Custom">Custom</option>
                </select>
                {errors.subCategory && <span className={errorTextClass}>{errors.subCategory}</span>}
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Sub-Title :</label>
                <input type="text" placeholder="Service Subtitle" className={inputBaseClass} />
              </div>
              
              <div className="space-y-1.5 col-span-1 md:col-span-2">
                <label className={labelClass}>Search Keywords (Tags) :</label>
                <input type="text" placeholder="e.g. fast, reliable, clean, safe" className={inputBaseClass} />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Commission */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-[#FEFAF6] border border-[#EADBC8] flex items-center justify-center text-[10px] font-black text-[#102C57]">02</span>
              <h3 className="text-xs font-black text-[#102C57] uppercase tracking-[0.2em]">Pricing & Revenue</h3>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#EADBC8] to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-1.5">
                <label className={labelClass}>Pricing Type : <span className="text-red-500">*</span></label>
                <select
                  name="pricingType"
                  className={getFieldClass('pricingType')}
                  value={formData.pricingType}
                  onChange={handleChange}
                >
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
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="0.00"
                    className={`${getFieldClass('maxPrice')} pl-8`}
                    value={formData.maxPrice}
                    onChange={handleChange}
                  />
                </div>
                {errors.maxPrice && <span className={errorTextClass}>{errors.maxPrice}</span>}
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Discount Percent (%) :</label>
                <input
                  type="text"
                  name="discount"
                  placeholder="e.g. 10"
                  className={getFieldClass('discount')}
                  value={formData.discount}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Commission Type : <span className="text-red-500">*</span></label>
                <select
                  name="commissionType"
                  className={getFieldClass('commissionType')}
                  value={formData.commissionType}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Value">Value</option>
                </select>
                {errors.commissionType && <span className={errorTextClass}>{errors.commissionType}</span>}
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Commission Value : <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="commissionValue"
                  placeholder="Commission Amount"
                  className={getFieldClass('commissionValue')}
                  value={formData.commissionValue}
                  onChange={handleChange}
                />
                {errors.commissionValue && <span className={errorTextClass}>{errors.commissionValue}</span>}
              </div>
            </div>
          </div>

          {/* Section 3: Description */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-[#FEFAF6] border border-[#EADBC8] flex items-center justify-center text-[10px] font-black text-[#102C57]">03</span>
              <h3 className="text-xs font-black text-[#102C57] uppercase tracking-[0.2em]">Service Description</h3>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#EADBC8] to-transparent"></div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Detailed Description :</label>
              <textarea
                name="description"
                rows="8"
                placeholder="Briefly describe the service, its benefits, and what it covers..."
                className={`${inputBaseClass} border-[#DAC0A3] resize-none h-48 focus:ring-[#102C57]/5`}
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-12 pt-10 border-t border-[#FEFAF6] flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/service/list')}
              className="px-12 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#102C57] bg-[#FEFAF6] border border-[#EADBC8] hover:bg-[#EADBC8]/20 transition-all flex items-center justify-center gap-2"
            >
              Cancel Process
            </button>
            <button
              type="submit"
              className="bg-[#102C57] text-[#DAC0A3] px-16 py-4 rounded-xl font-black text-[10px] shadow-2xl shadow-[#102C57]/30 hover:bg-[#1a3d75] hover:text-white transform active:scale-95 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-3"
            >
               Confirm & Save Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddService;
