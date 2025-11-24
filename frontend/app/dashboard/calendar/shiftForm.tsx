"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { X } from "lucide-react"
import type { Shift, Employee, ShiftTemplate } from "./types"

interface ShiftFormProps {
  shift?: Shift | null
  employees: Employee[]
  templates: ShiftTemplate[]
  selectedDate?: string
  onSubmit: (shift: Omit<Shift, "id" | "status" | "approvalHistory" | "submittedAt">) => void
  onCancel: () => void
}

export function ShiftForm({ shift, employees, templates, selectedDate, onSubmit, onCancel }: ShiftFormProps) {
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    date: "",
    startTime: "",
    endTime: "",
    position: "",
    notes: "",
    templateId: "default",
    priority: "normal" as "low" | "normal" | "high",
  })

  const [selectedTemplate, setSelectedTemplate] = useState<ShiftTemplate | null>(null)

  useEffect(() => {
    if (shift) {
      setFormData({
        employeeName: shift.employeeName,
        employeeId: shift.employeeId,
        date: shift.date,
        startTime: shift.startTime,
        endTime: shift.endTime,
        position: shift.position,
        notes: shift.notes || "",
        templateId: shift.templateId || "default",
        priority: shift.priority || "normal",
      })
      // Set selectedTemplate nếu có template
      if (shift.templateId && shift.templateId !== "default") {
        const template = templates.find(t => t.id === shift.templateId);
        setSelectedTemplate(template || null);
      } else {
        setSelectedTemplate(null);
      }
    } else {
      // Khi tạo ca làm việc mới, sử dụng selectedDate nếu có, không thì dùng ngày hiện tại
      const dateToUse = selectedDate || (() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      })();
      setFormData(prev => ({
        ...prev,
        date: dateToUse,
        templateId: "default" // Đảm bảo templateId được set đúng
      }));
      setSelectedTemplate(null);
    }
  }, [shift, selectedDate, templates])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: string, value: string) => {
    if (field === "date") {
      // Đảm bảo date được lưu đúng format YYYY-MM-DD
      const dateValue = value;
      setFormData((prev) => ({ ...prev, [field]: dateValue }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId)
    if (employee) {
      setFormData((prev) => ({
        ...prev,
        employeeId,
        employeeName: employee.name,
        position: employee.position,
      }))
    }
  }

  const handleTemplateChange = (templateId: string) => {
    if (templateId === "default") {
      // Khi chọn "Không sử dụng mẫu", chỉ reset thời gian, giữ nguyên position từ employee
      setSelectedTemplate(null)
      setFormData((prev) => ({
        ...prev,
        templateId: "default",
        startTime: "",
        endTime: "",
        // Không reset position để giữ nguyên position từ employee đã chọn
      }))
    } else {
      const template = templates.find((t) => t.id === templateId)
      if (template) {
        setSelectedTemplate(template)
        setFormData((prev) => ({
          ...prev,
          templateId,
          startTime: template.startTime,
          endTime: template.endTime,
          position: template.position,
        }))
      }
    }
  }

  const activeEmployees = employees.filter((emp) => emp.isActive)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{shift ? "Chỉnh sửa ca làm" : "Thêm ca làm mới"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!shift && (
              <div>
                <Label htmlFor="template">Sử dụng mẫu có sẵn (tùy chọn)</Label>
                <Select value={formData.templateId} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue>
                      {formData.templateId === "default" 
                        ? "Không sử dụng mẫu"
                        : templates.find(t => t.id === formData.templateId)?.name || "Chọn mẫu ca làm"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Không sử dụng mẫu</SelectItem>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.startTime} - {template.endTime})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedTemplate && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                    <p>
                      <strong>Mô tả:</strong> {selectedTemplate.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="employee">Nhân viên</Label>
              <Select value={formData.employeeId} onValueChange={handleEmployeeChange}>
                <SelectTrigger>
                  <SelectValue>
                    {formData.employeeId 
                      ? activeEmployees.find(emp => emp.id === formData.employeeId)?.name || "Chọn nhân viên"
                      : "Chọn nhân viên"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {activeEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Ngày làm việc</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Giờ bắt đầu</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange("startTime", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endTime">Giờ kết thúc</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleChange("endTime", e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="position">Vị trí công việc</Label>
              <Select value={formData.position} onValueChange={(value) => handleChange("position", value)}>
                <SelectTrigger>
                  <SelectValue>
                    {formData.position || "Chọn vị trí"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nhân viên bán hàng">Nhân viên bán hàng</SelectItem>
                  <SelectItem value="Thu ngân">Thu ngân</SelectItem>
                  <SelectItem value="Kho">Nhân viên kho</SelectItem>
                  <SelectItem value="Bảo vệ">Bảo vệ</SelectItem>
                  <SelectItem value="Quản lý">Quản lý ca</SelectItem>
                  <SelectItem value="Phục vụ">Phục vụ</SelectItem>
                  <SelectItem value="Đầu bếp">Đầu bếp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Độ ưu tiên</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue>
                    {formData.priority === "low" && "Thấp"}
                    {formData.priority === "normal" && "Bình thường"}
                    {formData.priority === "high" && "Cao"}
                    {!formData.priority && "Chọn độ ưu tiên"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="normal">Bình thường</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Ghi chú</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Ghi chú thêm về ca làm việc..."
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {shift ? "Cập nhật" : "Thêm ca làm"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
