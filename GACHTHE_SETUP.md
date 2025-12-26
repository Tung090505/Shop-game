# Hướng dẫn cấu hình Gachthe1s Webhook

## ✅ Đã hoàn thành

1. **Cấu hình Biến môi trường** trong hệ thống (Render/Local)
   - Sử dụng: `PARTNER_ID` và `PARTNER_KEY`
   - Tuyệt đối không để lộ mã này trong code.

2. **Cấu hình Secret Key cho Webhook**
   - Sử dụng biến: `CARD_WEBHOOK_SECRET`
   - Cập nhật URL Callback trên Gachthe1s theo định dạng: `https://your-domain.com/api/webhooks/card?secret=YOUR_SECRET`

3. **Thêm tính năng Test Webhook** trong Admin Settings
   - Truy cập: `/admin/settings`
   - Nhấn nút "Test Webhook Endpoint" để kiểm tra

4. **Cải thiện logging** trong webhook controller để debug dễ dàng hơn

## 🔧 Cách cấu hình trên Gachthe1s.com

1. Đăng nhập vào https://gachthe1s.com
2. Vào phần **Cấu hình Callback** (hoặc Settings)
3. Nhập thông tin:
   - **Callback URL**: `https://your-domain.com/api/webhooks/card?secret=YOUR_SECRET`
   - **Method**: `POST`
4. Lưu cấu hình
5. Test bằng cách nạp thẻ thử (hoặc dùng chức năng test của Gachthe1s)

## 🧪 Kiểm tra Webhook

### Cách 1: Từ Admin Panel
1. Vào `/admin/settings`
2. Nhấn nút "🧪 Test Webhook Endpoint"
3. Xem kết quả (nếu thấy "Webhook is active" là OK)

### Cách 2: Kiểm tra logs trên Render.com
1. Vào https://dashboard.render.com
2. Chọn service `shop-game-dy16`
3. Xem tab **Logs**
4. Tìm dòng log: `--- CARD WEBHOOK RECEIVED ---`

## ⚠️ Lưu ý quan trọng

1. **Webhook chỉ nhận được dữ liệu khi có giao dịch thực tế**
   - Gachthe1s sẽ gửi POST request đến callback URL khi có thẻ được nạp
   - Không có giao dịch = không có webhook

2. **Kiểm tra Secret Key**
   - Mọi request đến webhook phải có `?secret=YOUR_SECRET`
   - Nếu không có hoặc sai secret, sẽ bị từ chối (403 Forbidden)

3. **Cập nhật Settings trong Database**
   - Khi server khởi động lần đầu, nó sẽ tự động tạo settings với Partner ID và Key
   - Bạn có thể thay đổi trong Admin Settings nếu cần

## 🚀 Deploy lên Render.com

Nếu bạn cần deploy lại:

```bash
# Commit changes
git add .
git commit -m "Update Gachthe1s configuration"
git push

# Render sẽ tự động deploy
```

## 📊 Kiểm tra trạng thái

Sau khi deploy, kiểm tra:
1. ✅ Server đang chạy: https://shop-game-dy16.onrender.com
2. ✅ Webhook endpoint: `https://your-domain.com/api/webhooks/card?secret=YOUR_SECRET`
3. ✅ Admin Settings: https://[your-frontend-url]/admin/settings

## 🐛 Debug

Nếu webhook không hoạt động:
1. Kiểm tra logs trên Render.com
2. Đảm bảo Callback URL đã được cấu hình đúng trên Gachthe1s
3. Thử nạp thẻ test để xem có nhận được webhook không
4. Kiểm tra database xem Partner ID và Key đã đúng chưa
