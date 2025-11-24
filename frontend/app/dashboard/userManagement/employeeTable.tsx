"use client"

import type { Employee } from "./page"
import { Edit2, Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table"
import { getRoleLabel } from "./employeeForm"

interface EmployeeTableProps {
  employees: Employee[]
  onEdit: (employee: Employee) => void
  onRequestDelete: (employee: Employee) => void
  onToggleStatus: (employee: Employee) => void | Promise<void>
  togglingStatus?: string | null
}

export default function EmployeeTable({ employees, onEdit, onRequestDelete, onToggleStatus, togglingStatus = null }: EmployeeTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="font-semibold text-gray-700">Họ tên</TableHead>
            <TableHead className="font-semibold text-gray-700">Email</TableHead>
            <TableHead className="font-semibold text-gray-700">Vị trí</TableHead>
            
            <TableHead className="font-semibold text-gray-700">Ngày vào làm</TableHead>
            <TableHead className="font-semibold text-gray-700 text-center">Trạng thái</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow
              key={employee.id}
              className={`hover:bg-gray-50 transition-colors ${!employee.isActive ? "bg-gray-100 opacity-60" : ""}`}
            >
              <TableCell className="font-medium text-gray-900">{employee.name}</TableCell>
              <TableCell className="text-gray-600">{employee.email}</TableCell>
              <TableCell className="text-gray-600">{getRoleLabel(employee.position)}</TableCell>
              <TableCell className="text-gray-600">{formatDate(employee.joinDate)}</TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleStatus(employee)}
                  disabled={togglingStatus === employee.id}
                  className={`${
                    employee.isActive
                      ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                      : "text-gray-400 hover:text-gray-500 hover:bg-gray-200"
                  } ${togglingStatus === employee.id ? "opacity-50 cursor-not-allowed" : ""}`}
                  title={employee.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                >
                  {togglingStatus === employee.id ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : employee.isActive ? (
                    <Eye size={18} />
                  ) : (
                    <EyeOff size={18} />
                  )}
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(employee)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit2 size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRequestDelete(employee)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
