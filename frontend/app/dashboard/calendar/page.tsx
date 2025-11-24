"use client";

import { useState, useEffect } from "react";
import { useLocalStorageState } from "@/app/hooks/useLocalStorageState";
import { Calendar } from "./calendar";
import { ShiftForm } from "./shiftForm";
import { ShiftList } from "./shiftList";
import { EmployeeManager } from "./employeeManager";
import { ShiftTemplates } from "./shiftTemplates";
import { ShiftStats } from "./shiftStats";
import { ApprovalWorkflow } from "./approvalWorkflow";
import { RejectModal } from "./rejectModal";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Plus, Search } from "lucide-react";

import type { Employee, Shift, ShiftTemplate } from "./types";

export interface ApprovalHistory {
  id: string;
  action: "approved" | "rejected" | "pending";
  approvedBy: string;
  approvedAt: string;
  reason?: string;
  previousStatus?: "pending" | "approved" | "rejected";
}

export default function WorkSchedulePage() {
  const [employees, setEmployees, employeesLoaded] = useLocalStorageState<
    Employee[]
  >("calendar-employees", []);

  // Đảm bảo luôn có dữ liệu mẫu employees khi khởi tạo
  useEffect(() => {
    if (employeesLoaded && employees.length === 0) {
      const sampleEmployees: Employee[] = [
        {
          id: "1",
          name: "Nguyễn Văn A",
          position: "Nhân viên bán hàng",
          email: "nguyenvana@email.com",
          phone: "0123456789",
          isActive: true,
        },
        {
          id: "2",
          name: "Trần Thị B",
          position: "Thu ngân",
          email: "tranthib@email.com",
          phone: "0987654321",
          isActive: true,
        },
      ];
      setEmployees(sampleEmployees);
    }
  }, [employeesLoaded, employees.length, setEmployees]);

  const [shiftTemplates, setShiftTemplates, templatesLoaded] =
    useLocalStorageState<ShiftTemplate[]>("calendar-templates", []);

  // Đảm bảo luôn có dữ liệu mẫu templates khi khởi tạo
  useEffect(() => {
    if (templatesLoaded && shiftTemplates.length === 0) {
      const sampleTemplates: ShiftTemplate[] = [
        {
          id: "1",
          name: "Ca sáng",
          startTime: "08:00",
          endTime: "16:00",
          position: "Nhân viên bán hàng",
          description: "Ca làm việc buổi sáng",
        },
        {
          id: "2",
          name: "Ca chiều",
          startTime: "14:00",
          endTime: "22:00",
          position: "Thu ngân",
          description: "Ca làm việc buổi chiều",
        },
      ];
      setShiftTemplates(sampleTemplates);
    }
  }, [templatesLoaded, shiftTemplates.length, setShiftTemplates]);

  const [shifts, setShifts, shiftsLoaded] = useLocalStorageState<Shift[]>(
    "calendar-shifts",
    [],
  );

  // Đảm bảo luôn có dữ liệu mẫu khi khởi tạo
  useEffect(() => {
    if (shiftsLoaded && shifts.length === 0) {
      const sampleShifts: Shift[] = [
        {
          id: "1",
          employeeName: "Nguyễn Văn A",
          employeeId: "1",
          date: "2025-08-15",
          startTime: "08:00",
          endTime: "16:00",
          position: "Nhân viên bán hàng",
          status: "approved",
          approvalHistory: [
            {
              id: "1",
              action: "approved",
              approvedBy: "Quản lý A",
              approvedAt: "2024-01-10T10:30:00",
              previousStatus: "pending",
            },
          ],
          priority: "normal",
          submittedAt: "2024-01-10T09:00:00",
        },
        {
          id: "2",
          employeeName: "Trần Thị B",
          employeeId: "2",
          date: "2025-08-15",
          startTime: "14:00",
          endTime: "22:00",
          position: "Thu ngân",
          status: "pending",
          approvalHistory: [],
          priority: "high",
          submittedAt: "2024-01-12T14:00:00",
        },
        {
          id: "3",
          employeeName: "Nguyễn Văn A",
          employeeId: "1",
          date: "2025-08-14",
          startTime: "08:00",
          endTime: "16:00",
          position: "Nhân viên bán hàng",
          status: "pending",
          approvalHistory: [],
          priority: "normal",
          submittedAt: "2024-08-10T09:00:00",
        },
        {
          id: "4",
          employeeName: "Trần Thị B",
          employeeId: "2",
          date: "2025-08-14",
          startTime: "08:00",
          endTime: "16:00",
          position: "Thu ngân",
          status: "pending",
          approvalHistory: [],
          priority: "normal",
          submittedAt: "2024-08-10T10:00:00",
        },
        {
          id: "5",
          employeeName: "Nguyễn Văn C",
          employeeId: "3",
          date: "2025-08-02",
          startTime: "09:00",
          endTime: "17:00",
          position: "Nhân viên bán hàng",
          status: "approved",
          approvalHistory: [
            {
              id: "2",
              action: "approved",
              approvedBy: "Quản lý B",
              approvedAt: "2024-01-01T10:30:00",
              previousStatus: "pending",
            },
          ],
          priority: "high",
          submittedAt: "2024-01-01T09:00:00",
        },
      ];
      setShifts(sampleShifts);
    }
  }, [shiftsLoaded, shifts.length, setShifts]);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showShiftForm, setShowShiftForm] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingShift, setRejectingShift] = useState<Shift | null>(null);

  const [searchTerm, setSearchTerm] = useLocalStorageState<string>(
    "calendar-search",
    "",
  );
  const [statusFilter, setStatusFilter] = useLocalStorageState<string>(
    "calendar-status-filter",
    "all",
  );
  const [positionFilter, setPositionFilter] = useLocalStorageState<string>(
    "calendar-position-filter",
    "all",
  );

  const handleAddShift = (
    shiftData: Omit<Shift, "id" | "status" | "approvalHistory" | "submittedAt">,
  ) => {
    console.log("Received shift data:", shiftData); // Debug log
    console.log("Date from form:", shiftData.date); // Debug log
    console.log("Selected date:", selectedDate.toLocaleDateString("en-CA")); // Debug log

    const newShift: Shift = {
      ...shiftData,
      id: Date.now().toString(),
      status: "pending",
      approvalHistory: [],
      priority: shiftData.priority || "normal",
      submittedAt: new Date().toISOString(),
    };
    console.log("Created new shift:", newShift); // Debug log
    console.log("New shift date:", newShift.date); // Debug log
    const updatedShifts = [...shifts, newShift];
    console.log("Updated shifts array:", updatedShifts); // Debug log
    setShifts(updatedShifts);
    setShowShiftForm(false);
  };

  const handleEditShift = (
    shiftData: Omit<Shift, "id" | "status" | "approvalHistory" | "submittedAt">,
  ) => {
    if (editingShift) {
      const updatedShift = {
        ...editingShift,
        ...shiftData,
        approvalHistory: editingShift.approvalHistory,
        submittedAt: editingShift.submittedAt,
      };
      setShifts(
        shifts.map((shift) =>
          shift.id === editingShift.id ? updatedShift : shift,
        ),
      );
      setEditingShift(null);
      setShowShiftForm(false);
    }
  };

  const handleDeleteShift = (shiftId: string) => {
    setShifts(shifts.filter((shift) => shift.id !== shiftId));
  };

  const handleApproveShift = (shiftId: string) => {
    setShifts(
      shifts.map((shift) => {
        if (shift.id === shiftId) {
          const newHistory: ApprovalHistory = {
            id: Date.now().toString(),
            action: "approved",
            approvedBy: "Quản lý hệ thống",
            approvedAt: new Date().toISOString(),
            previousStatus: shift.status,
          };

          return {
            ...shift,
            status: "approved" as const,
            approvalHistory: [...(shift.approvalHistory || []), newHistory],
            rejectionReason: undefined,
          };
        }
        return shift;
      }),
    );
  };

  const handleRejectShift = (shiftId: string, reason?: string) => {
    setShifts(
      shifts.map((shift) => {
        if (shift.id === shiftId) {
          const newHistory: ApprovalHistory = {
            id: Date.now().toString(),
            action: "rejected",
            approvedBy: "Quản lý hệ thống",
            approvedAt: new Date().toISOString(),
            reason,
            previousStatus: shift.status,
          };

          return {
            ...shift,
            status: "rejected" as const,
            approvalHistory: [...(shift.approvalHistory || []), newHistory],
            rejectionReason: reason,
          };
        }
        return shift;
      }),
    );
  };

  const handleBulkApprove = (shiftIds: string[]) => {
    setShifts(
      shifts.map((shift) => {
        if (shiftIds.includes(shift.id) && shift.status === "pending") {
          const newHistory: ApprovalHistory = {
            id: Date.now().toString(),
            action: "approved",
            approvedBy: "Quản lý hệ thống",
            approvedAt: new Date().toISOString(),
            previousStatus: shift.status,
          };
          return {
            ...shift,
            status: "approved" as const,
            approvalHistory: [...(shift.approvalHistory || []), newHistory],
          };
        }
        return shift;
      }),
    );
  };

  const handleDuplicateShift = (shift: Shift) => {
    const newShift: Shift = {
      ...shift,
      id: Date.now().toString(),
      status: "pending",
      date: shift.date, // Giữ nguyên ngày của shift gốc
      approvalHistory: [],
      submittedAt: new Date().toISOString(),
      rejectionReason: undefined,
    };
    setShifts([...shifts, newShift]);
  };

  const handleClearAllData = () => {
    if (
      confirm(
        "Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.",
      )
    ) {
      // Xóa tất cả localStorage keys
      localStorage.removeItem("calendar-employees");
      localStorage.removeItem("calendar-templates");
      localStorage.removeItem("calendar-shifts");
      localStorage.removeItem("calendar-search");
      localStorage.removeItem("calendar-status-filter");
      localStorage.removeItem("calendar-position-filter");

      // Reload trang để load lại dữ liệu mẫu
      window.location.reload();
    }
  };

  const openEditForm = (shift: Shift) => {
    setEditingShift(shift);
    setShowShiftForm(true);
  };

  const closeForm = () => {
    setShowShiftForm(false);
    setEditingShift(null);
  };

  const openRejectModal = (shift: Shift) => {
    setRejectingShift(shift);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectingShift(null);
  };

  const handleRejectWithReason = (reason: string) => {
    if (rejectingShift) {
      handleRejectShift(rejectingShift.id, reason);
      closeRejectModal();
    }
  };

  const filteredShifts = shifts.filter((shift) => {
    const matchesSearch =
      shift.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shift.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || shift.status === statusFilter;
    const matchesPosition =
      positionFilter === "all" || shift.position === positionFilter;

    return matchesSearch && matchesStatus && matchesPosition;
  });

  const uniquePositions = Array.from(
    new Set(shifts.map((shift) => shift.position)),
  );

  // Check if all data is loaded to prevent hydration mismatch
  const isDataLoaded = employeesLoaded && templatesLoaded && shiftsLoaded;

  // Show loading state until data is loaded
  if (!isDataLoaded) {
    return (
      <div className='container mx-auto p-6'>
        <div className='flex items-center justify-center h-64'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
            <p className='text-gray-600'>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6'>
        <div className='flex justify-between items-start'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              Calendar Report
            </h1>
            <p className='text-gray-600'>
              Quản lý lịch làm việc của nhân viên với tính năng duyệt và chỉnh
              sửa
            </p>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={handleClearAllData}
              className='text-red-600 border-red-600 hover:bg-red-50'
            >
              Xóa dữ liệu
            </Button>
          </div>
        </div>
      </div>

      <div className='mb-6 '>
        <ShiftStats shifts={shifts} employees={employees} />
      </div>

      <Tabs defaultValue='calendar' className='space-y-6 '>
        <TabsList className='grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 bg-orange-100 overflow-x-auto'>
          <TabsTrigger value='calendar' className='text-xs sm:text-sm'>
            Lịch làm việc
          </TabsTrigger>
          <TabsTrigger value='shifts' className='text-xs sm:text-sm'>
            Danh sách ca
          </TabsTrigger>
          <TabsTrigger value='approval' className='text-xs sm:text-sm'>
            Phê duyệt
          </TabsTrigger>
          <TabsTrigger value='employees' className='text-xs sm:text-sm'>
            Nhân viên
          </TabsTrigger>
          <TabsTrigger value='templates' className='text-xs sm:text-sm'>
            Mẫu ca làm
          </TabsTrigger>
          <TabsTrigger value='reports' className='text-xs sm:text-sm'>
            Báo cáo
          </TabsTrigger>
        </TabsList>

        <TabsContent value='calendar' className='space-y-6'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
            <h2 className='text-lg sm:text-xl font-semibold'>
              Lịch theo chi nhánh
            </h2>
            <Button
              onClick={() => setShowShiftForm(true)}
              className='bg-orange-500 w-full sm:w-auto'
            >
              <Plus className='w-4 h-4 mr-2' />
              Thêm ca làm
            </Button>
          </div>

          <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6'>
            <div className='xl:col-span-2'>
              <Calendar
                shifts={shifts}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>
            <div className='xl:col-span-1'>
              <Card className='h-fit'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-base sm:text-lg'>
                    Ca làm ngày {selectedDate.toLocaleDateString("vi-VN")}
                  </CardTitle>
                </CardHeader>
                <CardContent className='pt-0'>
                  <ShiftList
                    shifts={shifts.filter(
                      (shift) =>
                        shift.date === selectedDate.toLocaleDateString("en-CA"),
                    )}
                    onEdit={openEditForm}
                    onDelete={handleDeleteShift}
                    onApprove={handleApproveShift}
                    onReject={openRejectModal}
                    onDuplicate={handleDuplicateShift}
                    showActions={true}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value='shifts'>
          <Card>
            <CardHeader>
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                <CardTitle className='text-lg sm:text-xl'>
                  Tất cả ca làm việc
                </CardTitle>
                <div className='flex flex-col sm:flex-row gap-2 w-full sm:w-auto'>
                  <Button
                    onClick={() => setShowShiftForm(true)}
                    className='w-full sm:w-auto'
                  >
                    <Plus className='w-4 h-4 mr-2' />
                    Thêm ca làm
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => {
                      const testShift: Shift = {
                        id: Date.now().toString(),
                        employeeName: "Test Employee",
                        employeeId: "test",
                        date: "2025-08-02",
                        startTime: "10:00",
                        endTime: "18:00",
                        position: "Test Position",
                        status: "pending",
                        approvalHistory: [],
                        priority: "normal",
                        submittedAt: new Date().toISOString(),
                      };
                      console.log("Adding test shift for day 2:", testShift);
                      setShifts([...shifts, testShift]);
                    }}
                    className='w-full sm:w-auto'
                  >
                    Test Day 2
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => {
                      if (confirm("Bạn có muốn reset về dữ liệu mẫu?")) {
                        localStorage.removeItem("calendar-shifts");
                        window.location.reload();
                      }
                    }}
                    className='w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300'
                  >
                    Reset Data
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => {
                      const testEmployee: Employee = {
                        id: Date.now().toString(),
                        name: "Test Employee",
                        position: "Test Position",
                        email: "test@email.com",
                        phone: "0123456789",
                        isActive: true,
                      };
                      console.log("Adding test employee:", testEmployee);
                      console.log("Current employees:", employees);
                      setEmployees([...employees, testEmployee]);
                      console.log("Updated employees:", [
                        ...employees,
                        testEmployee,
                      ]);
                    }}
                    className='w-full sm:w-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 hover:border-blue-300'
                  >
                    Test Add Employee
                  </Button>
                </div>
              </div>
              <div className='flex flex-col sm:flex-row gap-4 mt-4'>
                <div className='flex-1 min-w-0'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                    <Input
                      placeholder='Tìm kiếm theo tên nhân viên hoặc vị trí...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='pl-10'
                    />
                  </div>
                </div>
                <div className='flex flex-col sm:flex-row gap-2 min-w-0'>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className='w-full sm:w-40'>
                      <SelectValue>Trạng thái</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Tất cả</SelectItem>
                      <SelectItem value='pending'>Chờ duyệt</SelectItem>
                      <SelectItem value='approved'>Đã duyệt</SelectItem>
                      <SelectItem value='rejected'>Từ chối</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={positionFilter}
                    onValueChange={setPositionFilter}
                  >
                    <SelectTrigger className='w-full sm:w-40'>
                      <SelectValue>Vị trí</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>Tất cả</SelectItem>
                      {uniquePositions.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ShiftList
                shifts={filteredShifts}
                onEdit={openEditForm}
                onDelete={handleDeleteShift}
                onApprove={handleApproveShift}
                onReject={openRejectModal}
                onDuplicate={handleDuplicateShift}
                showActions={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='approval'>
          <ApprovalWorkflow
            shifts={shifts.filter((shift) => shift.status === "pending")}
            onApprove={handleApproveShift}
            onReject={openRejectModal}
            onBulkApprove={handleBulkApprove}
            onEdit={openEditForm}
          />
        </TabsContent>

        <TabsContent value='employees'>
          <EmployeeManager employees={employees} setEmployees={setEmployees} />
        </TabsContent>

        <TabsContent value='templates'>
          <ShiftTemplates
            templates={shiftTemplates}
            setTemplates={setShiftTemplates}
          />
        </TabsContent>

        <TabsContent value='reports'>
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo thống kê</CardTitle>
            </CardHeader>
            <CardContent>
              <ShiftStats
                shifts={shifts}
                employees={employees}
                detailed={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showShiftForm && (
        <ShiftForm
          shift={editingShift}
          employees={employees}
          templates={shiftTemplates}
          selectedDate={selectedDate.toLocaleDateString("en-CA")}
          onSubmit={editingShift ? handleEditShift : handleAddShift}
          onCancel={closeForm}
        />
      )}

      {showRejectModal && rejectingShift && (
        <RejectModal
          shift={rejectingShift}
          onReject={handleRejectWithReason}
          onCancel={closeRejectModal}
        />
      )}
    </div>
  );
}
