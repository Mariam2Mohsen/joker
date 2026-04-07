import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaFilter, FaArrowLeft, FaFileImage } from "react-icons/fa";

const API = "https://joker-hm0k.onrender.com/api/admin";
const IMG_BASE_URL = "https://joker-hm0k.onrender.com/uploads/";

const ProviderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); 

        const res = await axios.get(`${API}/providers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        
        setData(res.data.data);
      } catch (err) {
        console.error("Fetch Error:", err);
        if (err.response?.status === 401) {
          Swal.fire("Unauthorized", "Please login again", "error");
          navigate("/login");
        } else {
          Swal.fire("Error", "Could not fetch provider details", "error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  const handleAction = async (status) => {
    const result = await Swal.fire({
      title: `Confirm ${status}`,
      text: `Are you sure you want to ${status === "Active" ? 'approve' : 'reject'} this provider?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: status === "Active" ? "#0d254a" : "#dc2626",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel"
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        
        await axios.patch(`${API}/providers/${id}/status`, 
          { status },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        await Swal.fire("Success", `Status updated to ${status}`, "success");
        navigate("/admin/pending-providers"); 
      } catch (err) {
        console.error("Update Error:", err);
        Swal.fire("Error", err.response?.data?.message || "Failed to update", "error");
      }
    }
  };

  if (loading) return <div className="p-10 text-[#0d254a] font-bold text-center animate-pulse">Loading Provider Details...</div>;
  if (!data) return <div className="p-10 text-red-500 font-bold text-center">Provider not found or deleted.</div>;

  const { overview, services } = data;
  const firstService = services?.[0] || {};

 
  const renderGallery = () => {
    if (!firstService.gallery) return [1, 2, 3].map(i => <div key={i} className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed"></div>);
    
    try {
      const images = typeof firstService.gallery === 'string' ? JSON.parse(firstService.gallery) : firstService.gallery;
      return images.map((img, i) => (
        <div key={i} className="aspect-square bg-gray-100 rounded-xl overflow-hidden border">
          <img src={`${IMG_BASE_URL}${img}`} alt={`gallery-${i}`} className="w-full h-full object-cover" />
        </div>
      ));
    } catch (e) {
      return <div className="text-gray-400 text-xs">Error loading gallery</div>;
    }
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen font-sans text-[#0d254a]">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <FaArrowLeft className="cursor-pointer text-gray-400 hover:text-[#0d254a] transition-colors" onClick={() => navigate(-1)} />
          <h2 className="text-lg font-bold border-l-4 border-[#0d254a] pl-3">Provider Profile</h2>
        </div>
        <div className="flex gap-3">
          <button onClick={() => handleAction("Active")} className="bg-[#0d254a] text-white px-8 py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-opacity-90 transition-all shadow-md">Accept</button>
          <button onClick={() => handleAction("Rejected")} className="bg-white text-red-600 border border-red-600 px-8 py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-red-50 transition-all shadow-sm">Reject</button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border-l-[6px] border-[#0d254a]">
          <h3 className="text-[10px] font-black text-gray-400 uppercase mb-6 tracking-widest">Contact Info</h3>
          <div className="space-y-4">
            <div><p className="text-[10px] font-bold text-gray-400 uppercase">Name</p><p className="font-bold">{overview.Full_Name}</p></div>
            <div><p className="text-[10px] font-bold text-gray-400 uppercase">Phone</p><p className="font-bold">{overview.phone_number}</p></div>
            <div><p className="text-[10px] font-bold text-gray-400 uppercase">Email</p><p className="font-bold underline text-blue-600">{overview.Email}</p></div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border-l-[6px] border-[#0d254a]">
          <h3 className="text-[10px] font-black text-gray-400 uppercase mb-6 tracking-widest">Identity</h3>
          <div className="flex gap-6">
            <div className="w-20 h-20 bg-gray-50 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden">
               {overview.profile_image ? <img src={`${IMG_BASE_URL}${overview.profile_image}`} className="w-full h-full object-cover" alt="profile" /> : <FaFileImage size={20} className="text-gray-300"/>}
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Joined: <span className="text-[#0d254a] font-black">{new Date(overview.Joining_Date).toLocaleDateString()}</span></p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Status: <span className="text-orange-600 font-black">{overview.account_status}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Requested Services Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 bg-gray-50/50 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h3 className="font-black uppercase text-xs tracking-widest">Requested Services</h3>
            <FaFilter className="text-gray-300" />
          </div>
          <button className="bg-[#0d254a] text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase">Service Action</button>
        </div>

        <div className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10 mb-12">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Category</label>
              <p className="font-bold">{firstService.category_name || "N/A"}</p>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Sub category</label>
              <p className="font-bold">{firstService.sub_category_name || "N/A"}</p>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Description</label>
              <p className="text-xs text-gray-500 italic leading-relaxed">{firstService.description || "No description provided."}</p>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Price Type</label>
              <p className="font-bold text-[#0d254a]">{firstService.pricing_type || "Free"}</p>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Commission</label>
              <p className="font-bold text-blue-600">{firstService.commission ? `${firstService.commission}%` : "0%"}</p>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase block mb-1">Price</label>
              <p className="font-black text-lg text-[#0d254a]">{firstService.max_price ? `${firstService.max_price} EGP` : "0.00"}</p>
            </div>
          </div>

          <hr className="mb-10 border-gray-100" />

          {/* Media Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4">Service Image</h4>
              <div className="aspect-video bg-gray-50 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden shadow-inner">
                {firstService.service_image ? <img src={`${IMG_BASE_URL}${firstService.service_image}`} className="w-full h-full object-contain" alt="service" /> : <span className="text-gray-300 text-xs font-bold uppercase tracking-widest">No Image Available</span>}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4">Showcase Gallery</h4>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {renderGallery()}
              </div>
              <div className="flex gap-4 justify-end">
                <button onClick={() => handleAction("Active")} className="bg-[#0d254a] text-white px-10 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all">Accept All</button>
                <button onClick={() => handleAction("Rejected")} className="bg-red-600 text-white px-10 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-red-700 active:scale-95 transition-all">Reject All</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetails;