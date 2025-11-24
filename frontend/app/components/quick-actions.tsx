"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import {
  Plus,
  Users,
  Settings,
  TrendingUp,
  ShoppingCart,
  BarChart3,
  Radical,
  Sparkles,
} from "lucide-react";
import { getQuickActionsUrl } from "@/app/lib/api-config";

interface QuickAction {
  id: string;
  icon: string;
  label: string;
  color: string;
  border?: string;
  count?: number;
  trend?: number;
  href?: string;
}

// API URL được quản lý bởi utility function

export function QuickActions() {
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchQuickActions = async () => {
      try {
        setLoading(true);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(
          getQuickActionsUrl(),
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setQuickActions(data);
        setError(null);
        console.log('✅ Quick Actions loaded successfully:', data.length, 'actions');
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch quick actions";
        setError(errorMessage);
        console.warn("Quick actions fetch error:", err);

        // Fallback data when API fails
        const fallbackActions = [
          {
            id: 'orders',
            icon: 'ShoppingCart',
            label: 'Order Report',
            color: 'hover:bg-blue-500 hover:border-blue-500',
            border: 'border-blue-500',
            href: '/dashboard/orders'
          },
          {
            id: 'customers',
            icon: 'Users',
            label: 'Customer Report',
            color: 'hover:bg-green-500 hover:border-green-500',
            border: 'border-green-500',
            href: '/dashboard/customers'
          },
          {
            id: 'services',
            icon: 'Radical',
            label: 'Services Report',
            color: 'hover:bg-purple-500 hover:border-purple-500',
            border: 'border-purple-500',
            href: '/dashboard/services'
          },
          {
            id: 'accounting',
            icon: 'BarChart3',
            label: 'Accounting Report',
            color: 'hover:bg-orange-500 hover:border-orange-500',
            border: 'border-orange-500',
            href: '/dashboard/accounting'
          },
          {
            id: 'generate-ai',
            icon: 'Sparkles',
            label: 'Generate AI',
            color: 'hover:bg-pink-500 hover:border-pink-500',
            border: 'border-pink-500',
            href: '/dashboard/generateAI'
          },
          {
            id: 'settings',
            icon: 'Settings',
            label: 'System Settings',
            color: 'hover:bg-gray-500 hover:border-gray-500',
            border: 'border-gray-500',
            href: '/dashboard/settings'
          }
        ];
        
        setQuickActions(fallbackActions);
        console.log('🔄 Using fallback Quick Actions data');
      } finally {
        setLoading(false);
      }
    };

    fetchQuickActions();
  }, []);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Plus":
        return Plus;
      case "Users":
        return Users;
      case "BarChart3":
        return BarChart3;
      case "Radical":
        return Radical;
      case "Sparkles":
        return Sparkles;
      case "Settings":
        return Settings;
      case "TrendingUp":
        return TrendingUp;
      case "ShoppingCart":
        return ShoppingCart;
      default:
        return Plus;
    }
  };

  const handleActionClick = (action: QuickAction) => {
    if (isNavigating) return; // Prevent multiple clicks
    
    if (action.href) {
      console.log(`[QuickActions] Navigating to: ${action.href}`);
      setIsNavigating(true);
      router.push(action.href, { scroll: false });
      
      // Fallback to window.location if router doesn't work
      setTimeout(() => {
        if (action.href && window.location.pathname !== action.href) {
          console.log(`[QuickActions] Router failed, using window.location`);
          window.location.href = action.href;
        }
        setIsNavigating(false);
      }, 2000);
    } else {
      // Handle different action types
      switch (action.label) {
        case " Order Report":
          console.log(`[QuickActions] Navigating to: /dashboard/orders`);
          router.push("/dashboard/orders", { scroll: false });
          break;
        case " Customer Report":
          console.log(`[QuickActions] Navigating to: /dashboard/customers`);
          router.push("/dashboard/customers", { scroll: false });
          break;
        case "Services Report":
          console.log(`[QuickActions] Navigating to: /dashboard/services`);
          router.push("/dashboard/services", { scroll: false });
          break;
        case "Accounting Report":
          console.log(`[QuickActions] Navigating to: /dashboard/accounting`);
          router.push("/dashboard/accounting", { scroll: false });
          break;
        case "Generate AI":
          console.log(`[QuickActions] Navigating to: /dashboard/generateAI`);
          router.push("/dashboard/generateAI", { scroll: false });
          break;
        case "System Settings":
          console.log(`[QuickActions] Navigating to: /dashboard/settings`);
          router.push("/dashboard/settings", { scroll: false });
          break;
        default:
          console.log(`Action clicked: ${action.label}`);
      }
    }
  };

  if (loading) {
    return (
      <Card className="bg-white mb-6">
        <CardContent className="p-3 sm:p-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-4 w-32"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-14 sm:h-20 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white mb-6">
      <CardContent className="p-3 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Quick Actions
          </h3>

          
          {error && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
              Using offline data
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
          {quickActions.map((action) => {
            const IconComponent = getIconComponent(action.icon);

            return (
              <Button
                key={action.id}
                variant="outline"
                disabled={isNavigating}
                className={`h-14 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 border-2 hover:border-transparent transition-all ${action.color} hover:text-white ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''} ${action.border || 'border-gray-300'}`}
                onClick={() => handleActionClick(action)}
              >
                <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-[11px] sm:text-xs font-medium">
                  {action.label}
                </span>
               
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
