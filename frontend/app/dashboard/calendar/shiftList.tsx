"use client";

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/components/ui/collapsible";
import {
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  ChevronDown,
  History,
  AlertTriangle,
} from "lucide-react";
import type { Shift } from "./types";

interface ShiftListProps {
  shifts: Shift[];
  onEdit: (shift: Shift) => void;
  onDelete: (shiftId: string) => void;
  onApprove: (shiftId: string) => void;
  onReject: (shift: Shift) => void;
  onDuplicate?: (shift: Shift) => void;
  showActions?: boolean;
}

export function ShiftList({
  shifts,
  onEdit,
  onDelete,
  onApprove,
  onReject,

  showActions = false,
}: ShiftListProps) {
  const getStatusBadge = (status: Shift["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Đã duyệt</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>
        );
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Từ chối</Badge>;
    }
  };

  const getPriorityBadge = (priority: Shift["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">Cao</Badge>;
      case "normal":
        return <Badge className="bg-blue-100 text-blue-800">Bình thường</Badge>;
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">Thấp</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("vi-VN");
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  };

  if (shifts.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 text-gray-500">
        <div className="max-w-sm mx-auto">
          <Clock className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg sm:text-xl font-medium mb-2 text-gray-600">
            Không có ca làm việc nào
          </h3>
          <p className="text-sm sm:text-base text-gray-500">
            Chưa có ca làm việc nào được tạo cho thời gian này.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[600px] overflow-y-auto space-y-3 pr-3 custom-scrollbar">
      {shifts.map((shift) => (
        <Card
          key={shift.id}
          className="p-3 sm:p-4 hover:shadow-md transition-shadow duration-200"
        >
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              {/* Main content */}
              <div className="flex-1 min-w-0">
                {/* Header with badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <h4 className="font-medium text-base sm:text-lg truncate">
                    {shift.employeeName}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {getStatusBadge(shift.status)}
                    {getPriorityBadge(shift.priority)}
                    {shift.priority === "high" && (
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                </div>

                {/* Shift details */}
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📅</span>
                    <span>{formatDate(shift.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">⏰</span>
                    <span>
                      {shift.startTime} - {shift.endTime} (
                      {calculateDuration(shift.startTime, shift.endTime)})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">💼</span>
                    <span className="truncate">{shift.position}</span>
                  </div>

                  {shift.notes && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 mt-0.5">📝</span>
                      <span className="text-sm bg-gray-50 p-2 rounded-lg flex-1">
                        {shift.notes}
                      </span>
                    </div>
                  )}

                  {shift.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">⚠️</span>
                        <div className="flex-1">
                          <p className="text-red-800 font-medium text-sm">
                            Lý do từ chối:
                          </p>
                          <p className="text-red-700 text-sm mt-1">
                            {shift.rejectionReason}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Approval history */}
                {shift.approvalHistory && shift.approvalHistory.length > 0 && (
                  <Collapsible className="mt-4">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-2 h-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <History className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          Lịch sử phê duyệt ({shift.approvalHistory.length})
                        </span>
                        <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                        {shift.approvalHistory.map((history) => (
                          <div
                            key={history.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm"
                          >
                            <div className="flex items-center gap-2">
                              {history.action === "approved" ? (
                                <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                              ) : (
                                <X className="w-4 h-4 text-red-600 flex-shrink-0" />
                              )}
                              <span className="text-gray-700">
                                {history.action === "approved"
                                  ? "Đã duyệt"
                                  : "Từ chối"}{" "}
                                bởi {history.approvedBy}
                              </span>
                            </div>
                            <span className="text-gray-500 text-xs sm:text-sm">
                              {formatDateTime(history.approvedAt)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>

              {/* Action buttons */}
              {showActions && (
                <div className="flex flex-wrap gap-1 sm:gap-2 sm:flex-col sm:flex-shrink-0">
                  {shift.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onApprove(shift.id)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 hover:border-green-300 transition-colors"
                        title="Duyệt ca làm"
                      >
                        <Check className="w-4 h-4" />
                        <span className="hidden sm:inline ml-1">Duyệt</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onReject(shift)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 transition-colors"
                        title="Từ chối ca làm"
                      >
                        <X className="w-4 h-4" />
                        <span className="hidden sm:inline ml-1">Từ chối</span>
                      </Button>
                    </>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(shift)}
                    title="Chỉnh sửa"
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Sửa</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDelete(shift.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 transition-colors"
                    title="Xóa ca làm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Xóa</span>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
