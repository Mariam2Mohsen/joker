const TrashBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    className="text-red-500 hover:text-red-700 transition-colors"
    aria-label="Delete"
  >
    🗑️
  </button>
);

export default TrashBtn;