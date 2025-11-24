import React from "react";
import { CalendarDate } from "@internationalized/date";

interface CustomerFiltersProps {
  startDate: CalendarDate;
  endDate: CalendarDate;
  setStartDate: (date: CalendarDate) => void;
  setEndDate: (date: CalendarDate) => void;
  today: (tz: string) => CalendarDate;
  getLocalTimeZone: () => string;
  parseDate: (str: string) => CalendarDate;
  selectedType: string[];
  setSelectedType: (types: string[]) => void;
  showTypeDropdown: boolean;
  setShowTypeDropdown: (show: boolean) => void;
  customerTypes: string[];
  selectedStatus: string | null;
  setSelectedStatus: (status: string | null) => void;
  showStatusDropdown: boolean;
  setShowStatusDropdown: (show: boolean) => void;
  customerStatus: string[];
  selectedRegions: string[];
  setSelectedRegions: (regions: string[]) => void;
  showRegionDropdown: boolean;
  setShowRegionDropdown: (show: boolean) => void;
  allRegions: string[];
  selectedBranches: string[];
  setSelectedBranches: (branches: string[]) => void;
  showBranchDropdown: boolean;
  setShowBranchDropdown: (show: boolean) => void;
  allBranches: string[];
}

const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  today,
  getLocalTimeZone,
  parseDate,
  selectedType,
  setSelectedType,
  showTypeDropdown,
  setShowTypeDropdown,
  customerTypes,
  selectedStatus,
  setSelectedStatus,
  showStatusDropdown,
  setShowStatusDropdown,
  customerStatus,
  selectedRegions,
  setSelectedRegions,
  showRegionDropdown,
  setShowRegionDropdown,
  allRegions,
  selectedBranches,
  setSelectedBranches,
  showBranchDropdown,
  setShowBranchDropdown,
  allBranches,
}) => (
  <div className="flex flex-col gap-4 lg:gap-6 mb-4 lg:mb-6">
    {/* Date filters */}

    {/* Dropdown filters */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Filter loại khách */}
      <div className="relative">
        <button
          className="block border rounded p-2 w-full text-left bg-white shadow border-[orange] hover:bg-gray-50 transition-colors"
          onClick={() => setShowTypeDropdown(!showTypeDropdown)}
          type="button"
        >
          <span className="font-semibold">Loại khách</span>
          {selectedType.length > 0 && <span> ({selectedType.length})</span>}
          <span className="float-right">&#9660;</span>
        </button>
        {showTypeDropdown && (
          <div className="absolute z-20 bg-white border rounded shadow w-full mt-1 max-h-60 overflow-auto">
            <label className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={selectedType.length === 0}
                onChange={() => setSelectedType([])}
                className="mr-2"
              />
              Tất cả
            </label>
            {customerTypes.map((type) => (
              <label
                key={type}
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={selectedType.includes(type)}
                  onChange={() => {
                    if (selectedType.includes(type)) {
                      setSelectedType(selectedType.filter((t) => t !== type));
                    } else {
                      setSelectedType([...selectedType, type]);
                    }
                  }}
                  className="mr-2"
                />
                {type}
              </label>
            ))}
            <button
              className="w-full text-center py-2 text-orange-600 hover:underline"
              onClick={() => setShowTypeDropdown(false)}
              type="button"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
      {/* Filter khách mới/cũ */}
      <div className="relative">
        <button
          className="block border rounded p-2 w-full text-left bg-white shadow border-[orange] hover:bg-gray-50 transition-colors"
          onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          type="button"
        >
          <span className="font-semibold">Khách mới/cũ</span>
          {selectedStatus && <span>: {selectedStatus}</span>}
          <span className="float-right">&#9660;</span>
        </button>
        {showStatusDropdown && (
          <div className="absolute z-20 bg-white border rounded shadow w-full mt-1 max-h-60 overflow-auto">
            <label className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100">
              <input
                type="radio"
                name="customerStatus"
                checked={!selectedStatus}
                onChange={() => setSelectedStatus(null)}
                className="mr-2"
              />
              Tất cả
            </label>
            {customerStatus.map((status) => (
              <label
                key={status}
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="radio"
                  name="customerStatus"
                  checked={selectedStatus === status}
                  onChange={() => setSelectedStatus(status)}
                  className="mr-2"
                />
                {status}
              </label>
            ))}
            <button
              className="w-full text-center py-2 text-orange-600 hover:underline"
              onClick={() => setShowStatusDropdown(false)}
              type="button"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
      {/* Filter Region */}
      <div className="relative">
        <button
          className="block border rounded p-2 w-full text-left bg-white shadow border-[orange] hover:bg-gray-50 transition-colors"
          onClick={() => setShowRegionDropdown(!showRegionDropdown)}
          type="button"
        >
          <span className="font-semibold">Region</span>
          {selectedRegions.length > 0 && <span> ({selectedRegions.length})</span>}
          <span className="float-right">&#9660;</span>
        </button>
        {showRegionDropdown && (
          <div className="absolute z-20 bg-white border rounded shadow w-full mt-1 max-h-60 overflow-auto">
            <label className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={selectedRegions.length === 0}
                onChange={() => setSelectedRegions([])}
                className="mr-2"
              />
              Tất cả
            </label>
            {allRegions.map((region) => (
              <label
                key={region}
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={selectedRegions.includes(region)}
                  onChange={() => {
                    if (selectedRegions.includes(region)) {
                      setSelectedRegions(selectedRegions.filter((r) => r !== region));
                    } else {
                      setSelectedRegions([...selectedRegions, region]);
                    }
                  }}
                  className="mr-2"
                />
                {region}
              </label>
            ))}
            <button
              className="w-full text-center py-2 text-orange-600 hover:underline"
              onClick={() => setShowRegionDropdown(false)}
              type="button"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
      {/* Filter Branch */}
      <div className="relative">
        <button
          className="block border rounded p-2 w-full text-left bg-white shadow border-[orange]"
          onClick={() => setShowBranchDropdown(!showBranchDropdown)}
          type="button"
        >
          <span className="font-semibold">Branch</span>
          {selectedBranches.length > 0 && <span> ({selectedBranches.length})</span>}
          <span className="float-right">&#9660;</span>
        </button>
        {showBranchDropdown && (
          <div className="absolute z-20 bg-white border rounded shadow w-64 mt-1 max-h-60 overflow-auto">
            <label className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={selectedBranches.length === 0}
                onChange={() => setSelectedBranches([])}
                className="mr-2"
              />
              Tất cả
            </label>
            {allBranches.map((branch) => (
              <label
                key={branch}
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={selectedBranches.includes(branch)}
                  onChange={() => {
                    if (selectedBranches.includes(branch)) {
                      setSelectedBranches(selectedBranches.filter((b) => b !== branch));
                    } else {
                      setSelectedBranches([...selectedBranches, branch]);
                    }
                  }}
                  className="mr-2"
                />
                {branch}
              </label>
            ))}
            <button
              className="w-full text-center py-2 text-orange-600 hover:underline"
              onClick={() => setShowBranchDropdown(false)}
              type="button"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default CustomerFilters;