const PageBtn = ({ label, onClick, disabled, active }) => (
  <button onClick={onClick} disabled={disabled}
    className={`w-8 h-8 rounded text-sm font-medium transition-colors
      ${active  ? "bg-gray-800 text-white" : "border border-gray-300 text-gray-600 hover:bg-gray-100"}
      ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}>
    {label}
  </button>
);

const Pagination = ({ current, total, onChange, perPage, onPerPageChange }) => (
  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white text-sm text-gray-600">
    <div className="flex items-center gap-2">
      <span>Show</span>
      <input
        type="number"
        value={perPage}
        onChange={(e) => onPerPageChange(Math.max(1, Number(e.target.value)))}
        className="w-14 border border-gray-300 rounded px-2 py-1 text-center text-sm outline-none focus:ring-2 focus:ring-gray-400"
      />
      <span>Entries</span>
    </div>
    <div className="flex items-center gap-1">
      <PageBtn label="‹" onClick={() => onChange(current - 1)} disabled={current === 1} />
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <PageBtn key={p} label={String(p)} onClick={() => onChange(p)} active={p === current} />
      ))}
      <PageBtn label="›" onClick={() => onChange(current + 1)} disabled={current === total} />
    </div>
  </div>
);

export default Pagination;