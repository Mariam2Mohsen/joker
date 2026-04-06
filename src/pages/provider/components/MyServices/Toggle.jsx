const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors focus:outline-none ${
      checked ? "bg-[#102C57]" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block w-3 h-3 transform bg-white rounded-full transition-transform ${
        checked ? "translate-x-5" : "translate-x-1"
      }`}
    />
  </button>
);

export default Toggle;