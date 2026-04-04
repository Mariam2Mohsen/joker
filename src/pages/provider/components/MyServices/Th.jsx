const Th = ({ key, label, sortConfig, onSort }) => {
  const isActive = sortConfig.key === key;
  const direction = sortConfig.dir;

  return (
    <th
      onClick={() => onSort(key)}
      className="px-2 sm:px-4 py-2 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-[#1a3a6e] transition-colors"
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive && (
          <span className="text-xs">{direction === "asc" ? "↑" : "↓"}</span>
        )}
      </div>
    </th>
  );
};

export default Th;