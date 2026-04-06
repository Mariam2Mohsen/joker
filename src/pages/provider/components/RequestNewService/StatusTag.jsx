export const StatusTag = ({ status }) => {
  const styles = {
    Accepted: "bg-green-500",
    Pending: "bg-yellow-500",
    Rejected: "bg-red-500",
  };
  return (
    <span
      className={`px-5 py-2 rounded text-white text-sm font-semibold ${
        styles[status] || "bg-gray-500"
      }`}
    >
      {status}
    </span>
  );
};