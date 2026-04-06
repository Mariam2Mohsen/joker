export const TableControls = ({ search, onSearch, filter, onFilter, filterOptions }) => (
  <div className="flex flex-wrap gap-2 p-2 sm:p-3 border-b bg-white rounded-t-lg">
    <select
      value={filter}
      onChange={e => onFilter(e.target.value)}
      className="border px-2 sm:px-3 py-1.5 sm:py-2 rounded text-xs sm:text-sm flex-1 sm:flex-none"
    >
      {filterOptions.map(o => <option key={o}>{o}</option>)}
    </select>
    <input
      value={search}
      onChange={e => onSearch(e.target.value)}
      placeholder="Search..."
      className="border px-2 sm:px-3 py-1.5 sm:py-2 rounded text-xs sm:text-sm flex-1"
    />
  </div>
);