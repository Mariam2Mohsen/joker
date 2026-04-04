import { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import { ActionButton } from "./ActionButton";

export const DataTable = ({ columns, data, onAction }) => {
  const [sortConfig, setSortConfig] = useState({ key: "id", dir: "asc" });

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  };

  const sorted = [...data].sort((a, b) => {
    const av = a[sortConfig.key];
    const bv = b[sortConfig.key];
    if (av < bv) return sortConfig.dir === "asc" ? -1 : 1;
    if (av > bv) return sortConfig.dir === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <table className="min-w-full text-xs sm:text-sm">
      <thead className="bg-[#102C57] text-white">
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              onClick={() => handleSort(col.key)}
              className="px-2 sm:px-4 py-2 text-left cursor-pointer hover:bg-[#1a3a6e] transition-colors whitespace-nowrap"
            >
              {col.label}
            </th>
          ))}
          <th className="px-2 sm:px-4 py-2 text-center w-16">Action</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {sorted.map((row) => (
          <tr
            key={row.id}
            className="border-t border-[#DAC0A3] hover:bg-[#FEFAF6] transition-colors"
          >
            {columns.map((col) => (
              <td key={col.key} className="px-2 sm:px-4 py-2 text-[#102C57] whitespace-nowrap">
                {col.key === "status" ? (
                  <StatusBadge status={row[col.key]} />
                ) : (
                  row[col.key]
                )}
              </td>
            ))}
            <td className="px-2 sm:px-4 py-2 text-center">
              <ActionButton
                onView={() => onAction("view", row)}
                onEdit={() => onAction("edit", row)}
                onDelete={() => onAction("delete", row)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};