import nodemailer from 'nodemailer';
// Email configuration
const EMAIL_CONFIG = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password',
  },
};

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport(EMAIL_CONFIG);
};

// Email templates
export const EMAIL_TEMPLATES = {
  // Email cho khách hàng
  bookingConfirmation: (bookingData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    service: string;
    branchName: string;
    branchAddress: string;
    bookingDate: string;
    bookingTime: string;
    bookingId: string;
    bookingCustomer:string;
  }) => ({
    subject: `🦊 Xác nhận đặt lịch thành công - ${bookingData.service}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác nhận đặt lịch</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f8fafc;
          }
          .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            overflow: hidden;
          }
          .header { 
            background: linear-gradient(135deg, #f97316, #ea580c); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            position: relative;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
            opacity: 0.3;
          }
          .header-content { position: relative; z-index: 1; }
          .content { 
            padding: 40px 30px; 
            background: #ffffff;
          }
          .booking-details { 
            background: #f8fafc; 
            padding: 30px; 
            border-radius: 12px; 
            margin: 30px 0; 
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          .detail-row { 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            margin: 16px 0; 
            padding: 16px 0; 
            border-bottom: 1px solid #e2e8f0; 
          }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { 
            font-weight: 600; 
            color: #374151; 
            font-size: 14px;
            flex: 1;
          }
          .detail-value { 
            color: #6b7280; 
            font-size: 14px;
            text-align: right;
            flex: 1;
            word-break: break-word;
          }
          .footer { 
            text-align: center; 
            margin-top: 40px; 
            padding: 30px;
            background: #f8fafc;
            color: #6b7280; 
            font-size: 14px; 
            border-top: 1px solid #e2e8f0;
          }
          .logo { 
            font-size: 32px; 
            margin-bottom: 16px; 
            display: inline-block;
          }
          .success-icon { 
            font-size: 64px; 
            margin-bottom: 24px; 
            display: block;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #f97316, #ea580c);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
            transition: all 0.3s ease;
          }
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(249, 115, 22, 0.4);
          }
          .notice-box {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            border: 1px solid #f59e0b;
            border-radius: 12px;
            padding: 24px;
            margin: 30px 0;
            position: relative;
          }
          .notice-box::before {
            content: '⚠️';
            position: absolute;
            top: -12px;
            left: 24px;
            background: #f59e0b;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
          }
          .notice-title {
            margin: 0 0 16px 0;
            color: #92400e;
            font-weight: 600;
            font-size: 16px;
          }
          .notice-list {
            margin: 0;
            padding-left: 20px;
            color: #92400e;
            line-height: 1.8;
          }
          .notice-list li {
            margin-bottom: 8px;
          }
          .booking-id {
            background: linear-gradient(135deg, #f97316, #ea580c);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 16px;
            display: inline-block;
          }
          .time-highlight {
            background: linear-gradient(135deg, #059669, #047857);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 16px;
            display: inline-block;
          }
          .customer-highlight {
            background: linear-gradient(135deg, #059669, #047857);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 16px;
            display: inline-block;
          }
          
          /* Mobile Responsive */
          @media only screen and (max-width: 600px) {
            .email-container { margin: 0; border-radius: 0; }
            .header { padding: 30px 20px; }
            .content { padding: 30px 20px; }
            .booking-details { padding: 20px; margin: 20px 0; }
            .detail-row { 
              flex-direction: column; 
              align-items: flex-start; 
              gap: 8px;
            }
            .detail-value { text-align: left; }
            .cta-button { 
              display: block; 
              text-align: center; 
              padding: 14px 24px;
              font-size: 14px;
            }
            .footer { padding: 20px; }
            .notice-box { padding: 20px; margin: 20px 0; }
            .success-icon { font-size: 48px; }
            .logo { font-size: 28px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="header-content">
              <div class="logo">🦊</div>
              <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700;">Face Wash Fox</h1>
              <p style="margin: 0; font-size: 16px; opacity: 0.9;">Xác nhận đặt lịch thành công!</p>
            </div>
          </div>
          
          <div class="content">
            <div style="text-align: center; margin-bottom: 40px;">
              <div class="success-icon">✅</div>
              <h2 style="color: #059669; margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">Đặt lịch thành công!</h2>
              <p style="color: #6b7280; margin: 0; font-size: 16px;">Cảm ơn bạn đã tin tưởng Face Wash Fox</p>
            </div>

            <div class="booking-details">
              <h3 style="margin: 0 0 24px 0; color: #1f2937; font-size: 20px; font-weight: 700; text-align: center;">📋 Thông tin đặt lịch</h3>
              
              <div class="detail-row">
                <span class="detail-label">Mã đặt lịch:</span>
                <span class="detail-value">
                  <span class="booking-id">#${bookingData.bookingId}</span>
                </span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Tên khách hàng:</span>
                <span class="detail-value" style="font-weight: 600; color: #374151;">${bookingData.customerName}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${bookingData.customerEmail}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Số điện thoại:</span>
                <span class="detail-value" style="font-weight: 600; color: #374151;">${bookingData.customerPhone}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Dịch vụ:</span>
                <span class="detail-value" style="font-weight: 600; color: #374151;">${bookingData.service}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Chi nhánh:</span>
                <span class="detail-value">${bookingData.branchName}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Địa chỉ:</span>
                <span class="detail-value">${bookingData.branchAddress}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Ngày đặt lịch:</span>
                <span class="detail-value" style="font-weight: 600; color: #374151; font-size: 16px;">${bookingData.bookingDate}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Giờ đặt lịch:</span>
                <span class="detail-value">
                  <span class="time-highlight">${bookingData.bookingTime}</span>
                </span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Số lượng khách:</span>
                <span class="detail-value">
                  <span class="customer-highlight">${bookingData.bookingCustomer} người</span>
                </span>
              </div>
            </div>

            <div class="notice-box">
              <h4 class="notice-title">📝 Lưu ý quan trọng</h4>
              <ul class="notice-list">
                <li>Vui lòng đến đúng giờ đã đặt lịch để được phục vụ tốt nhất</li>
                <li>Mang theo CMND/CCCD để xác minh thông tin cá nhân</li>
                <li>Liên hệ hotline <strong style="color: #dc2626;">0889 866 666</strong> nếu cần hỗ trợ</li>
                <li>Có thể hủy/đổi lịch trước 2 giờ mà không mất phí</li>
                <li>Đến sớm 10-15 phút để được tư vấn dịch vụ phù hợp</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 40px 0;">
              <a href="https://fbnetworkdev.vercel.app/dashboard/map" class="cta-button">
                🗺️ Xem chi nhánh trên bản đồ
              </a>
            </div>
          </div>

          <div class="footer">
            <p style="margin: 0 0 8px 0; font-weight: 600;">© 2024 Face Wash Fox. Tất cả quyền được bảo lưu.</p>
            <p style="margin: 0; font-size: 13px;">📞 Hotline: 0889 866 666 | 📧 Email: info@facewashfox.com</p>
            <p style="margin: 8px 0 0 0; font-size: 12px; opacity: 0.8;">Hệ thống đặt lịch tự động - Phục vụ 24/7</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Xác nhận đặt lịch thành công!

Mã đặt lịch: #${bookingData.bookingId}
Tên khách hàng: ${bookingData.customerName}
Email: ${bookingData.customerEmail}
Số điện thoại: ${bookingData.customerPhone}
Chi nhánh: ${bookingData.branchName}
Địa chỉ: ${bookingData.branchAddress}
Ngày đặt lịch: ${bookingData.bookingDate}
Giờ đặt lịch: ${bookingData.bookingTime}
Số lượng khách hàng: ${bookingData.bookingCustomer}

Lưu ý quan trọng:
- Vui lòng đến đúng giờ đã đặt lịch
- Mang theo CMND/CCCD để xác minh thông tin
- Liên hệ hotline 0889 866 666 nếu cần hỗ trợ
- Có thể hủy/đổi lịch trước 2 giờ

Cảm ơn bạn đã tin tưởng Face Wash Fox!
    `
  }),

  // Email cho nhà cáo (thông báo có khách đặt lịch mới)
  businessNotification: (bookingData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    service: string;
    branchName: string;
    branchAddress: string;
    bookingDate: string;
    bookingTime: string;
    bookingId: string;
    bookingCustomer: string;
  }) => ({
    subject: `🔔 Có khách đặt lịch mới - ${bookingData.customerName} - ${bookingData.service}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thông báo đặt lịch mới</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f8fafc;
          }
          .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            overflow: hidden;
          }
          .header { 
            background: linear-gradient(135deg, #059669, #047857); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            position: relative;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
            opacity: 0.3;
          }
          .header-content { position: relative; z-index: 1; }
          .content { 
            padding: 40px 30px; 
            background: #ffffff;
          }
          .urgent { 
            background: linear-gradient(135deg, #fef2f2, #fee2e2); 
            border: 2px solid #fca5a5; 
            border-radius: 12px; 
            padding: 24px; 
            margin: 30px 0; 
            position: relative;
            box-shadow: 0 4px 12px rgba(252, 165, 165, 0.2);
          }
          .urgent::before {
            content: '🚨';
            position: absolute;
            top: -12px;
            left: 24px;
            background: #dc2626;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
          }
          .booking-details { 
            background: #f8fafc; 
            padding: 30px; 
            border-radius: 12px; 
            margin: 30px 0; 
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          }
          .detail-row { 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            margin: 16px 0; 
            padding: 16px 0; 
            border-bottom: 1px solid #e2e8f0; 
          }
          .detail-row:last-child { border-bottom: none; }
          .detail-label { 
            font-weight: 600; 
            color: #374151; 
            font-size: 14px;
            flex: 1;
          }
          .detail-value { 
            color: #6b7280; 
            font-size: 14px;
            text-align: right;
            flex: 1;
            word-break: break-word;
          }
          .footer { 
            text-align: center; 
            margin-top: 40px; 
            padding: 30px;
            background: #f8fafc;
            color: #6b7280; 
            font-size: 14px; 
            border-top: 1px solid #e2e8f0;
          }
          .logo { 
            font-size: 32px; 
            margin-bottom: 16px; 
            display: inline-block;
          }
          .action-buttons { 
            text-align: center; 
            margin: 40px 0; 
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
          }
          .btn { 
            display: inline-block; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600; 
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          }
          .btn-primary { 
            background: linear-gradient(135deg, #059669, #047857); 
            color: white; 
          }
          .btn-secondary { 
            background: linear-gradient(135deg, #6b7280, #4b5563); 
            color: white; 
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #059669, #047857);
            color: white;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
            transition: all 0.3s ease;
          }
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(5, 150, 105, 0.4);
          }
          .action-box {
            background: linear-gradient(135deg, #ecfdf5, #d1fae5);
            border: 1px solid #10b981;
            border-radius: 12px;
            padding: 24px;
            margin: 30px 0;
            position: relative;
          }
          .action-box::before {
            content: '✅';
            position: absolute;
            top: -12px;
            left: 24px;
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
          }
          .action-title {
            margin: 0 0 16px 0;
            color: #047857;
            font-weight: 600;
            font-size: 16px;
          }
          .action-list {
            margin: 0;
            padding-left: 20px;
            color: #047857;
            line-height: 1.8;
          }
          .action-list li {
            margin-bottom: 8px;
          }
          .booking-id {
            background: linear-gradient(135deg, #059669, #047857);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 16px;
            display: inline-block;
          }
          .time-highlight {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 16px;
            display: inline-block;
          }
          .customer-highlight {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 16px;
            display: inline-block;
          }
          
          /* Mobile Responsive */
          @media only screen and (max-width: 600px) {
            .email-container { margin: 0; border-radius: 0; }
            .header { padding: 30px 20px; }
            .content { padding: 30px 20px; }
            .booking-details { padding: 20px; margin: 20px 0; }
            .detail-row { 
              flex-direction: column; 
              align-items: flex-start; 
              gap: 8px;
            }
            .detail-value { text-align: left; }
            .action-buttons { 
              flex-direction: column; 
              align-items: center;
            }
            .btn { 
              display: block; 
              text-align: center; 
              padding: 14px 24px;
              font-size: 14px;
              width: 100%;
              max-width: 280px;
            }
            .cta-button { 
              display: block; 
              text-align: center; 
              padding: 14px 24px;
              font-size: 14px;
            }
            .footer { padding: 20px; }
            .urgent, .action-box { padding: 20px; margin: 20px 0; }
            .logo { font-size: 28px; }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="header-content">
              <div class="logo">🦊</div>
              <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700;">Thông báo đặt lịch mới</h1>
              <p style="margin: 0; font-size: 16px; opacity: 0.9;">Có khách hàng vừa đặt lịch thành công!</p>
            </div>
          </div>

          <div class="content">
            <div class="urgent">
              <h3 style="margin: 0 0 12px 0; color: #dc2626; font-size: 20px; font-weight: 700;">🚨 Có khách đặt lịch mới!</h3>
              <p style="margin: 0; color: #dc2626; font-size: 16px; font-weight: 600;">Vui lòng chuẩn bị và xác nhận lịch hẹn với khách hàng ngay lập tức.</p>
            </div>

            <div class="booking-details">
              <h3 style="margin: 0 0 24px 0; color: #374151; font-size: 20px; font-weight: 700; text-align: center; border-bottom: 2px solid #059669; padding-bottom: 12px;">
                📋 Thông tin đặt lịch
              </h3>
              
              <div class="detail-row">
                <span class="detail-label">Mã đặt lịch:</span>
                <span class="detail-value">
                  <span class="booking-id">#${bookingData.bookingId}</span>
                </span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Tên khách hàng:</span>
                <span class="detail-value" style="font-weight: 700; color: #374151; font-size: 16px;">${bookingData.customerName}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Email khách hàng:</span>
                <span class="detail-value">${bookingData.customerEmail}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Số điện thoại:</span>
                <span class="detail-value" style="font-weight: 700; color: #059669; font-size: 16px;">${bookingData.customerPhone}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Dịch vụ:</span>
                <span class="detail-value" style="font-weight: 600; color: #374151;">${bookingData.service}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Chi nhánh:</span>
                <span class="detail-value">${bookingData.branchName}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Địa chỉ:</span>
                <span class="detail-value">${bookingData.branchAddress}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Ngày đặt lịch:</span>
                <span class="detail-value" style="font-weight: 700; color: #dc2626; font-size: 16px;">${bookingData.bookingDate}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Giờ đặt lịch:</span>
                <span class="detail-value">
                  <span class="time-highlight">${bookingData.bookingTime}</span>
                </span>
              </div>

              <div class="detail-row">
                <span class="detail-label">Số lượng khách:</span>
                <span class="detail-value">
                  <span class="customer-highlight">${bookingData.bookingCustomer} người</span>
                </span>
              </div>
            </div>

            <div class="action-box">
              <h4 class="action-title">✅ Hành động cần thực hiện</h4>
              <ul class="action-list">
                <li>Xác nhận lịch hẹn với khách hàng qua điện thoại trong vòng 30 phút</li>
                <li>Chuẩn bị không gian và dụng cụ cho dịch vụ ${bookingData.service}</li>
                <li>Kiểm tra lịch trình nhân viên và phân công phù hợp</li>
                <li>Gửi lời nhắc nhở trước giờ hẹn 1 tiếng</li>
                <li>Cập nhật hệ thống quản lý lịch hẹn</li>
              </ul>
            </div>

            <div class="action-buttons">
              <a href="tel:${bookingData.customerPhone}" class="btn btn-primary">
                📞 Gọi khách hàng ngay
              </a>
              <a href="mailto:${bookingData.customerEmail}" class="btn btn-secondary">
                📧 Gửi email xác nhận
              </a>
            </div>

            <div style="text-align: center; margin: 40px 0;">
              <a href="https://fbnetworkdev.vercel.app/dashboard/map" class="cta-button">
                🗺️ Xem chi tiết trên hệ thống
              </a>
            </div>
          </div>

          <div class="footer">
            <p style="margin: 0 0 8px 0; font-weight: 600;">© 2024 Face Wash Fox. Hệ thống quản lý đặt lịch tự động.</p>
            <p style="margin: 0; font-size: 13px;">📞 Hotline: 0889 866 666 | 📧 Email: info@facewashfox.com</p>
            <p style="margin: 8px 0 0 0; font-size: 12px; opacity: 0.8;">Thông báo tự động - Cập nhật realtime</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
THÔNG BÁO ĐẶT LỊCH MỚI

Có khách hàng vừa đặt lịch thành công!

Mã đặt lịch: #${bookingData.bookingId}
Tên khách hàng: ${bookingData.customerName}
Email khách hàng: ${bookingData.customerEmail}
Số điện thoại: ${bookingData.customerPhone}
Chi nhánh: ${bookingData.branchName}
Địa chỉ: ${bookingData.branchAddress}
Ngày đặt lịch: ${bookingData.bookingDate}
Giờ đặt lịch: ${bookingData.bookingTime}
Số lượng khách hàng: ${bookingData.bookingCustomer}

Hành động cần thực hiện:
- Xác nhận lịch hẹn với khách hàng qua điện thoại
- Chuẩn bị không gian và dụng cụ cho dịch vụ
- Kiểm tra lịch trình nhân viên
- Gửi lời nhắc nhở trước giờ hẹn 1 tiếng

Liên hệ khách hàng:
- Điện thoại: ${bookingData.customerPhone}
- Email: ${bookingData.customerEmail}

Hệ thống quản lý đặt lịch tự động - Face Wash Fox
    `
  }),
};

// Send email function
export const sendEmail = async (to: string, subject: string, html: string, text?: string) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Face Wash Fox" <${EMAIL_CONFIG.auth.user}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Send booking confirmation email (dual notification)
export const sendBookingConfirmationEmail = async (bookingData: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  branchName: string;
  branchAddress: string;
  bookingDate: string;
  bookingTime: string;
  bookingId: string;
  bookingCustomer: string
}) => {
  const results = {
    customer: { success: false, error: null as string | null, messageId: null as string | null },
    business: { success: false, error: null as string | null, messageId: null as string | null }
  };

  // Gửi email cho khách hàng
  try {
    const customerTemplate = EMAIL_TEMPLATES.bookingConfirmation(bookingData);
    const customerResult = await sendEmail(
      bookingData.customerEmail,
      customerTemplate.subject,
      customerTemplate.html,
      customerTemplate.text
    );
    results.customer = {
      success: customerResult.success,
      error: customerResult.success ? null : customerResult.error || 'Unknown error',
      messageId: customerResult.success ? (customerResult.messageId || null) : null
    };
    console.log('📧 Customer email result:', customerResult);
  } catch (error) {
    results.customer = { success: false, error: error instanceof Error ? error.message : 'Unknown error', messageId: null };
    console.error('❌ Customer email failed:', error);
  }

  // Gửi email cho nhà cáo (business owner)
  try {
    const businessTemplate = EMAIL_TEMPLATES.businessNotification(bookingData);
    const businessEmail = process.env.EMAIL_USER || 'your-email@gmail.com'; // Email của nhà cáo
    const businessResult = await sendEmail(
      businessEmail,
      businessTemplate.subject,
      businessTemplate.html,
      businessTemplate.text
    );
    results.business = {
      success: businessResult.success,
      error: businessResult.success ? null : businessResult.error || 'Unknown error',
      messageId: businessResult.success ? (businessResult.messageId || null) : null
    };
    console.log('📧 Business email result:', businessResult);
  } catch (error) {
    results.business = { success: false, error: error instanceof Error ? error.message : 'Unknown error', messageId: null };
    console.error('❌ Business email failed:', error);
  }

  // Trả về kết quả tổng hợp
  const overallSuccess = results.customer.success || results.business.success;
  const errors = [];
  
  if (!results.customer.success) {
    errors.push(`Customer email failed: ${results.customer.error}`);
  }
  if (!results.business.success) {
    errors.push(`Business email failed: ${results.business.error}`);
  }

  return {
    success: overallSuccess,
    messageId: results.customer.messageId || results.business.messageId,
    details: {
      customer: results.customer,
      business: results.business
    },
    error: errors.length > 0 ? errors.join('; ') : null
  };
};

// Test email configuration
export const testEmailConfiguration = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return { success: true };
  } catch (error) {
    console.error('❌ Email configuration is invalid:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
