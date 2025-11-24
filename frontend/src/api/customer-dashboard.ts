// API_BASE_URL removed as it's not used

// Add interface for dashboard data
interface DashboardData {
  newCustomer: unknown;
  genderRatio: unknown;
  customerType: unknown;
  customerOldType: unknown;
  customerSource: unknown;
  appDownloadStatus: unknown;
  appDownload: unknown;
  customerSummary: unknown;
  genderRevenue: unknown;
  uniqueCustomers: unknown;
  facilityBooking: unknown;
  [key: string]: unknown; // Add index signature
}

export async function fetchCustomerDashboardData(
  fromDate: string,
  toDate: string,
  authToken?: string
) {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    // Gọi tất cả API cần thiết trong parallel
    const apiCalls = [
      { name: "newCustomer", url: "customer-sale/new-customer-lineChart" },
      { name: "genderRatio", url: "customer-sale/gender-ratio" },
      { name: "customerType", url: "customer-sale/customer-type-trend" },
      { name: "customerOldType", url: "customer-sale/old-customer-lineChart" },
      { name: "customerSource", url: "customer-sale/customer-source-trend" },
      { name: "appDownloadStatus", url: "customer-sale/app-download-status" },
      { name: "appDownload", url: "customer-sale/app-download-pieChart" },
      { name: "customerSummary", url: "customer-sale/customer-summary" },
      { name: "genderRevenue", url: "customer-sale/gender-revenue" },
      {
        name: "uniqueCustomers",
        url: "customer-sale/unique-customers-comparison",
      },
      // Temporarily disabled to prevent API spam
      // {
      //   name: "facilityBooking",
      //   url: "booking/facility-booking-hour?status=Khách%20đến",
      // },
      { name: 'facilityHourService', url: 'customer-sale/facility-hour-service' }, // Thêm API này
    ];

    console.log(" Starting batch API calls for customer dashboard...");

    const results = await Promise.allSettled(
      apiCalls.map(async ({ name, url }) => {
        try {
          // Gọi qua proxy thay vì trực tiếp backend
          const response = await fetch(`/api/proxy/${url}`, {
            method: "POST",
            headers,
            body: JSON.stringify({ fromDate, toDate }),
          });

          if (!response.ok) {
            throw new Error(`${name}: ${response.status}`);
          }

          const data = await response.json();
          console.log(`✅ ${name} API success`);
          return { name, data };
        } catch (error) {
          console.error(`❌ ${name} API failed:`, error);
          throw error;
        }
      })
    );

    // Xử lý kết quả
    const dashboardData: Partial<DashboardData> = {};
    const errors: string[] = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        dashboardData[result.value.name] = result.value.data;
      } else {
        const apiName = apiCalls[index].name;
        const errorMsg = result.reason.message;
        errors.push(`${apiName}: ${errorMsg}`);
        console.error(`Failed to fetch ${apiName}:`, result.reason);
      }
    });

    console.log(
      `📊 Batch API completed. Success: ${
        Object.keys(dashboardData).length
      }, Errors: ${errors.length}`
    );

    return {
      success: true,
      data: dashboardData,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
      summary: {
        totalApis: apiCalls.length,
        successfulApis: Object.keys(dashboardData).length,
        failedApis: errors.length,
      },
    };
  } catch (error) {
    console.error("Dashboard summary error:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch dashboard data"
    );
  }
}
