import React from "react";

interface FacilityHourRow {
  facility: string;
  total: number;
  [key: string]: string | number;
}

interface CustomerFacilityHourTableProps {
  allHourRanges: string[];
  facilityHourTableData: FacilityHourRow[];
  getCellBg: (val: number) => string;
  isMobile: boolean;
  loadingFacilityHour: boolean;
  errorFacilityHour: string | null;
}

const CustomerFacilityBookingTable: React.FC<CustomerFacilityHourTableProps> = ({
  allHourRanges,
  facilityHourTableData,
  getCellBg,
  isMobile,
  loadingFacilityHour,
  errorFacilityHour,
}) => {
  console.log("🔍 CustomerFacilityBookingTable Debug:", {
    loadingFacilityHour,
    errorFacilityHour,
    allHourRanges,
    facilityHourTableData,
    hasData: facilityHourTableData.length > 0
  });
  
  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-4 mt-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-5 gap-4">
        <h2 className="text-lg sm:text-xl font-semibold"  data-search-ref="customers_booking_hour">
          Thời gian đơn hàng hoàn thành
        </h2>
        <div className="flex flex-wrap gap-2 text-xs mt-2 sm:mt-0">
          <span className="inline-flex items-center px-2 py-1 rounded bg-[#68B2A0] text-white">
            Cao điểm (≥50 đơn)
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded bg-[#CDE0C9]">
            Bận rộn (≥35 đơn)
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded bg-[#E0ECDE]">
            Khá bận (≥25 đơn)
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded bg-[#F0F8F0]">
            Ít bận (≤15 đơn)
          </span>
        </div>
      </div>
      {loadingFacilityHour ? (
        <div>Đang tải dữ liệu...</div>
      ) : errorFacilityHour ? (
        <div className="text-red-500">
          {errorFacilityHour.includes('Authentication failed') || errorFacilityHour.includes('No valid token') || errorFacilityHour.includes('401') || errorFacilityHour.includes('Backend Error: 401')
            ? 'Vui lòng đăng nhập để xem dữ liệu' 
            : errorFacilityHour}
        </div>
      ) : allHourRanges.length === 0 || facilityHourTableData.length === 0 ? (
        <div className="text-gray-500">Không có dữ liệu để hiển thị</div>
      ) : (
        <div className="overflow-x-auto mt-4 custom-scrollbar">
          <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
            <div className="max-h-[420px] overflow-y-auto">
              <table
                className={`min-w-[600px] w-full border text-center ${
                  isMobile ? "text-xs" : ""
                }`}
              >
                <thead>
                  <tr>
                    <th
                      className={`border px-2 py-1 bg-[#2C6975] text-white text-left font-bold 
        ${isMobile ? "text-xs" : ""} sticky left-0 top-0 z-20`}
                    >
                      Cơ sở
                    </th>
                    {allHourRanges.map((hour) => (
                      <th
                        key={hour}
                        className={`border px-2 py-1 font-bold text-sm bg-[#2C6975] text-white 
          ${isMobile ? "text-xs px-1 py-0.5" : ""} sticky top-0 z-10`}
                      >
                        {hour}
                      </th>
                    ))}
                    <th
                      className={`border px-2 py-1 bg-[#2C6975] text-white font-bold 
        ${isMobile ? "text-xs" : ""} sticky right-0 top-0 z-20`}
                    >
                      Tổng
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {facilityHourTableData.map((row) => (
                    <tr key={row.facility}>
                      <td
                        className={`border px-2 py-1 text-left font-semibold ${
                          isMobile ? "text-xs px-1 py-0.5" : ""
                        } sticky left-0 z-10 bg-gray-50`}
                      >
                        {row.facility}
                      </td>
                      {allHourRanges.map((hour) => {
                        const val = Number(row[hour] ?? 0);
                        return (
                          <td
                            key={hour}
                            className={`border px-2 py-1 ${getCellBg(val)} ${
                              isMobile ? "text-xs px-1 py-0.5" : ""
                            }`}
                          >
                            {val}
                          </td>
                        );
                      })}
                      <td
                        className={`border px-2 py-1 font-bold ${
                          isMobile ? "text-xs px-1 py-0.5" : ""
                        } sticky right-0 z-10 bg-gray-100`}
                      >
                        {row.total}
                      </td>
                    </tr>
                  ))}
                  {/* Hàng tổng cộng */}
                  <tr className="bg-gray-200 font-bold sticky bottom-0 z-10">
                    <td
                      className={`border px-2 py-1 text-left ${
                        isMobile ? "text-xs px-1 py-0.5" : ""
                      } 
      sticky left-0 bottom-0 bg-gray-200 z-20`}
                    >
                      TỔNG CỘNG
                    </td>
                    {allHourRanges.map((hour) => {
                      const totalVal = facilityHourTableData.reduce(
                        (sum, row) => sum + Number(row[hour] ?? 0),
                        0
                      );
                      return (
                        <td
                          key={hour}
                          className={`border px-2 py-1 ${getCellBg(totalVal)} 
          ${isMobile ? "text-xs px-1 py-0.5" : ""} sticky bottom-0 bg-gray-200`}
                        >
                          {totalVal}
                        </td>
                      );
                    })}
                    <td
                      className={`border px-2 py-1 ${
                        isMobile ? "text-xs px-1 py-0.5" : ""
                      } 
      sticky right-0 bottom-0 bg-gray-200`}
                    >
                      {facilityHourTableData.reduce(
                        (sum, row) => sum + Number(row.total ?? 0),
                        0
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerFacilityBookingTable;
