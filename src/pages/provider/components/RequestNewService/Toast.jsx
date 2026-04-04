import { useEffect } from "react";

export const Toast = ({ message, type = "info", onClose, duration = 2500 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-gray-800",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`${colors[type]} text-white px-5 py-3 rounded-lg shadow-xl text-sm font-medium flex items-center gap-3`}
      >
        {message}
        <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 font-bold">
          ✕
        </button>
      </div>
    </div>
  );
};