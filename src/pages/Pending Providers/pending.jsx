import React, { useEffect, useState } from "react";
import { FaSearch, FaEllipsisV } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { pendingProvidersMock } from "../../datatest";

const PendingProviders = () => {
  const [providers, setProviders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setProviders(pendingProvidersMock);
  }, []);

  return (
    <div className="p-6 bg-[#F5F6FA] min-h-screen">

      {/* Title */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[#0d254a]">
          Pending Providers Management
        </h2>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border p-5">

        {/* Top Actions */}
        <div className="flex justify-between items-center mb-5">

          {/* Left */}
          <div className="flex items-center gap-3">
            <select className="border px-4 py-2 rounded-lg text-sm bg-gray-50 focus:outline-none">
              <option>No Action</option>
              <option>Approve</option>
              <option>Reject</option>
            </select>

            <button className="bg-[#0d254a] text-white px-5 py-2 rounded-lg text-sm hover:opacity-90">
              Apply
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">

            <select className="border px-3 py-2 rounded-lg text-sm bg-gray-50">
              <option>ALL</option>
              <option>Pending</option>
            </select>

            <div className="flex items-center border rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-2 text-sm outline-none"
              />
              <button className="bg-[#0d254a] text-white px-3 h-full">
                <FaSearch size={12} />
              </button>
            </div>

          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border">

          <table className="w-full text-sm">

            <thead className="bg-[#0d254a] text-white text-xs uppercase tracking-wide">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Joining Date</th>
                <th className="p-3 text-left">Provider Type</th>
                <th className="p-3 text-left">Services</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {providers.map((p, index) => (
                <tr
                  key={p.users_id}
                  className={`border-b hover:bg-gray-50 transition ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="p-3 font-medium text-[#0d254a]">
                    {p.full_name}
                  </td>

                  <td className="p-3 text-gray-600">
                    {p.created_at}
                  </td>

                  <td className="p-3 text-gray-600">
                    Provider
                  </td>

                  <td className="p-3 text-gray-600">
                    {p.service_name}
                  </td>

                  <td className="p-3 text-gray-600">
                    {p.phone_number}
                  </td>

                  <td className="p-3">
                    <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                      Pending
                    </span>
                  </td>

                  <td className="p-3 text-center">

                    <button
                      onClick={() =>
                        navigate(`/admin/pending-providers/${p.users_id}`)
                      }
                      className="flex items-center justify-center gap-2 bg-[#0d254a] text-white px-3 py-1.5 rounded-md text-xs hover:opacity-90"
                    >
                      View
                      <FaEllipsisV size={10} />
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">

          <div>
            Show
            <select className="mx-2 border px-2 py-1 rounded">
              <option>10</option>
              <option>20</option>
            </select>
            Entries
          </div>

          <div className="flex items-center gap-2">
            <button className="px-2 py-1 border rounded">‹</button>
            <button className="px-3 py-1 bg-[#0d254a] text-white rounded">
              1
            </button>
            <button className="px-2 py-1 border rounded">›</button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PendingProviders;