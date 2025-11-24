import React from "react";
import { useDateRange } from "@/app/contexts/DateContext";

interface OrderFilterProps {
  selectedRegions: string[];
  setSelectedRegions: (regions: string[]) => void;
  regionOptions: { name: string; total: number }[];
  regionSearch: string;
  setRegionSearch: (s: string) => void;
  filteredRegionOptions: { name: string; total: number }[];
  showRegionDropdown: boolean;
  setShowRegionDropdown: (v: boolean) => void;
  regionDropdownRef: React.RefObject<HTMLDivElement | null>;
  selectedBranches: string[];
  setSelectedBranches: (branches: string[]) => void;
  locationOptions: string[];
  locationSearch: string;
  setLocationSearch: (s: string) => void;
  filteredLocationOptions: string[];
  showLocationDropdown: boolean;
  setShowLocationDropdown: (v: boolean) => void;
  locationDropdownRef: React.RefObject<HTMLDivElement | null>;
}



const OrderFilter = React.memo(function OrderFilter({
  selectedRegions,
  setSelectedRegions,
  regionOptions,
  regionSearch,
  setRegionSearch,
  filteredRegionOptions,
  showRegionDropdown,
  setShowRegionDropdown,
  regionDropdownRef,
  selectedBranches,
  setSelectedBranches,
  locationOptions,
  locationSearch,
  setLocationSearch,
  filteredLocationOptions,
  showLocationDropdown,
  setShowLocationDropdown,
  locationDropdownRef,
}: OrderFilterProps) {
  // Get date range from global context
  const { } = useDateRange();

    
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4">
      {/* Date picker is now handled by global header component */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              {/* Region Dropdown */}
              <div className="relative" ref={regionDropdownRef}>
                <button
                  className="bg-yellow-300 px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 min-w-[180px] border-b-2 border-yellow-400 text-sm sm:text-base"
                  onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                  type="button"
                >
                  <span className="material-icons"></span> Region
                </button>
                {showRegionDropdown && (
                  <div className="absolute z-20 bg-white shadow-xl rounded-b-lg w-full min-w-[250px] border border-yellow-200">
                    <div className="bg-yellow-200 px-4 py-2 font-bold flex items-center gap-2 border-b border-yellow-300">
                      <input
                        type="checkbox"
                        checked={
                          selectedRegions.length === regionOptions.length
                        }
                        onChange={() =>
                          setSelectedRegions(
                            selectedRegions.length === regionOptions.length
                              ? []
                              : regionOptions.map((r) => r.name)
                          )
                        }
                        className="accent-yellow-400"
                      />
                      Region
                      <span className="ml-auto">Branches </span>
                    </div>
                    <div className="px-2 py-2 border-b">
                      <input
                        className="w-full border rounded px-2 py-1"
                        placeholder="Nhập để tìm kiếm"
                        value={regionSearch}
                        onChange={(e) => setRegionSearch(e.target.value)}
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredRegionOptions.map((r) => (
                        <label
                          key={r.name}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-yellow-50 cursor-pointer border-b last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={selectedRegions.includes(r.name)}
                            onChange={() => {
                              if (selectedRegions.includes(r.name)) {
                                setSelectedRegions(selectedRegions.filter((x: string) => x !== r.name));
                              } else {
                                setSelectedRegions([...selectedRegions, r.name]);
                              }
                            }}
                            className="accent-yellow-400"
                          />
                          <span className="font-medium">{r.name}</span>
                          <span className="ml-auto text-right min-w-[70px] font-semibold">
                            {r.total}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Location Dropdown */}
              <div className="relative" ref={locationDropdownRef}>
                <button
                  className="bg-yellow-300 px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 min-w-[180px] border-b-2 border-yellow-400 text-sm sm:text-base"
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  type="button"
                >
                  <span className="material-icons"></span> Locations
                </button>
                {showLocationDropdown && (
                  <div className="absolute z-20 bg-white shadow-xl rounded-b-lg w-full min-w-[220px] border border-yellow-200">
                    <div className="bg-yellow-100 px-4 py-2 font-bold flex items-center gap-2 border-b border-yellow-200">
                      <input
                        type="checkbox"
                        checked={
                          selectedBranches.length === locationOptions.length
                        }
                        onChange={() =>
                          setSelectedBranches(
                            selectedBranches.length === locationOptions.length
                              ? []
                              : [...locationOptions]
                          )
                        }
                        className="accent-yellow-400"
                      />
                      Locations
                    </div>
                    <div className="px-2 py-2 border-b">
                      <input
                        className="w-full border rounded px-2 py-1"
                        placeholder="Nhập để tìm kiếm"
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredLocationOptions.map((loc) => (
                        <label
                          key={loc}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-yellow-50 cursor-pointer border-b last:border-b-0"
                        >
                          <input
                            type="checkbox"
                            checked={selectedBranches.includes(loc)}
                            onChange={() => {
                              if (selectedBranches.includes(loc)) {
                                setSelectedBranches(selectedBranches.filter((x: string) => x !== loc));
                              } else {
                                setSelectedBranches([...selectedBranches, loc]);
                              }
                            }}
                            className="accent-yellow-400"
                          />
                          <span className="font-medium">{loc}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        
      );
    });
    
    export default OrderFilter;