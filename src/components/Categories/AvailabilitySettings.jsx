import React, { useState } from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';

const AvailabilitySettings = ({ availability, onChange, isAvailableGlobally, onGlobalToggle }) => {
  const [editingDay, setEditingDay] = useState(null);
  const [tempSlots, setTempSlots] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const handleOpenModal = (day) => {
    if (!isAvailableGlobally) return;
    const dayKey = day.charAt(0) + day.slice(1).toLowerCase();
    setEditingDay(dayKey);
    const dayData = availability[dayKey] || { available: false, slots: [] };
    setTempSlots(dayData.slots?.length > 0 ? [...dayData.slots] : [{ from: "09:00", to: "17:00" }]);
  };

  const saveDayChanges = () => {
    onChange(editingDay, { available: true, slots: tempSlots });
    setEditingDay(null);
  };

  const clearDaySlots = () => {
    onChange(editingDay, { available: false, slots: [{ from: "09:00", to: "17:00" }] });
    setEditingDay(null);
  };

  return (
    <div className="space-y-6 pt-2">
      <h2 className="text-[11px] font-black uppercase tracking-widest text-[#102C57] border-b border-[#EADBC8]/50 pb-3">
        AVAILABILITY & WORKING HOURS
      </h2>

      {/* Global Toggle */}
      <div className="flex bg-[#FEFAF6] p-1.5 rounded-2xl border border-[#EADBC8]/50 mb-7 inline-flex w-full md:w-auto shadow-sm">
        <button
          type="button"
          onClick={() => onGlobalToggle(true)}
          className={`flex-1 md:flex-none flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
            isAvailableGlobally 
              ? "bg-[#102C57] text-white shadow-md transform scale-[1.02]" 
              : "text-[#102C57]/40 hover:text-[#102C57] hover:bg-white/50"
          }`}
        >
          <span className={`w-2 h-2 rounded-full transition-all duration-300 ${isAvailableGlobally ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]" : "bg-gray-300"}`}></span>
          AVAILABLE
        </button>
        <button
          type="button"
          onClick={() => onGlobalToggle(false)}
          className={`flex-1 md:flex-none flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${
            !isAvailableGlobally 
              ? "bg-white text-red-500 shadow-md border border-red-50 transform scale-[1.02]" 
              : "text-[#102C57]/40 hover:text-red-400 hover:bg-white/50"
          }`}
        >
          <span className={`w-2 h-2 rounded-full transition-all duration-300 ${!isAvailableGlobally ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.6)]" : "bg-gray-300"}`}></span>
          Always AVAILABLE
        </button>
      </div>

      <div className={`grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4 transition-all duration-500 ${!isAvailableGlobally ? "opacity-30 pointer-events-none grayscale" : ""}`}>
        {days.map((dayFull) => { 
          const day = dayFull.charAt(0) + dayFull.slice(1).toLowerCase();
          const dayData = availability[day] || { available: false };
          const isDayMarked = dayData.available;

          return (
            <div
              key={dayFull}
              onClick={() => handleOpenModal(dayFull)}
              className={`min-h-[110px] rounded-2xl flex flex-col items-center p-3 text-center border-2 transition-all duration-500 cursor-pointer relative overflow-hidden group hover:-translate-y-1 hover:shadow-xl ${
                isDayMarked
                  ? "bg-gradient-to-br from-[#102C57] to-[#163a70] border-[#102C57] shadow-lg shadow-[#102C57]/20"
                  : "bg-white border-[#EADBC8]/40 hover:border-[#102C57]/20 shadow-sm"
              }`}
            >
              {isDayMarked && <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:10px_10px] opacity-20 pointer-events-none"></div>}
              
              <span className={`text-[12px] font-black mb-2 transition-colors relative z-10 ${isDayMarked ? "text-white" : "text-[#102C57]/40 group-hover:text-[#102C57]"}`}>
                {dayFull}
              </span>
              
              <div className="flex-1 w-full flex flex-col justify-center relative z-10">
                {isDayMarked ? (
                  <div className="flex flex-col items-center gap-1.5 w-full">
                    {dayData.slots?.slice(0, 2).map((slot, i) => (
                      <span key={i} className="text-[9px] text-[#FEFAF6] font-bold tracking-wider bg-white/10 px-2.5 py-1 rounded-lg w-full overflow-hidden text-ellipsis whitespace-nowrap border border-white/10 backdrop-blur-sm">
                        {slot.from} - {slot.to}
                      </span>
                    ))}
                    {dayData.slots?.length > 2 && (
                      <span className="text-[8px] text-[#DAC0A3] font-black uppercase tracking-widest mt-0.5">+{dayData.slots.length - 2} MORE</span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-[#FEFAF6] group-hover:bg-[#102C57] group-hover:text-white text-[#102C57]/20 flex items-center justify-center transition-all duration-500 mb-1.5 shadow-sm">
                      <svg className="w-3.5 h-3.5 transform group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <span className="text-[8px] text-[#102C57]/30 font-bold uppercase tracking-widest group-hover:text-[#102C57]/60 transition-colors">Add Hours</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Button */}
      <div className="flex justify-center mt-4">
        <button
          type="button"
          onClick={() => setShowSummary(true)}
          disabled={!isAvailableGlobally}
          className="px-6 py-3 bg-[#FEFAF6] border border-[#EADBC8] text-[#102C57] text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#102C57] hover:text-white hover:border-[#102C57] transition-all flex items-center gap-2 group shadow-sm disabled:opacity-30 disabled:pointer-events-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          View Selected Times
        </button>
      </div>

      {/* Reusable Modal Integration */}
      <Modal
        isOpen={!!editingDay}
        onClose={() => setEditingDay(null)}
        title={editingDay}
        subtitle="Configure Working Hours"
        size="sm"
        footer={
          <div className="space-y-3">
            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={() => setEditingDay(null)}>Cancel</Button>
              <Button fullWidth onClick={saveDayChanges}>Save Slots</Button>
            </div>
            {availability[editingDay]?.available && (
              <Button variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600" fullWidth onClick={clearDaySlots}>
                Reset Day Availability
              </Button>
            )}
          </div>
        }
      >
        <div className="space-y-4">
          {tempSlots.map((slot, index) => (
            <div key={index} className="flex items-end gap-3 p-4 bg-[#FEFAF6] rounded-2xl border border-[#EADBC8]/30 shadow-sm">
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-[#102C57]/40 uppercase tracking-widest ml-1">Start Time</label>
                  <input
                    type="time"
                    value={slot.from}
                    onChange={(e) => {
                      const newSlots = [...tempSlots];
                      newSlots[index] = { ...newSlots[index], from: e.target.value };
                      setTempSlots(newSlots);
                    }}
                    className="w-full h-11 px-4 bg-white border-2 border-[#EADBC8]/40 rounded-xl text-[#102C57] font-bold outline-none text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-[#102C57]/40 uppercase tracking-widest ml-1">End Time</label>
                  <input
                    type="time"
                    value={slot.to}
                    onChange={(e) => {
                      const newSlots = [...tempSlots];
                      newSlots[index] = { ...newSlots[index], to: e.target.value };
                      setTempSlots(newSlots);
                    }}
                    className="w-full h-11 px-4 bg-white border-2 border-[#EADBC8]/40 rounded-xl text-[#102C57] font-bold outline-none text-sm"
                  />
                </div>
              </div>
              {tempSlots.length > 1 && (
                <button
                  type="button"
                  onClick={() => setTempSlots(tempSlots.filter((_, i) => i !== index))}
                  className="h-11 w-11 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => setTempSlots([...tempSlots, { from: "09:00", to: "17:00" }])}
            className="w-full py-4 border-2 border-dashed border-[#EADBC8] text-[#102C57]/40 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-[#102C57]/40 hover:text-[#102C57] transition-all flex items-center justify-center gap-3 bg-[#FEFAF6]/50"
          >
            <span className="text-xl">+</span> Add Time Slot
          </button>
        </div>
      </Modal>

      {/* Summary Modal */}
      <Modal
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
        title="Weekly Schedule Summary"
        subtitle="Review your configured working hours"
        size="md"
        footer={
          <Button fullWidth onClick={() => setShowSummary(false)}>Close Summary</Button>
        }
      >
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {days.map((dayFull) => {
            const day = dayFull.charAt(0) + dayFull.slice(1).toLowerCase();
            const dayData = availability[day];
            if (!dayData?.available) return null;

            return (
              <div key={dayFull} className="flex items-center justify-between p-4 bg-[#FEFAF6] rounded-2xl border border-[#EADBC8]/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#102C57] rounded-xl flex items-center justify-center text-white font-black text-xs">
                    {dayFull.slice(0, 3)}
                  </div>
                  <div>
                    <h4 className="text-[#102C57] font-black text-xs uppercase tracking-widest">{dayFull}</h4>
                    <p className="text-[10px] text-[#102C57]/40 font-bold uppercase tracking-widest">
                      {dayData.slots?.length} Time Slot(s)
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {dayData.slots?.map((slot, i) => (
                    <span key={i} className="text-[11px] font-black text-[#102C57] bg-white border border-[#EADBC8]/40 px-3 py-1.5 rounded-lg shadow-sm">
                      {slot.from} - {slot.to}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
          {Object.values(availability).every(d => !d.available) && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#FEFAF6] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#EADBC8]/20">
                <svg className="w-8 h-8 text-[#102C57]/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-[#102C57]/40 font-black text-xs uppercase tracking-widest">No times selected yet</p>
            </div>
          )}
        </div>
      </Modal>

    </div>
  );
};

export default AvailabilitySettings;
