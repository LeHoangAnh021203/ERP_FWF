"use client"

import type React from "react"

import { useState } from "react"
import type { Employee } from "./page"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"

interface EmployeeFormProps {
  initialData?: Employee | null
  onSubmit: (data: Employee | Omit<Employee, "id">) => void | Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

// Common valid roles that backend might accept
export const COMMON_ROLES = [
  { value: "USER", label: "Nhân viên" },
  { value: "STORE_LEADER", label: "Quản Lí Cửa Hàng" },
  { value: "AREA_MANAGER", label: "Quản Lí Khu Vực" },
  { value: "TEAM_LEAD", label: "Trưởng Phòng" },
  { value: "CEO", label: "Giám Đốc" },
  { value: "ADMIN", label: "Admin" },
  { value: "other", label: "Khác (nhập tùy chỉnh)" },
]

// Helper function to get role label from value
export const getRoleLabel = (value: string): string => {
  if (!value) return value
  const role = COMMON_ROLES.find(r => r.value.toUpperCase() === value.toUpperCase())
  return role ? role.label : value
}

export default function EmployeeForm({ initialData, onSubmit, onCancel, isSubmitting = false }: EmployeeFormProps) {
  const initialPosition = initialData?.position || ""
  const isCustomRole = initialPosition && !COMMON_ROLES.some(r => r.value.toUpperCase() === initialPosition.toUpperCase())
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    position: initialData?.position || "",
    joinDate: initialData?.joinDate || new Date().toISOString().split("T")[0],
    isActive: initialData?.isActive ?? true,
  })
  
  const [selectedRole, setSelectedRole] = useState(
    isCustomRole ? "other" : (initialPosition.toUpperCase() || "")
  )
  const [customRole, setCustomRole] = useState(isCustomRole ? initialPosition : "")

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }
    // Ensure role is uppercase
    const finalPosition = selectedRole === "other" 
      ? customRole.trim().toUpperCase() 
      : selectedRole.toUpperCase()
    if (!finalPosition) {
      newErrors.position = "Vui lòng chọn hoặc nhập vị trí"
    } else {
      // Validate role format and length
      // Role should only contain letters, numbers, and underscores
      // Maximum length is typically 20 characters for database columns (VARCHAR(20))
      const MAX_ROLE_LENGTH = 20
      const ROLE_PATTERN = /^[A-Z0-9_]+$/
      
      if (finalPosition.length > MAX_ROLE_LENGTH) {
        newErrors.position = `Vị trí không được vượt quá ${MAX_ROLE_LENGTH} ký tự`
      } else if (!ROLE_PATTERN.test(finalPosition)) {
        newErrors.position = "Vị trí chỉ được chứa chữ cái in hoa, số và dấu gạch dưới (_)"
      }
    }
   
    if (!formData.joinDate) {
      newErrors.joinDate = "Vui lòng chọn ngày vào làm"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Ensure role is uppercase before submitting
    const finalPosition = selectedRole === "other" 
      ? customRole.trim().toUpperCase() 
      : selectedRole.toUpperCase()
    
    if (initialData) {
      await onSubmit({
        ...initialData,
        ...formData,
        position: finalPosition,
      })
    } else {
      await onSubmit({
        ...formData,
        position: finalPosition,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
          Họ tên
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
          className={errors.name ? "border-red-500 mt-1" : "mt-1"}
          placeholder="Nguyễn Văn A"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
          className={errors.email ? "border-red-500 mt-1" : "mt-1"}
          placeholder="example@company.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="position" className="text-sm font-medium text-gray-700">
          Vị trí (Role)
        </Label>
        <select
          id="position"
          value={selectedRole}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value
            setSelectedRole(value)
            if (value !== "other") {
              setFormData({ ...formData, position: value })
            }
          }}
          className={`w-full mt-1 px-3 py-2 border rounded-md ${
            errors.position ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value="">-- Chọn vị trí --</option>
          {COMMON_ROLES.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
        {selectedRole === "other" && (
          <Input
            id="customRole"
            value={customRole}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value
              setCustomRole(value)
              setFormData({ ...formData, position: value })
            }}
            className={`mt-2 ${errors.position ? "border-red-500" : ""}`}
            placeholder="Nhập role tùy chỉnh (ví dụ: user_management)"
          />
        )}
        {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
        <p className="text-xs text-gray-500 mt-1">
          Lưu ý: Backend chỉ chấp nhận các role hợp lệ. Nếu nhập tùy chỉnh, vui lòng đảm bảo role tồn tại trong hệ thống.
        </p>
      </div>

     

      <div>
        <Label htmlFor="joinDate" className="text-sm font-medium text-gray-700">
          Ngày vào làm
        </Label>
        <Input
          id="joinDate"
          type="date"
          value={formData.joinDate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, joinDate: e.target.value })}
          className={errors.joinDate ? "border-red-500 mt-1" : "mt-1"}
        />
        {errors.joinDate && <p className="text-red-500 text-sm mt-1">{errors.joinDate}</p>}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <input
          id="isActive"
          type="checkbox"
          checked={formData.isActive}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, isActive: e.target.checked })}
          className="w-4 h-4 cursor-pointer"
        />
        <Label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
          Nhân viên hoạt động trên hệ thống
        </Label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang xử lý..." : initialData ? "Cập nhật" : "Thêm"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          className="flex-1"
          disabled={isSubmitting}
        >
          Hủy
        </Button>
      </div>
    </form>
  )
}
