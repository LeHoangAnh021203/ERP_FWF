"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Plus, Edit, Trash2, Clock, Copy } from "lucide-react"
import type { ShiftTemplate } from "./types"

interface ShiftTemplatesProps {
  templates: ShiftTemplate[]
  setTemplates: (templates: ShiftTemplate[]) => void
}

export function ShiftTemplates({ templates, setTemplates }: ShiftTemplatesProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<ShiftTemplate | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    position: "",
    description: "",
  })

  const positions = ["Nhân viên bán hàng", "Thu ngân", "Nhân viên kho", "Bảo vệ", "Quản lý ca", "Phục vụ", "Đầu bếp"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingTemplate) {
      setTemplates(
        templates.map((template) => (template.id === editingTemplate.id ? { ...template, ...formData } : template)),
      )
    } else {
      const newTemplate: ShiftTemplate = {
        ...formData,
        id: Date.now().toString(),
      }
      setTemplates([...templates, newTemplate])
    }

    resetForm()
  }

  const handleEdit = (template: ShiftTemplate) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      startTime: template.startTime,
      endTime: template.endTime,
      position: template.position,
      description: template.description,
    })
    setShowForm(true)
  }

  const handleDelete = (templateId: string) => {
    setTemplates(templates.filter((template) => template.id !== templateId))
  }

  const handleDuplicate = (template: ShiftTemplate) => {
    const newTemplate: ShiftTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Sao chép)`,
    }
    setTemplates([...templates, newTemplate])
  }

  const resetForm = () => {
    setFormData({
      name: "",
      startTime: "",
      endTime: "",
      position: "",
      description: "",
    })
    setEditingTemplate(null)
    setShowForm(false)
  }

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    const diff = end.getTime() - start.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    return `${hours} giờ`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Mẫu ca làm việc</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo mẫu mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <h3 className="font-medium">{template.name}</h3>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Thời gian:</span>
                  <span>
                    {template.startTime} - {template.endTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Thời lượng:</span>
                  <span>{calculateDuration(template.startTime, template.endTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Vị trí:</span>
                  <span>{template.position}</span>
                </div>
                {template.description && (
                  <div className="mt-2">
                    <span className="font-medium">Mô tả:</span>
                    <p className="text-xs mt-1">{template.description}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => handleEdit(template)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDuplicate(template)}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(template.id)} className="text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{editingTemplate ? "Chỉnh sửa mẫu ca làm" : "Tạo mẫu ca làm mới"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Tên mẫu</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Ca sáng, Ca tối..."
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
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">Giờ kết thúc</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="position">Vị trí công việc</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => setFormData({ ...formData, position: value })}
                  >
                    <SelectTrigger>
                      <SelectValue>Chọn vị trí</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết về ca làm việc..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingTemplate ? "Cập nhật" : "Tạo mẫu"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Hủy
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
