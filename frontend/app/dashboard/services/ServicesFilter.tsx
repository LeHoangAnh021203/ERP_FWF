"use client";
import React, { useState, useEffect, useRef } from "react";
import { useDateRange } from "@/app/contexts/DateContext";

interface ServicesFilterProps {
  selectedRegions: string[];
  setSelectedRegions: (regions: string[] | ((prev: string[]) => string[])) => void;
  selectedBranches: string[];
  setSelectedBranches: (branches: string[] | ((prev: string[]) => string[])) => void;
  selectedServiceTypes: string[];
  setSelectedServiceTypes: (types: string[] | ((prev: string[]) => string[])) => void;
  selectedGenders: string[];
  setSelectedGenders: (genders: string[] | ((prev: string[]) => string[])) => void;
  regionOptions: Array<{ name: string; total: number }>;
  locationOptions: string[];
  filteredRegionOptions: Array<{ name: string; total: number }>;
  ALL_SERVICE_TYPES: Array<{ key: string; label: string }>;
  ALL_GENDERS: string[];
  filteredServiceTypes: Array<{ key: string; label: string }>;
  filteredGenders: string[];
  genderActualPrice: Array<{ gender: string; total: number }>;
  formatMoneyShort: (val: number) => string;
}

export default function ServicesFilter({
  selectedRegions,
  setSelectedRegions,
  selectedBranches,
  setSelectedBranches,
  selectedServiceTypes,
  setSelectedServiceTypes,
  selectedGenders,
  setSelectedGenders,
  regionOptions,
  locationOptions,
  filteredRegionOptions,
  ALL_SERVICE_TYPES,
  ALL_GENDERS,
  filteredServiceTypes,
  filteredGenders,
  genderActualPrice,
  formatMoneyShort,
}: ServicesFilterProps) {
  // Use global date context
  const { } = useDateRange();
  
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [regionSearch, setRegionSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");
  const [genderSearch, setGenderSearch] = useState("");
  
  const regionDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);
  const genderDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        regionDropdownRef.current &&
        !regionDropdownRef.current.contains(e.target as Node)
      ) {
        setShowRegionDropdown(false);
      }
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(e.target as Node)
      ) {
        setShowLocationDropdown(false);
      }
      if (
        serviceDropdownRef.current &&
        !serviceDropdownRef.current.contains(e.target as Node)
      ) {
        setShowServiceDropdown(false);
      }
      if (
        genderDropdownRef.current &&
        !genderDropdownRef.current.contains(e.target as Node)
      ) {
        setShowGenderDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="w-full flex flex-col gap-4 md:flex-row md:gap-10">
      {/* Filter */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full">
          {/* Region Dropdown */}
          <div
            className="relative w-full sm:w-auto"
            ref={regionDropdownRef}
          >
            <button
              className="bg-yellow-300 px-3 py-2 rounded-lg font-bold flex items-center gap-2 w-full sm:w-auto border-b-2 border-yellow-400"
              onClick={() => setShowRegionDropdown((v) => !v)}
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
                          setSelectedRegions((prev: string[]) =>
                            prev.includes(r.name)
                              ? prev.filter((x: string) => x !== r.name)
                              : [...prev, r.name]
                          );
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
          <div
            className="relative w-full sm:w-auto"
            ref={locationDropdownRef}
          >
            <button
              className="bg-yellow-300 px-3 py-2 rounded-lg font-bold flex items-center gap-2 w-full sm:w-auto border-b-2 border-yellow-400"
              onClick={() => setShowLocationDropdown((v) => !v)}
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
                  {locationOptions
                    .filter((loc) =>
                      loc
                        .toLowerCase()
                        .includes(locationSearch.toLowerCase())
                    )
                    .map((loc) => (
                      <label
                        key={loc}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-yellow-50 cursor-pointer border-b last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBranches.includes(loc)}
                          onChange={() => {
                            setSelectedBranches((prev: string[]) =>
                              prev.includes(loc)
                                ? prev.filter((x: string) => x !== loc)
                                : [...prev, loc]
                            );
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

          <div className="flex flex-wrap gap-2 mb-4">
            {/* Filter dịch vụ dạng dropdown */}
            <div
              className="relative w-full sm:w-auto"
              ref={serviceDropdownRef}
            >
              <button
                className="bg-yellow-300 px-3 py-2 rounded-lg font-bold flex items-center gap-2 w-full sm:w-auto border-b-2 border-yellow-400"
                onClick={() => setShowServiceDropdown((v) => !v)}
                type="button"
              >
                <span className="material-icons"></span> Services
              </button>
              {showServiceDropdown && (
                <div className="absolute z-20 bg-white shadow-xl rounded-b-lg w-full min-w-[180px] border border-yellow-200">
                  <div className="bg-yellow-200 px-4 py-2 font-bold flex items-center gap-2 border-b border-yellow-300">
                    <input
                      type="checkbox"
                      checked={
                        selectedServiceTypes.length ===
                        ALL_SERVICE_TYPES.length
                      }
                      onChange={() =>
                        setSelectedServiceTypes(
                          selectedServiceTypes.length ===
                            ALL_SERVICE_TYPES.length
                            ? []
                            : ALL_SERVICE_TYPES.map((s) => s.key)
                        )
                      }
                      className="accent-yellow-400"
                    />
                    Services
                  </div>
                  <div className="px-2 py-2 border-b">
                    <input
                      className="w-full border rounded px-2 py-1"
                      placeholder="Nhập để tìm kiếm"
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredServiceTypes.map((s) => (
                      <label
                        key={s.key}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-yellow-50 cursor-pointer border-b last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedServiceTypes.includes(s.key)}
                          onChange={() => {
                            setSelectedServiceTypes((prev: string[]) =>
                              prev.includes(s.key)
                                ? prev.filter((x: string) => x !== s.key)
                                : [...prev, s.key]
                            );
                          }}
                          className="accent-yellow-400"
                        />
                        <span className="font-medium">{s.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Filter giới tính dạng dropdown */}
            <div
              className="relative w-full sm:w-auto"
              ref={genderDropdownRef}
            >
              <button
                className="bg-yellow-300 px-3 py-2 rounded-lg font-bold flex items-center gap-2 w-full sm:w-auto border-b-2 border-yellow-400"
                onClick={() => setShowGenderDropdown((v) => !v)}
                type="button"
              >
                <span className="material-icons"></span> Gender
              </button>
              {showGenderDropdown && (
                <div className="absolute z-20 bg-white shadow-xl rounded-b-lg w-full min-w-[220px] border border-yellow-200">
                  <div className="bg-yellow-200 px-4 py-2 font-bold flex items-center gap-2 border-b border-yellow-300">
                    <input
                      type="checkbox"
                      checked={
                        selectedGenders.length === ALL_GENDERS.length
                      }
                      onChange={() =>
                        setSelectedGenders(
                          selectedGenders.length === ALL_GENDERS.length
                            ? []
                            : [...ALL_GENDERS]
                        )
                      }
                      className="accent-yellow-400"
                    />
                    Gender
                    <span className="ml-auto">Actual price </span>
                  </div>
                  <div className="px-2 py-2 border-b">
                    <input
                      className="w-full border rounded px-2 py-1"
                      placeholder="Nhập để tìm kiếm"
                      value={genderSearch}
                      onChange={(e) => setGenderSearch(e.target.value)}
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredGenders.map((g) => {
                      const price =
                        genderActualPrice.find((row) => row.gender === g)
                          ?.total || 0;
                      return (
                        <label
                          key={g}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-yellow-50 cursor-pointer border-b last:border-b-0 justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedGenders.includes(g)}
                                                              onChange={() => {
                                  setSelectedGenders((prev: string[]) =>
                                    prev.includes(g)
                                      ? prev.filter((x: string) => x !== g)
                                      : [...prev, g]
                                  );
                                }}
                              className="accent-yellow-400"
                            />
                            <span className="font-medium">{g}</span>
                          </span>
                          <span className="text-xs text-gray-500 min-w-[60px] text-right">
                            {formatMoneyShort(price)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}