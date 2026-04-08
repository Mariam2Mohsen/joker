import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
    status: 'Active',
    sort_order: 0      
  });
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchCategory = async () => {
        try {
          const response = await axios.get(`https://joker-hm0k.onrender.com/api/categories/${id}`);
          if (response.data.success) {
            const cat = response.data.data;
            setFormData({
              name: cat.name,
              description: cat.description,
              image: cat.image,
             status: cat.status|| 'Active',
              sort_order: cat.sort_order || 0
            });
         
          }
        } catch (error) {
          toast.error("Error fetching category data");
          navigate('/admin/category/list');
        }
      };
      fetchCategory();
    }
  }, [id, isEditMode, navigate]);

  const labelClass = "block text-[11px] font-black text-[#102C57] mb-2 uppercase tracking-tight";
  const inputBaseClass = "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#102C57]/10 focus:border-[#102C57] outline-none text-xs transition-all bg-[#FEFAF6] placeholder:text-[#DAC0A3]/60";
  const errorTextClass = "text-[#E72929] text-[9px] mt-1 font-black text-right uppercase tracking-wider block w-full";

  const getFieldClass = (fieldName) => {
    const hasError = errors[fieldName];
    return `${inputBaseClass} ${hasError ? 'border-[#E72929] bg-[#FFF5F5]' : 'border-[#DAC0A3]'}`;
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "CATEGORY NAME IS REQUIRED";
    if (!formData.description) newErrors.description = "DESCRIPTION IS REQUIRED";
    if (!isEditMode && !imageFile) newErrors.image = "CATEGORY IMAGE IS REQUIRED";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('status', formData.status);
   data.append('color','#102C57');
    data.append('sort_order', formData.sort_order);

    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      const token = localStorage.getItem('token');
      const url = isEditMode
        ? `https://joker-hm0k.onrender.com/api/categories/${id}`
        : `https://joker-hm0k.onrender.com/api/categories`;

      const method = isEditMode ? 'put' : 'post';

      const response = await axios({
        method: method,
        url: url,
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success(isEditMode ? "Category updated!" : "Category saved!");
        navigate('/admin/category/list');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
const MAX_DESCRIPTION = 400;
  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-[#FEFAF6] p-2 sm:p-4 pb-20">
      <div className="bg-white rounded-[2rem] shadow-sm border border-[#EADBC8] overflow-hidden">
        {/* Page Header Area */}
        <div className="p-8 border-b border-[#EADBC8] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white">
          <div className="items-center flex gap-4">
            <div className="w-12 h-12 bg-[#102C57] rounded-2xl flex items-center justify-center shadow-lg shadow-[#102C57]/20">
              <span className="text-white text-xl font-black">{isEditMode ? 'E' : 'C'}</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-[#102C57] uppercase tracking-tight">
                {isEditMode ? 'Edit Category' : 'Category Details'}
              </h2>
              <p className="text-[#DAC0A3] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Management / Classification</p>
            </div>
          </div>
            {/* Activ & Inactive toggle */}
        <div className="flex bg-[#FEFAF6] rounded-xl p-1.5 w-full md:w-auto shadow-inner ">
        
          <button
            type="button"
            onClick={() => setFormData({ ...formData, status: 'Active' })} 
            className={`flex-1 md:px-10 py-3 text-[10px] font-black rounded-lg transition-all duration-300 uppercase tracking-widest ${
              formData.status?.toLowerCase() === 'active'
                ? 'bg-green-500 text-white shadow-lg shadow-green-200 translate-y-[-1px]'
                : 'text-slate-400 hover:text-green-600 hover:bg-green-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {formData.status?.toLowerCase() === 'active' && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
              Active
            </div>
          </button>

       
          <button
            type="button"
            onClick={() => setFormData({ ...formData, status: 'Inactive' })} 
            className={`flex-1 md:px-10 py-3 text-[10px] font-black rounded-lg transition-all duration-300 uppercase tracking-widest ${
              formData.status?.toLowerCase() === 'inactive' 
                ? 'bg-slate-500 text-white shadow-lg shadow-slate-200 translate-y-[-1px]'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            Inactive
          </button>
        </div>
        </div>

        {/* Content Area */}
        <form onSubmit={handleSubmit} noValidate className="p-8 md:p-12 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#EADBC8] to-transparent"></div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className={labelClass}>Category Name : <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. Programming"
                    className={getFieldClass('name')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {errors.name && <span className={errorTextClass}>{errors.name}</span>}
                </div>

               
          
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className={labelClass}>Description : <span className="text-red-500">*</span></label>
                 
                  <span className={`text-[9px] font-black uppercase tracking-widest ${
                    formData.description?.length >= MAX_DESCRIPTION ? 'text-red-500' : 'text-[#DAC0A3]'
                  }`}>
                    {formData.description?.length || 0} / {MAX_DESCRIPTION}
                  </span>
                </div>

                <textarea
                  maxLength={MAX_DESCRIPTION} 
                  rows="6"
                  placeholder="Briefly describe this category..."
                  className={`${getFieldClass('description')} resize-none h-44`}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
                
                {errors.description && <span className={errorTextClass}>{errors.description}</span>}
                
                
                {formData.description?.length === MAX_DESCRIPTION && (
                  <span className="text-[#E72929] text-[8px] font-black uppercase mt-1 block">
                    Maximum limit reached!
                  </span>
                )}
              </div>
                  <div className="grid grid-cols-2 gap-4">
               
                  <div className="space-y-1.5">
                    <label className={labelClass}>Sort Order :</label>
                    <input
                      type="number"
                      placeholder="0"
                      className={getFieldClass('sort_order')}
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-[#EADBC8] to-transparent"></div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className={labelClass}>Category Image : <span className="text-red-500">*</span></label>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder={isEditMode ? "Keep current or change" : "No file chosen"}
                      className={`${getFieldClass('image')} rounded-r-none border-r-0`}
                      value={imageFile ? imageFile.name : (formData.image || "")}
                      readOnly
                    />
                    <label className="bg-[#102C57] text-white px-8 py-3 rounded-r-xl text-[10px] font-black uppercase cursor-pointer hover:bg-[#1a3d75] transition-colors flex items-center tracking-widest border border-l-0 border-[#102C57]">
                      Browse
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) setImageFile(file);
                        }}
                      />
                    </label>
                  </div>
                  {errors.image && <span className={errorTextClass}>{errors.image}</span>}

                  <div className="mt-6 p-1 border-2 border-dashed border-[#DAC0A3] bg-[#FEFAF6] rounded-3xl h-64 flex flex-col items-center justify-center group overflow-hidden transition-all hover:border-[#102C57]/40 relative">
                    {(imageFile || formData.image) ? (
                      <div className="flex flex-col items-center gap-4">
                        <img
                          src={imageFile ? URL.createObjectURL(imageFile) : `https://joker-hm0k.onrender.com/uploads/categories/${formData.image}`}
                          alt="Preview"
                          className="h-48 w-48 object-cover rounded-2xl shadow-md"
                        />
                        <span className="text-[10px] font-black text-[#102C57] uppercase tracking-widest">
                          {imageFile ? imageFile.name : 'Current Image'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 opacity-40 group-hover:opacity-60 transition-opacity">
                        <div className="w-20 h-20 bg-[#DAC0A3]/10 rounded-3xl flex items-center justify-center mb-2">
                          <span className="text-xs font-black text-[#DAC0A3]">SVG</span>
                        </div>
                        <span className="text-[10px] font-black text-[#DAC0A3] uppercase tracking-[0.3em]">Drop Image or Browse</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-10 border-t border-[#FEFAF6] flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#102C57] text-[#DAC0A3] px-16 py-4 rounded-xl font-black text-[10px] shadow-2xl shadow-[#102C57]/30 hover:bg-[#1a3d75] hover:text-white transform active:scale-95 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isEditMode ? 'Confirm & Update' : 'Confirm & Save Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;