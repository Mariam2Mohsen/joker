import { FormLabel } from "./FormLabel";

export const TextAreaField = ({
  label,
  required,
  value,
  onChange,
  placeholder,
  rows = 4,
}) => (
  <div className="flex flex-col">
    {label && <FormLabel required={required}>{label}</FormLabel>}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="border border-gray-300 rounded px-3 py-2 text-sm outline-none resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-gray-700 placeholder-gray-300"
    />
  </div>
);