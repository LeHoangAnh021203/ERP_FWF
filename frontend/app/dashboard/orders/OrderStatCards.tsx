"use client";
import React from "react";

interface StatCardProps {
  title: string;
  value: number;
  delta: number | null;
  className?: string;
  valueColor?: string;
}

function StatCard({
  title,
  value,
  delta,
  className,
  valueColor,
}: StatCardProps) {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const isUp = delta !== null && delta > 0;
  const isDown = delta !== null && delta < 0;

  // Use consistent number formatting to prevent hydration mismatch
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Show loading state during SSR to prevent hydration mismatch
  if (!isClient) {
    return (
      <div
        className={`bg-white rounded-xl shadow p-3 flex flex-col items-center w-full border-2 ${
          className ?? "border-gray-200"
        }`}
      >
        <div className="text-xs font-semibold text-gray-700 mb-2 text-center leading-tight">
          {title}
        </div>
        <div
          className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-center break-words ${
            valueColor ?? "text-black"
          }`}
        >
          -
        </div>
        <div
          className={`text-xs font-semibold flex items-center gap-1 text-gray-500`}
        >
          -
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-xl shadow p-3 flex flex-col items-center w-full border-2 ${
        className ?? "border-gray-200"
      }`}
    >
      <div className="text-xs font-semibold text-gray-700 mb-2 text-center leading-tight">
        {title}
      </div>
      <div
        className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-center break-words ${
          valueColor ?? "text-black"
        }`}
      >
        {formatNumber(value)}
      </div>
      <div
        className={`text-xs font-semibold flex items-center gap-1 ${
          isUp ? "text-green-600" : isDown ? "text-red-500" : "text-gray-500"
        }`}
      >
        {isUp && <span>↑</span>}
        {isDown && <span>↓</span>}
        {delta === null ? "N/A" : formatNumber(Math.abs(delta))}
      </div>
    </div>
  );
}

interface OrderStatCardsProps {
  totalOrdersThisWeek: number;
  deltaOrders: number;
  cardOrdersThisWeek: number;
  deltaCardOrders: number;
  retailOrdersThisWeek: number;
  deltaRetailOrders: number;
  foxieOrdersThisWeek: number;
  deltaFoxieOrders: number;
  productOrdersThisWeek: number;
  deltaProductOrders: number;
}

export default function OrderStatCards({
  totalOrdersThisWeek,
  deltaOrders,
  cardOrdersThisWeek,
  deltaCardOrders,
  retailOrdersThisWeek,
  deltaRetailOrders,
  foxieOrdersThisWeek,
  deltaFoxieOrders,
  productOrdersThisWeek,
  deltaProductOrders,
}: OrderStatCardsProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  const cards = [
    {
      title: "Tổng đơn hàng",
      value: totalOrdersThisWeek,
      delta: deltaOrders,
      className: "border-[#f8a0ca] border text-sm",
      valueColor: "text-[#f8a0ca]"
    },
    {
      title: "Đơn mua thẻ",
      value: cardOrdersThisWeek,
      delta: deltaCardOrders,
      className: "border-[#8ed1fc] border text-sm",
      valueColor: "text-[#8ed1fc]"
    },
    {
      title: "Đơn dịch vụ/sản phẩm",
      value: retailOrdersThisWeek,
      delta: deltaRetailOrders,
      className: "border-[#fcb900] border text-sm",
      valueColor: "text-[#fcb900]"
    },
    {
      title: "Đơn trả bằng thẻ Foxie",
      value: foxieOrdersThisWeek,
      delta: deltaFoxieOrders,
      className: "border-[#a9b8c3] border text-sm",
      valueColor: "text-[#a9b8c3]"
    },
    {
      title: "Đơn mua sản phẩm",
      value: productOrdersThisWeek,
      delta: deltaProductOrders,
      className: "border-[#b6d47a] border text-sm",
      valueColor: "text-[#b6d47a]"
    }
  ];

  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 128 + 12; // w-32 (128px) + gap-3 (12px)
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = 128 + 12;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(newIndex);
    }
  };

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

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
              <StatCard
                title={card.title}
                value={card.value}
                delta={card.delta}
                className={card.className}
                valueColor={card.valueColor}
              />
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
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            delta={card.delta}
            className={card.className}
            valueColor={card.valueColor}
          />
        ))}
      </div>
    </div>
  );
}