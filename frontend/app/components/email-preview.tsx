"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { EMAIL_TEMPLATES } from '@/app/lib/email-service';

export function EmailPreview() {
  const [selectedTemplate, setSelectedTemplate] = useState<'customer' | 'business'>('customer');
  
  // Sample data for preview
  const sampleBookingData = {
    customerName: "Nguyễn Thị Mai",
    customerEmail: "mai.nguyen@example.com",
    customerPhone: "0901234567",
    service: "Dịch vụ chăm sóc da mặt",
    branchName: "Vincom Center Bà Triệu",
    branchAddress: "191 Bà Triệu, Quận Hai Bà Trưng, TP.Hà Nội",
    bookingDate: "2024-12-25",
    bookingTime: "14:30",
    bookingId: "FWF-2024-001",
    bookingCustomer: "2"
  };

  const customerTemplate = EMAIL_TEMPLATES.bookingConfirmation(sampleBookingData);
  const businessTemplate = EMAIL_TEMPLATES.businessNotification(sampleBookingData);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📧 Email Preview</h1>
        <p className="text-gray-600">Xem trước mẫu email gửi cho khách hàng và nhà cáo</p>
      </div>

      <Tabs value={selectedTemplate} onValueChange={(value) => setSelectedTemplate(value as 'customer' | 'business')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customer" className="flex items-center gap-2">
            👤 Email Khách Hàng
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            🦊 Email Nhà Cáo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customer" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-orange-500">👤</span>
                Email Xác Nhận Cho Khách Hàng
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">Subject: {customerTemplate.subject}</Badge>
                <Badge variant="secondary">To: {sampleBookingData.customerEmail}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 border-b">
                  HTML Preview
                </div>
                <div 
                  className="p-4 bg-white"
                  dangerouslySetInnerHTML={{ __html: customerTemplate.html }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-green-500">🦊</span>
                Email Thông Báo Cho Nhà Cáo
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">Subject: {businessTemplate.subject}</Badge>
                <Badge variant="secondary">To: info@facewashfox.com</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 border-b">
                  HTML Preview
                </div>
                <div 
                  className="p-4 bg-white"
                  dangerouslySetInnerHTML={{ __html: businessTemplate.html }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>📋 Sample Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Tên khách hàng:</strong> {sampleBookingData.customerName}
              </div>
              <div>
                <strong>Email:</strong> {sampleBookingData.customerEmail}
              </div>
              <div>
                <strong>Số điện thoại:</strong> {sampleBookingData.customerPhone}
              </div>
              <div>
                <strong>Dịch vụ:</strong> {sampleBookingData.service}
              </div>
              <div>
                <strong>Chi nhánh:</strong> {sampleBookingData.branchName}
              </div>
              <div>
                <strong>Ngày đặt lịch:</strong> {sampleBookingData.bookingDate}
              </div>
              <div>
                <strong>Giờ đặt lịch:</strong> {sampleBookingData.bookingTime}
              </div>
              <div>
                <strong>Số lượng khách:</strong> {sampleBookingData.bookingCustomer}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
