# Submission Summary – 3D Scene Describer

## 📌 Tổng Quát Bài Test

Đây là hoàn chỉnh **AI 3D Scene Describer** - công cụ hỗ trợ quản lý và tổ chức nội dung 3D bằng AI.

### ✅ Yêu cầu hoàn thành:

- [x] **Giao diện nhập liệu** - Form React với validation
- [x] **API backend** - Express server kết nối Claude
- [x] **Tính năng AI** - Generate marketing content + digitization notes
- [x] **QA Report** - 3 vấn đề UI/UX + đề xuất fix
- [x] **AI Documentation** - Mô tả dùng AI + prompt examples

---

## 🤖 Cách dùng AI trong bài

### 1. AI Tool được sử dụng

**Tool:** Claude 3.5 Sonnet (Anthropic API)

**Vị trí:** Backend ([backend/server.js](3d-scene-describer/backend/server.js))

**Lý do chọn:**
- Giá hợp lý (~$0.003/request)
- Tốc độ nhanh (2-3s)
- Hiểu Vietnamese tốt
- Output JSON reliable

---

### 2. Cách dùng AI trong ứng dụng

```
User Form Input
    ↓
Frontend Validation
    ↓
POST /api/describe-scene
    ↓
Backend: generateSceneDescription()
    ↓
Claude API Call (System Prompt + User Prompt)
    ↓
Parse JSON Response
    ↓
Display Result + Save History
```

---

### 3. Prompt Mẫu

#### **Prompt Mẫu 1: Căn hộ cao cấp**

**System Prompt:**
```
Bạn là chuyên gia về không gian 3D và marketing bất động sản.
Nhiệm vụ: Tạo nội dung tiếp thị chuyên nghiệp và hướng dẫn số hóa 3D.

Output format (JSON):
{
  "title": "Tiêu đề hấp dẫn (không vượt 80 ký tự)",
  "shortDescription": "Đoạn mô tả ngắn (2-3 câu, phù hợp nhóm khách hàng)",
  "highlights": ["5 điểm nổi bật của không gian"],
  "digitizationNotes": ["5 gợi ý kỹ thuật khi chụp/số hóa 3D"]
}

Yêu cầu:
- Tone phù hợp loại không gian + nhóm khách
- Highlights cụ thể, không generic
- Notes chuyên nghiệp, dựa vào đặc điểm riêng
```

**User Prompt:**
```
Tạo nội dung cho dự án 3D:
- Tên: The Manor Central Park – Tầng 12
- Loại: căn hộ
- Mô tả: Căn hộ 2PN nội thất cao cấp, hướng Đông Nam, view công viên
- Khách: Người mua nhà cá nhân

Trả về JSON hợp lệ.
```

**Expected Output:**
```json
{
  "title": "The Manor Central Park – Tầng 12 | Căn Hộ Premium View Công Viên",
  "shortDescription": "Khám phá căn hộ 2PN The Manor qua virtual tour 3D chân thực. Từng chi tiết nội thất cao cấp, view công viên được tái hiện hoàn hảo.",
  "highlights": [
    "Thiết kế 2PN + 2WC + phòng khách – bếp – ăn mở, tối ưu 89m²",
    "View hướng Đông Nam với công viên xanh, ánh sáng tự nhiên cả ngày",
    "Nội thất imported: sàn gỗ engineered, tủ bếp Acrylic, thiết bị Kohler",
    "Ban công rộng 12m² – không gian thư giãn riêng tư giữa lòng đô thị",
    "Hệ thống thông minh: điều hòa inverter, tủ âm tường, bảo mật 24/7"
  ],
  "digitizationNotes": [
    "Quét từng phòng riêng lẻ để nắm chi tiết nội thất đầy đủ",
    "Chụp bổ sung ban công với 2-3 góc để tái hiện view công viên",
    "Khử nhiễu gương phòng tắm, kính bếp sau xử lý",
    "Đo đạc chính xác trần – sàn để model 3D không méo phối cảnh",
    "Close-up vân gỗ, mặt đá, fabric để tăng chân thực"
  ]
}
```

#### **Prompt Mẫu 2: Cửa hàng bán lẻ**

**User Prompt:**
```
- Tên: FashionHub – Store Q1
- Loại: cửa hàng
- Mô tả: Cửa hàng thời trang 200m², tầng trệt shopping mall, hệ kệ trưng bày hiện đại
- Khách: Khách hàng bán lẻ
```

**Expected Output:**
```json
{
  "title": "FashionHub – Store Q1 | Showroom Bán Lẻ 3D Interactive",
  "shortDescription": "Trải nghiệm cửa hàng FashionHub qua virtual tour 3D. Khách hàng khám phá từng góc store, kệ trưng bày, lighting từ mobile device.",
  "highlights": [
    "Mặt bằng 200m² bố cục flow tối ưu – dẫn dắt khách từ cửa vào đến quầy thanh toán",
    "Hệ kệ trưng bày modular, điều chỉnh chiều cao phù hợp mọi nhóm sản phẩm",
    "Chiếu sáng track light 3000K làm nổi bật màu sắc vải, thiết kế sản phẩm",
    "Fitting room 4 cabin cách âm, ánh sáng chuẩn màu da – trải nghiệm tối ưu",
    "POS counter mở, thiết kế thấp – gần gũi, không rào cản khách"
  ],
  "digitizationNotes": [
    "Quét trước giờ mở cửa khi kệ hàng sắp xếp hoàn chỉnh, sạch sẽ nhất",
    "Sử dụng polarizing filter khử phản chiếu khu vực kính trưng bày",
    "Ghi chú vị trí camera an ninh, cảm biến cửa tích hợp bản vẽ",
    "Chụp POV từ điểm vào cửa và quầy thanh toán cho UX analysis",
    "Close-up chi tiết: vân fabric, buckle kim loại, texture hanger"
  ]
}
```

---

### 4. Cách kiểm tra output của AI

#### **Validation Tự động (Backend):**

```javascript
// Kiểm tra JSON hợp lệ
const jsonMatch = responseText.match(/\{[\s\S]*\}/);
if (!jsonMatch) throw new Error("Invalid JSON");

// Parse & validate structure
const result = JSON.parse(jsonMatch[0]);
if (!Array.isArray(result.highlights) || result.highlights.length !== 5)
  throw new Error("Must have 5 highlights");
```

#### **Quality Checklist (Manual QA):**

| Tiêu chí | Cách kiểm tra |
|----------|--------------|
| **Title relevance** | Title có chứa tên dự án + loại không gian? |
| **Tone match** | Văn phong phù hợp nhóm khách? |
| **Highlight quality** | 5 điểm cụ thể, không generic? |
| **Notes accuracy** | Gợi ý dùng thuật ngữ 3D/BIM đúng? |
| **Language** | Tiếng Việt đúng chính tả, grammar? |
| **JSON valid** | Không lỗi escape character? |

#### **Fallback Mechanism:**

Nếu Claude API fail:
```javascript
catch (error) {
  console.error("API Error:", error.message);
  // Fallback to mock database
  return getMockData(...);
}
```

---

## 📋 QA Report Summary

Báo cáo hoàn chỉnh: [docs/QA_REPORT.md](3d-scene-describer/docs/QA_REPORT.md)

### 3 Vấn đề chính:

**1. 🔴 Form không responsive trên mobile (HIGH)**
- Problem: Grid 2 cột không fit màn hình < 768px
- Fix: Thêm breakpoint CSS, stack layout vertically
- Priority: **Ngay**

**2. 🟡 Loading state không rõ ràng (MEDIUM)**
- Problem: Không hiển thị progress, mất bao lâu
- Fix: Thêm step indicator, elapsed time
- Priority: **2**

**3. 🟡 History không có search/filter (MEDIUM)**
- Problem: Khó tìm dự án trong 20 item
- Fix: Thêm search box, filter dropdown, sort options
- Priority: **3**

---

## 🗂️ Files Chính

### Backend
- **[backend/server.js](3d-scene-describer/backend/server.js)** - Express API + Claude integration
- **[backend/.env.example](3d-scene-describer/backend/.env.example)** - Template config

### Frontend
- **[frontend/src/App.jsx](3d-scene-describer/frontend/src/App.jsx)** - Main React component
- **[frontend/src/index.css](3d-scene-describer/frontend/src/index.css)** - Styling + badge modes

### Documentation
- **[docs/README.md](3d-scene-describer/docs/README.md)** - Setup guide
- **[docs/AI_USAGE.md](3d-scene-describer/docs/AI_USAGE.md)** - AI implementation (9 sections)
- **[docs/QA_REPORT.md](3d-scene-describer/docs/QA_REPORT.md)** - Quality issues
- **[README.md](README.md)** - Project overview

---

## 🚀 Cách Run

```bash
# Backend
cd 3d-scene-describer/backend
set ANTHROPIC_API_KEY=sk-ant-your-key
npm install && npm start

# Frontend (new terminal)
cd 3d-scene-describer/frontend
npm install && npm run dev

# Open: http://localhost:3000
```

---

## ✨ Điểm nổi bật của bài

1. **AI Integration** - Sử dụng Claude API + system/user prompts phù hợp
2. **Fallback Mechanism** - App vẫn hoạt động nếu API fail (graceful degradation)
3. **Comprehensive Docs** - AI usage guide + QA report chi tiết
4. **Dynamic Badge** - UI hiển thị mode (Claude AI / Mock / Offline)
5. **Quality Focus** - Xác định 3 vấn đề thực tế + đề xuất fix cụ thể

---

## 📊 API Mode Indicator

Frontend tự động detect backend mode:
- 🤖 **Claude AI** - API key configured, using real Claude
- 📋 **Mock Data** - API key missing, using fallback
- ⚠️ **Offline** - Backend not running

---

**Submitted:** 2026-06-06  
**Status:** ✅ Complete
