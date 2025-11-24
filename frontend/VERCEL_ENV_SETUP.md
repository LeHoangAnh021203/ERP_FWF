# Vercel Environment Variables Setup

## Vấn đề hiện tại
Bản local đăng nhập được nhưng bản deploy không đăng nhập được vì thiếu environment variable `NEXT_PUBLIC_API_BASE_URL`.

## Cách fix

### 1. Set Environment Variable trên Vercel Dashboard

1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project `fb_network_dev`
3. Vào tab **Settings** → **Environment Variables**
4. Thêm biến mới:
   - **Name**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: `https://your-backend-api-url.com` (thay bằng URL backend thực tế)
   - **Environment**: Production, Preview, Development

### 2. Hoặc sử dụng Vercel CLI

```bash
vercel env add NEXT_PUBLIC_API_BASE_URL
# Nhập value: https://your-backend-api-url.com
# Chọn environments: Production, Preview, Development
```

### 3. Redeploy

Sau khi set environment variable, cần redeploy:

```bash
vercel --prod
```

## Kiểm tra

Sau khi deploy, kiểm tra logs để xem API_BASE_URL có được set đúng không:

1. Vào Vercel Dashboard → Project → Functions
2. Xem logs của function `/api/proxy/auth/login`
3. Tìm dòng log: `🔍 Login attempt:` để xem API_BASE_URL

## Lưu ý

- `NEXT_PUBLIC_` prefix là bắt buộc cho client-side environment variables
- URL backend phải có HTTPS trong production
- Cần đảm bảo backend API đang chạy và accessible
