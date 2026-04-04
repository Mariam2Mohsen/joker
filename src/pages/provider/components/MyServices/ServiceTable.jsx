import Toggle from "./Toggle";
import TrashBtn from "./TrashBtn";
import Th from "./Th";

const ServicesTable = ({
  services,
  selected,
  toggleOne,
  handleToggle,
  setDelTarget,
  sortConfig,
  handleSort,
  allChecked,
  toggleAll,
  onEdit,
}) => {
  const HEADERS = [
    { key: "name", label: "Service" },
    { key: "category", label: "Category" },
    { key: "pricing", label: "Pricing" },
    { key: "active", label: "Status" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs sm:text-sm">
        <thead className="bg-[#102C57] text-white">
          <tr>
            <th className="px-2 sm:px-4 py-2 text-center">
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
                className="accent-[#EADBC8]"
              />
            </th>
            {HEADERS.map((h) => (
              <Th
                key={h.key}
                {...h}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            ))}
            <th className="px-2 sm:px-4 py-2 text-center text-xs font-medium">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#DAC0A3]">
          {services.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-500 italic">
                No services found.
              </td>
            </tr>
          )}
          {services.map((row, index) => (
            <tr
              key={row.id}
              className={`hover:bg-amber-50 transition-colors ${
                index % 2 === 0 ? "bg-white" : "bg-[#FEFAF6]/50"
              } ${selected.includes(row.id) ? "!bg-amber-100" : ""}`}
            >
              <td className="px-2 sm:px-4 py-2 text-center">
                <input
                  type="checkbox"
                  checked={selected.includes(row.id)}
                  onChange={() => toggleOne(row.id)}
                  className="accent-[#102C57]"
                />
              </td>
              <td className="px-2 sm:px-4 py-2 text-center text-gray-800">
                <span className="block sm:hidden font-semibold text-[#102C57]">Service:</span>
                {row.name}
              </td>
              <td className="px-2 sm:px-4 py-2 text-center text-gray-600">
                <span className="block sm:hidden font-semibold text-[#102C57]">Category:</span>
                {row.category}
              </td>
              <td className="px-2 sm:px-4 py-2 text-center text-gray-700">
                <span className="block sm:hidden font-semibold text-[#102C57]">Pricing:</span>
                {row.pricing}
              </td>
              <td className="px-2 sm:px-4 py-2 text-center">
                <span className="block sm:hidden font-semibold text-[#102C57] mb-1">Status:</span>
                <Toggle
                  checked={row.active}
                  onChange={() => handleToggle(row.id)}
                />
              </td>
              <td className="px-2 sm:px-4 py-2 text-center">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                  <button
                    onClick={() => onEdit(row)}
                    className="text-amber-700 hover:text-amber-900 text-xs sm:text-sm font-medium hover:underline transition-colors"
                  >
                    Edit
                  </button>
                  <TrashBtn onClick={() => setDelTarget(row)} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesTable;