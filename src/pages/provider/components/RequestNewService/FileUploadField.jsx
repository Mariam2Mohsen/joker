import { useRef } from "react";
import { FormLabel } from "./FormLabel";

export const FileUploadField = ({ label, required, onUpload, accept = "image/*" }) => {
  const inputRef = useRef();

  return (
    <div className="flex flex-col">
      {label && <FormLabel required={required}>{label}</FormLabel>}
      <div className="flex rounded overflow-hidden border border-[#DAC0A3]">
        <div className="flex-1 px-2 sm:px-3 py-2 text-xs sm:text-sm text-[#102C57] bg-white flex items-center truncate">
          Browser
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-3 sm:px-5 py-2 bg-[#102C57] text-white text-xs sm:text-sm font-semibold hover:bg-[#1a3a6e] transition-colors whitespace-nowrap"
        >
          Upload
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          multiple
          onChange={(e) => onUpload?.(Array.from(e.target.files))}
        />
      </div>
    </div>
  );
};