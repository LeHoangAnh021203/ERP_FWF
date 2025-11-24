"use client";

import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { useNotification } from '@/app/components/notification';

export default function BookingEmailTest() {
  const { showSuccess, showError } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: 'Nguyễn Văn A',
    customerEmail: 'test@example.com',
    customerPhone: '0123456789',
    service: 'Rửa mặt chuyên sâu',
    branchName: 'Chi nhánh Quận 1',
    branchAddress: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    bookingDate: new Date().toLocaleDateString('vi-VN'),
    bookingTime: '14:00'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSendTestEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/booking/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        showSuccess(`Email xác nhận đã được gửi thành công! Mã đặt lịch: ${result.bookingId}`);
      } else {
        showError(`Lỗi gửi email: ${result.error}`);
      }
    } catch (error) {
      showError('Lỗi kết nối: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🧪 Test Gửi Email Xác Nhận Đặt Lịch</CardTitle>
        <CardDescription>
          Điền thông tin để test gửi email xác nhận đặt lịch
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerName">Tên khách hàng</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              placeholder="Nhập tên khách hàng"
            />
          </div>
          
          <div>
            <Label htmlFor="customerEmail">Email khách hàng</Label>
            <Input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => handleInputChange('customerEmail', e.target.value)}
              placeholder="Nhập email khách hàng"
            />
          </div>
          
          <div>
            <Label htmlFor="customerPhone">Số điện thoại</Label>
            <Input
              id="customerPhone"
              value={formData.customerPhone}
              onChange={(e) => handleInputChange('customerPhone', e.target.value)}
              placeholder="Nhập số điện thoại"
            />
          </div>
          
          <div>
            <Label htmlFor="service">Dịch vụ</Label>
            <Input
              id="service"
              value={formData.service}
              onChange={(e) => handleInputChange('service', e.target.value)}
              placeholder="Nhập tên dịch vụ"
            />
          </div>
          
          <div>
            <Label htmlFor="branchName">Tên chi nhánh</Label>
            <Input
              id="branchName"
              value={formData.branchName}
              onChange={(e) => handleInputChange('branchName', e.target.value)}
              placeholder="Nhập tên chi nhánh"
            />
          </div>
          
          <div>
            <Label htmlFor="branchAddress">Địa chỉ chi nhánh</Label>
            <Input
              id="branchAddress"
              value={formData.branchAddress}
              onChange={(e) => handleInputChange('branchAddress', e.target.value)}
              placeholder="Nhập địa chỉ chi nhánh"
            />
          </div>
          
          <div>
            <Label htmlFor="bookingDate">Ngày đặt lịch</Label>
            <Input
              id="bookingDate"
              value={formData.bookingDate}
              onChange={(e) => handleInputChange('bookingDate', e.target.value)}
              placeholder="DD/MM/YYYY"
            />
          </div>
          
          <div>
            <Label htmlFor="bookingTime">Giờ đặt lịch</Label>
            <Input
              id="bookingTime"
              value={formData.bookingTime}
              onChange={(e) => handleInputChange('bookingTime', e.target.value)}
              placeholder="HH:MM"
            />
          </div>
        </div>
        
        <div className="pt-4">
          <Button 
            onClick={handleSendTestEmail}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Đang gửi...' : '📧 Gửi Email Test'}
          </Button>
        </div>
        
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <strong>Lưu ý:</strong> Để gửi email thực tế, cần cấu hình EMAIL_USER và EMAIL_PASSWORD trong environment variables.
        </div>
      </CardContent>
    </Card>
  );
}
