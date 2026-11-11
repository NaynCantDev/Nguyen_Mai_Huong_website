# Nguyen_Mai_Huong_website — Portfolio CNS&AI của Nguyễn Mai Hương

Portfolio học phần **Nhập môn Công nghệ số và ứng dụng AI (INF2501)** — sinh viên Sư phạm Âm nhạc, MSSV 2552210390.

## Trạng thái
- ✅ Giao diện riêng + trang Giới thiệu (thông tin, sở thích, 4 mục tiêu học tập, mục tiêu portfolio)
- ✅ Trang Bài tập / chi tiết bài / Tổng kết đã dựng sẵn, hỗ trợ đủ các loại khối sản phẩm
- ⏳ Nội dung 6 bài tập & phần Tổng kết: **chưa điền** (đang để `…` trong `data.yaml`)
- ⏳ Lớp, email: chưa có

## Giao diện — "Bản nhạc của Hương"
Thiết kế riêng, không dùng chung khung với portfolio khác:
- Màu: xanh trời (lấy từ bức tường trong ảnh) `#d4def5`, xanh mực `#172152`, cobalt `#2c46c9`, trắng ren, hồng phấn
- Chữ: **Bricolage Grotesque** (một họ chữ, dùng trục độ rộng) + **Mali** viết tay cho ghi chú lề; cả hai tự host trong `template/assets/fonts/` và có đủ dấu tiếng Việt
- **Cái tên biết hát**: tên nằm trên khuông nhạc, mỗi chữ cái là một nốt (thang ngũ cung), cao thấp theo giai điệu; rê chuột/chạm để nghe từng nốt, nút "Nghe tên mình" hát cả tên
- Mục tiêu học tập = 4 ô nhịp trên một khuông, đầu nốt đi lên dần
- Trang Bài tập = danh sách tiết mục, mỗi bài một cao độ khi rê chuột
- Trang chi tiết: cột thông tin dính bên trái + 6 nốt trên khuông để chuyển bài
- Đàn piano 15 phím ở chân trang: bấm, kéo ngón, hoặc gõ phím `A…'` / `W…P`
- Âm thanh tổng hợp bằng Web Audio, không cần file; tôn trọng *prefers-reduced-motion*

## Cấu trúc
```
students/nguyen_mai_huong/data.yaml   ← toàn bộ nội dung
students/nguyen_mai_huong/images/     ← ảnh đại diện + ảnh minh chứng bài tập
template/*.html.j2, template/assets/  ← giao diện
scripts/render.py                     ← YAML → HTML tĩnh vào dist/
```

## Dùng
```bash
pip install -r requirements.txt
python scripts/render.py
```
Mở `dist/index.html`. Push lên `main` → GitHub Actions tự build & deploy (bật **Settings → Pages → Source: GitHub Actions** một lần).
