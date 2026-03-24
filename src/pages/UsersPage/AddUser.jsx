import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddUser = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEditMode = Boolean(id); 
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    userType: '', 
    email: '',
    password: '',
    confirmPassword: '',
    contactNumber: '',
    status: 'active',
    address: '',
    description: ''
    
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode && id) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/users/get_user/${id}`);
          if (response.data.success) {
            const user = response.data.user;
            setFormData({
              name: user.Full_Name || '',
              username: user.Full_Name || '', 
              userType: user.role_id === 1 ? 'Admin' : 'Admin_user',
              email: user.Email || '',
              password: '', 
              confirmPassword: '',
              contactNumber: user.phone_number || '',
              
              status: user.account_status?.toLowerCase() === 'approved' ? 'active' : 'inactive',
              address: user.Address || '',
              description: user.Description || ''
            });
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };
      fetchUserData();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'contactNumber') {
      const onlyNums = value.replace(/[^0-9]/g, ''); 
      if (onlyNums.length <= 11) {
        setFormData({ ...formData, [name]: onlyNums });
        if (onlyNums.length > 0 && onlyNums.length < 11) {
          setErrors(prev => ({ ...prev, contactNumber: "Must be 11 digits" }));
        } else {
          setErrors(prev => ({ ...prev, contactNumber: "" }));
        }
      }
      return;
    }

    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    if (name === 'password') {
      if (value.length > 0 && value.length < 6) {
        setErrors(prev => ({ ...prev, password: "Too short! Min 6 characters" }));
      } else {
        setErrors(prev => ({ ...prev, password: "" }));
      }
      if (updatedData.confirmPassword && value !== updatedData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: "Does not match" }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
      }
    }

    if (name === 'confirmPassword') {
      if (value && value !== updatedData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: "Does not match" }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: "" }));
      }
    }

    if (!['password', 'confirmPassword', 'contactNumber'].includes(name)) {
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const labelClass = "block text-[11px] font-black text-[#102C57] mb-1.5 uppercase tracking-tight";
  const inputBaseClass = "w-full px-5 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#102C57]/10 outline-none text-xs transition-all bg-white";
  const errorTextClass = "text-[#E72929] text-[9px] mt-1 font-black text-right uppercase tracking-wider block w-full";

  const getFieldClass = (fieldName) => {
    const hasError = errors[fieldName];
    return `${inputBaseClass} ${hasError ? 'border-[#E72929] bg-[#FFF5F5]' : 'border-[#DAC0A3]'}`;
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "FULL NAME IS REQUIRED";
    if (!formData.username) newErrors.username = "USERNAME IS REQUIRED";
    if (!formData.userType) newErrors.userType = "USER TYPE IS REQUIRED";
    if (!formData.email) newErrors.email = "EMAIL ADDRESS IS REQUIRED";
    if (!formData.address) newErrors.address = "PHYSICAL ADDRESS IS REQUIRED";
    if (formData.contactNumber.length !== 11) newErrors.contactNumber = "PHONE MUST BE 11 DIGITS";
    if (!isEditMode || formData.password) {
      if (!formData.password) newErrors.password = "PASSWORD IS REQUIRED";
      else if (formData.password.length < 6) newErrors.password = "TOO SHORT";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "MISMATCH";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const dataToSend = {
        Full_Name: formData.name,      
        Email: formData.email,         
        Password: formData.password,  
        Role: formData.userType,       
        phone_number: formData.contactNumber, 
        Address: formData.address || "Assiut", 
        City: "Assiut",             
        account_status: formData.status === 'active' ? 'approved' : 'rejected'    
      };

      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/users/user_update/${id}`, dataToSend);
      } else {
        await axios.post('http://localhost:5000/api/users/user_signup', dataToSend);
      }
      navigate('/admin/users/list');
    } catch (error) {
     const serverMessage = error.response?.data?.message || "Error saving user data";
    setErrors(prev => ({ ...prev, server: serverMessage }));
    toast.error(serverMessage);
    }
  };

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-[#FEFAF6] p-2 sm:p-4 pb-20">
      <div className="bg-white rounded-[2rem] shadow-sm border border-[#EADBC8] overflow-hidden">
        {/* Page Header Area */}
        <div className="p-8 border-b border-[#EADBC8] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#102C57] rounded-2xl flex items-center justify-center shadow-lg shadow-[#102C57]/20">
              <span className="text-white text-xl font-black">{isEditMode ? 'E' : 'A'}</span>
            </div>
            <div>
              <h2 className="text-xl font-black text-[#102C57] uppercase tracking-tight">
                {isEditMode ? 'Edit' : 'Add'} System User
              </h2>
              <p className="text-[#DAC0A3] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Management / Staff Directory</p>
            </div>
          </div>

          <div className="flex bg-[#FEFAF6] rounded-xl p-1.5 border border-[#EADBC8] w-full md:w-auto">
            <button
              type="button"
              onClick={() => setFormData({...formData, status: 'active'})}
              className={`flex-1 md:px-10 py-3 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${
                formData.status === 'active' ? 'bg-[#102C57] text-white shadow-xl translate-y-[-1px]' : 'text-[#102C57]/40 hover:text-[#102C57]'
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, status: 'inactive'})}
              className={`flex-1 md:px-10 py-3 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${
                formData.status === 'inactive' ? 'bg-[#102C57] text-white shadow-xl translate-y-[-1px]' : 'text-[#102C57]/40 hover:text-[#102C57]'
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
              <h3 className="text-xs font-black text-[#102C57] uppercase tracking-[0.2em]">Personal Information</h3>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#EADBC8] to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-1.5">
                <label className={labelClass}>Full Name : <span className="text-red-500">*</span></label>
                <input type="text" name="name" className={getFieldClass('name')} value={formData.name} onChange={handleChange} required placeholder="Full Name" />
                {errors.name && <p className={errorTextClass}>{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Username : <span className="text-red-500">*</span></label>
                <input type="text" name="username" className={getFieldClass('username')} value={formData.username} onChange={handleChange} required placeholder="Username" />
                {errors.username && <p className={errorTextClass}>{errors.username}</p>}
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>User Type : <span className="text-red-500">*</span></label>
                <select name="userType" className={getFieldClass('userType')} value={formData.userType} onChange={handleChange} required>
                  <option value="">Select Type</option>
                  <option value="Admin">Admin</option>
                  <option value="Admin_user">Admin User</option>
                </select>
                {errors.userType && <p className={errorTextClass}>{errors.userType}</p>}
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Email Address : <span className="text-red-500">*</span></label>
                <input type="email" name="email" className={getFieldClass('email')} value={formData.email} onChange={handleChange} required placeholder="email@example.com" />
                {errors.email && <p className={errorTextClass}>{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Contact Number : <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="contactNumber" 
                  className={getFieldClass('contactNumber')} 
                  value={formData.contactNumber} 
                  onChange={handleChange} 
                  required 
                  placeholder="01xxxxxxxxx"
                />
                {errors.contactNumber && <p className={errorTextClass}>{errors.contactNumber}</p>}
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Physical Address : <span className="text-red-500">*</span></label>
                <input type="text" name="address" className={getFieldClass('address')} value={formData.address} onChange={handleChange} required placeholder="City, Country" />
                {errors.address && <p className={errorTextClass}>{errors.address}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Security */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-[#FEFAF6] border border-[#EADBC8] flex items-center justify-center text-[10px] font-black text-[#102C57]">02</span>
              <h3 className="text-xs font-black text-[#102C57] uppercase tracking-[0.2em]">Security Credentials</h3>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#EADBC8] to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-1.5">
                <label className={labelClass}>Password : {isEditMode ? '(Optional)' : <span className="text-red-500">*</span>}</label>
                <input 
                  type="password" 
                  name="password" 
                  className={getFieldClass('password')} 
                  value={formData.password} 
                  onChange={handleChange} 
                  required={!isEditMode} 
                  placeholder="******"
                />
                {errors.password && <p className={errorTextClass}>{errors.password}</p>}
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Confirm Password : <span className="text-red-500">*</span></label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  className={getFieldClass('confirmPassword')} 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  required={!isEditMode || formData.password} 
                  placeholder="******"
                />
                {errors.confirmPassword && <p className={errorTextClass}>{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Others */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-full bg-[#FEFAF6] border border-[#EADBC8] flex items-center justify-center text-[10px] font-black text-[#102C57]">03</span>
              <h3 className="text-xs font-black text-[#102C57] uppercase tracking-[0.2em]">Additional Information</h3>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-[#EADBC8] to-transparent"></div>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>User Description / Bio :</label>
              <textarea name="description" rows="4" className={`${inputBaseClass} resize-none h-32`} placeholder="Additional information about the user..." value={formData.description} onChange={handleChange}></textarea>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-12 pt-10 border-t border-[#FEFAF6] flex flex-col sm:flex-row justify-end gap-3">
             <button 
              type="button"
              onClick={() => navigate('/admin/users/list')}
              className="px-12 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-[#102C57] bg-[#FEFAF6] border border-[#EADBC8] hover:bg-[#EADBC8]/20 transition-all flex items-center justify-center"
            >
              Cancel Process
            </button>
            <button type="submit" className="bg-[#102C57] text-[#DAC0A3] px-16 py-4 rounded-xl font-black text-[10px] shadow-2xl shadow-[#102C57]/30 hover:bg-[#1a3d75] hover:text-white transform active:scale-95 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-3">
              {isEditMode ? 'Confirm Update' : 'Confirm & Save User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;