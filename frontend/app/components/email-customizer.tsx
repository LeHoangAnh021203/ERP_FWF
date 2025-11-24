"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { EMAIL_TEMPLATES } from '@/app/lib/email-service';

export function EmailCustomizer() {
  const [customData, setCustomData] = useState({
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
  });

  const [selectedTemplate, setSelectedTemplate] = useState<'customer' | 'business'>('customer');

  const customerTemplate = EMAIL_TEMPLATES.bookingConfirmation(customData);
  const businessTemplate = EMAIL_TEMPLATES.businessNotification(customData);

  const handleInputChange = (field: string, value: string) => {
    setCustomData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🎨 Email Customizer</h1>
        <p className="text-gray-600">Tùy chỉnh dữ liệu và xem trước email template</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form để custom data */}
        <Card>
          <CardHeader>
            <CardTitle>📝 Customize Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Tên khách hàng</Label>
                <Input
                  id="customerName"
                  value={customData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={customData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Số điện thoại</Label>
                <Input
                  id="customerPhone"
                  value={customData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="service">Dịch vụ</Label>
                <Input
                  id="service"
                  value={customData.service}
                  onChange={(e) => handleInputChange('service', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="branchName">Chi nhánh</Label>
                <Input
                  id="branchName"
                  value={customData.branchName}
                  onChange={(e) => handleInputChange('branchName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bookingDate">Ngày đặt lịch</Label>
                <Input
                  id="bookingDate"
                  type="date"
                  value={customData.bookingDate}
                  onChange={(e) => handleInputChange('bookingDate', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bookingTime">Giờ đặt lịch</Label>
                <Input
                  id="bookingTime"
                  value={customData.bookingTime}
                  onChange={(e) => handleInputChange('bookingTime', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bookingCustomer">Số lượng khách</Label>
                <Input
                  id="bookingCustomer"
                  value={customData.bookingCustomer}
                  onChange={(e) => handleInputChange('bookingCustomer', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="branchAddress">Địa chỉ chi nhánh</Label>
              <Textarea
                id="branchAddress"
                value={customData.branchAddress}
                onChange={(e) => handleInputChange('branchAddress', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="bookingId">Mã đặt lịch</Label>
              <Input
                id="bookingId"
                value={customData.bookingId}
                onChange={(e) => handleInputChange('bookingId', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>👀 Live Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTemplate} onValueChange={(value) => setSelectedTemplate(value as 'customer' | 'business')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer">👤 Khách Hàng</TabsTrigger>
                <TabsTrigger value="business">🦊 Nhà Cáo</TabsTrigger>
              </TabsList>

              <TabsContent value="customer" className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 border-b">
                    Subject: {customerTemplate.subject}
                  </div>
                  <div 
                    className="p-4 bg-white max-h-96 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: customerTemplate.html }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="business" className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 border-b">
                    Subject: {businessTemplate.subject}
                  </div>
                  <div 
                    className="p-4 bg-white max-h-96 overflow-y-auto"
                    dangerouslySetInnerHTML={{ __html: businessTemplate.html }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>📋 Current Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
              {JSON.stringify(customData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
