export interface Shift {
  id: string
  employeeName: string
  employeeId: string
  position: string
  startTime: string
  endTime: string
  status: "pending" | "approved" | "rejected"
  date: string
  priority: "low" | "normal" | "high"
  submittedAt: string
  notes?: string
  templateId?: string
  rejectionReason?: string
  approvalHistory?: Array<{
    id: string
    action: "approved" | "rejected" | "pending"
    approvedBy: string
    approvedAt: string
    reason?: string
    previousStatus?: "pending" | "approved" | "rejected"
  }>
}

export interface Employee {
  id: string
  name: string
  position: string
  isActive: boolean
  email: string
  phone: string
}

export interface ShiftTemplate {
  id: string
  name: string
  position: string
  startTime: string
  endTime: string
  description: string
  isActive?: boolean
}
