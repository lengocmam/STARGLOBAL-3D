# AI Usage Documentation – 3D Scene Describer

## 1. AI Tool được sử dụng

**Tool:** Claude 3.5 Sonnet (Anthropic API)  
**Model ID:** `claude-3-5-sonnet-20241022`  
**Provider:** Anthropic  
**Setup:** Environment variable `ANTHROPIC_API_KEY` (từ Anthropic Console)

### Tại sao chọn Claude 3.5 Sonnet?
- ✅ Giá rẻ, tốc độ nhanh (~2-3s/request)
- ✅ Hiểu context tốt để tạo nội dung marketing phù hợp
- ✅ Output JSON reliable, ít hallucinate
- ✅ Hỗ trợ Vietnamese tốt
- ✅ Rate limit cao (50K tokens/min)

---

## 2. Cách dùng AI trong ứng dụng

### Luồng xử lý

```
Frontend Form Input
    ↓
POST /api/describe-scene
    ↓
Backend: Validate dữ liệu
    ↓
Claude API: generateSceneDescription()
    ↓
Claude System Prompt → User Prompt → JSON Response
    ↓
Parse JSON & Return to Frontend
    ↓
Display Result + Save to History
```

### Thành phần AI Integration

**File:** [backend/server.js](../backend/server.js)

#### System Prompt
```javascript
systemPrompt = `
Bạn là chuyên gia về không gian 3D và marketing bất động sản.
Nhiệm vụ: Tạo nội dung tiếp thị chuyên nghiệp và hướng dẫn số hóa 3D cho các dự án.

Yêu cầu output (JSON):
{
  "title": "Tiêu đề hấp dẫn (không vượt 80 ký tự)",
  "shortDescription": "Đoạn mô tả ngắn (2-3 câu, phù hợp nhóm khách hàng)",
  "highlights": ["5 điểm nổi bật của không gian"],
  "digitizationNotes": ["5 gợi ý kỹ thuật khi chụp/số hóa 3D"]
}

Chú ý:
- Tone phù hợp loại không gian và nhóm khách hàng
- Highlights phải cụ thể, không chung chung
- Digitization notes phải chuyên nghiệp, dựa vào đặc điểm riêng của loại không gian
`
```

**Mục đích System Prompt:**
- Set context: "chuyên gia BDS 3D"
- Định format output: JSON structure cố định
- Yêu cầu quality: Cụ thể, phù hợp audience, chuyên nghiệp

---

## 3. Prompt Mẫu

### Prompt Mẫu 1: Căn hộ cao cấp

**User Input:**
```
- Tên dự án: The Manor Central Park – Tầng 12
- Loại không gian: căn hộ
- Mô tả: Căn hộ 2PN nội thất cao cấp, hướng Đông Nam, tầng 12, view công viên
- Nhóm khách: Người mua nhà cá nhân
```

**AI Prompt được gửi:**
```
Tạo nội dung cho dự án 3D:
- Tên dự án: The Manor Central Park – Tầng 12
- Loại không gian: căn hộ
- Mô tả: Căn hộ 2PN nội thất cao cấp, hướng Đông Nam, tầng 12, view công viên
- Nhóm khách hàng: Người mua nhà cá nhân

Trả về JSON hợp lệ.
```

**Expected Output:**
```json
{
  "title": "The Manor Central Park – Tầng 12 | Căn Hộ Premium View Công Viên Toàn Mô Phỏng 3D",
  "shortDescription": "Khám phá căn hộ 2PN The Manor Central Park qua công nghệ virtual tour 3D tuyệt vời. Từng chi tiết nội thất cao cấp, view công viên xanh mát được tái hiện chân thực. Quyết định mua nhà không cần đến tận nơi, nhưng có cảm giác đã nhìn hết.",
  "highlights": [
    "Thiết kế 2PN + 2WC + Phòng khách – bếp – ăn mở, tối ưu diện tích 89m²",
    "View hướng Đông Nam với công viên xanh mát, ánh sáng tự nhiên cả ngày",
    "Nội thất imported cao cấp: sàn gỗ engineered, tủ bếp Acrylic, thiết bị Kohler",
    "Ban công rộng 12m² – không gian thư giãn riêng tư giữa lòng đô thị",
    "Hệ thống thông minh: điều hòa inverter, tủ âm tường, bảo mật 24/7"
  ],
  "digitizationNotes": [
    "Quét từng phòng riêng lẻ (phòng khách, 2 phòng ngủ, 2 WC) để nắm chi tiết nội thất",
    "Chụp bổ sung ban công: nên quét 2-3 góc để tái hiện view công viên đầy đủ",
    "Chú ý phản chiếu gương phòng tắm, kính bếp – cần khử nhiễu texture sau xử lý",
    "Đo đạc chính xác tỉ lệ chiều cao trần – sàn để model 3D không bị méo phối cảnh",
    "Chụp chi tiết vật liệu close-up: vân gỗ, mặt đá kitchen top, fabric sofa để tăng chân thực"
  ]
}
```

### Prompt Mẫu 2: Cửa hàng bán lẻ

**User Input:**
```
- Tên dự án: FashionHub – Store Q1
- Loại không gian: cửa hàng
- Mô tả: Cửa hàng thời trang 200m², tầng trệt shopping mall, hệ kệ trưng bày hiện đại
- Nhóm khách: Khách hàng bán lẻ
```

**Expected Output:**
```json
{
  "title": "FashionHub – Store Q1 | Showroom Bán Lẻ 3D Virtual Interactive",
  "shortDescription": "Trải nghiệm cửa hàng FashionHub qua công nghệ 3D Virtual Tour. Khách hàng có thể khám phá từng góc store, hệ kệ trưng bày, lighting – tất cả từ thiết bị di động.",
  "highlights": [
    "Mặt bằng 200m² bố cục flow tối ưu – dẫn dắt khách từ cửa vào đến quầy thanh toán",
    "Hệ thống kệ trưng bày modular, điều chỉnh chiều cao phù hợp mọi sản phẩm thời trang",
    "Chiếu sáng track light 3000K làm nổi bật màu sắc vải, thiết kế sản phẩm",
    "Khu fitting room 4 cabin cách âm, ánh sáng chuẩn màu – trải nghiệm thử đồ tối ưu",
    "POS counter mở, thiết kế thấp – tạo cảm giác gần gũi, dễ tiếp cận với khách"
  ],
  "digitizationNotes": [
    "Quét trước giờ mở cửa khi kệ hàng đã sắp xếp hoàn chỉnh, sạch sẽ nhất",
    "Cần quét đặc biệt khu vực kính trưng bày – sử dụng polarizing filter khử phản chiếu",
    "Ghi chú vị trí camera an ninh, cảm biến cửa để tích hợp vào bản vẽ kỹ thuật",
    "Chụp thêm POV từ điểm vào cửa hàng và quầy thanh toán cho UX analysis",
    "Close-up chi tiết: vân fabric, buckle kim loại, texture hanger – tăng tính thuyết phục"
  ]
}
```

---

## 4. Cách kiểm tra Output của AI

### 4.1 Validation Checklist

Sau mỗi API response từ Claude, backend tự động kiểm tra:

```javascript
// Validation in generateSceneDescription():
✓ Response là JSON hợp lệ
✓ Có field: title, shortDescription, highlights, digitizationNotes
✓ highlights là array với 5 phần tử
✓ digitizationNotes là array với 5 phần tử
✓ title không quá 100 ký tự
✓ shortDescription không quá 500 ký tự
```

**Code kiểm tra:**
```javascript
const jsonMatch = responseText.match(/\{[\s\S]*\}/);
if (!jsonMatch) throw new Error("AI response is not valid JSON");
const result = JSON.parse(jsonMatch[0]);
// Validate structure
if (!Array.isArray(result.highlights) || result.highlights.length !== 5) {
  throw new Error("Invalid highlights format");
}
```

### 4.2 Quality Checks (Manual QA)

Khi test, kiểm tra:

| Tiêu chí | Cách kiểm tra | Pass/Fail |
|----------|---------------|-----------|
| **Title relevance** | Title có chứa tên dự án + loại không gian không? | ✓ |
| **Tone match** | Văn phong phù hợp nhóm khách (B2B vs B2C)? | ✓ |
| **Highlight quality** | 5 điểm có cụ thể, không generic không? | ✓ |
| **Notes accuracy** | Gợi ý số hóa 3D dùng đúng thuật ngữ BIM/photogrammetry? | ✓ |
| **Language** | Tiếng Việt đúng chính tả, không lỗi grammar? | ✓ |
| **JSON valid** | Có lỗi escape character hay unicode? | ✓ |

### 4.3 Fallback Mechanism

Nếu Claude API fail hoặc timeout:
```javascript
catch (error) {
  console.error("Claude API Error:", error.message);
  // Fallback to MOCK_DB
  return getMockData(projectName, spaceType, description, targetAudience);
}
```

**Fallback response sẽ:**
- Dùng MOCK_DB (dữ liệu template chuẩn)
- Trả về `model: "mock-fallback"` để frontend biết
- Vẫn valid JSON format
- Không crash app

---

## 5. API Setup & Environment

### 5.1 Local Development

**Step 1: Get API Key**
1. Đăng ký tại https://console.anthropic.com
2. Tạo API key mới (save securely)

**Step 2: Set Environment Variable**
```bash
# Windows PowerShell
$env:ANTHROPIC_API_KEY="sk-ant-xxxxxx"

# Windows CMD
set ANTHROPIC_API_KEY=sk-ant-xxxxxx

# Linux/Mac
export ANTHROPIC_API_KEY="sk-ant-xxxxxx"
```

**Step 3: Verify Connection**
```bash
cd backend
npm install
npm start

# Output should show:
# Backend running on http://localhost:3001 [Claude API (LIVE)]
```

**Step 4: Test endpoint**
```bash
curl -X GET http://localhost:3001/api/health

# Expected response:
# {"status":"ok","mode":"claude-ai","apiConfigured":true}
```

### 5.2 Testing với Mock Mode

Nếu không muốn dùng API key (test locally):
```bash
npm start
# Output shows: Backend running on http://localhost:3001 [Mock Mode (Fallback)]
```

---

## 6. Monitoring & Cost

### Token Usage Estimate

Mỗi request khoảng:
- **Input tokens:** ~150-200 (system prompt + user prompt)
- **Output tokens:** ~300-400 (JSON response)
- **Total:** ~500 tokens/request

**Cost per request:** $0.003 (Claude 3.5 Sonnet pricing)

### Rate Limiting

- **Frontend:** Disable submit button khi loading
- **Backend:** Không có rate limit hiện tại (add nếu production)
- **Max concurrent:** API allows 50K tokens/min

---

## 7. Prompt Engineering Tips

### Tối ưu AI Response Quality

**Tip 1: Context rõ ràng**
- ❌ Không tốt: "Generate description"
- ✅ Tốt: "Bạn là chuyên gia BDS 3D. Tạo marketing content cho căn hộ cao cấp"

**Tip 2: Format output explicit**
- ❌ Không tốt: "Trả về JSON"
- ✅ Tốt: `"Yêu cầu output (JSON): {...}"` (show structure)

**Tip 3: Quality constraints**
- ❌ Không tốt: "Write highlights"
- ✅ Tốt: "5 điểm nổi bật (cụ thể, không generic)"

**Tip 4: Language consistency**
- ❌ Không tốt: Mix Vietnamese & English
- ✅ Tốt: Toàn bộ prompt & output Vietnamese

---

## 8. Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| 500 error | API key missing | Set `ANTHROPIC_API_KEY` env var |
| Timeout | API slow | Fallback to mock data kicks in |
| Invalid JSON | Claude hallucinate | Validate & fallback |
| Empty highlights | Parsing fail | Use mock data |
| Wrong tone | Prompt unclear | Improve system prompt |

---

## 9. Future Improvements

- [ ] Add streaming response (show AI thinking in real-time)
- [ ] Implement retry logic (3x retry on API fail)
- [ ] Add prompt versioning (A/B test different prompts)
- [ ] Track token usage & costs
- [ ] Cache similar requests (reduce API calls)
- [ ] Multi-language support (English, Chinese)
