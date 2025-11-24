"use client";
import React from "react";

interface OrderSummaryData {
  totalOrders: number;
  serviceOrders: number;
  foxieCardOrders: number;
  productOrders: number;
  cardPurchaseOrders: number;
  deltaTotalOrders: number;
  deltaServiceOrders: number;
  deltaFoxieCardOrders: number;
  deltaProductOrders: number;
  deltaCardPurchaseOrders: number;
}

interface OrderStatCardsWithAPIProps {
  data: OrderSummaryData | null;
  loading: boolean;
  error: string | null;
}

export default function OrderStatCardsWithAPI({
  data,
  loading,
  error,
}: OrderStatCardsWithAPIProps) {
  const [isClient, setIsClient] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleScroll = React.useCallback(() => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = 128 + 12;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    }
  }, []);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const scrollToCard = React.useCallback((index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 128 + 12; // w-32 (128px) + gap-3 (12px)
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  }, []);

  const formatNumber = React.useCallback((num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

  if (loading) {
    return (
      <div className="w-full mb-5 mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" data-search-ref="orders_stat_cards">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mb-5 mt-5">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="text-red-600 text-center">
            ❌ Lỗi tải dữ liệu: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full mb-5 mt-5">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="text-gray-500 text-center">
            Không có dữ liệu
          </div>
        </div>
      </div>
    );
  }

  // Show loading state during SSR to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="w-full mb-5 mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow p-3 flex flex-col items-center w-full border-2 border-gray-200">
              <div className="text-xs font-semibold text-gray-700 mb-2 text-center leading-tight">-</div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-center break-words text-black">-</div>
              <div className="text-xs font-semibold flex items-center gap-1 text-gray-500">-</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Tổng đơn hàng",
      value: data.totalOrders,
      delta: data.deltaTotalOrders,
      className: "border-[#f8a0ca] border text-sm",
      valueColor: "text-[#f8a0ca]"
    },
    {
      title: "Đơn mua thẻ",
      value: data.cardPurchaseOrders,
      delta: data.deltaCardPurchaseOrders,
      className: "border-[#8ed1fc] border text-sm",
      valueColor: "text-[#8ed1fc]"
    },
    {
      title: "Đơn dịch vụ/sản phẩm",
      value: data.serviceOrders,
      delta: data.deltaServiceOrders,
      className: "border-[#fcb900] border text-sm",
      valueColor: "text-[#fcb900]"
    },
    {
      title: "Đơn trả bằng thẻ Foxie",
      value: data.foxieCardOrders,
      delta: data.deltaFoxieCardOrders,
      className: "border-[#a9b8c3] border text-sm",
      valueColor: "text-[#a9b8c3]"
    },
    {
      title: "Đơn mua sản phẩm",
      value: data.productOrders,
      delta: data.deltaProductOrders,
      className: "border-[#b6d47a] border text-sm",
      valueColor: "text-[#b6d47a]"
    }
  ];



  return (
    <div className="w-full mb-5 mt-5">
      {/* Mobile: Horizontal scrollable layout with dots */}
      <div className="sm:hidden">
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {cards.map((card, index) => (
            <div key={index} className="flex-shrink-0 w-32">
              <div className={`bg-white rounded-xl shadow p-3 flex flex-col items-center w-full border-2 ${card.className}`}>
                <div className="text-xs font-semibold text-gray-700 mb-2 text-center leading-tight">
                  {card.title}
                </div>
                <div className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-center break-words ${card.valueColor}`}>
                  {formatNumber(card.value)}
                </div>
                <div className={`text-xs font-semibold flex items-center gap-1 ${
                  card.delta > 0 ? "text-green-600" : card.delta < 0 ? "text-red-500" : "text-gray-500"
                }`}>
                  {card.delta > 0 && <span>↑</span>}
                  {card.delta < 0 && <span>↓</span>}
                  {card.delta === 0 ? "0" : formatNumber(Math.abs(card.delta))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Dots navigation */}
        <div className="flex justify-center gap-2 mt-3">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-orange-300 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Desktop: Grid layout */}
      <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-5 gap-3">
        {cards.map((card, index) => (
          <div key={index} className={`bg-white rounded-xl shadow p-3 flex flex-col items-center w-full border-2 ${card.className}`}>
            <div className="text-xs font-semibold text-gray-700 mb-2 text-center leading-tight">
              {card.title}
            </div>
            <div className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-center break-words ${card.valueColor}`}>
              {formatNumber(card.value)}
            </div>
            <div className={`text-xs font-semibold flex items-center gap-1 ${
              card.delta > 0 ? "text-green-600" : card.delta < 0 ? "text-red-500" : "text-gray-500"
            }`}>
              {card.delta > 0 && <span>↑</span>}
              {card.delta < 0 && <span>↓</span>}
              {card.delta === 0 ? "0" : formatNumber(Math.abs(card.delta))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
