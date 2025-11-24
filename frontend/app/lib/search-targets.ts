export type SearchRoute = 'dashboard' | 'orders' | 'services' | 'customers';

export type SearchTarget = {
  label: string;
  route: SearchRoute;
  refKey:
    | 'dashboard_total_sale_table' | 'dashboard_foxie_balance' | 'dashboard_sales_by_hour' | 'dashboard_sale_detail' | 'dashboard_kpi' | 'dashboard_customer_section' | 'dashboard_booking_section' | 'dashboard_service_section'
    | 'orders_kpi' | 'orders_store_table' | 'orders_store_revenue' | 'orders_region_pie' | 'orders_total_by_day' | 'orders_total_by_store' | 'orders_customer_type_by_day' | 'orders_top10_location' | 'orders_orders_chart' | 'orders_top10_store' | 'orders_stat_cards'
    | 'services_weekly' | 'services_pies' | 'services_bottom3' | 'services_stat_cards' | 'services_store' | 'services_region' | 'services_table' | 'services_new_old'
    | 'customers_summary' | 'customers_old_trend' | 'customers_new_chart' | 'customers_old_stat' | 'customers_type_trend' | 'customers_source_bar' | 'customers_app_pie' | 'customers_app_bar' | 'customers_facility_hour' | 'customers_booking_hour';
  keywords: string[]; // extra aliases
};

// Central registry of user-facing tables/charts for suggestions and search mapping
export const SEARCH_TARGETS: SearchTarget[] = [
  // Dashboard
  { label: 'Bảng Tổng Doanh Số', route: 'dashboard', refKey: 'dashboard_total_sale_table', keywords: ['total sale table', 'bảng tổng doanh số', 'real time'] },
  { label: 'Số Dư Thẻ Foxie', route: 'dashboard', refKey: 'dashboard_foxie_balance', keywords: ['foxie', 'the foxie', 'foxie card', 'số dư', 'real time'] },
  { label: 'Doanh Số Theo Giờ', route: 'dashboard', refKey: 'dashboard_sales_by_hour', keywords: ['sales by hour', 'theo giờ', 'real time']  },
  { label: 'Chi Tiết Doanh Thu', route: 'dashboard', refKey: 'dashboard_sale_detail', keywords: ['chi tiết', 'detail', 'hóa đơn', 'real time'] },
  { label: 'KPI Doanh Số', route: 'dashboard', refKey: 'dashboard_kpi', keywords: ['kpi', 'target', 'mục tiêu', 'real time'] },
  { label: 'Khách Hàng', route: 'dashboard', refKey: 'dashboard_customer_section', keywords: ['khách hàng', 'customer', 'real time'] },
  { label: 'Đặt Lịch', route: 'dashboard', refKey: 'dashboard_booking_section', keywords: ['đặt lịch', 'booking', 'real time'] },
  { label: 'Dịch Vụ', route: 'dashboard', refKey: 'dashboard_service_section', keywords: ['dịch vụ', 'service', 'real time'] },
  { label: 'Top 10 Dịch Vụ Theo Số Lượt', route: 'dashboard', refKey: 'dashboard_service_section', keywords: ['top 10', 'số lượt', 'real time'] },

  // Orders page
  { label: 'KPI Cửa Hàng', route: 'orders', refKey: 'orders_kpi', keywords: ['kpi', 'cua hang', 'store kpi', "don hang"] },
  { label: 'Thực Thu Cửa Hàng', route: 'orders', refKey: 'orders_store_revenue', keywords: ['thuc thu', 'store revenue', "don hang"] },
  { label: 'Thực Thu Khu Vực (Pie)', route: 'orders', refKey: 'orders_region_pie', keywords: ['khu vuc', 'pie', "don hang"] },
  { label: 'Tổng Thực Thu Theo Ngày', route: 'orders', refKey: 'orders_total_by_day', keywords: ['tong thuc thu', 'theo ngay', "don hang"] },
  { label: 'Tổng Thực Thu Theo Loại Cửa Hàng', route: 'orders', refKey: 'orders_total_by_store', keywords: ['loai cua hang', "don hang"] },
  { label: 'Khách Theo Loại (Theo Ngày)', route: 'orders', refKey: 'orders_customer_type_by_day', keywords: ['khach', 'loai', 'theo ngay', "don hang"] },
  { label: 'Top 10 Cửa Hàng Theo Doanh Thu', route: 'orders', refKey: 'orders_top10_location', keywords: ['top 10', 'location', "don hang"] },
  { label: 'Số Lượng Đơn Theo Ngày', route: 'orders', refKey: 'orders_orders_chart', keywords: ['orders chart', "don hang"] },
  { label: 'Top 10 Cửa Hàng Theo Đơn Hàng', route: 'orders', refKey: 'orders_top10_store', keywords: ['top 10 store', "don hang"] },
  { label: 'Thống Kê Tổng Quan', route: 'orders', refKey: 'orders_stat_cards', keywords: ['stat cards', "don hang"] },

  // Services page
  { label: 'Tổng Dịch Vụ Thực Hiện', route: 'services', refKey: 'services_weekly', keywords: ['weekly', 'tong dich vu', 'dich vu'] },
  { label: 'Pie Top 10 Dịch Vụ', route: 'services', refKey: 'services_pies', keywords: ['pie', 'top 10', 'dich vu'] },
  { label: 'Bottom 3 Dịch Vụ', route: 'services', refKey: 'services_bottom3', keywords: ['bottom 3', 'dich vu'] },
  { label: 'Thống Kê Dịch Vụ', route: 'services', refKey: 'services_stat_cards', keywords: ['stat cards', 'dich vu'] },
  { label: 'Dịch Vụ Theo Cửa Hàng', route: 'services', refKey: 'services_store', keywords: ['store', 'dich vu'] },
  { label: 'Dịch Vụ Theo Khu Vực', route: 'services', refKey: 'services_region', keywords: ['region', 'dich vu'] },
  { label: 'Bảng Thống Kê Dịch Vụ', route: 'services', refKey: 'services_table', keywords: ['table', 'dich vu'] },
  { label: 'Tỉ Lệ Khách Mới/Cũ', route: 'services', refKey: 'services_new_old', keywords: ['khach moi cu', 'dich vu'] },
  
  // Customers page
  { label: 'Tổng Hợp Khách Mới/Cũ', route: 'customers', refKey: 'customers_summary', keywords: ['tong hop', 'summary', 'khach hang'] },
  { label: 'Khách Cũ Theo Thời Gian', route: 'customers', refKey: 'customers_old_trend', keywords: ['khach cu', 'old trend', 'khach hang'] },
  { label: 'Tổng Số Khách Mới', route: 'customers', refKey: 'customers_new_chart', keywords: ['khach moi', 'new chart', 'khach hang'] },
  { label: 'Thống Kê Khách Cũ', route: 'customers', refKey: 'customers_old_stat', keywords: ['old stat', 'khach hang'] },
  { label: 'Khách Theo Phân Loại', route: 'customers', refKey: 'customers_type_trend', keywords: ['phan loai', 'type trend', 'khach hang'] },
  { label: 'Nguồn Đơn Hàng', route: 'customers', refKey: 'customers_source_bar', keywords: ['nguon', 'source', 'khach hang'] },
  { label: 'Tỉ Lệ Tải App', route: 'customers', refKey: 'customers_app_pie', keywords: ['app pie', 'khach hang'] },
  { label: 'Khách Tải App', route: 'customers', refKey: 'customers_app_bar', keywords: ['app bar', 'khach hang'] },
  { label: 'Thời Gian Đơn Hàng Được Tạo', route: 'customers', refKey: 'customers_facility_hour', keywords: ['facility hour', 'khach hang'] },
  { label: 'Thời Gian Đơn Hàng Hoàn Thành', route: 'customers', refKey: 'customers_booking_hour', keywords: ['booking hour', 'khach hang'] },
];

export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();


