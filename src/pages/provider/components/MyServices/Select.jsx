const Select = ({ value, onChange, options, placeholder, className = "" }) => (
  <select
    value={value}
    onChange={onChange}
    className={`border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#DAC0A3] focus:border-transparent ${className}`}
  >
    <option value="">{placeholder}</option>
    {options.map((opt) => {
      if (typeof opt === "string") {
        return <option key={opt} value={opt}>{opt}</option>;
      }
      return <option key={opt.value} value={opt.value}>{opt.label}</option>;
    })}
  </select>
);

export default Select;