import { StatusTag } from "./StatusTag";

export const PageTitleBar = ({ title, status }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
    <div className="px-4 sm:px-5 py-2 sm:py-2.5 bg-white border border-gray-300 rounded text-xs sm:text-sm font-semibold text-gray-700 shadow-sm">
      {title}
    </div>
    {status && <StatusTag status={status} />}
  </div>
);