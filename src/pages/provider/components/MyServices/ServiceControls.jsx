import Select from "./Select";
import SearchBar from "./SearchBar";

const STATUS_OPTIONS = ["ALL", "Active", "Inactive"];
const BULK_OPTIONS = [
  { value: "activate", label: "Activate Selected" },
  { value: "deactivate", label: "Deactivate Selected" },
  { value: "delete", label: "Delete Selected" },
];

const ServiceControls = ({
  bulkAction,
  setBulkAction,
  applyBulk,
  selected,
  statusFilter,
  setStatusFilter,
  search,
  setSearch,
}) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 py-3 border-b border-[#DAC0A3] bg-white rounded-t-lg">
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
      <Select
        value={bulkAction}
        onChange={(e) => setBulkAction(e.target.value)}
        options={BULK_OPTIONS}
        placeholder="No Action"
        className="w-full sm:w-auto"
      />
      <button
        onClick={applyBulk}
        disabled={!bulkAction || !selected.length}
        className="w-full sm:w-auto px-5 py-2 bg-[#102C57] hover:bg-[#1a3a6e] text-white text-sm font-semibold rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Apply
      </button>
    </div>
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
      <Select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        options={STATUS_OPTIONS.slice(1)}
        placeholder="ALL"
        className="w-full sm:w-auto"
      />
      <SearchBar value={search} onChange={setSearch} className="w-full sm:w-auto" />
    </div>
  </div>
);

export default ServiceControls;