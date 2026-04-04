import { FormLabel } from "./FormLabel";

export const SelectField = ({
  label,
  required,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}) => (
  <div className="flex flex-col">
    <FormLabel required={required}>{label}</FormLabel>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full appearance-none border rounded px-3 py-2 text-sm outline-none pr-8 transition-all
          ${
            disabled
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              : "bg-white text-gray-700 border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 cursor-pointer hover:border-gray-400"
          }`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">
        ▼
      </span>
    </div>
  </div>
);