import { FormLabel } from "./FormLabel";

export const InputField = ({
  label,
  required,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled,
  readOnly,
}) => (
  <div className="flex flex-col">
    {label && <FormLabel required={required}>{label}</FormLabel>}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      className={`border rounded px-3 py-2 text-sm outline-none transition-all
        ${
          disabled || readOnly
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
            : "bg-white text-gray-700 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        }`}
    />
  </div>
);