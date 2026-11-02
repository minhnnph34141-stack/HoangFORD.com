# Hoàng Ford Auto

Website giới thiệu và tư vấn các dòng xe Ford, xây dựng bằng **React + Vite**.

## Công nghệ

- React 18
- Vite 6
- CSS thuần, responsive cho desktop, tablet và điện thoại

## Cấu trúc dự án

```text
HoangFORD.com/
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── .gitignore
├── index.html
├── package.json
├── README.md
├── vercel.json
└── vite.config.js
```

## Chạy website trên máy tính

Cần cài Node.js phiên bản LTS.

```bash
npm install
npm run dev
```

Vite sẽ hiển thị địa chỉ local trong terminal (thường là `http://localhost:5173`).

## Kiểm tra bản build trước khi triển khai

```bash
npm run build
npm run preview
```

Thư mục xuất bản là `dist/`.

## Triển khai lên Vercel

1. Đưa toàn bộ mã nguồn lên GitHub.
2. Trên Vercel, import repository tương ứng.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Deploy và kiểm tra website sau khi hoàn tất.

Nếu repository đã được kết nối với Vercel, mỗi lần push/commit lên nhánh production đã cấu hình, Vercel sẽ tự chạy deployment.

## Cập nhật nội dung xe

Dữ liệu các mẫu xe hiện đang khai báo trong `src/App.jsx`. Khi cập nhật, cần xác minh phiên bản, giá, trang bị, động cơ, thông số kỹ thuật và tình trạng phân phối theo nguồn chính thức tại thời điểm đăng tải.

Không nên tự điền thông số hoặc giá chưa được xác nhận. Ảnh minh họa cần được thay bằng ảnh xe đúng mẫu, đúng phiên bản và có quyền sử dụng.

## Lưu ý về biểu mẫu tư vấn

Biểu mẫu hiện sử dụng liên kết `mailto` để mở ứng dụng email của khách. Nó **chưa** lưu thông tin vào cơ sở dữ liệu và không bảo đảm gửi được yêu cầu nếu thiết bị khách chưa cấu hình email. Muốn nhận khách hàng tự động, cần tích hợp dịch vụ biểu mẫu/backend hoặc CRM và cấu hình bảo mật phù hợp.

## Thông tin thương hiệu và bản quyền

Website này là website giới thiệu/tư vấn độc lập. Không sử dụng logo, hình ảnh hoặc nội dung có bản quyền theo cách gây hiểu nhầm rằng đây là website chính thức của Ford Motor Company hoặc đại lý được ủy quyền nếu chưa có xác nhận.
