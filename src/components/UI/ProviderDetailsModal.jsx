import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaStar, FaTools, FaCheck } from 'react-icons/fa';
import Modal from './Modal';
import Button from './Button';
import axios from 'axios';

const ProviderDetailsModal = ({ isOpen, onClose, providerId }) => {
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [fullDetails, setFullDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && providerId) {
      fetchProviderDetails(providerId);
    }
    // Reset on close
    if (!isOpen) {
      setFullDetails(null);
      setError(null);
    }
  }, [isOpen, providerId]);

  const fetchProviderDetails = async (id) => {
    setIsLoadingDetails(true);
    setFullDetails(null);
    setError(null);
    try {
      // Public endpoint — no auth required
      const res = await axios.get(`https://joker-hm0k.onrender.com/api/providers/${id}`);
      if (res.data.success) {
        setFullDetails(res.data.data);
      } else {
        setError('Could not load provider details.');
      }
    } catch (err) {
      console.error('Failed to fetch provider details', err);
      setError('Could not load provider details. Please try again.');
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Professional Profile"
      subtitle="Verified Provider Details"
      size="lg"
    >
      {/* ── Loading state ── */}
      {isLoadingDetails && (
        <div className="py-20 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#DAC0A3] border-t-[#102C57] rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#102C57]/40">Gathering Profile...</p>
        </div>
      )}

      {/* ── Error state ── */}
      {!isLoadingDetails && error && (
        <div className="py-20 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z" />
            </svg>
          </div>
          <p className="text-[11px] font-black uppercase tracking-widest text-[#102C57]/50">{error}</p>
          <button
            onClick={() => fetchProviderDetails(providerId)}
            className="mt-6 px-6 py-2 bg-[#102C57] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#DAC0A3] hover:text-[#102C57] transition-all"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Details ── */}
      {!isLoadingDetails && !error && fullDetails && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            <div className="w-40 h-40 rounded-[3rem] bg-[#102C57] text-[#FEFAF6] flex items-center justify-center text-4xl font-black shadow-2xl relative flex-shrink-0">
              {fullDetails.overview.profile_image ? (
                <img
                  src={
                    fullDetails.overview.profile_image.startsWith('http')
                      ? fullDetails.overview.profile_image
                      : `https://joker-hm0k.onrender.com/images/${fullDetails.overview.profile_image}`
                  }
                  className="w-full h-full object-cover rounded-[3rem] border-4 border-white"
                  alt={fullDetails.overview.Full_Name}
                />
              ) : (
                <span>{fullDetails.overview.Full_Name?.[0]}</span>
              )}
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-3 rounded-2xl shadow-lg border-4 border-white">
                <FaCheck size={16} />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h2 className="text-4xl font-black text-[#102C57] uppercase tracking-tighter">{fullDetails.overview.Full_Name}</h2>
                <span className="md:ml-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest rounded-full border border-emerald-100 inline-block w-fit mx-auto md:mx-0">
                  Verified Expert
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-center md:justify-start gap-3 text-[#102C57]/60">
                  <div className="w-8 h-8 rounded-xl bg-[#FEFAF6] flex items-center justify-center"><FaEnvelope size={12} /></div>
                  <span className="text-xs font-bold">{fullDetails.overview.Email}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3 text-[#102C57]/60">
                  <div className="w-8 h-8 rounded-xl bg-[#FEFAF6] flex items-center justify-center"><FaPhone size={12} /></div>
                  <span className="text-xs font-bold">{fullDetails.overview.phone_number}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3 text-[#102C57]/60">
                  <div className="w-8 h-8 rounded-xl bg-[#FEFAF6] flex items-center justify-center"><FaMapMarkerAlt size={12} /></div>
                  <span className="text-xs font-bold">
                    {[fullDetails.overview.City, fullDetails.overview.Address].filter(Boolean).join(', ') || 'N/A'}
                  </span>
                </div>
                {fullDetails.reviews.avg_rating && (
                  <div className="flex items-center justify-center md:justify-start gap-3 text-amber-500">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center"><FaStar size={12} /></div>
                    <span className="text-xs font-black uppercase tracking-widest">{fullDetails.reviews.avg_rating} Average Rating</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 p-6 bg-[#FEFAF6] rounded-[2.5rem] border border-[#EADBC8]/30">
            <div className="text-center">
              <p className="text-[9px] font-black text-[#102C57]/40 uppercase tracking-widest mb-1">Services</p>
              <p className="text-xl font-black text-[#102C57]">{fullDetails.services.length}</p>
            </div>
            <div className="text-center border-l border-[#EADBC8]/30">
              <p className="text-[9px] font-black text-[#102C57]/40 uppercase tracking-widest mb-1">Bookings</p>
              <p className="text-xl font-black text-[#102C57]">{fullDetails.bookings.total ?? 0}</p>
            </div>
            <div className="text-center border-l border-[#EADBC8]/30">
              <p className="text-[9px] font-black text-[#102C57]/40 uppercase tracking-widest mb-1">Reviews</p>
              <p className="text-xl font-black text-[#102C57]">{fullDetails.reviews.total ?? 0}</p>
            </div>
          </div>

          {/* Services Offered */}
          <div>
            <h3 className="text-sm font-black text-[#102C57] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <FaTools /> Available Services
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fullDetails.services.length > 0 ? fullDetails.services.map((svc, i) => (
                <div key={i} className="p-6 bg-white border border-[#EADBC8] rounded-3xl hover:shadow-lg transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-[#FEFAF6] rounded-xl text-[#102C57] group-hover:bg-[#102C57] group-hover:text-white transition-colors">
                      <FaTools size={14} />
                    </div>
                    <span className="text-[10px] font-black text-[#102C57] bg-[#FEFAF6] px-3 py-1 rounded-lg border border-[#EADBC8]">
                      {svc.category_name}
                    </span>
                  </div>
                  <p className="text-xs font-black text-[#102C57] uppercase tracking-wide mb-1">{svc.service_name}</p>
                  <p className="text-[10px] text-[#DAC0A3] font-medium leading-relaxed line-clamp-2 mb-4">{svc.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-[#FEFAF6]">
                    <span className="text-[9px] font-black text-[#DAC0A3] uppercase tracking-widest">Pricing</span>
                    <span className="text-sm font-black text-[#102C57]">{svc.price} L.E</span>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-10 bg-[#FEFAF6]/50 rounded-3xl text-center">
                  <p className="text-[10px] font-black uppercase text-[#102C57]/30 tracking-widest">No services publicly listed</p>
                </div>
              )}
            </div>
          </div>

          {/* Action */}
          <div className="pt-8 border-t border-[#FEFAF6]">
            <Link to="/contact" onClick={onClose}>
              <Button fullWidth variant="primary" className="py-4 bg-[#102C57] hover:bg-[#DAC0A3] hover:text-[#102C57]">
                Book This Professional
              </Button>
            </Link>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ProviderDetailsModal;