import { useEffect } from "react";

const Toast = ({ msg, type, onClose }) => {
  useEffect(() => {
    if (msg) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [msg, onClose]);

  if (!msg) return null;

  const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500";

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded shadow-lg z-50 max-w-xs text-sm`}>
      {msg}
    </div>
  );
};

export default Toast;