# Hoàng Ford Auto

Website React + Vite kết nối Supabase, có trang quản trị tại `/admin`.

## Cài đặt

```bash
npm install
cp .env.example .env.local
npm run dev
```

Điền `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY` trong `.env.local` bằng Project URL và Publishable key (hoặc anon key legacy) từ Supabase. Không đưa `service_role` hoặc secret key vào trình duyệt.

## Thiết lập Supabase

1. Tạo project tại https://supabase.com/dashboard.
2. Mở SQL Editor, chạy toàn bộ `supabase/schema.sql`.
3. Vào Authentication > Users > Add user, tạo tài khoản quản trị bằng email và mật khẩu mạnh.
4. Sao chép UUID của user vừa tạo.
5. Chạy SQL sau, thay UUID bằng ID thực tế:

```sql
update public.profiles
set role = 'admin'
where id = 'PASTE_AUTH_USER_UUID_HERE';
```

6. Tạo `.env.local` ở thư mục gốc. Ví dụ:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
```

7. Chạy `npm install` rồi `npm run dev`. Mở `/admin` để đăng nhập quản trị.

## Triển khai Vercel

Trong Vercel > Project > Settings > Environment Variables, thêm:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Chọn Production (và Preview nếu cần), lưu lại rồi Redeploy. Không commit `.env.local` lên GitHub.

## Chức năng

- Website công khai: danh mục xe, form tư vấn ghi dữ liệu vào `customer_leads`, đăng ký lái thử ghi dữ liệu vào `test_drive_appointments`.
- `/admin`: đăng nhập, dashboard, CRUD dòng xe, quản lý bảng giá, xem và cập nhật trạng thái khách hàng/lịch lái thử.
- Khách truy cập chỉ được đọc xe/bảng giá đang hoạt động và gửi form. Chỉ user có `profiles.role = 'admin'` được xem thông tin khách hàng và quản trị dữ liệu.

## Lưu ý vận hành

- Bảng giá cần nhập theo báo giá được xác minh và ngày hiệu lực. Không dùng giá mẫu hoặc giá cũ làm giá bán chính thức.
- Thông số xe, phiên bản và hình ảnh phải kiểm tra theo đúng năm sản xuất/thị trường.
- `VITE_*` là biến công khai ở frontend. Chỉ dùng Supabase Publishable/anon key với RLS; tuyệt đối không dùng service-role/secret key trong website.
- Trước khi đưa vào vận hành, kiểm thử gửi form, đăng nhập admin, phân quyền, cập nhật/xóa xe và cập nhật trạng thái lịch hẹn.
