import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddSubCategory = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        description: '',
        status: 'active',
        sort_order: 0
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const labelClass = "block text-[11px] font-black text-[#102C57] mb-2 uppercase tracking-tight";
    const inputBaseClass = "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#102C57]/10 focus:border-[#102C57] outline-none text-xs transition-all bg-[#FEFAF6] placeholder:text-[#DAC0A3]/60";
    const errorTextClass = "text-[#E72929] text-[9px] mt-1 font-black text-right uppercase tracking-wider block w-full";

    const getFieldClass = (fieldName) => {
        const hasError = errors[fieldName];
        return `${inputBaseClass} ${hasError ? 'border-[#E72929] bg-[#FFF5F5]' : 'border-[#DAC0A3]'}`;
    };

    const getAuthHeaders = () => ({
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                
                const resCat = await axios.get('https://joker-hm0k.onrender.com/api/categories', getAuthHeaders());
                if (resCat.data.success) {
                    setCategories(resCat.data.data);
                }

               
                if (isEditMode) {
                    const resSub = await axios.get(`https://joker-hm0k.onrender.com/api/subcategories/${id}`, getAuthHeaders());
                    if (resSub.data.success) {
                        const data = resSub.data.data;
                       
                        setFormData({
                            name: data.name || '',
                            category_id: data.category_id || '',
                            description: data.description || '',
                            status: data.status || 'active',
                            sort_order: data.sort_order || 0
                        });
                    }
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                toast.error("Error loading data");
            }
        };

        fetchInitialData();
    }, [id, isEditMode]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "SUB CATEGORY NAME IS REQUIRED";
        if (!formData.category_id) newErrors.category_id = "PARENT CATEGORY IS REQUIRED";
        if (!formData.description.trim()) newErrors.description = "DESCRIPTION IS REQUIRED";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            const url = isEditMode 
                ? `https://joker-hm0k.onrender.com/api/subcategories/${id}` 
                : `https://joker-hm0k.onrender.com/api/subcategories`;
            
          
            const method = isEditMode ? 'put' : 'post';

            const response = await axios[method](url, formData, getAuthHeaders());

            if (response.data.success) {
                toast.success(isEditMode ? "Updated successfully" : "Created successfully");
                navigate('/admin/subcategory/list');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Operation failed";
            setErrors({ server: errorMsg });
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen bg-[#FEFAF6] p-2 sm:p-4 pb-20">
            <div className="bg-white rounded-[2rem] shadow-sm border border-[#EADBC8] overflow-hidden">
                {/* Header Area */}
                <div className="p-8 border-b border-[#EADBC8] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#102C57] rounded-2xl flex items-center justify-center shadow-lg shadow-[#102C57]/20">
                            <span className="text-white text-xl font-black">{isEditMode ? 'E' : 'A'}</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-[#102C57] uppercase tracking-tight">
                                {isEditMode ? 'Edit Sub Category' : 'Add Sub Category'}
                            </h2>
                            <p className="text-[#DAC0A3] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Management / Classification</p>
                        </div>
                    </div>

                    <div className="flex bg-[#FEFAF6] rounded-xl p-1.5 border border-[#EADBC8] w-full md:w-auto">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, status: 'active' })}
                            className={`flex-1 md:px-10 py-3 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${formData.status === 'active' ? 'bg-[#102C57] text-white shadow-xl' : 'text-[#102C57]/40 hover:text-[#102C57]'}`}
                        >
                            Active
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, status: 'inactive' })}
                            className={`flex-1 md:px-10 py-3 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${formData.status === 'inactive' ? 'bg-[#102C57] text-white shadow-xl' : 'text-[#102C57]/40 hover:text-[#102C57]'}`}
                        >
                            Inactive
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} noValidate className="p-8 md:p-12 space-y-12">
                    {errors.server && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-black text-center border border-red-100 uppercase tracking-widest">
                            {errors.server}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        {/* Left Column */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full bg-[#FEFAF6] border border-[#EADBC8] flex items-center justify-center text-[10px] font-black text-[#102C57]">01</span>
                                <h3 className="text-xs font-black text-[#102C57] uppercase tracking-[0.2em]">Basic Details</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Sub Category Name : <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Mobile Apps"
                                        className={getFieldClass('name')}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    {errors.name && <span className={errorTextClass}>{errors.name}</span>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className={labelClass}>Select Parent Category : <span className="text-red-500">*</span></label>
                                    <select
                                        className={getFieldClass('category_id')}
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    >
                                        <option value="">Select Parent</option>
                                        {categories.map(cat => (
                                            <option key={cat.category_id} value={cat.category_id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && <span className={errorTextClass}>{errors.category_id}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <span className="w-8 h-8 rounded-full bg-[#FEFAF6] border border-[#EADBC8] flex items-center justify-center text-[10px] font-black text-[#102C57]">02</span>
                                <h3 className="text-xs font-black text-[#102C57] uppercase tracking-[0.2em]">Contextual Data</h3>
                            </div>

                            <div className="space-y-1.5">
                                <label className={labelClass}>Description : <span className="text-red-500">*</span></label>
                                <textarea
                                    rows="6"
                                    placeholder="Briefly describe this sub category..."
                                    className={`${getFieldClass('description')} resize-none h-44`}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                                {errors.description && <span className={errorTextClass}>{errors.description}</span>}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-10 border-t border-[#FEFAF6] flex flex-col sm:flex-row justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/subcategory/list')}
                            className="px-12 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#102C57] bg-[#FEFAF6] border border-[#EADBC8] hover:bg-white transition-all"
                        >
                            Cancel Process
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-[#102C57] text-[#DAC0A3] px-16 py-4 rounded-xl font-black text-[10px] shadow-2xl shadow-[#102C57]/30 hover:bg-[#1a3d75] hover:text-white transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (isEditMode ? 'Update Sub-Category' : 'Confirm & Save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSubCategory;