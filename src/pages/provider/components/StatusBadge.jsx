export const StatusBadge = ({ status }) => {
  const styles = {
    Active:    "bg-green-100 text-green-700 border border-green-300",
    Inactive:  "bg-gray-100 text-gray-500 border border-gray-300",
    Suspended: "bg-red-100 text-red-600 border border-red-300",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${styles[status] || styles.Inactive}`}>
      {status}
    </span>
  );
};