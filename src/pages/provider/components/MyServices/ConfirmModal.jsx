const ConfirmModal = ({ open, name, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-auto overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">Delete Service</h3>
        </div>
        <div className="px-4 sm:px-6 py-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <strong>"{name}"</strong>? This cannot be undone.
          </p>
        </div>
        <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-end gap-3 bg-gray-50">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;