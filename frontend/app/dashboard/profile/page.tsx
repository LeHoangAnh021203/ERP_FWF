"use client";

import React from "react";
import { useRouter } from "next/navigation";
// import { UserPermissions } from "@/app/components/UserPermissions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { useAuth } from "@/app/contexts/AuthContext";
import { User, Mail, Phone, Shield, Eye, EyeOff } from "lucide-react";

export default function ProfilePage() {
  const { user, permissions, isAdmin, getValidToken, logout } = useAuth();
  const router = useRouter();
  const [isChanging, setIsChanging] = React.useState(false);
  const [changeMsg, setChangeMsg] = React.useState<string | null>(null);
  const [changeErr, setChangeErr] = React.useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showChangeModal, setShowChangeModal] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const handleChangePassword = async () => {
    setChangeMsg(null);
    setChangeErr(null);
    if (!currentPassword || !newPassword) {
      setChangeErr("Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới");
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangeErr("Mật khẩu xác nhận không khớp");
      return;
    }
    setIsChanging(true);
    try {
      const token = await getValidToken();
      const resp = await fetch("/api/proxy/user/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `HTTP ${resp.status}`);
      }
      setChangeMsg("Đổi mật khẩu thành công.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Hiển thị modal yêu cầu đăng nhập lại
      setShowChangeModal(false);
      setShowSuccessModal(true);
    } catch (e) {
      setChangeErr(e instanceof Error ? e.message : "Đổi mật khẩu thất bại");
    } finally {
      setIsChanging(false);
    }
  };

  const handleReLogin = async () => {
    try {
      await logout();
    } finally {
      router.push("/login");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Bạn chắc chắn muốn xoá tài khoản? Hành động này không thể hoàn tác."
      )
    ) {
      return;
    }
    try {
      const token = await getValidToken();
      const resp = await fetch("/api/proxy/auth/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || `HTTP ${resp.status}`);
      }
      // Logout and redirect
      await logout();
    } catch (e) {
      alert(
        e instanceof Error
          ? `Xoá tài khoản thất bại: ${e.message}`
          : "Xoá tài khoản thất bại"
      );
    }
  };

  if (!user) {
    return (
      <div className="p-3 sm:p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">
          Manage your account information and view your permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
              {isAdmin && (
                <Badge variant="default" className="bg-red-500">
                  ADMIN
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {(() => {
                    // Lấy chữ cái đầu từ firstname và lastname, nếu không có thì lấy từ username
                    const firstInitial = user.firstname?.[0] || '';
                    const lastInitial = user.lastname?.[0] || '';
                    if (firstInitial || lastInitial) {
                      return `${firstInitial}${lastInitial}`.toUpperCase();
                    }
                    // Nếu không có firstname/lastname, lấy 2 chữ cái đầu của username
                    return (user.username || 'U').substring(0, 2).toUpperCase();
                  })()}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {(() => {
                    // Hiển thị tên đầy đủ nếu có, nếu không thì dùng username
                    const fullName = `${user.firstname || ''} ${user.lastname || ''}`.trim();
                    return fullName || user.username || "User";
                  })()}
                </h3>
                <p className="text-gray-500">@{user.username}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-600">
                    {user.email || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-gray-600">
                    {user.phoneNumber || "Not provided"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm text-gray-600">{user.role}</p>
                </div>
              </div>

              {user.bio && (
                <div className="pt-3 border-t">
                  <p className="text-sm font-medium mb-2">Bio</p>
                  <p className="text-sm text-gray-600">{user.bio}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Permissions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permissions & Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">
                  System Permissions ({permissions.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {permissions.length > 0 ? (
                    permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No specific permissions assigned
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3">Account Status</h4>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      user.active ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm">
                    {user.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {isAdmin && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Admin Privileges</h4>
                  <div className="space-y-2">
                    <Badge variant="default" className="bg-red-500">
                      Full System Access
                    </Badge>
                    <Badge variant="default" className="bg-orange-500">
                      User Management
                    </Badge>
                    <Badge variant="default" className="bg-purple-500">
                      System Settings
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security actions */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change password trigger */}
        <Card>
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={() => setShowChangeModal(true)}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Đặt lại mật khẩu
            </button>
            {changeMsg && (
              <div className="text-green-600 text-sm">{changeMsg}</div>
            )}
            {changeErr && (
              <div className="text-red-600 text-sm">{changeErr}</div>
            )}
          </CardContent>
        </Card>

        {/* Danger zone */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Xoá tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              Hành động này sẽ xoá vĩnh viễn tài khoản của bạn cùng dữ liệu liên
              quan.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
            >
              Tôi hiểu rủi ro, xoá tài khoản
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Modal change password */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowChangeModal(false)}
          ></div>
          <div className="relative bg-white rounded-lg shadow-xl w-[95%] max-w-md p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Đổi mật khẩu</h3>
              <button
                onClick={() => setShowChangeModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid gap-2">
                <label className="text-sm text-gray-700">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    className="border rounded px-3 py-2 w-full pr-10"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={
                      showCurrent ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"
                    }
                  >
                    {showCurrent ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-gray-700">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    className="border rounded px-3 py-2 w-full pr-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={showNew ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                  >
                    {showNew ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-gray-700">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    className="border rounded px-3 py-2 w-full pr-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                    aria-label={
                      showConfirm ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"
                    }
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleChangePassword}
                  disabled={isChanging}
                  className={`px-4 py-2 rounded text-white ${
                    isChanging ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isChanging ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
                <button
                  onClick={() => setShowChangeModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Huỷ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal success change password */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowSuccessModal(false)}
          ></div>
          <div className="relative bg-white rounded-lg shadow-xl w-[95%] max-w-md p-6">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold">Đổi mật khẩu thành công</h3>
              <p className="text-sm text-gray-600">
                Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập lại bằng mật khẩu mới để tiếp tục.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={handleReLogin}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Đăng nhập lại
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Để sau
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
