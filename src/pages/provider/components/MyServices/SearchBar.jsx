const SearchBar = ({ value, onChange }) => (
  <div className="flex">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search..."
      className="border border-gray-300 border-r-0 rounded-l px-3 py-2 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-400 w-44 transition-all"
    />
    <button className="px-3 py-2 bg-gray-700 hover:bg-gray-900 rounded-r text-white transition-colors">
      🔍
    </button>
  </div>
);

export default SearchBar;