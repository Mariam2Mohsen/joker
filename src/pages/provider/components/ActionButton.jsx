import { useState } from "react";

export const ActionButton = ({ onView, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
        title="Actions"
      >
        <span className="text-lg">⋮</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-32 sm:w-36 bg-white border rounded shadow-lg z-50">
          {[
            { label: "👁 View", fn: onView },
            { label: "✏️ Edit", fn: onEdit },
            { label: "🗑 Delete", fn: onDelete },
          ].map(({ label, fn }) => (
            <button
              key={label}
              onClick={() => { fn?.(); setOpen(false); }}
              className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};