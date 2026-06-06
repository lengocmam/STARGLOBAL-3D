# Documentation – 3D Scene Describer

Welcome to the 3D Scene Describer documentation hub.

## 📖 Quick Links

### 1. **[AI_USAGE.md](AI_USAGE.md)** – AI Implementation Guide
- Claude 3.5 Sonnet API integration
- Prompt engineering + system prompts
- 2 detailed prompt examples (Apartment & Store)
- Quality validation & fallback mechanism
- Cost & rate limiting
- Troubleshooting guide

**Best for:** Understanding how AI is used in the backend

---

### 2. **[QA_REPORT.md](QA_REPORT.md)** – Quality Assurance Report
- 3 main UI/UX issues identified
- Impact level & difficulty assessment
- Improvement suggestions for each issue
- Testing checklist

**Issues covered:**
1. 🔴 Form not responsive on mobile (HIGH priority)
2. 🟡 Loading feedback is unclear (MEDIUM priority)
3. 🟡 History panel lacks search/filter (MEDIUM priority)

**Best for:** Product managers & designers evaluating the app

---

### 3. **[README.md](README.md)** – You are here!
Quick navigation to all docs.

---

## 🚀 Getting Started

### Setup Backend with Claude API

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Set API key
set ANTHROPIC_API_KEY=sk-ant-xxxxx  # Windows
export ANTHROPIC_API_KEY=sk-ant-xxxxx  # Linux/Mac

# 3. Start server
npm start
# Output: Backend running on http://localhost:3001 [Claude API (LIVE)]

# 4. Verify
curl http://localhost:3001/api/health
# Response: {"status":"ok","mode":"claude-ai","apiConfigured":true}
```

### Setup Frontend

```bash
cd frontend
npm install
npm run dev
# Open: http://localhost:3000
```

---

## 📊 Project Structure

```
3d-scene-describer/
├── backend/
│   ├── server.js                 # Express server + Claude API integration
│   ├── package.json              # Dependencies
│   └── .env (need to create)     # ANTHROPIC_API_KEY
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Main React component
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── docs/
    ├── README.md                 # This file
    ├── AI_USAGE.md              # AI guide
    └── QA_REPORT.md             # Quality issues
```

---

## 🧪 Testing the API

### Test 1: Health Check
```bash
curl http://localhost:3001/api/health
```

### Test 2: Create Scene Description
```bash
curl -X POST http://localhost:3001/api/describe-scene \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "The Manor Central Park – Tầng 12",
    "spaceType": "căn hộ",
    "description": "Căn hộ 2PN nội thất cao cấp, hướng Đông Nam, view công viên",
    "targetAudience": "Người mua nhà cá nhân"
  }'
```

### Expected Response
```json
{
  "success": true,
  "data": {
    "title": "The Manor Central Park – Tầng 12 | Căn Hộ Premium...",
    "shortDescription": "Khám phá căn hộ...",
    "highlights": ["Thiết kế 2PN...", "View hướng Đông Nam...", ...],
    "digitizationNotes": ["Quét từng phòng...", ...],
    "tone": "căn hộ",
    "generatedAt": "2026-06-06T...",
    "model": "claude-3-5-sonnet"
  }
}
```

---

## 🎯 Key Features

### AI-Powered Content Generation
- Input: Project name, space type, description, target audience
- Output: Marketing title, short description, 5 highlights, 5 digitization notes
- AI: Claude 3.5 Sonnet (Anthropic)

### Frontend
- Form validation (client-side)
- Real-time error messages
- Export to TXT/JSON
- Local history (20 max)
- Comparison tool (2 projects)

### Backend
- Mock DB fallback (if API fails)
- Automatic error handling
- Health check endpoint
- CORS enabled

---

## 📋 User Flow

1. **User fills form** → Name, Space Type, Description, Target Audience
2. **Frontend validates** → Check required fields, min length
3. **Submit to backend** → POST `/api/describe-scene`
4. **Backend calls Claude API** → Generate content
5. **Frontend displays result** → Title, description, highlights, notes
6. **User can export** → TXT or JSON format
7. **Auto-saved to history** → localStorage (max 20 items)

---

## ⚙️ Environment Variables

| Variable | Required | Example | Note |
|----------|----------|---------|------|
| `ANTHROPIC_API_KEY` | Yes (for live) | `sk-ant-...` | Get from https://console.anthropic.com |
| `PORT` | No | `3001` | Backend port (default: 3001) |

---

## 🔗 External Resources

- **Anthropic API Docs:** https://docs.anthropic.com
- **Claude Models:** https://docs.anthropic.com/en/docs/about/models
- **Pricing:** https://www.anthropic.com/pricing

---

## 📝 Notes

- **Mock Mode:** If `ANTHROPIC_API_KEY` is not set, backend falls back to mock data
- **Fallback DB:** 6 space types with pre-defined content (apartment, villa, office, store, gallery, hotel)
- **Response Time:** ~2-3 seconds per request (Claude API + network)
- **Cost:** ~$0.003 per request

---

*Last updated: 2026-06-06*
