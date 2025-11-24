"use client";
import React from "react";

interface ServiceSummaryData {
  totalCombo: number;
  totalLe: number;
  totalCT: number;
  totalGift: number;
  totalAll: number;
  totalPending: number;
  prevCombo: number;
  prevLe: number;
  prevCT: number;
  prevGift: number;
  prevAll: number;
  prevPending: number;
  comboGrowth: number;
  leGrowth: number;
  ctGrowth: number;
  giftGrowth: number;
  allGrowth: number;
  pendingGrowth: number;
}

interface ServiceStatCardsProps {
  serviceSummary: ServiceSummaryData | null;
  serviceSummaryLoading: boolean;
  serviceSummaryError: string | null;
}

function StatCard({
  title,
  value,
  delta,
  className,
  valueColor,
}: {
  title: string;
  value: number;
  delta: number | null;
  className?: string;
  valueColor?: string;
}) {
  const isUp = delta !== null && delta > 0;
  const isDown = delta !== null && delta < 0;
  return (
    <div
      className={`bg-white rounded-xl shadow p-6 flex flex-col items-center min-w-[220px] border-4 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
        className ?? "border-gray-200"
      }`}
    >
      <div className="text-sm text-gray-700 mb-1 text-center">{title}</div>
      <div
        className={`text-4xl font-bold mb-1 text-center ${
          valueColor ?? "text-black"
        }`}
      >
        {value.toLocaleString()}
      </div>
      <div
        className={`text-lg font-semibold flex items-center gap-1 ${
          isUp ? "text-green-600" : isDown ? "text-red-500" : "text-gray-500"
        }`}
      >
        {isUp && <span>↑</span>}
        {isDown && <span>↓</span>}
        {delta === null ? "N/A" : Math.abs(delta).toLocaleString()}
      </div>
    </div>
  );
}

export default function ServiceStatCards({
  serviceSummary,
  serviceSummaryLoading,
  serviceSummaryError,
}: ServiceStatCardsProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Theo dõi scroll position để cập nhật dot active
  const handleScroll = React.useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const scrollWidth = container.scrollWidth;
      const maxScroll = scrollWidth - containerWidth;
      
      // Tính toán index dựa trên vị trí scroll
      if (scrollLeft <= 0) {
        setCurrentIndex(0);
      } else if (scrollLeft >= maxScroll) {
        setCurrentIndex(2); // 3 dots = index 0, 1, 2
      } else {
        // Chia scroll range thành 3 phần
        const scrollPercent = scrollLeft / maxScroll;
        const newIndex = Math.round(scrollPercent * 2); // 0, 1, 2
        setCurrentIndex(newIndex);
      }
    }
  }, []);

  // Scroll đến card cụ thể
  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const containerWidth = container.clientWidth;
      const scrollWidth = container.scrollWidth;
      const maxScroll = scrollWidth - containerWidth;
      
      // Tính toán vị trí scroll dựa trên index
      let scrollLeft;
      if (index === 0) {
        scrollLeft = 0;
      } else if (index === 2) {
        scrollLeft = maxScroll;
      } else {
        // index = 1, scroll đến giữa
        scrollLeft = maxScroll / 2;
      }
      
      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  // Use API data only
  const serviceData = React.useMemo(() => {
    if (!serviceSummary) return null;
    
    return {
      comboThisWeek: serviceSummary.totalCombo,
      retailThisWeek: serviceSummary.totalLe,
      ctThisWeek: serviceSummary.totalCT,
      giftThisWeek: serviceSummary.totalGift,
      totalServiceThisWeek: serviceSummary.totalAll,
      pendingThisWeek: serviceSummary.totalPending || 0,
      deltaCombo: serviceSummary.totalCombo - serviceSummary.prevCombo,
      deltaRetail: serviceSummary.totalLe - serviceSummary.prevLe,
      deltaCT: serviceSummary.totalCT - serviceSummary.prevCT,
      deltaGift: serviceSummary.totalGift - serviceSummary.prevGift,
      deltaTotalService: serviceSummary.totalAll - serviceSummary.prevAll,
      deltaPending:
        (serviceSummary.totalPending || 0) -
        (serviceSummary.prevPending || 0),
    };
  }, [serviceSummary]);

  return (
    <>
      <div className="w-full mb-2">
        {serviceSummaryLoading && (
          <div className="text-blue-600 text-sm">🔄 Đang tải dữ liệu...</div>
        )}
        {serviceSummaryError && (
          <div className="text-red-600 text-sm">
            ❌ Lỗi API: {serviceSummaryError}
          </div>
        )}
      </div>

      {/* Mobile: Vertical scrollable layout */}
      <div className="md:hidden w-full mb-5 mt-5" data-search-ref="services_stat_cards">
        <div
          className="max-h-96 overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#fbbf24 #f3f4f6",
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              width: 6px;
            }
            div::-webkit-scrollbar-track {
              background: #f3f4f6;
              border-radius: 3px;
            }
            div::-webkit-scrollbar-thumb {
              background: #fbbf24;
              border-radius: 3px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: #f59e0b;
            }
          `}</style>
          <div className="flex flex-col gap-4">
            {serviceData && (
              <StatCard
                title="Tổng Combo"
                value={serviceData.comboThisWeek}
                delta={serviceData.deltaCombo}
                valueColor="text-black"
                className="bg-[#33a7b5] w-full"
              />
            )}
            {serviceData && (
              <>
                <StatCard
                  title="Tổng dịch vụ lẻ"
                  value={serviceData.retailThisWeek}
                  delta={serviceData.deltaRetail}
                  valueColor="text-black"
                  className="bg-[#9b51e0] w-full"
                />
                <StatCard
                  title="Tổng dịch vụ CT"
                  value={serviceData.ctThisWeek}
                  delta={serviceData.deltaCT}
                  valueColor="text-black"
                  className="bg-[#ee2c82] w-full"
                />
                <StatCard
                  title="Tổng quà tặng"
                  value={serviceData.giftThisWeek}
                  delta={serviceData.deltaGift}
                  valueColor="text-black"
                  className="bg-[#f16a3f] w-full"
                />
                <StatCard
                  title="Tổng dịch vụ thực hiện"
                  value={serviceData.totalServiceThisWeek}
                  delta={serviceData.deltaTotalService}
                  valueColor="text-black"
                  className="bg-[#7adcb4] w-full"
                />
                <StatCard
                  title="Tổng dịch vụ chưa thực hiện"
                  value={serviceData.pendingThisWeek}
                  delta={serviceData.deltaPending}
                  valueColor="text-black"
                  className="bg-[#ff6b6b] w-full"
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: Horizontal scrollable with dots navigation */}
      <div className="hidden md:flex flex-col items-center w-full" data-search-ref="services_stat_cards">
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto scrollbar-hide gap-4 mb-5 mt-5 w-[80%]"
          data-search-ref="services_stat_cards"
          style={{
            scrollbarWidth: 'none',
            scrollbarColor: '#fbbf24 #f3f4f6'
          }}
        >
          <style jsx>{`
            div::-webkit-scrollbar {
              height: 8px;
            }
            div::-webkit-scrollbar-track {
              background: #f3f4f6;
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb {
              background: #fbbf24;
              border-radius: 4px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: #f59e0b;
            }
          `}</style>
          {serviceData && (
            <>
              <StatCard
                title="Tổng Combo"
                value={serviceData.comboThisWeek}
                delta={serviceData.deltaCombo}
                valueColor="text-black"
                className="bg-[#33a7b5] flex-shrink-0 w-64"
                data-search-ref="services_stat_cards"
              />
              <StatCard
                title="Tổng dịch vụ lẻ"
                value={serviceData.retailThisWeek}
                delta={serviceData.deltaRetail}
                valueColor="text-black"
                className="bg-[#9b51e0] flex-shrink-0 w-64"
              />
              <StatCard
                title="Tổng dịch vụ CT"
                value={serviceData.ctThisWeek}
                delta={serviceData.deltaCT}
                valueColor="text-black"
                className="bg-[#ee2c82] flex-shrink-0 w-64"
              />
              <StatCard
                title="Tổng quà tặng"
                value={serviceData.giftThisWeek}
                delta={serviceData.deltaGift}
                valueColor="text-black"
                className="bg-[#f16a3f] flex-shrink-0 w-64"
              />
              <StatCard
                title="Tổng dịch vụ thực hiện"
                value={serviceData.totalServiceThisWeek}
                delta={serviceData.deltaTotalService}
                valueColor="text-black"
                className="bg-[#7adcb4] flex-shrink-0 w-64"
              />
              <StatCard
                title="Tổng dịch vụ chưa thực hiện"
                value={serviceData.pendingThisWeek}
                delta={serviceData.deltaPending}
                valueColor="text-black"
                className="bg-[#ff6b6b] flex-shrink-0 w-64"
              />
            </>
          )}
        </div>
        
        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? 'bg-orange-300 scale-25'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              title={`Card ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
