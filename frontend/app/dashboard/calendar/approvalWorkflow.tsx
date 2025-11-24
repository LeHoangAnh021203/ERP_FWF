"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Badge } from "@/app/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Input } from "@/app/components/ui/input"
import { CheckCircle, XCircle, Clock, AlertTriangle, Search } from "lucide-react"
import type { Shift } from "./types"

interface ApprovalWorkflowProps {
  shifts: Shift[]
  onApprove: (shiftId: string) => void
  onReject: (shift: Shift) => void
  onBulkApprove: (shiftIds: string[]) => void
  onEdit: (shift: Shift) => void
}

export function ApprovalWorkflow({ shifts, onApprove, onReject, onBulkApprove, onEdit }: ApprovalWorkflowProps) {
  const [selectedShifts, setSelectedShifts] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("submittedAt")

  const handleSelectShift = (shiftId: string, checked: boolean) => {
    if (checked) {
      setSelectedShifts([...selectedShifts, shiftId])
    } else {
      setSelectedShifts(selectedShifts.filter((id) => id !== shiftId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedShifts(filteredShifts.map((shift) => shift.id))
    } else {
      setSelectedShifts([])
    }
  }

  const handleBulkApprove = () => {
    if (selectedShifts.length > 0) {
      onBulkApprove(selectedShifts)
      setSelectedShifts([])
    }
  }

  const filteredShifts = shifts
    .filter((shift) => {
      const matchesSearch =
        shift.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shift.position.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPriority = priorityFilter === "all" || shift.priority === priorityFilter
      return matchesSearch && matchesPriority
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "submittedAt":
          return new Date(a.submittedAt || '').getTime() - new Date(b.submittedAt || '').getTime()
        case "priority":
          const priorityOrder = { high: 3, normal: 2, low: 1 }
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - (priorityOrder[a.priority as keyof typeof priorityOrder] || 0)
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "employee":
          return a.employeeName.localeCompare(b.employeeName)
        default:
          return 0
      }
    })

  const getPriorityBadge = (priority: Shift["priority"]) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-800">Cao</Badge>
      case "normal":
        return <Badge className="bg-blue-100 text-blue-800">Bình thường</Badge>
      case "low":
        return <Badge className="bg-gray-100 text-gray-800">Thấp</Badge>
    }
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("vi-VN")
  }

  const getTimeAgo = (dateStr: string) => {
    const now = new Date()
    const submitted = new Date(dateStr)
    const diffInHours = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Vừa xong"
    if (diffInHours < 24) return `${diffInHours} giờ trước`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} ngày trước`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Quy trình phê duyệt ca làm việc
            </CardTitle>
            <div className="flex items-center gap-2">
              {selectedShifts.length > 0 && (
                <Button onClick={handleBulkApprove} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Duyệt {selectedShifts.length} ca
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên nhân viên hoặc vị trí..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue>Độ ưu tiên</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="high">Cao</SelectItem>
                <SelectItem value="normal">Bình thường</SelectItem>
                <SelectItem value="low">Thấp</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue>Sắp xếp</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="submittedAt">Thời gian gửi</SelectItem>
                <SelectItem value="priority">Độ ưu tiên</SelectItem>
                <SelectItem value="date">Ngày làm việc</SelectItem>
                <SelectItem value="employee">Tên nhân viên</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {filteredShifts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Không có ca làm việc nào cần phê duyệt</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-4 border-b">
                <Checkbox checked={selectedShifts.length === filteredShifts.length} onCheckedChange={handleSelectAll} />
                <span className="text-sm text-gray-600">Chọn tất cả ({filteredShifts.length} ca)</span>
              </div>

              {filteredShifts.map((shift) => (
                <Card key={shift.id} className="border-l-4 border-l-yellow-400">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedShifts.includes(shift.id)}
                        onCheckedChange={(checked) => handleSelectShift(shift.id, checked as boolean)}
                      />

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium text-lg">{shift.employeeName}</h4>
                            {getPriorityBadge(shift.priority)}
                            {shift.priority === "high" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                          </div>
                          <div className="text-sm text-gray-500">{shift.submittedAt ? getTimeAgo(shift.submittedAt) : 'Chưa có thời gian'}</div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                          <div>
                            <span className="font-medium">Ngày làm việc:</span>
                            <p>{new Date(shift.date).toLocaleDateString("vi-VN")}</p>
                          </div>
                          <div>
                            <span className="font-medium">Thời gian:</span>
                            <p>
                              {shift.startTime} - {shift.endTime}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Vị trí:</span>
                            <p>{shift.position}</p>
                          </div>
                          <div>
                            <span className="font-medium">Gửi lúc:</span>
                            <p>{shift.submittedAt ? formatDateTime(shift.submittedAt) : 'Chưa có thời gian'}</p>
                          </div>
                        </div>

                        {shift.notes && (
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-sm">Ghi chú:</span>
                            <p className="text-sm mt-1">{shift.notes}</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => onApprove(shift.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Duyệt
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onReject(shift)}
                            className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Từ chối
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => onEdit(shift)}>
                            Chỉnh sửa
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
