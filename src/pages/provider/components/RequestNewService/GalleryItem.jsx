export const GalleryItem = ({ name, onRemove }) => (
  <div className="flex items-center justify-between px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm text-gray-600 mt-2">
    <span className="truncate">{name}</span>
    <button
      type="button"
      onClick={onRemove}
      className="ml-2 text-gray-500 hover:text-red-500 transition-colors font-bold text-lg leading-none"
    >
      ×
    </button>
  </div>
);