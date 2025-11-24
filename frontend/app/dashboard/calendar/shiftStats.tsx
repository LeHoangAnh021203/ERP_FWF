"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { Users, Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import type { Shift, Employee } from "./types";

interface ShiftStatsProps {
  shifts: Shift[];
  employees: Employee[];
  detailed?: boolean;
}

export function ShiftStats({
  shifts,
  employees,
  detailed = false,
}: ShiftStatsProps) {
  const totalShifts = shifts.length;
  const approvedShifts = shifts.filter(
    (shift) => shift.status === "approved",
  ).length;
  const pendingShifts = shifts.filter(
    (shift) => shift.status === "pending",
  ).length;
  const rejectedShifts = shifts.filter(
    (shift) => shift.status === "rejected",
  ).length;
  const activeEmployees = employees.filter((emp) => emp.isActive).length;

  const approvalRate =
    totalShifts > 0 ? (approvedShifts / totalShifts) * 100 : 0;

  // Calculate total working hours
  const totalHours = shifts
    .filter((shift) => shift.status === "approved")
    .reduce((total, shift) => {
      const start = new Date(`2000-01-01T${shift.startTime}`);
      const end = new Date(`2000-01-01T${shift.endTime}`);
      const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);

  // Position statistics
  const positionStats = shifts.reduce((acc, shift) => {
    acc[shift.position] = (acc[shift.position] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Employee workload
  const employeeWorkload = shifts.reduce((acc, shift) => {
    acc[shift.employeeName] = (acc[shift.employeeName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const basicStats = [
    {
      title: "Tổng ca làm",
      value: totalShifts,
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Nhân viên hoạt động",
      value: activeEmployees,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Ca đã duyệt",
      value: approvedShifts,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Ca chờ duyệt",
      value: pendingShifts,
      icon: AlertCircle,
      color: "text-yellow-600",
    },
    {
      title: "Ca bị từ chối",
      value: rejectedShifts,
      icon: AlertCircle,
      color: "text-red-600",
    },
  ];

  if (!detailed) {
    return (
      <div className='flex gap-2'>
        {basicStats.map((stat, index) => (
          <Card key={index} className='w-[250px]'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-3'>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <div>
                  <p className='text-2xl font-bold'>{stat.value}</p>
                  <p className='text-sm text-gray-600'>{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Clock className='w-5 h-5' />
              Thống kê thời gian
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <div className='flex justify-between mb-2'>
                <span>Tổng giờ làm việc đã duyệt</span>
                <span className='font-bold'>{totalHours.toFixed(1)} giờ</span>
              </div>
            </div>
            <div>
              <div className='flex justify-between mb-2'>
                <span>Tỷ lệ duyệt ca</span>
                <span className='font-bold'>{approvalRate.toFixed(1)}%</span>
              </div>
              <Progress value={approvalRate} className='h-2' />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê theo vị trí</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {Object.entries(positionStats)
                .sort(([, a], [, b]) => b - a)
                .map(([position, count]) => (
                  <div
                    key={position}
                    className='flex justify-between items-center'
                  >
                    <span className='text-sm'>{position}</span>
                    <div className='flex items-center gap-2'>
                      <div className='w-20 bg-gray-200 rounded-full h-2'>
                        <div
                          className='bg-blue-600 h-2 rounded-full'
                          style={{ width: `${(count / totalShifts) * 100}%` }}
                        />
                      </div>
                      <span className='text-sm font-medium w-8'>{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Khối lượng công việc nhân viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {Object.entries(employeeWorkload)
                .sort(([, a], [, b]) => b - a)
                .map(([employee, count]) => (
                  <div
                    key={employee}
                    className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'
                  >
                    <span className='font-medium'>{employee}</span>
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-600'>{count} ca</span>
                      <div className='w-16 bg-gray-200 rounded-full h-2'>
                        <div
                          className='bg-green-600 h-2 rounded-full'
                          style={{
                            width: `${Math.min(
                              (count /
                                Math.max(...Object.values(employeeWorkload))) *
                                100,
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
