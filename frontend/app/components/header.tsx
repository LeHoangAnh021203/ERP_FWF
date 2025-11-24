"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, User, Settings, LogOut, HelpCircle, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SmartNotifications } from "./smart-notifications";
import { useAuth } from "../contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { GlobalDatePicker } from "./global-date-picker";
import { SEARCH_TARGETS, normalize } from "../lib/search-targets";

export function Header() {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [desktopQuery, setDesktopQuery] = useState("");
  const [mobileQuery, setMobileQuery] = useState("");
  const [desktopFocused, setDesktopFocused] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const emitSearch = (q: string) => {
    const query = q.trim();
    if (!query) return;
    if (pathname !== "/dashboard") {
      router.push(`/dashboard?q=${encodeURIComponent(query)}`);
      return;
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("global-search", { detail: { query } }));
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const getFiltered = (q: string) => {
    const n = normalize(q);
    if (!n) return SEARCH_TARGETS.slice(0, 6);
    return SEARCH_TARGETS
      .filter((s) => normalize(s.label).includes(n) || s.keywords.some((k) => normalize(k).includes(n) || n.includes(normalize(k))))
      .slice(0, 8);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-3 py-2 sm:px-6 sm:py-4">
      <div className="flex sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
          <div className="relative block sm:hidden w-full">
            <button
              className="p-2"
              onClick={() => setShowMobileSearch((v) => !v)}
              aria-label="Open search"
            >
              <Search className="h-5 w-5 text-gray-400" />
            </button>
            {showMobileSearch && (
              <div className="fixed inset-0 z-[10000] bg-white/95 backdrop-blur-sm">
                <div className="relative px-3 py-3">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    autoFocus
                    placeholder="Tìm theo tên chart/bảng..."
                    className="pl-10 w-full text-base border border-orange-300 shadow"
                    value={mobileQuery}
                    onChange={(e) => setMobileQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        emitSearch(mobileQuery);
                        setShowMobileSearch(false);
                      }
                    }}
                  />
                  {/* Suggestions on mobile */}
                  <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {getFiltered(mobileQuery).map((s) => (
                      <button
                        key={`${s.route}-${s.label}`}
                        className="w-full text-left px-3 py-3 hover:bg-gray-50 text-base"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setMobileQuery(s.label);
                          const path = s.route === 'dashboard' ? '/dashboard' : s.route === 'orders' ? '/dashboard/orders' : s.route === 'services' ? '/dashboard/services' : s.route === 'customers' ? '/dashboard/customers' : '/dashboard';
                          if (typeof window !== 'undefined') {
                            const sameRoute = window.location.pathname.startsWith(path);
                            if (sameRoute) {
                              window.location.hash = `#${s.refKey}`;
                              window.dispatchEvent(new CustomEvent('jump-to-ref', { detail: { refKey: s.refKey } }));
                            } else {
                              window.location.href = `${path}#${s.refKey}`;
                            }
                          }
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm"
                    onClick={() => {
                      emitSearch(mobileQuery);
                      setShowMobileSearch(false);
                    }}
                    aria-label="Close search"
                  >
                    Tìm
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Desktop: luôn hiện input */}
          <div className="relative w-full sm:w-auto hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search..."
              className="pl-10 w-full sm:w-64 text-sm border-orange-500"
              value={desktopQuery}
              onChange={(e) => setDesktopQuery(e.target.value)}
              onFocus={() => setDesktopFocused(true)}
              onBlur={() => setTimeout(() => setDesktopFocused(false), 150)}
              onKeyDown={(e) => {
                if (e.key === "Enter") emitSearch(desktopQuery);
              }}
            />
            {(desktopFocused || desktopQuery) && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-[1200]">
                {getFiltered(desktopQuery).map((s) => (
                  <button
                    key={`${s.route}-${s.label}`}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setDesktopQuery(s.label);
                      const path = s.route === 'dashboard' ? '/dashboard' : s.route === 'orders' ? '/dashboard/orders' : s.route === 'services' ? '/dashboard/services' : s.route === 'customers' ? '/dashboard/customers' : '/dashboard';
                      if (typeof window !== 'undefined') {
                        const sameRoute = window.location.pathname.startsWith(path);
                        if (sameRoute) {
                          window.location.hash = `#${s.refKey}`;
                          window.dispatchEvent(new CustomEvent('jump-to-ref', { detail: { refKey: s.refKey } }));
                        } else {
                          window.location.href = `${path}#${s.refKey}`;
                        }
                      }
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Date Picker */}
        <div className="flex items-center text-xs  ">
          <GlobalDatePicker compact={true}  className="flex text-xs"/>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4 justify-end w-full sm:w-auto">
          <SmartNotifications />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 p-1 sm:p-2"
              >
                <div className="w-8 h-8 bg-[#61c9d7] rounded-full flex items-center justify-center">
                  <Image src="/logo.png" alt="FB Network Logo" width={32} height={32} className="w-full h-full" />
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                  {(() => {
                    // Logic giống profile page: ưu tiên firstname + lastname, nếu không có thì dùng username
                    const fullName = `${user?.firstname || ''} ${user?.lastname || ''}`.trim();
                    if (fullName) {
                      return fullName;
                    }
                    // Nếu không có tên đầy đủ, dùng username (giống profile page hiển thị @username)
                    return user?.username || "User";
                  })()}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 sm:w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {(() => {
                      // Logic giống profile page: ưu tiên firstname + lastname, nếu không có thì dùng username
                      const fullName = `${user?.firstname || ''} ${user?.lastname || ''}`.trim();
                      if (fullName) {
                        return fullName;
                      }
                      // Nếu không có tên đầy đủ, dùng username (giống profile page hiển thị @username)
                      return user?.username || "User";
                    })()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || (user?.username ? `@${user.username}` : "user@example.com")}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/dashboard/userManagement')}>
                <Users className="mr-2 h-4 w-4" />
              User Management
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
