"use client";

import {
  Users,
  ShoppingCart,
  BarChart3,
  Menu,
  X,
  Sparkles,
  Radical,
  CalendarCheck2,
  LayoutDashboard
} from "lucide-react";
import { cn } from "../lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

// Define route permissions mapping
const ROUTE_PERMISSIONS: Record<string, string[]> = {
  "/": [], // Dashboard home - accessible to all authenticated users
  "/dashboard/customers": ["ROLE_ADMIN", "ROLE_CEO"],
  "/dashboard/orders": ["ROLE_ADMIN", "ROLE_CEO"],
  "/dashboard/services": ["ROLE_ADMIN", "ROLE_CEO"],
  "/dashboard/accounting": ["ROLE_ADMIN", "ROLE_CEO"],
  "/dashboard/calendar": ["ROLE_ADMIN", "ROLE_CEO"],
  "/dashboard/generateAI": ["ROLE_ADMIN", "ROLE_CEO"],
  "/dashboard/userManagement": ["ROLE_ADMIN", "ROLE_CEO"],
};

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Users,
    label: "Customer",
    href: "/dashboard/customers",
    requiredPermissions: ["ROLE_ADMIN", "ROLE_CEO"],
  },

  {
    icon: ShoppingCart,
    label: "Orders",
    href: "/dashboard/orders",
    requiredPermissions: ["ROLE_ADMIN", "ROLE_CEO"],
  },
  {
    icon: BarChart3,
    label: "Services",
    href: "/dashboard/services",
    requiredPermissions: ["ROLE_ADMIN", "ROLE_CEO"],
  },
  {
    icon: Radical,
    label: "Accounts",
    href: "/dashboard/accounting",
    requiredPermissions: ["ROLE_ADMIN", "ROLE_CEO"],
  },
  {
    icon: CalendarCheck2,
    label: "Calendar",
    href: "/dashboard/calendar",
    requiredPermissions: ["ROLE_ADMIN", "ROLE_CEO"],
  },
  {
    icon: Sparkles,
    label: "Generate",
    href: "/dashboard/generateAI",
    requiredPermissions: ["ROLE_ADMIN", "ROLE_CEO"],
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, permissions, hasPermission } = useAuth();

  // Check if user has access to a route
  const hasRouteAccess = (href: string, requiredPermissions?: string[]) => {
    // Dashboard home is accessible to all authenticated users
    if (href === "/") return true;
    
    // If no permissions required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    
    // Check if user is admin or CEO (they have access to everything)
    const isAdminOrCEO = permissions.includes("ROLE_ADMIN") || 
                         permissions.includes("ROLE_CEO") ||
                         user?.role === "ADMIN" ||
                         user?.role === "CEO";
    
    if (isAdminOrCEO) return true;
    
    // Check if user has at least one of the required permissions
    return requiredPermissions.some(permission => 
      hasPermission(permission) || permissions.includes(permission)
    );
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-40 bg-[#f66035] text-white flex flex-col transition-all duration-300 ease-in-out",
          isOpen ? "w-64" : "w-16"
        )}
      >
        {/* Logo section with toggle button */}
        <div className="p-2 border-b border-[#fdec40]">
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 flex items-center justify-center "
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <div
              className={cn(
                "transition-opacity duration-300",
                isOpen ? "block" : "hidden"
              )}
            >
              <h2 className="text-xl font-bold">Master Report</h2>
              <p className="text-white text-sm mt-1">FB Network</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 lg:p-4">
          <ul className="flex space-y-2 justify-center ">
            <div>
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const hasAccess = hasRouteAccess(item.href, item.requiredPermissions);
                
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => {
                        if (isNavigating) return; // Prevent multiple clicks
                        
                        // Check permission before navigation
                        if (!hasAccess) {
                          // Navigate to the route anyway - PermissionGuard will handle showing the denied page
                          router.push(item.href, { scroll: false });
                          return;
                        }
                        
                        console.log(`[Sidebar] Navigating to: ${item.href}`);
                        setIsNavigating(true);
                        
                        // Try router.push first
                        router.push(item.href, { scroll: false });
                        
                        // Fallback to window.location if router doesn't work
                        setTimeout(() => {
                          if (window.location.pathname !== item.href) {
                            console.log(`[Sidebar] Router failed, using window.location`);
                            window.location.href = item.href;
                          }
                          setIsNavigating(false);
                        }, 2000);
                      }}
                      disabled={isNavigating}
                      className={cn(
                        "w-full flex items-center j lg:justify-start px-2 lg:px-3 py-2 rounded-lg text-left transition-colors",
                        isActive
                          ? "bg-white text-[#f66035] shadow-md"
                          : "text-white hover:bg-slate-700 hover:text-white",
                        !hasAccess && "opacity-50 cursor-not-allowed"
                      )}
                      title={!hasAccess ? "Bạn không có quyền truy cập trang này" : ""}
                    >
                      <div className="flex items-center space-x-3">
                        {isNavigating && pathname === item.href ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <item.icon className="h-5 w-5" />
                        )}
                        <span
                          className={cn(
                            "transition-opacity duration-300",
                            isOpen ? "block" : "hidden"
                          )}
                        >
                          {isNavigating && pathname === item.href ? "Loading..." : item.label}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </div>
          </ul>
        </nav>

        {/* User section */}
        <div className="p-2 border-t border-[#fdec40]">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-[#61c9d7] rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">
                <Link href="/dashboard">
                  <Image
                    src="/logo.png"
                    alt="FB Network Logo"
                    width={32}
                    height={32}
                    className="w-full h-full"
                  />
                </Link>
              </span>
            </div>
            <div
              className={cn(
                "transition-opacity duration-300",
                isOpen ? "block" : "hidden"
              )}
            >
              <p className="text-sm font-medium">{user?.firstname ? `${user.firstname} ${user.lastname}` : "User"}</p>
              <p className="text-xs text-white">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center justify-center lg:justify-start px-2 lg:px-3 py-2 rounded-lg text-left transition-colors mt-2 text-white hover:bg-red-600",
              isOpen ? "hidden" : "hidden"
            )}
          ></button>
        </div>
      </div>
    </>
  );
}
