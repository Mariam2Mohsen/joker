export const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex flex-wrap justify-center gap-1 sm:gap-2 py-2 sm:py-3">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-2 sm:px-3 py-1 border rounded disabled:opacity-40 text-xs sm:text-sm"
    >
      ‹
    </button>
    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
      <button
        key={p}
        onClick={() => onPageChange(p)}
        className={`px-2 sm:px-3 py-1 border rounded text-xs sm:text-sm ${
          p === currentPage ? "bg-gray-700 text-white" : ""
        }`}
      >
        {p}
      </button>
    ))}
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-2 sm:px-3 py-1 border rounded disabled:opacity-40 text-xs sm:text-sm"
    >
      ›
    </button>
  </div>
);