# QA Report – 3D Scene Describer

## 3 Vấn đề chính về UI/UX/Luồng thao tác

---

### 🔴 **Vấn đề 1: Loading state không rõ ràng & thiếu ước lượng thời gian**

**Mô tả:**
- Khi user nhấn "Phân tích với AI", hiện bộ loading animation nhưng không có thông tin:
  - Đang xử lý đoạn nào (validation → API call → parsing)
  - Mất bao lâu (không có progress indicator hoặc time estimate)
  - Có phải đã gửi request đi không (network feedback)
- User sẽ hoài nghi hoặc click lại button → gửi duplicate request

**Mức độ ảnh hưởng:** 🟡 **Trung bình**
- Ảnh hưởng UX nhưng không critical

**Đề xuất cải thiện:**
1. Thêm **step indicator** trong loading state:
   ```
   ⏳ Đang xử lý…
   ✓ Dữ liệu hợp lệ
   ⟳ Gửi request đến AI…
   ```
2. Hiển thị thời gian elapsed hoặc average processing time (3-5 giây)
3. Disable button sau khi submit (vô hiệu hóa để tránh duplicate)
4. Thêm cancel button nếu request mất hơn 10 giây

---

### 🔴 **Vấn đề 2: History panel không có search/filter**

**Mô tả:**
- History lưu tối đa 20 dự án nhưng hiển thị dưới dạng danh sách đơn giản
- Khi user có 15-20 dự án, khó tìm cái cần:
  - Không thể search theo tên dự án
  - Không thể filter theo loại không gian
  - Không thể sắp xếp (mới nhất, cũ nhất, A-Z)
- Phải cuộn dài hoặc scroll nhiều lần

**Mức độ ảnh hưởng:** 🟡 **Trung bình**
- Ảnh hưởng hiệu suất công việc khi dữ liệu tăng

**Đề xuất cải thiện:**
1. Thêm **search box** tìm theo tên dự án (realtime filter)
2. Thêm **dropdown filter** theo loại không gian
3. Thêm **sort options** (newest first, oldest first, A-Z)
4. Hiển thị "N kết quả" để user biết có bao nhiêu item
5. Nếu kết quả trống, hiện placeholder: "Không tìm thấy kết quả"

---

### 🔴 **Vấn đề 3: Form layout không responsive trên mobile/tablet**

**Mô tả:**
- Frontend dùng CSS Grid `grid-template-columns: 380px 1fr` (sidebar form + kết quả)
- Trên mobile (< 768px):
  - Sidebar 380px quá rộng → chiếm hết màn hình
  - Không có breakpoint để chuyển layout thành vertical
  - Khó dùng form trên phone (input fields bị nén)
  - Text fields không đủ rộng để nhập

**Mức độ ảnh hưởng:** 🔴 **Cao**
- Ứng dụng không dùng được trên mobile/tablet
- Ảnh hưởng 40-50% user base (mobile users)

**Đề xuất cải thiện:**
1. Thêm **responsive breakpoint** trong CSS:
   ```css
   @media (max-width: 768px) {
     .main-layout {
       grid-template-columns: 1fr; /* Stack vertically */
     }
     .form-panel {
       position: static; /* Disable sticky */
       width: 100%;
     }
   }
   ```
2. Trên mobile: form hiện trên cùng, result ở dưới
3. Input fields padding/height phù hợp mobile (48px min height)
4. Dropdown/select phải accessible trên touch device

---

## Tóm tắt ưu tiên fix

| # | Vấn đề | Ảnh hưởng | Độ khó fix | Priority |
|---|--------|----------|-----------|----------|
| 1 | Form không responsive | 🔴 Cao | 🟢 Dễ | **🔥 Ngay** |
| 2 | Loading feedback yếu | 🟡 Trung | 🟡 Trung | **2** |
| 3 | History không search | 🟡 Trung | 🟡 Trung | **3** |

---

## Checklist kiểm thử thêm

- [ ] Test trên mobile 375px (iPhone SE)
- [ ] Test trên tablet 768px (iPad)
- [ ] Test API error handling (server down, timeout)
- [ ] Test duplicate submission (rapid click)
- [ ] Test with long project names (100+ chars)
- [ ] Test localStorage capacity (20+ entries)
- [ ] Test export files (TXT, JSON) trên browser khác nhau
