# 🏢 3D Scene Describer – AI Content Generator cho Dự Án 3D/Không Gian Số

![Node.js](https://img.shields.io/badge/Node.js-Latest-green)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![License](https://img.shields.io/badge/License-Proprietary-red)

**3D Scene Describer** là công cụ AI tích hợp **Claude 3.5 Sonnet** + **Google Gemini** để tự động tạo nội dung marketing chuyên nghiệp và hướng dẫn số hóa 3D cho các dự án bất động sản, không gian xanh, và dự án lớn khác.

---

## 🎯 Tính Năng Chính

✅ **4 Dự Án Công Ty** – Dropdown selector cho dự án:
- Masteri Centre Point (Smart Home)
- Verosa Park Khang Diên (Khu đô thị)
- Công Viên Vĩnh Hằng (Công viên)
- Tecco Felice Homes (Đất xanh)

✅ **Dual LLM AI** – Claude (Primary) + Gemini (Fallback)  
✅ **Nội Dung Tự Động** – 5 highlights + 5 gợi ý số hóa 3D  
✅ **Marketing Intelligence** – Tone phù hợp nhóm khách hàng  
✅ **Export Formats** – TXT hoặc JSON  
✅ **History & Compare** – Lưu trữ 20 dự án, so sánh 2 kết quả  
✅ **Mock Data Fallback** – Ứng dụng never crashes  

---

## 🚀 Quick Start (5 phút)

### **1. Clone/Open Project**

```bash
cd d:\GLOBALAI\3d-scene-describer
```

### **2. Setup Backend**

```bash
cd backend
npm install

# Comment out API keys (dùng mock data)
# nano .env
# Hoặc để trống (fallback tự động)

npm start
# Output: Backend running on http://localhost:3001
# AI Services: ✗ No Claude | ✗ No Gemini (sẽ dùng mock data)
```

### **3. Setup Frontend** (new terminal)

```bash
cd frontend
npm install
npm run dev

# Open: http://localhost:3000
```

### **4. Test**

1. Chọn dự án từ dropdown: **"Masteri Centre Point"**
2. Chọn loại không gian: **"Căn hộ"**
3. Điền mô tả: **"Căn hộ Smart Home 30/360 độ"**
4. Chọn khách: **"Người mua nhà cá nhân"**
5. Nhấn **"Phân tích với AI"** → Kết quả hiện lên! ✅

---

## 📋 Dòng Chảy Ứng Dụng

```
┌─────────────────────────┐
│   Frontend Form Input    │
│  (Project + Type + Desc) │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│  Client-side Validation │
│  (Check required fields)│
└────────────┬────────────┘
             ↓
      POST /api/describe-scene
             ↓
┌─────────────────────────────────┐
│     Backend Processing           │
│  1. Validate input               │
│  2. Try Claude API               │
│  3. → Gemini Fallback (if fail)  │
│  4. → Mock Data (if both fail)   │
└────────────┬────────────────────┘
             ↓
┌─────────────────────────────┐
│   Return JSON Response       │
│  • title                     │
│  • shortDescription          │
│  • highlights (5)            │
│  • digitizationNotes (5)     │
│  • model used                │
└────────────┬────────────────┘
             ↓
┌──────────────────────────────┐
│  Frontend Display Result      │
│  • Show content              │
│  • Save to localStorage      │
│  • Option: Export/Compare    │
└──────────────────────────────┘
```

---

## 🛠️ Cài Đặt AI Services (Optional)

### **Chế độ 1: Mock Data (Recommended - Bây giờ)**

```bash
# .env có thể để trống hoặc comment out
# ANTHROPIC_API_KEY=
# GOOGLE_GEMINI_API_KEY=

npm start
# Sẽ dùng MOCK_DB - không cần API key
```

### **Chế độ 2: Với Gemini (Recommended)**

1. Lấy key: https://aistudio.google.com/apikey
2. Edit `.env`:
```env
# ANTHROPIC_API_KEY=

GOOGLE_GEMINI_API_KEY=AIzaSy...
PORT=3001
```
3. Restart: `npm start`

### **Chế độ 3: Với Claude + Gemini**

1. Lấy Claude key: https://console.anthropic.com/account/keys
2. Edit `.env`:
```env
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GEMINI_API_KEY=AIzaSy...
PORT=3001
```
3. Restart: `npm start`

---

## 📊 Project Structure

```
3d-scene-describer/
├── backend/
│   ├── server.js                 # Express + Claude + Gemini
│   ├── package.json              # Dependencies
│   ├── .env.example              # Template
│   ├── .env                       # Local config (NEVER commit)
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main React component
│   │   ├── main.jsx
│   │   ├── index.css             # Styling + responsive
│   │   └── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .gitignore
├── docs/
│   ├── README.md                 # Setup guide
│   ├── AI_USAGE.md              # AI implementation
│   ├── QA_REPORT.md             # Quality issues + fixes
│   └── GEMINI_SETUP.md          # Detailed Gemini setup
├── QUICK_START_GEMINI.md        # 5-step quick start
├── GEMINI_INTEGRATION_SUMMARY.md
└── README.md                    # This file
```

---

## 🎨 Frontend Features

### **Form Input**
- Dropdown dự án (4 options)
- Dropdown loại không gian
- Text input mô tả
- Dropdown nhóm khách hàng

### **Result Display**
- Tiêu đề (dynamic)
- Mô tả ngắn (phù hợp khách hàng)
- 5 Highlights (điểm bán hàng)
- 5 Digitization Notes (hướng dẫn quét 3D)
- Tags: Loại dự án + Model dùng

### **Actions**
- 📥 Export TXT
- 📥 Export JSON
- 📋 Lưu lịch sử (localhost)
- ⚖️ So sánh 2 dự án

### **History Panel**
- Danh sách 20 dự án gần đây
- Xóa từng item hoặc clear all
- Select để so sánh

---

## 🤖 AI Integration

### **Claude 3.5 Sonnet** (Primary)
- Chất lượng cao, hiểu context tốt
- Model: `claude-3-5-sonnet-20241022`
- Cost: ~$0.003/request
- Rate: 50K tokens/min

### **Google Gemini Pro** (Fallback)
- Model: `gemini-2.0-flash`
- Free tier: 60 requests/min
- Fallback nếu Claude fail

### **Mock Data** (Emergency Fallback)
- 4 dự án công ty + 6 loại không gian generic
- Dùng khi API fail hoặc hết quota
- Never crash app ✅

---

## 📈 API Endpoints

### **Health Check**
```bash
GET /api/health

Response:
{
  "status": "ok",
  "mode": "gemini-2.0-flash",
  "aiServices": {"claude": false, "gemini": true},
  "description": "Using Gemini only"
}
```

### **Generate Description**
```bash
POST /api/describe-scene

Request:
{
  "projectName": "masteri",
  "spaceType": "Căn hộ",
  "description": "Căn hộ Smart Home 30/360 độ",
  "targetAudience": "Người mua nhà cá nhân"
}

Response:
{
  "success": true,
  "data": {
    "title": "Masteri Centre Point – Trải Nghiệm Số Hóa Đỉnh Cao",
    "shortDescription": "...",
    "highlights": [...],
    "digitizationNotes": [...],
    "model": "gemini-2.0-flash",
    "generatedAt": "2026-06-08T..."
  }
}
```

---

## 🧪 Testing

### **1. Health Endpoint**
```bash
curl http://localhost:3001/api/health
```

### **2. Generate with Masteri**
```bash
curl -X POST http://localhost:3001/api/describe-scene \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "masteri",
    "spaceType": "Căn hộ",
    "description": "Smart Home 30/360 độ view",
    "targetAudience": "Người mua nhà"
  }'
```

### **3. Test All 4 Projects**
- masteri
- verosa
- vinh hang
- tecco felice

---

## 📚 Documentation

| File | Mục đích |
|------|---------|
| [docs/README.md](docs/README.md) | Setup & Architecture |
| [docs/AI_USAGE.md](docs/AI_USAGE.md) | AI Implementation + Prompts |
| [docs/QA_REPORT.md](docs/QA_REPORT.md) | UI/UX Issues & Fixes |
| [QUICK_START_GEMINI.md](QUICK_START_GEMINI.md) | 5-step Gemini Setup |
| [GEMINI_SETUP.md](GEMINI_SETUP.md) | Detailed Gemini Guide |

---

