# Nguyen_Mai_Huong_website — Portfolio CNS&AI của Nguyễn Mai Hương

Portfolio học phần **Nhập môn Công nghệ số và ứng dụng AI (INF2501)** — sinh viên Sư phạm Âm nhạc, MSSV 2552210390.

## Trạng thái
- ✅ Giao diện riêng + trang Giới thiệu (thông tin, sở thích, 4 mục tiêu học tập, mục tiêu portfolio)
- ✅ Trang Bài tập / chi tiết bài / Tổng kết đã dựng sẵn, hỗ trợ đủ các loại khối sản phẩm
- ✅ Nội dung 6 bài tập & trang Tổng kết đã điền (xem ghi chú bản mẫu bên dưới)
- ✅ Lớp: INF2501_5 · ⏳ Email: chưa có
- ⏳ Còn thiếu so với đề: Bài 2 – kết quả tìm kiếm bằng toán tử nâng cao; Bài 4 – minh chứng công cụ quản lý dự án; Bài 5 – link video

## Ghi chú bản mẫu (không hiển thị trên web)
Các phần dưới đây do Claude (Anthropic) soạn để hoàn thiện portfolio, **Hương cần đọc lại và viết lại bằng lời của mình trước khi nộp**:

| Phần | Nguồn gốc | Việc cần làm |
|---|---|---|
| Bài 3 – Viết Prompt hiệu quả | Claude chạy 9 prompt trên ChatGPT và chụp màn hình | Hương tự chạy lại, thay ảnh và kết quả của mình |
| Bài 6 – Bộ nguyên tắc dùng AI có trách nhiệm | Claude soạn dựa trên khung lý thuyết mục 6.4 và các bài 1–5 | Đọc lại, sửa từng nguyên tắc theo cách mình thật sự dùng AI |
| Tổng kết – 4 đoạn cảm nhận (`experience`, `highlight`, `challenge`, `future`) | Bản nháp gợi ý của Claude | **Bắt buộc tự viết** – đề thi quy định: *"Nội dung cảm nhận, tự đánh giá phải do sinh viên tự viết"*; thầy có thể vấn đáp |

Ô "Sử dụng AI" ở mỗi trang bài tập và bảng công cụ AI ở trang Tổng kết vẫn hiển thị trên web vì đề yêu cầu ghi rõ việc dùng AI.

Muốn hiện lại khung ghi chú trên web: thêm trường `demo_note: "..."` vào bài tương ứng (hoặc vào `conclusion`) trong `data.yaml` – giao diện vẫn hỗ trợ sẵn.

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
