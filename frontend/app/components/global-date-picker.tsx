"use client";

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CalendarDate, today, getLocalTimeZone, parseDate } from '@internationalized/date';
import { useDateRange } from '@/app/contexts/DateContext';
import { Button } from './ui/button';
import { Calendar, ChevronDown, RotateCcw, Check } from 'lucide-react';

interface GlobalDatePickerProps {
  className?: string;
  showResetButton?: boolean;
  compact?: boolean;
}

export function GlobalDatePicker({ 
  className = "", 
  showResetButton = true,
  compact = false 
}: GlobalDatePickerProps) {
  const { startDate, endDate, setStartDate, setEndDate, resetToDefault, isLoaded } = useDateRange();
  const [isOpen, setIsOpen] = useState(false);
  const [tempStartDate, setTempStartDate] = useState<CalendarDate | null>(null);
  const [tempEndDate, setTempEndDate] = useState<CalendarDate | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const portalDropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const [justApplied, setJustApplied] = useState(false);

  // Initialize temp dates when dropdown opens
  useEffect(() => {
    if (isOpen && isLoaded) {
      setTempStartDate(startDate);
      setTempEndDate(endDate);
    }
  }, [isOpen, startDate, endDate, isLoaded]);

  // Close dropdown when clicking outside (works for both in-DOM and portal dropdown)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedInsideTrigger = triggerRef.current?.contains(target);
      const clickedInsideInline = dropdownRef.current?.contains(target);
      const clickedInsidePortal = portalDropdownRef.current?.contains(target);
      if (!clickedInsideTrigger && !clickedInsideInline && !clickedInsidePortal) setIsOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApply = () => {
    if (tempStartDate && tempEndDate) {
      setStartDate(tempStartDate);
      setEndDate(tempEndDate);
    }
    setIsOpen(false);
    // visual feedback
    setJustApplied(true);
    window.setTimeout(() => setJustApplied(false), 900);
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsOpen(false);
  };

  const formatDate = (date: CalendarDate) => {
    return `${String(date.day).padStart(2, "0")}/${String(date.month).padStart(2, "0")}/${date.year}`;
  };

  const formatDateRange = () => {
    if (!isLoaded) return "Đang tải...";
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  // Compute dropdown position when opening
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const left = Math.min(rect.left, window.innerWidth - 360);
      setDropdownPos({ top: rect.bottom + window.scrollY + 8, left: left + window.scrollX, width: Math.max(rect.width, 360) });
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {!isLoaded ? (
        <div className="flex items-center gap-2">
          <div className="h-9 bg-gray-200 rounded-md animate-pulse w-48"></div>
        </div>
      ) : (
        <>
          {/* Animated Gradient Border Container */}
          <div ref={triggerRef} className="relative p-[2px] rounded-md bg-gradient-to-r from-[#f16a3f] via-[#0693e3] to-[#00d084] animate-gradient-x">
            <div className="absolute inset-0 rounded-md bg-gradient-to-r from-[#f16a3f] via-[#0693e3] to-[#00d084] opacity-75 animate-gradient-x blur-sm"></div>
            
            {/* Date Range Display Button */}
            <Button
              variant="outline"
              onClick={() => setIsOpen(!isOpen)}
              className={`relative bg-white hover:bg-gray-50 flex items-center gap-2 ${compact ? 'px-3 py-1.5 text-base' : 'px-4 py-2'} border-0 ${justApplied ? 'ring-2 ring-[#00d084] ring-offset-2 ring-offset-white animate-pulse' : ''}`}
            >
              <Calendar className="w-4 h-4" />
              <span className={compact ? 'text-[14px] font-medium' : 'text-[20px]'}>
                {formatDateRange()}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              {justApplied && (
                <span className="absolute -top-2 -right-2 bg-[#00d084] text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  <Check className="w-3 h-3" />
                </span>
              )}
            </Button>
          </div>

          {/* Reset Button */}
          {showResetButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetToDefault}
              className="ml-2"
              title="Reset về 7 ngày gần nhất"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}

          {/* Dropdown (rendered in portal to avoid clipping) */}
          {isOpen && dropdownPos && typeof window !== 'undefined' && createPortal(
            <div ref={portalDropdownRef} className="fixed bg-white border border-gray-200 rounded-lg shadow-2xl z-[1000]" style={{ top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width }}>
              <div className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Chọn khoảng thời gian</h3>
              
              {/* Quick Presets */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const todayDate = today(getLocalTimeZone());
                    setTempStartDate(todayDate);
                    setTempEndDate(todayDate);
                  }}
                >
                  Hôm nay
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const todayDate = today(getLocalTimeZone());
                    const yesterdayDate = todayDate.subtract({ days: 1 });
                    setTempStartDate(yesterdayDate);
                    setTempEndDate(yesterdayDate);
                  }}
                >
                  Hôm qua
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const todayDate = today(getLocalTimeZone());
                    setTempStartDate(todayDate.subtract({ days: 6 }));
                    setTempEndDate(todayDate);
                  }}
                >
                  7 ngày qua
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const todayDate = today(getLocalTimeZone());
                    setTempStartDate(todayDate.subtract({ days: 29 }));
                    setTempEndDate(todayDate);
                  }}
                >
                  30 ngày qua
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const todayDate = today(getLocalTimeZone());
                    setTempStartDate(todayDate.subtract({ days: 89 }));
                    setTempEndDate(todayDate);
                  }}
                >
                  90 ngày qua
                </Button>
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Từ ngày
                  </label>
                  <input
                    type="date"
                    value={tempStartDate ? `${tempStartDate.year}-${String(tempStartDate.month).padStart(2, "0")}-${String(tempStartDate.day).padStart(2, "0")}` : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        try {
                          const parsed = parseDate(e.target.value);
                          setTempStartDate(parsed);
                        } catch (error) {
                          console.error('Invalid date:', error);
                        }
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Đến ngày
                  </label>
                  <input
                    type="date"
                    value={tempEndDate ? `${tempEndDate.year}-${String(tempEndDate.month).padStart(2, "0")}-${String(tempEndDate.day).padStart(2, "0")}` : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        try {
                          const parsed = parseDate(e.target.value);
                          setTempEndDate(parsed);
                        } catch (error) {
                          console.error('Invalid date:', error);
                        }
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Hủy
              </Button>
              <Button
                size="sm"
                onClick={handleApply}
                disabled={!tempStartDate || !tempEndDate}
              >
                Áp dụng
              </Button>
            </div>
              </div>
            </div>,
            document.body
          )}
        </>
      )}
    </div>
  );
}
