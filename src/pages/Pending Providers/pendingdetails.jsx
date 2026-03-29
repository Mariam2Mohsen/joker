import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { pendingProvidersMock } from "../../datatest";
import { FaFilter, FaImage } from "react-icons/fa";

const ProviderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const found = pendingProvidersMock.find(
      (p) => p.users_id === id
    );
    setProvider(found);
  }, [id]);

  if (!provider) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-[#F5F6FA] min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <div className="bg-white px-6 py-3 rounded-lg shadow border-l-4 border-[#0d254a]">
          <h2 className="text-[#0d254a] font-semibold">
            Provider Details
          </h2>
        </div>

        <div className="flex gap-3">
          <button className="bg-[#0d254a] text-white px-6 py-2 rounded-lg hover:opacity-90">
            Accept
          </button>

          <button className="bg-black text-white px-6 py-2 rounded-lg hover:opacity-90">
            Reject
          </button>
        </div>

      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-6 mb-6">

        {/* Left */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-semibold mb-4 text-[#0d254a]">
            Provider Information
          </h3>

          <div className="space-y-2 text-sm text-gray-600">
            <p><b>Name:</b> {provider.full_name}</p>
            <p><b>Contact:</b> {provider.phone_number}</p>
            <p><b>Email:</b> {provider.email}</p>
            <p><b>Address:</b> {provider.address}</p>
          </div>
        </div>

        {/* Right */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-semibold mb-4 text-[#0d254a]">
            Provider Information
          </h3>

          <div className="space-y-2 text-sm text-gray-600">
            <p><b>Profile Image:</b> -</p>
            <p><b>Registration:</b> {provider.created_at}</p>
            <p><b>Service Area:</b> {provider.city}</p>

            <p>
              <b>Status:</b>{" "}
              <span className="ml-2 px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">
                Pending
              </span>
            </p>
          </div>
        </div>

      </div>

      {/* Requested Services */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">

          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-[#0d254a]">
              Requested Services
            </h3>
            <FaFilter className="text-gray-400 text-sm" />
          </div>

          <button className="bg-[#0d254a] text-white px-4 py-1 rounded-md text-sm">
            Action
          </button>

        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-6 text-sm text-gray-600 border-b pb-4 mb-4">

          <div>
            <p><b>Category:</b> {provider.category}</p>
            <p><b>Service:</b> {provider.service_name}</p>
            <p><b>Price Type:</b> Fixed</p>
          </div>

          <div>
            <p><b>Sub Category:</b> {provider.subcategory}</p>
            <p><b>Commission:</b> 10%</p>
            <p><b>Price:</b> {provider.price}</p>
          </div>

          <div>
            <p><b>Description:</b></p>
            <p className="text-gray-500 leading-relaxed">
              {provider.description}
            </p>
          </div>

        </div>

        {/* Service Image */}
        <div className="mb-4">
          <h4 className="font-medium mb-2 text-[#0d254a]">
            Service Image
          </h4>

          <div className="h-32 border rounded-lg flex items-center justify-center text-gray-400">
            <FaImage size={24} />
          </div>
        </div>

        {/* Gallery */}
        <div>
          <h4 className="font-medium mb-2 text-[#0d254a]">
            Service Gallery
          </h4>

          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-16 h-16 border rounded flex items-center justify-center text-gray-400"
              >
                <FaImage />
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={() => navigate("/admin/pending-providers")}
            className="bg-[#0d254a] text-white px-6 py-2 rounded-lg"
          >
            Accept
          </button>

          <button
            onClick={() => navigate("/admin/pending-providers")}
            className="bg-black text-white px-6 py-2 rounded-lg"
          >
            Reject
          </button>

        </div>

      </div>
    </div>
  );
};

export default ProviderDetails;