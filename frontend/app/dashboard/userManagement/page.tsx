"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Users, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"
import EmployeeTable from "./employeeTable"
import EmployeeForm, { COMMON_ROLES } from "./employeeForm"
import { useAuth } from "@/app/contexts/AuthContext"
import { ApiService } from "@/app/lib/api-service"
import { Notification, useNotification } from "@/app/components/notification"

export interface Employee {
  id: string
  name: string
  email: string
  position: string
  joinDate: string
  isActive: boolean
}

interface ApiUser {
  id: number
  firstname: string
  lastname: string
  username: string
  email: string
  phoneNumber: string
  dob: string
  gender: boolean
  bio: string
  avatar: string
  role: string
  active: boolean
}

interface ApiResponse {
  content: ApiUser[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  lastPage: boolean
}

export default function Dashboard() {
  const router = useRouter()
  const { user: authUser, getValidToken } = useAuth()
  const { notification, showSuccess, showError, hideNotification } = useNotification()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasAccess, setHasAccess] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [togglingStatus, setTogglingStatus] = useState<string | null>(null) // Track which user is being toggled
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [toggleConfirmEmployee, setToggleConfirmEmployee] = useState<Employee | null>(null)
  
  // Pagination state
  const [pageNumber, setPageNumber] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  
  // Sorting state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sortBy, setSortBy] = useState("id") // Use valid field: id, email, username, firstname, etc. (setSortBy for future sorting UI)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sortDir, _setSortDir] = useState("asc") // setSortDir will be used when sorting is implemented

  // Map API user data to Employee format
  const mapApiUserToEmployee = (user: ApiUser): Employee => {
    const fullName = user.firstname && user.lastname 
      ? `${user.firstname} ${user.lastname}`
      : user.username || user.email || "Unknown"
    
    // Format date from ISO string to YYYY-MM-DD
    const formatDate = (dateString: string | undefined): string => {
      if (!dateString) return new Date().toISOString().split("T")[0]
      try {
        const date = new Date(dateString)
        return date.toISOString().split("T")[0]
      } catch {
        return new Date().toISOString().split("T")[0]
      }
    }
    
    // Normalize role format - ensure consistency with COMMON_ROLES
    // Backend might return role with spaces (e.g., "STORE LEADER") but COMMON_ROLES uses underscores (e.g., "STORE_LEADER")
    let normalizedRole = user.role || ""
    if (normalizedRole) {
      // Try to find matching role in COMMON_ROLES (case-insensitive, space/underscore agnostic)
      const roleUpper = normalizedRole.toUpperCase()
      const matchingRole = COMMON_ROLES.find(r => {
        const roleValueUpper = r.value.toUpperCase()
        // Match exact
        if (roleValueUpper === roleUpper) return true
        // Match with space/underscore conversion
        const roleValueWithSpaces = roleValueUpper.replace(/_/g, ' ')
        const roleValueWithUnderscores = roleValueUpper.replace(/\s+/g, '_')
        const roleWithSpaces = roleUpper.replace(/_/g, ' ')
        const roleWithUnderscores = roleUpper.replace(/\s+/g, '_')
        return roleValueWithSpaces === roleWithSpaces || 
               roleValueWithUnderscores === roleWithUnderscores ||
               roleValueUpper === roleWithUnderscores ||
               roleValueUpper === roleWithSpaces
      })
      
      // If found matching role, use the COMMON_ROLES format (with underscore)
      if (matchingRole) {
        normalizedRole = matchingRole.value
      } else {
        // If no match, keep original but normalize to uppercase
        normalizedRole = normalizedRole.toUpperCase()
      }
    }
    
    return {
      id: String(user.id),
      name: fullName,
      email: user.email || "",
      position: normalizedRole,
      joinDate: formatDate(user.dob),
      isActive: user.active ?? true,
    }
  }

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setHasAccess(true)
      
      const token = await getValidToken()
      if (!token) {
        throw new Error("No valid token available")
      }

      // Build query parameters
      const queryParams = new URLSearchParams({
        pageNumber: String(pageNumber),
        pageSize: String(pageSize),
        sortBy: sortBy,
        sortDir: sortDir,
      })
      const queryString = queryParams.toString()

      // Try using ApiService (which uses /api/proxy)
      let data: unknown
      try {
        data = await ApiService.get(`user/get-all-users?${queryString}`, token)
      } catch (apiError) {
        console.error("ApiService error:", apiError)
        
        // Parse error message to provide better feedback
        const errorMessage = apiError instanceof Error ? apiError.message : String(apiError)
        // Access check: 403 or forbidden
        if (/403|forbidden|access is denied/i.test(errorMessage)) {
          setHasAccess(false)
          setLoading(false)
          return
        }
        const isConnectionError = 
          errorMessage.includes("fetch failed") ||
          errorMessage.includes("ECONNREFUSED") ||
          errorMessage.includes("ENOTFOUND") ||
          errorMessage.includes("502") ||
          errorMessage.includes("Bad Gateway") ||
          errorMessage.includes("Proxy Error") ||
          errorMessage.includes("Backend Error")
        
        if (isConnectionError) {
          // Extract more details from error message if available
          const backendErrorMatch = errorMessage.match(/Backend Error: 502 - (.+)/)
          const details = backendErrorMatch ? backendErrorMatch[1] : ""
          
          throw new Error(
            "Không thể kết nối đến backend server (502 Bad Gateway).\n\n" +
            "Vui lòng kiểm tra:\n" +
            "1. Backend server có đang chạy không\n" +
            "2. URL backend có đúng không (kiểm tra trong .env)\n" +
            "3. Network/firewall có chặn kết nối không\n" +
            "4. Backend server có đang xử lý request không\n\n" +
            (details ? `Chi tiết lỗi: ${details}` : "")
          )
        }
        
        // If proxy fails, try direct API call (if backend is accessible)
        try {
          const response = await fetch(`/api/user/get-all-users?${queryString}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })

          if (!response.ok) {
            if (response.status === 403) {
              setHasAccess(false)
              setLoading(false)
              return
            }
            const errorText = await response.text()
            console.error("Direct API error:", response.status, errorText)
            throw new Error(
              response.status === 502
                ? "Không thể kết nối đến server. Vui lòng kiểm tra backend server có đang chạy không."
                : `Failed to fetch users: ${response.status} - ${errorText}`
            )
          }

          data = await response.json()
        } catch {
          // If both proxy and direct fail, throw the original error
          throw apiError
        }
      }

      // Handle API response format
      let users: ApiUser[] = []
      if (data && typeof data === "object") {
        const response = data as ApiResponse
        if (response.content && Array.isArray(response.content)) {
          users = response.content
          // Update pagination info
          setTotalElements(response.totalElements || 0)
          setTotalPages(response.totalPages || 0)
        } else if (Array.isArray(data)) {
          // Fallback: if response is directly an array
          users = data as ApiUser[]
        }
      }

      const mappedEmployees = users.map(mapApiUserToEmployee)
      setEmployees(mappedEmployees)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError(err instanceof Error ? err.message : "Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [getValidToken, pageNumber, pageSize, sortBy, sortDir])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage)
  }
  
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPageNumber(0) // Reset to first page when changing page size
  }
  
  // Handle sorting (for future use - can be connected to table headers)
  // const handleSort = (field: string) => {
  //   if (sortBy === field) {
  //     // Toggle sort direction if clicking same field
  //     setSortDir(sortDir === "asc" ? "desc" : "asc")
  //   } else {
  //     setSortBy(field)
  //     setSortDir("asc")
  //   }
  // }

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddEmployee = (newEmployee: Omit<Employee, "id">) => {
    const employee: Employee = {
      ...newEmployee,
      id: Date.now().toString(),
    }
    setEmployees([...employees, employee])
    setIsDialogOpen(false)
    // Optionally refresh data from API
    // fetchUsers()
  }

  const handleUpdateEmployee = async (updatedEmployee: Employee) => {
    setIsUpdating(true)
    try {
      const token = await getValidToken()
      if (!token) {
        throw new Error("No valid token available")
      }

      // Call API to update user role (position)
      const userId = updatedEmployee.id
      const role = updatedEmployee.position // position maps to role in API
      
      if (role) {
        const originalRole = role
        const roleTrimmed = role.trim().toUpperCase() // Always use uppercase
        
        // Validate role format before sending
        // Database role column is typically VARCHAR(20), so limit to 20 characters
        const MAX_ROLE_LENGTH = 20
        const ROLE_PATTERN = /^[A-Z0-9_]+$/
        
        if (roleTrimmed.length > MAX_ROLE_LENGTH) {
          showError(`Vị trí "${originalRole}" quá dài (tối đa ${MAX_ROLE_LENGTH} ký tự). Vui lòng chọn lại.`)
          setIsUpdating(false)
          return
        }
        
        if (!ROLE_PATTERN.test(roleTrimmed)) {
          showError(`Vị trí "${originalRole}" chứa ký tự không hợp lệ. Chỉ được chứa chữ cái in hoa, số và dấu gạch dưới (_).`)
          setIsUpdating(false)
          return
        }
        
        // Backend expects role in request body
        // Based on logs: body format { role: 'USER' } works, query parameter doesn't
        // COMMON_ROLES uses underscores (STORE_LEADER, AREA_MANAGER)
        // Backend might need the exact format from COMMON_ROLES or with spaces
        
        // Build payloads - try multiple formats to find what backend accepts
        const payloads: unknown[] = []
        
        const hasSpaces = roleTrimmed.includes(' ')
        const hasUnderscores = roleTrimmed.includes('_')
        
        // Always try the original format first
        payloads.push(
          { role: roleTrimmed },
          { id: Number(userId), role: roleTrimmed },
          { userId: Number(userId), role: roleTrimmed }
        )
        
        // If role has spaces, try underscore format (COMMON_ROLES format: STORE_LEADER, AREA_MANAGER)
        if (hasSpaces) {
          const roleWithUnderscores = roleTrimmed.replace(/\s+/g, '_')
          payloads.push(
            { role: roleWithUnderscores },
            { id: Number(userId), role: roleWithUnderscores }
          )
        }
        
        // If role has underscores, try space format (in case backend expects spaces)
        if (hasUnderscores) {
          const roleWithSpaces = roleTrimmed.replace(/_/g, ' ')
          payloads.push(
            { role: roleWithSpaces },
            { id: Number(userId), role: roleWithSpaces }
          )
        }
        
        // Add alternative field names
        payloads.push(
          { roleName: roleTrimmed },
          { id: Number(userId), roleName: roleTrimmed },
          // String format as last resort
          roleTrimmed
        )
        
        let lastError: Error | null = null
        let success = false
        
        for (const payload of payloads) {
          try {
            const response = await ApiService.patch(`user/setUserRole/${userId}`, payload, token)
            
            // Verify the update by checking response
            if (response && typeof response === 'object') {
              const responseObj = response as Record<string, unknown>
              if ('role' in responseObj && typeof responseObj.role === 'string') {
                const returnedRole = responseObj.role as string
                const roleMatch = returnedRole.toUpperCase() === roleTrimmed.toUpperCase()
                
                if (!roleMatch) {
                  showError(
                    `Không thể cập nhật role "${roleTrimmed}". ` +
                    `Backend trả về role: "${returnedRole}".`
                  )
                  setEditingEmployee(null)
                  setIsDialogOpen(false)
                  setIsUpdating(false)
                  return
                }
              }
            }
            
            showSuccess("Cập nhật vị trí nhân viên thành công")
            success = true
            break
          } catch (apiError) {
            lastError = apiError instanceof Error ? apiError : new Error(String(apiError))
            const errorMessage = lastError.message
            const errorText = String(apiError)
            
            const isInvalidRole = errorMessage.includes("Invalid role name") || errorText.includes("Invalid role name")
            const isDeserializationError = errorMessage.includes("Cannot construct instance") || errorMessage.includes("deserialize")
            const isNullRole = errorMessage.includes("getRole() is null") || errorText.includes("getRole() is null")
            
            if (isInvalidRole) {
              break
            } else if (isDeserializationError || isNullRole) {
              continue
            }
          }
        }
        
        // If all formats failed, show error
        if (!success && lastError) {
          const errorMessage = lastError.message
          const errorText = String(lastError)
          const isInvalidRole = errorMessage.includes("Invalid role name") || errorText.includes("Invalid role name")
          const isNullRole = errorMessage.includes("getRole() is null") || errorText.includes("getRole() is null")
          const isDataTruncated = errorMessage.includes("Data truncated") || errorText.includes("Data truncated") || 
                                  errorMessage.includes("data truncated") || errorText.includes("data truncated")

          if (isDataTruncated) {
            showError(
              `Vị trí "${originalRole}" quá dài hoặc không đúng định dạng cho database. ` +
              `Vui lòng chọn một vị trí ngắn hơn hoặc kiểm tra lại định dạng (chỉ chữ cái in hoa, số và dấu gạch dưới).`
            )
          } else if (isInvalidRole) {
            showError(`Vị trí "${originalRole}" không hợp lệ. Backend không chấp nhận role này.`)
          } else if (isNullRole) {
            showError(`Không thể cập nhật vị trí "${originalRole}". Backend không nhận được role từ request.`)
          } else {
            showError(`Không thể cập nhật vị trí: ${errorMessage}`)
          }
          return
        }
      }

      setEditingEmployee(null)
      setIsDialogOpen(false)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      await fetchUsers()
    } catch (err) {
      console.error('Error updating employee:', err)
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật nhân viên'
      showError(errorMessage)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteEmployee = async () => {
    if (!deletingEmployee) return
    const expected = `tôi muốn xoá ${deletingEmployee.name}`.toLowerCase().trim()
    if (deleteConfirmText.toLowerCase().trim() !== expected) {
      showError(`Vui lòng nhập chính xác: "${expected}"`)
      return
    }
    try {
      const token = await getValidToken()
      if (!token) throw new Error("No valid token available")
      const res = await fetch(`/api/proxy/user/delete-user/${encodeURIComponent(deletingEmployee.id)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || "Xóa người dùng thất bại")
      }
      showSuccess(`Đã xóa: ${deletingEmployee.name}`)
      setDeletingEmployee(null)
      setDeleteConfirmText("")
      await fetchUsers()
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Không thể xóa người dùng"
      showError(msg)
    }
  }

  const openDeleteDialog = (employee: Employee) => {
    setDeletingEmployee(employee)
    setDeleteConfirmText("")
  }

  const handleToggleStatus = async (id: string) => {
    setTogglingStatus(id)
    try {
      const token = await getValidToken()
      if (!token) {
        throw new Error("No valid token available")
      }

      // Find the employee to get current status
      const employee = employees.find((emp) => emp.id === id)
      if (!employee) {
        throw new Error("Không tìm thấy nhân viên")
      }

      const newActiveStatus = !employee.isActive
      // Always use banUser endpoint with body { active }
      try {
        await ApiService.patch(`user/banUser/${id}`, { active: newActiveStatus }, token)
        showSuccess(
          newActiveStatus
            ? "Đã mở khóa tài khoản nhân viên thành công" 
            : "Đã khóa tài khoản nhân viên thành công"
        )
      } catch (primaryErr) {
        console.warn('Primary banUser call failed, retrying via proxy fetch...', primaryErr)
            const response = await fetch(`/api/proxy/user/banUser/${id}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ active: newActiveStatus }),
            })
            if (!response.ok) {
              const errorText = await response.text()
              throw new Error(`Failed to update user ban status: ${response.status} - ${errorText}`)
            }
            showSuccess(
              newActiveStatus
                ? "Đã mở khóa tài khoản nhân viên thành công" 
                : "Đã khóa tài khoản nhân viên thành công"
            )
      }

      // Update local state optimistically
      setEmployees(employees.map((emp) => (emp.id === id ? { ...emp, isActive: newActiveStatus } : emp)))
      
      // Refresh data from API to get latest state
      await fetchUsers()
    } catch (err) {
      console.error('Error toggling user status:', err)
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật trạng thái nhân viên'
      showError(errorMessage)
    } finally {
      setTogglingStatus(null)
    }
  }

  const openToggleConfirmDialog = (employee: Employee) => {
    setToggleConfirmEmployee(employee)
  }

  const handleConfirmToggle = async () => {
    if (!toggleConfirmEmployee) return
    await handleToggleStatus(toggleConfirmEmployee.id)
    setToggleConfirmEmployee(null)
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingEmployee(null)
  }

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý nhân viên</h1>
            <p className="text-gray-600">Quản lý thông tin nhân viên và dữ liệu công ty</p>
          </div>
          <Card className="bg-white">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600">Đang tải dữ liệu...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    const isConnectionError = error.includes("Không thể kết nối") || error.includes("fetch failed")
    
    return (
      <div className="p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý nhân viên</h1>
            <p className="text-gray-600">Quản lý thông tin nhân viên và dữ liệu công ty</p>
          </div>
          <Card className={`bg-white ${isConnectionError ? "border-orange-200" : "border-red-200"}`}>
            <CardContent className="p-6">
              <div className="text-center">
                <p className={`${isConnectionError ? "text-orange-600" : "text-red-600"} font-medium mb-2`}>
                  {isConnectionError ? "⚠️ Lỗi kết nối" : "Lỗi tải dữ liệu"}
                </p>
                <div className="text-sm text-gray-600 mb-4 whitespace-pre-line text-left max-w-2xl mx-auto">
                  {error}
                </div>
                {isConnectionError && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4 text-left max-w-2xl mx-auto">
                    <p className="text-sm font-medium text-orange-800 mb-2">Hướng dẫn khắc phục:</p>
                    <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                      <li>Kiểm tra backend server có đang chạy tại <code className="bg-orange-100 px-1 rounded">https://backend.facewashfox.com</code></li>
                      <li>Kiểm tra file <code className="bg-orange-100 px-1 rounded">.env</code> có cấu hình đúng <code className="bg-orange-100 px-1 rounded">NEXT_PUBLIC_API_BASE_URL</code></li>
                      <li>Kiểm tra network/firewall có chặn kết nối không</li>
                      <li>Xem console logs để biết thêm chi tiết</li>
                    </ul>
                  </div>
                )}
                <Button onClick={fetchUsers} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Thử lại
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <Notification 
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
      {!hasAccess ? (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý nhân viên</h1>
            <p className="text-gray-600">Quản lý thông tin nhân viên và dữ liệu công ty</p>
          </div>
          <Card className="bg-white border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Bạn không có quyền truy cập</CardTitle>
              <CardDescription>
                Tài khoản hiện tại không có quyền truy cập vào trang này hoặc dữ liệu liên quan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={() => router.push("/dashboard")}>
                  Quay lại trang Dashboard
                </Button>
                <Button onClick={() => router.push("/login")}>
                  Đăng nhập lại vào tài khoản có quyền truy cập
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
      <>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý nhân viên</h1>
          <p className="text-gray-600">Quản lý thông tin nhân viên và dữ liệu công ty</p>
          {authUser && (
            <p className="text-xs text-gray-400 mt-1">Người thao tác: {authUser.username || authUser.email}</p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng nhân viên</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{totalElements || employees.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {employees.filter((e) => e.isActive).length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Không hoạt động</p>
                  <p className="text-2xl font-bold text-gray-500 mt-1">
                    {employees.filter((e) => !e.isActive).length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-gray-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Card */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="border-b bg-gray-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">Danh sách nhân viên</CardTitle>
                <CardDescription className="mt-1 text-gray-600">
                  Tổng cộng: {employees.filter((e) => e.isActive).length}/{employees.length} nhân viên hoạt động
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Search and Add Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Tìm theo tên, email, vị trí..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus size={20} className="mr-2" />
                    Thêm nhân viên
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{editingEmployee ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}</DialogTitle>
                    <DialogDescription>
                      {editingEmployee ? "Cập nhật thông tin nhân viên" : "Nhập thông tin nhân viên mới"}
                    </DialogDescription>
                  </DialogHeader>
                  <EmployeeForm
                    initialData={editingEmployee}
                    onSubmit={async (data) => {
                      if (editingEmployee) {
                        await handleUpdateEmployee(data as Employee)
                      } else {
                        handleAddEmployee(data as Omit<Employee, "id">)
                      }
                    }}
                    onCancel={handleCloseDialog}
                    isSubmitting={isUpdating}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Employee Table */}
            <EmployeeTable
              employees={filteredEmployees}
              onEdit={handleEditEmployee}
              onRequestDelete={openDeleteDialog}
              onToggleStatus={openToggleConfirmDialog}
              togglingStatus={togglingStatus}
            />

            {filteredEmployees.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchTerm ? "Không tìm thấy nhân viên phù hợp" : "Chưa có nhân viên nào"}
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Hiển thị:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-600">
                    / Tổng: {totalElements} nhân viên
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pageNumber - 1)}
                    disabled={pageNumber === 0}
                  >
                    Trước
                  </Button>
                  <span className="text-sm text-gray-600">
                    Trang {pageNumber + 1} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pageNumber + 1)}
                    disabled={pageNumber >= totalPages - 1}
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deletingEmployee} onOpenChange={(open) => { if (!open) setDeletingEmployee(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Để xác nhận, vui lòng nhập chính xác:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-gray-700">
              {deletingEmployee ? `tôi muốn xoá ${deletingEmployee.name}` : ""}
            </div>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Nhập xác nhận..."
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDeletingEmployee(null)}>Hủy</Button>
              <Button variant="destructive" onClick={handleDeleteEmployee}>Xóa</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!toggleConfirmEmployee} onOpenChange={(open) => { if (!open) setToggleConfirmEmployee(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {toggleConfirmEmployee?.isActive ? "Khoá tài khoản nhân viên" : "Mở khoá tài khoản nhân viên"}
            </DialogTitle>
            <DialogDescription>
              {toggleConfirmEmployee?.isActive
                ? "Bạn có chắc chắn muốn khoá tài khoản nhân viên này không? Họ sẽ không thể đăng nhập cho đến khi được mở khoá lại."
                : "Bạn có chắc chắn muốn mở khoá tài khoản nhân viên này không? Họ sẽ có thể đăng nhập trở lại."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="text-sm text-gray-700">
              {toggleConfirmEmployee?.name} ({toggleConfirmEmployee?.email || "Không có email"})
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setToggleConfirmEmployee(null)}>Huỷ</Button>
              <Button onClick={handleConfirmToggle} disabled={togglingStatus === toggleConfirmEmployee?.id}>
                {toggleConfirmEmployee?.isActive ? "Khoá tài khoản" : "Mở khoá tài khoản"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </>
      )}
    </div>
  )
}
