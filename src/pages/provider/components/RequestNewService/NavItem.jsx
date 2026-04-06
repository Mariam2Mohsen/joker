export const NavItem = ({ item, isOpen, onToggle }) => (
  <div>
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
        item.active
          ? "bg-gray-200 font-semibold text-gray-900"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <span className="flex items-center gap-3">
        <span>{item.icon}</span>
        <span className="text-left whitespace-pre-line">{item.label}</span>
      </span>
      {item.hasChildren && (
        <span className="text-xs text-gray-400 flex-shrink-0">
          {isOpen ? "∧" : "∨"}
        </span>
      )}
    </button>
    {isOpen &&
      item.children?.map((child) => (
        <div
          key={child}
          className={`pl-10 py-2 text-xs cursor-pointer border-l-2 ml-4 transition-colors ${
            child === "Add new Service"
              ? "text-gray-900 font-semibold border-gray-700 bg-gray-100"
              : "text-gray-600 border-gray-300 bg-gray-50 hover:bg-gray-100"
          }`}
        >
          • {child}
        </div>
      ))}
  </div>
);