export const FormLabel = ({ children, required }) => (
  <label className="block text-xs font-semibold text-gray-700 mb-1">
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);