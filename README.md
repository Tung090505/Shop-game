# 🎮 SHOPNICK - Hệ Thống Shop Game Chuyên Nghiệp v2.0

![Banner](https://img.shields.io/badge/ShopNick-v2.0-orange?style=for-the-badge&logo=gamepad)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**SHOPNICK** là nền tảng quản lý và kinh doanh tài khoản game (Liên Quân, Free Fire, Liên Minh...) tích hợp hệ thống nạp tiền tự động và vòng quay may mắn hiện đại.

---

## ✨ Tính Năng Nổi Bật

### 👨‍💻 Dành cho Khách hàng
*   **🛒 Mua Acc Tự Động:** Hệ thống giao tài khoản và mật khẩu ngay lập tức sau khi thanh toán.
*   **💳 Nạp Tiền Đa Kênh:**
    *   Nạp thẻ cào tự động (GachThe1s API).
    *   Nạp ATM/Internet Banking qua VietQR (Quét mã tự động).
    *   Ví điện tử MoMo.
*   **🎡 Mini Games:** Vòng quay may mắn, lật hình nhận quân huy/kim cương với hiệu ứng mượt mà.
*   **📱 Giao diện Mobile:** Tương thích hoàn hảo trên mọi thiết bị di động.

### 🛡️ Dành cho Quản trị viên (Admin)
*   **📊 Dashboard:** Thống kê doanh thu, đơn hàng, người dùng theo ngày/tháng.
*   **📦 Quản lý sản phẩm:** Thêm/sửa/xóa chuyên mục game và danh sách tài khoản dễ dàng.
*   **💰 Duyệt nạp tiền:** Hệ thống log lịch sử nạp thẻ, cộng tiền thông minh.
*   **🎡 Cấu hình vòng quay:** Tùy chỉnh tỷ lệ trúng thưởng và phần quà trực quan.

---

## 🚀 Công Nghệ Sử Dụng

| Frontend | Backend | Database |
| :--- | :--- | :--- |
| **React.js (Vite)** | **Node.js (Express)** | **MongoDB (Mongoose)** |
| **Tailwind CSS** | **JWT Authentication** | **Cloudinary (Upload)** |
| **Framer Motion** | **Axios / Axios Interceptors** | **Bcrypt.js (Security)** |

---

## 🛠️ Hướng Dẫn Cài Đặt Local

### 1. Yêu cầu hệ thống
*   Node.js (v14 trở lên)
*   MongoDB Atlas hoặc MongoDB Local

### 2. Cấu hình Server
```bash
cd server
npm install
# Tạo file .env và điền các thông tin:
# PORT, MONGODB_URI, JWT_SECRET, PARTNER_ID, PARTNER_KEY...
npm start
```

### 3. Cấu hình Client
```bash
cd client
npm install
npm run dev
```

---

## 📸 Ảnh Chụp Giao Diện

*(Bạn có thể thay các link ảnh thật của bạn vào đây)*
*   **Trang chủ:** `https://your-domain.com/preview1.png`
*   **Trang nạp thẻ:** `https://your-domain.com/preview2.png`

---

## 🤝 Liên Hệ & Hỗ Trợ

*   **Tác giả:** Phạm Thanh Tùng
*   **Facebook:** [Liên hệ ngay](https://facebook.com/your-profile)
*   **Zalo:** `0869.024.105`

---
⭐ **Nếu thấy dự án này hữu ích, hãy cho mình 1 Star trên GitHub nhé!**
