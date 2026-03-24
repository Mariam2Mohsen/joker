import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddSubCategory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    categoryId: 'Programming',
    description: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});

  const labelClass = "block text-[11px] font-black text-[#102C57] mb-2 uppercase tracking-tight";
  const inputBaseClass = "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#102C57]/10 focus:border-[#102C57] outline-none text-xs transition-all bg-[#FEFAF6] placeholder:text-[#DAC0A3]/60";
  const errorTextClass = "text-[#E72929] text-[9px] mt-1 font-black text-right uppercase tracking-wider block w-full";

  const getFieldClass = (fieldName) => {
    const hasError = errors[fieldName];
    return `${inputBaseClass} ${hasError ? 'border-[#E72929] bg-[#FFF5F5]' : 'border-[#DAC0A3]'}`;
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "SUB CATEGORY NAME IS REQUIRED";
    if (!formData.categoryId) newErrors.categoryId = "PARENT CATEGORY IS REQUIRED";
    if (!formData.description) newErrors.description = "DESCRIPTION IS REQUIRED";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // Handle form submission
    navigate('/admin/subcategory/list');
  };

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-[#FEFAF6] p-2 sm:p-4 pb-20">
      <div className="bg-white rounded-[2rem] shadow-sm border border-[#EADBC8] overflow-hidden">
        {/* Page Header Area */}
        <div className="p-8 border-b border-[#EADBC8] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#102C57] rounded-2xl flex items-center justify-center shadow-lg shadow-[#102C57]/20">
              <span className="text-white text-xl font-black">X</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-[#102C57] uppercase tracking-tight">Sub Category Details</h2>
              <p className="text-[#DAC0A3] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Management / Classification</p>
            </div>
          </div>

          <div className="flex bg-[#FEFAF6] rounded-xl p-1.5 border border-[#EADBC8] w-full md:w-auto">
            <button
              type="button"
              onClick={() => setFormData({...formData, isActive: true})}
              className={`flex-1 md:px-10 py-3 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${
                formData.isActive ? 'bg-[#102C57] text-white shadow-xl translate-y-[-1px]' : 'text-[#102C57]/40 hover:text-[#102C57]'
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, isActive: false})}
              className={`flex-1 md:px-10 py-3 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${
                !formData.isActive ? 'bg-[#102C57] text-white shadow-xl translate-y-[-1px]' : 'text-[#102C57]/40 hover:text-[#102C57]'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>

        {/* Content Area */}
        <form onSubmit={handleSubmit} noValidate className="p-8 md:p-12 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-[#FEFAF6] border border-[#EADBC8] flex items-center justify-center text-[10px] font-black text-[#102C57]">01</span>
                <h3 className="text-xs font-black text-[#102C57] uppercase tracking-[0.2em]">Sub Classification</h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#EADBC8] to-transparent"></div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className={labelClass}>Sub Category Name : <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. Mobile Apps" 
                    className={getFieldClass('name')}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  {errors.name && <span className={errorTextClass}>{errors.name}</span>}
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Select Parent Category : <span className="text-red-500">*</span></label>
                  <select 
                    className={getFieldClass('categoryId')}
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  >
                    <option value="">Select Parent</option>
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                  {errors.categoryId && <span className={errorTextClass}>{errors.categoryId}</span>}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-[#FEFAF6] border border-[#EADBC8] flex items-center justify-center text-[10px] font-black text-[#102C57]">02</span>
                <h3 className="text-xs font-black text-[#102C57] uppercase tracking-[0.2em]">Contextual Data</h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#EADBC8] to-transparent"></div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Description : <span className="text-red-500">*</span></label>
                <textarea 
                  rows="6" 
                  placeholder="Briefly describe this sub category..." 
                  className={`${getFieldClass('description')} resize-none h-44`}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
                {errors.description && <span className={errorTextClass}>{errors.description}</span>}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-12 pt-10 border-t border-[#FEFAF6] flex flex-col sm:flex-row justify-end gap-3">
             <button 
              type="button"
              onClick={() => navigate('/admin/subcategory/list')}
              className="px-12 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#102C57] bg-[#FEFAF6] border border-[#EADBC8] hover:bg-[#EADBC8]/20 transition-all flex items-center justify-center"
            >
              Cancel Process
            </button>
            <button type="submit" className="bg-[#102C57] text-[#DAC0A3] px-16 py-4 rounded-xl font-black text-[10px] shadow-2xl shadow-[#102C57]/30 hover:bg-[#1a3d75] hover:text-white transform active:scale-95 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-3">
              Confirm & Save Sub-Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubCategory;