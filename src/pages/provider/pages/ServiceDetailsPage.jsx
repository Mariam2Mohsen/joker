import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopHeader from "../../provider/components/TopHeader";
import Sidebar from "../../provider/components/Sidebar";
import { ArrowLeft, CheckCircle2, XCircle, Edit3, Save, X, Loader2, RefreshCw } from 'lucide-react';

export default function ServiceDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get service ID from URL
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  // Service Data
  const [service, setService] = useState({
    id: null,
    service_name: "",
    category_name: "",
    sub_category_name: "",
    description: "",
    status: "Active",
    approval_status: "Approved",
    prices: [],
    availability: null,
    service_image: null,
    service_rating: null,
    approved_at: null,
  });

  const [mainImage, setMainImage] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [isAlwaysAvailable, setIsAlwaysAvailable] = useState(true);
  const [editData, setEditData] = useState({
    description: "",
    availability: null,
  });

  const token = localStorage.getItem("authToken");

  // ==============================================
  // 🔥 Fetch Service Details
  // ==============================================
  const fetchServiceDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch service details
      const res = await fetch(`https://joker-hm0k.onrender.com/api/provider/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }

      const data = await res.json();

      if (data.success) {
        setService(data.data);
        setEditData({
          description: data.data.description || "",
          availability: data.data.availability,
        });
        
        // Check availability to set Always Available toggle
        if (data.data.availability) {
          // If availability has specific days, it's not always available
          const hasSpecificDays = Object.keys(data.data.availability).length > 0;
          setIsAlwaysAvailable(!hasSpecificDays);
        }
      } else {
        setError(data.message);
      }

      // Fetch service images
      const imagesRes = await fetch(`https://joker-hm0k.onrender.com/api/provider/services/${id}/images`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const imagesData = await imagesRes.json();

      if (imagesData.success) {
        setMainImage(imagesData.primary?.image_url || null);
        setGallery(imagesData.gallery || []);
      }

    } catch (err) {
      console.error(err);
      setError("Failed to load service details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchServiceDetails();
    }
  }, [id]);

  // ==============================================
  // 🔥 Update Service
  // ==============================================
  const handleUpdateService = async () => {
    setSaving(true);
    try {
      const updatePayload = {
        description: editData.description,
        availability: isAlwaysAvailable ? null : editData.availability,
      };

      const res = await fetch(`https://joker-hm0k.onrender.com/api/provider/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });

      const data = await res.json();

      if (data.success) {
        setEditMode(false);
        fetchServiceDetails(); // Refresh data
      } else {
        alert(data.message || "Failed to update service");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update service");
    } finally {
      setSaving(false);
    }
  };

  // ==============================================
  // 🔥 Handle Image Upload (Main)
  // ==============================================
  const handleMainImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // TODO: Implement image upload API
    // For now, just show the file name
    setMainImage(file.name);
    alert("Image upload API to be implemented");
  };

  // ==============================================
  // 🔥 Handle Gallery Upload
  // ==============================================
  const handleGalleryUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // TODO: Implement multiple image upload API
    alert(`Uploading ${files.length} images. API to be implemented`);
  };

  // ==============================================
  // Loading State
  // ==============================================
  if (loading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#FEFAF6]">
        <TopHeader />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#102C57]"></div>
          </main>
        </div>
      </div>
    );
  }

  // ==============================================
  // Error State
  // ==============================================
  if (error) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#FEFAF6]">
        <TopHeader />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle size={32} className="text-red-500" />
              </div>
              <p className="text-red-500 text-sm font-bold mb-4">{error}</p>
              <button
                onClick={fetchServiceDetails}
                className="bg-[#102C57] text-white px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2 mx-auto"
              >
                <RefreshCw size={14} /> Try Again
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Get main price and type
  const mainPrice = service.prices?.[0]?.price || 0;
  const mainPricingType = service.prices?.[0]?.type || "Fixed";

  const DetailField = ({ label, value, half = true }) => (
    <div className={`flex flex-col gap-2 ${half ? 'flex-1' : 'w-full'}`}>
      <label className="text-[10px] font-black text-[#102C57] uppercase tracking-[0.2em] ml-2">
        {label}
      </label>
      <div className="w-full bg-[#FEFAF6] border border-[#EADBC8] rounded-xl px-5 py-3 text-xs text-[#102C57] font-bold shadow-sm">
        {value || "—"}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#FEFAF6]">
      <TopHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8 overflow-auto font-sans">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4 bg-white px-6 py-2.5 rounded-[1.2rem] border border-[#EADBC8] shadow-sm">
                <button onClick={() => navigate(-1)} className="text-[#DAC0A3] hover:text-[#102C57]">
                  <ArrowLeft size={18} strokeWidth={3} />
                </button>
                <h2 className="text-[11px] font-black text-[#102C57] uppercase tracking-widest">Back</h2>
              </div>
              
              <div className="flex gap-3">
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-[#102C57] text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg"
                  >
                    <Edit3 size={14} /> Edit Service
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setEditMode(false)}
                      className="bg-gray-200 text-gray-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                    >
                      <X size={14} /> Cancel
                    </button>
                    <button
                      onClick={handleUpdateService}
                      disabled={saving}
                      className="bg-green-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-green-100"
                    >
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-[#EADBC8] shadow-sm p-10 relative">
              {/* Status Badge */}
              <div className="absolute top-6 right-10">
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg ${
                  service.status === "Active" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {service.status === "Active" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {service.status}
                </div>
              </div>

              <div className="space-y-8 mt-4">
                
                {/* Service Information */}
                <div className="flex flex-wrap gap-8">
                  <DetailField label="Category" value={service.category_name} />
                  <DetailField label="Sub-Category" value={service.sub_category_name} />
                  <DetailField label="Service Name" value={service.service_name} />
                </div>

                {/* Pricing Information */}
                <div className="flex flex-wrap gap-8">
                  <DetailField label="Commission" value={service.commission || "—"} />
                  <DetailField label="Pricing Type" value={mainPricingType} />
                  <DetailField label="Price" value={`${mainPrice} L.E`} />
                </div>

                {/* Status & Image */}
                <div className="flex flex-wrap gap-8 items-end">
                  <DetailField label="Approval Status" value={service.approval_status} />
                  <DetailField label="Approved At" value={service.approved_at ? new Date(service.approved_at).toLocaleDateString() : "—"} />
                  
                  <div className="flex-[2] flex flex-col gap-2">
                    <label className="text-[10px] font-black text-[#102C57] uppercase tracking-[0.2em] ml-2">
                      Service Image
                    </label>
                    <div className="flex border border-[#EADBC8] rounded-xl overflow-hidden h-[45px] shadow-sm">
                      <div className="flex-1 bg-[#FEFAF6] px-5 flex items-center text-[11px] text-[#102C57] font-bold truncate">
                        {mainImage || service.service_image || "No image"}
                      </div>
                      {editMode && (
                        <>
                          <input type="file" ref={fileInputRef} onChange={handleMainImageUpload} className="hidden" accept="image/*" />
                          <div 
                            onClick={() => fileInputRef.current.click()}
                            className="bg-[#102C57] text-white px-8 flex items-center text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-[#102C57]/90 transition-colors"
                          >
                            Upload
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center gap-4 bg-[#FEFAF6] p-4 rounded-xl border border-[#EADBC8]">
                  <div 
                    onClick={() => !editMode ? null : setIsAlwaysAvailable(!isAlwaysAvailable)}
                    className={`w-11 h-5 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                      editMode ? (isAlwaysAvailable ? 'bg-green-500' : 'bg-[#EADBC8]') : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 bg-white rounded-full transition-all shadow-sm transform ${isAlwaysAvailable ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#102C57] uppercase tracking-widest">
                      Always Available
                      {!editMode && <span className="text-[#DAC0A3] ml-2 text-[8px]">(Read only)</span>}
                    </span>
                    <span className="text-[9px] text-[#DAC0A3] font-bold lowercase tracking-normal">
                      Override working hours for 24/7 service
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#102C57] uppercase tracking-[0.2em] ml-2">
                    Description
                  </label>
                  {editMode ? (
                    <textarea
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      rows={4}
                      className="w-full bg-[#FEFAF6] border border-[#EADBC8] rounded-xl px-5 py-4 text-xs text-[#102C57] font-bold outline-none focus:ring-2 focus:ring-[#102C57]/5 resize-none"
                      placeholder="Enter service description..."
                    />
                  ) : (
                    <div className="w-full bg-[#FEFAF6] border border-[#EADBC8] rounded-xl px-5 py-6 text-xs text-[#102C57]/80 font-bold leading-relaxed">
                      {service.description || "No description provided"}
                    </div>
                  )}
                </div>

                {/* Service Gallery */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#102C57] uppercase tracking-[0.2em] ml-2">
                    Service Gallery ({gallery.length} images)
                  </label>
                  
                  {/* Gallery Preview */}
                  {gallery.length > 0 && (
                    <div className="flex gap-3 flex-wrap mb-4">
                      {gallery.map((img, idx) => (
                        <div key={img.id} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#EADBC8]">
                          <img 
                            src={`/images/${img.image_url}`} 
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => e.target.src = "/placeholder-image.png"}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {editMode && (
                    <>
                      <input 
                        type="file" 
                        ref={galleryInputRef} 
                        onChange={handleGalleryUpload} 
                        className="hidden" 
                        multiple 
                        accept="image/*"
                      />
                      <div 
                        onClick={() => galleryInputRef.current.click()}
                        className="flex border border-[#EADBC8] rounded-xl overflow-hidden h-[45px] shadow-sm cursor-pointer"
                      >
                        <div className="flex-1 bg-[#FEFAF6] px-5 flex items-center text-[11px] text-[#DAC0A3] font-bold">
                          Browse images
                        </div>
                        <div className="bg-[#102C57] text-white px-8 flex items-center text-[10px] font-black uppercase tracking-widest hover:bg-[#102C57]/90 transition-colors">
                          Upload Gallery
                        </div>
                      </div>
                      <p className="text-[8px] text-[#DAC0A3] mt-1">
                        You can upload multiple images (JPG, PNG)
                      </p>
                    </>
                  )}
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}