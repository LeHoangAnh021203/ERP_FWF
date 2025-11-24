"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { X, AlertTriangle } from "lucide-react";
import type { Shift } from "./types";

interface RejectModalProps {
  shift: Shift;
  onReject: (reason: string) => void;
  onCancel: () => void;
}

export function RejectModal({ shift, onReject, onCancel }: RejectModalProps) {
  const [reason, setReason] = useState("");
  const [selectedReason, setSelectedReason] = useState("");

  const commonReasons = [
    "Không đủ nhân sự cho ca này",
    "Trùng lịch với ca khác",
    "Vượt quá giờ làm việc cho phép",
    "Không phù hợp với vị trí công việc",
    "Thông tin không đầy đủ",
    "Yêu cầu chỉnh sửa thông tin",
    "Khác (ghi rõ lý do)",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason =
      selectedReason === "Khác (ghi rõ lý do)"
        ? reason
        : selectedReason || reason;
    if (finalReason.trim()) {
      onReject(finalReason.trim());
    }
  };

  const handleReasonSelect = (value: string) => {
    setSelectedReason(value);
    if (value !== "Khác (ghi rõ lý do)") {
      setReason(value);
    } else {
      setReason("");
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
      <Card className='w-full max-w-md'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <AlertTriangle className='w-5 h-5 text-red-500' />
            Từ chối ca làm việc
          </CardTitle>
          <Button variant='ghost' size='sm' onClick={onCancel}>
            <X className='w-4 h-4' />
          </Button>
        </CardHeader>
        <CardContent>
          <div className='mb-4 p-3 bg-gray-50 rounded-lg'>
            <h4 className='font-medium mb-2'>Thông tin ca làm việc:</h4>
            <div className='text-sm text-gray-600 space-y-1'>
              <p>
                <strong>Nhân viên:</strong> {shift.employeeName}
              </p>
              <p>
                <strong>Ngày:</strong>{" "}
                {new Date(shift.date).toLocaleDateString("vi-VN")}
              </p>
              <p>
                <strong>Thời gian:</strong> {shift.startTime} - {shift.endTime}
              </p>
              <p>
                <strong>Vị trí:</strong> {shift.position}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <Label htmlFor='reasonSelect'>Lý do từ chối</Label>
              <Select value={selectedReason} onValueChange={handleReasonSelect}>
                <SelectTrigger>
                  <SelectValue>Chọn lý do từ chối</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {commonReasons.map((reasonOption) => (
                    <SelectItem key={reasonOption} value={reasonOption}>
                      {reasonOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(selectedReason === "Khác (ghi rõ lý do)" || !selectedReason) && (
              <div>
                <Label htmlFor='customReason'>
                  {selectedReason === "Khác (ghi rõ lý do)"
                    ? "Lý do cụ thể"
                    : "Hoặc nhập lý do tùy chỉnh"}
                </Label>
                <Textarea
                  id='customReason'
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder='Nhập lý do từ chối ca làm việc này...'
                  rows={3}
                  required={
                    selectedReason === "Khác (ghi rõ lý do)" || !selectedReason
                  }
                />
              </div>
            )}

            <div className='flex gap-2 pt-4'>
              <Button
                type='submit'
                className='flex-1 bg-red-600 hover:bg-red-700'
                disabled={!reason.trim() && !selectedReason}
              >
                Xác nhận từ chối
              </Button>
              <Button type='button' variant='outline' onClick={onCancel}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
