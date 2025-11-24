"use client";

import { useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import type { Shift } from "./types";

interface CalendarProps {
  shifts: Shift[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export function Calendar({
  shifts,
  selectedDate,
  onDateSelect,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  const getShiftsForDate = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    // Sử dụng toLocaleDateString để đảm bảo format chính xác YYYY-MM-DD
    const dateStr = date.toLocaleDateString('en-CA');
    

    
    const dayShifts = shifts.filter((shift) => {
      return shift.date === dateStr;
    });
    return dayShifts;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleDateClick = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    onDateSelect(date);
  };

  const isSelectedDate = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleDayHover = (day: number, event: React.MouseEvent) => {
    const dayShifts = getShiftsForDate(day);
    if (dayShifts.length > 0) {
      setHoveredDay(day);
      setTooltipPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleDayLeave = () => {
    setHoveredDay(null);
  };



  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-3 sm:p-4 lg:p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="flex gap-1 sm:gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
          {dayNames.map((day) => (
            <div
              key={day}
              className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 flex-1">
          {emptyDays.map((day) => (
            <div key={`empty-${day}`} className="p-1 sm:p-2 h-16 sm:h-20"></div>
          ))}

          {days.map((day) => {
            const dayShifts = getShiftsForDate(day);
            const isSelected = isSelectedDate(day);

            return (
              <div
                key={day}
                className={cn(
                  "p-1 sm:p-2 h-16 sm:h-20 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors relative",
                  isSelected && "bg-blue-50 border-blue-300"
                )}
                onClick={() => handleDateClick(day)}
                onMouseEnter={(e) => handleDayHover(day, e)}
                onMouseLeave={handleDayLeave}
              >
                <div className="text-xs sm:text-sm font-medium mb-0.5 sm:mb-1 flex items-center justify-between">{day}

                                 {dayShifts.filter(shift => shift.employeeName && shift.employeeName.trim() !== '').length > 2 && (
                     <div className="text-[14px] text-red-500 rounded-full flex items-center justify-center ">
                       +{dayShifts.filter(shift => shift.employeeName && shift.employeeName.trim() !== '').length - 2}
                     </div>
                   )}
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  {dayShifts
                    .filter(shift => shift.employeeName && shift.employeeName.trim() !== '')
                    .slice(0, 2)
                    .map((shift) => (
                    <div
                      key={shift.id}
                      className={cn(
                        "text-xs px-1 py-0.5 rounded truncate",
                        shift.status === "approved" &&
                          "bg-green-100 text-green-800",
                        shift.status === "pending" &&
                          "bg-yellow-100 text-yellow-800",
                        shift.status === "rejected" && "bg-red-100 text-red-800"
                      )}
                    >
                      {shift.employeeName}
                    </div>
                  ))}
                 
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      {/* Popup hiển thị chi tiết ca làm việc */}
      {hoveredDay && (
        <div
          className="fixed z-50 bg-white border-2 border-orange-200 rounded-xl shadow-2xl p-4 max-w-md animate-in fade-in-0 zoom-in-95 duration-200"
          style={{
            left: Math.min(tooltipPosition.x + 15, window.innerWidth - 350),
            top: Math.max(tooltipPosition.y - 20, 20),
            transform: "translateY(-100%)",
          }}
        >
          {/* Header với ngày */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-orange-100">
            <div className="text-lg font-bold text-orange-600">
              Ngày {hoveredDay} - {monthNames[currentMonth.getMonth()]}{" "}
              {currentMonth.getFullYear()}
            </div>
            <div className="text-sm text-gray-500">
              {getShiftsForDate(hoveredDay).length} ca làm việc
            </div>
          </div>
          
          {/* Danh sách ca làm việc */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {getShiftsForDate(hoveredDay)
              .filter(shift => shift.employeeName && shift.employeeName.trim() !== '') // Lọc bỏ ca không có tên nhân viên
              .map((shift) => (
              <div key={shift.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{shift.employeeName}</div>
                  <div className="text-sm text-gray-600">
                    {shift.startTime} - {shift.endTime} • {shift.position}
                  </div>
                </div>
                <div className="ml-2">
                  {shift.status === "approved" && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Đã duyệt
                    </span>
                  )}
                  {shift.status === "pending" && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Chờ duyệt
                    </span>
                  )}
                  {shift.status === "rejected" && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Từ chối
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-2 border-t border-orange-100 text-xs text-gray-500 text-center">
            Click vào ngày để xem chi tiết đầy đủ
          </div>
        </div>
      )}
    </Card>
  );
}
