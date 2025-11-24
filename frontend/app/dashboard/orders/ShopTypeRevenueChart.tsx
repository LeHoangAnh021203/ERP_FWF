import React from 'react';

interface ShopTypeRevenueData {
  date: string;
  shopType: string;
  revenue: number;
}

interface Props {
  data: ShopTypeRevenueData[] | null;
  loading: boolean;
  error: string | null;
}

const ShopTypeRevenueChart: React.FC<Props> = ({ data, loading, error }) => {
  // Xử lý dữ liệu để tính tổng theo loại cửa hàng
  const processedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    const shopTypeTotals: Record<string, number> = {};
    
    data.forEach(item => {
      if (!shopTypeTotals[item.shopType]) {
        shopTypeTotals[item.shopType] = 0;
      }
      shopTypeTotals[item.shopType] += item.revenue;
    });

    return Object.entries(shopTypeTotals).map(([shopType, totalRevenue]) => ({
      shopType,
      totalRevenue,
      formattedRevenue: totalRevenue.toLocaleString('vi-VN'),
    }));
  }, [data]);

  const totalRevenue = React.useMemo(() => {
    return processedData.reduce((sum, item) => sum + item.totalRevenue, 0);
  }, [processedData]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Tổng thực thu theo loại cửa hàng
        </h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Tổng thực thu theo loại cửa hàng
        </h3>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-600">Không thể tải dữ liệu</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Tổng thực thu theo loại cửa hàng
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">📊</div>
          <p className="text-gray-600">Không có dữ liệu</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Tổng thực thu theo loại cửa hàng
      </h3>
      
      {/* Tổng thực thu */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <div className="text-sm text-gray-600 mb-1">Tổng thực thu</div>
        <div className="text-2xl font-bold text-blue-600">
          {totalRevenue.toLocaleString('vi-VN')} ₫
        </div>
      </div>

      {/* Chart và bảng dữ liệu */}
      <div className="space-y-6">
        {/* Bar Chart */}
        <div className="space-y-4">
          {processedData.map((item, index) => {
            const percentage = totalRevenue > 0 ? (item.totalRevenue / totalRevenue) * 100 : 0;
            const colors = [
              { gradient: 'from-blue-500 to-blue-600', text: 'text-blue-600', label: 'text-blue-500' },
              { gradient: 'from-green-500 to-green-600', text: 'text-green-600', label: 'text-green-500' },
              { gradient: 'from-purple-500 to-purple-600', text: 'text-purple-600', label: 'text-purple-500' },
              { gradient: 'from-orange-500 to-orange-600', text: 'text-orange-600', label: 'text-orange-500' },
              { gradient: 'from-red-500 to-red-600', text: 'text-red-600', label: 'text-red-500' }
            ];
            
            const currentColor = colors[index % colors.length];
            
            return (
              <div key={item.shopType} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${currentColor.label}`}>
                    {item.shopType}
                  </span>
                  <span className={`text-sm font-semibold ${currentColor.text}`}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${currentColor.gradient} transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-right">
                  <span className={`text-sm font-semibold ${currentColor.text}`}>
                    {item.formattedRevenue} ₫
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bảng chi tiết */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 font-medium text-gray-700">Loại cửa hàng</th>
                <th className="text-right py-2 font-medium text-gray-700">Thực thu</th>
                <th className="text-right py-2 font-medium text-gray-700">Tỷ lệ</th>
              </tr>
            </thead>
            <tbody>
              {processedData.map((item, index) => {
                const percentage = totalRevenue > 0 ? (item.totalRevenue / totalRevenue) * 100 : 0;
                const colors = [
                  { text: 'text-blue-600', label: 'text-blue-500' },
                  { text: 'text-green-600', label: 'text-green-500' },
                  { text: 'text-purple-600', label: 'text-purple-500' },
                  { text: 'text-orange-600', label: 'text-orange-500' },
                  { text: 'text-red-600', label: 'text-red-500' }
                ];
                const currentColor = colors[index % colors.length];
                
                return (
                  <tr key={item.shopType} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className={`py-3 font-medium ${currentColor.label}`}>{item.shopType}</td>
                    <td className={`py-3 text-right font-semibold ${currentColor.text}`}>
                      {item.formattedRevenue} ₫
                    </td>
                    <td className={`py-3 text-right font-medium ${currentColor.text}`}>
                      {percentage.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold">
                <td className="py-3 text-gray-800">Tổng cộng</td>
                <td className="py-3 text-right text-gray-800">
                  {totalRevenue.toLocaleString('vi-VN')} ₫
                </td>
                <td className="py-3 text-right text-gray-800">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShopTypeRevenueChart;
