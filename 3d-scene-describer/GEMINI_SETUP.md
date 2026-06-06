# Google Gemini Setup Guide

## 🎯 Mục đích

Hướng dẫn từng bước để lấy Google Gemini API key và setup tích hợp.

---

## ⚙️ Step 1: Lấy Gemini API Key

### 1.1 Truy cập Google AI Studio

Mở link: **https://aistudio.google.com/apikey**

(Nếu chưa đăng nhập, đăng nhập bằng Google account)

### 1.2 Tạo API Key mới

1. Nhấp **"Create API key"** button
2. Chọn **"Create new free API key in new project"**
3. Google tạo key tự động → **Copy key này**

**Format key:** `AIzaSy...` (dài khoảng 39 ký tự)

### 1.3 Lưu key an toàn

⚠️ **ĐỪNG share key công khai!**

---

## 📝 Step 2: Setup `.env` file

### 2.1 Copy template

```bash
cd backend
cp .env.example .env  # Linux/Mac
copy .env.example .env  # Windows
```

### 2.2 Edit `.env`

Mở file `backend/.env` bằng editor yêu thích:

```env
# ===== ANTHROPIC (Claude) =====
ANTHROPIC_API_KEY=sk-ant-your-claude-key

# ===== GOOGLE GEMINI =====
GOOGLE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ===== SERVER =====
PORT=3001
```

**Thay:**
- `sk-ant-your-claude-key` → key của Claude (nếu có)
- `AIzaSy...` → key Gemini vừa copy

### 2.3 Verify .env không được track

```bash
# Check .gitignore
cat backend/.gitignore

# Output should include:
# .env
# .env.local
```

---

## 🚀 Step 3: Install Dependencies

```bash
cd backend
npm install

# Output sẽ download @google/generative-ai library
```

---

## ✅ Step 4: Test Setup

### 4.1 Run backend

```bash
npm start

# Expected output:
# Backend running on http://localhost:3001
# AI Services: ✓ Claude API | ✓ Gemini API
```

### 4.2 Check health endpoint

```bash
curl http://localhost:3001/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "mode": "claude-ai",
  "aiServices": {
    "claude": true,
    "gemini": true
  },
  "description": "Using Claude (Gemini fallback)"
}
```

**Giải thích:**
- `claude: true` → Claude API ready
- `gemini: true` → Gemini API ready
- Nếu Claude fail → tự động fallback to Gemini

### 4.3 Test API call

```bash
curl -X POST http://localhost:3001/api/describe-scene \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "Test Project",
    "spaceType": "căn hộ",
    "description": "Căn hộ 2PN cao cấp",
    "targetAudience": "Người mua nhà"
  }'
```

**Response sẽ include:**
```json
{
  "success": true,
  "data": {
    "model": "claude-3-5-sonnet",  // ← Shows which model was used
    "title": "...",
    "highlights": [...],
    ...
  }
}
```

---

## 🔄 Fallback Logic

### Ưu tiên sử dụng:

```
1. Claude API (nếu ANTHROPIC_API_KEY set)
2. Gemini API (nếu Claude fail hoặc no Claude key)
3. Mock Data (nếu cả 2 API fail)
```

### Ví dụ:

**Scenario A: Cả 2 keys set**
```
User request
→ Try Claude
  └─ Success → Return (model: "claude-3-5-sonnet")
  └─ Fail → Try Gemini
     └─ Success → Return (model: "gemini-pro")
     └─ Fail → Use Mock (model: "mock-fallback")
```

**Scenario B: Chỉ Gemini key**
```
User request
→ Try Claude (skip - no key)
→ Use Gemini
  └─ Success → Return (model: "gemini-pro")
  └─ Fail → Use Mock (model: "mock-fallback")
```

---

## 🛠️ Troubleshooting

### Problem: `API key not valid` error

**Solution:**
1. Copy key từ https://aistudio.google.com/apikey lại
2. Paste vào `.env` (đảm bảo không có space)
3. Restart server: `npm start`

### Problem: `Cannot find module '@google/generative-ai'`

**Solution:**
```bash
cd backend
npm install  # Cài lại dependencies
npm start
```

### Problem: Gemini returns empty response

**Solution:**
1. Check key hợp lệ
2. Check quota https://console.cloud.google.com/
3. Gemini free tier có rate limit (60 req/min)

### Problem: Muốn chỉ dùng Gemini (không Claude)

**Solution:**
```env
# .env
# ANTHROPIC_API_KEY=  ← Leave empty or comment out

GOOGLE_GEMINI_API_KEY=AIzaSy...
PORT=3001
```

Output sẽ show:
```
AI Services: ✗ No Claude | ✓ Gemini API
```

---

## 📊 API Quotas & Limits

| Provider | Model | Free Tier | Rate Limit |
|----------|-------|-----------|-----------|
| **Claude** | claude-3-5-sonnet | Paid | 50K tokens/min |
| **Gemini** | gemini-pro | **Yes** | 60 requests/min |

### Gemini Free Tier Benefits:
- ✅ 60 requests per minute
- ✅ No credit card required
- ✅ Suitable for development
- ✅ Perfect for fallback

---

## 🔐 Security Checklist

- [ ] `.env` is in `.gitignore`
- [ ] Never commit `.env` to Git
- [ ] Keys are long strings (not obviously fake)
- [ ] Use different keys for dev/production (if applicable)
- [ ] Regenerate key if accidentally exposed
- [ ] Check https://console.cloud.google.com/ for usage stats

---

## 📚 Resources

- **Google AI Studio:** https://aistudio.google.com/apikey
- **Gemini API Docs:** https://ai.google.dev/docs
- **Python SDK:** https://github.com/google/generative-ai-python
- **Node.js SDK:** https://github.com/google/generative-ai-js

---

## ❓ FAQ

**Q: Có phí dùng Gemini API không?**
A: Free tier có 60 requests/minute. Trả phí nếu vượt.

**Q: Gemini có tốt như Claude không?**
A: Tương đương cho hầu hết task. Claude lành hơn cho writing, Gemini tốt cho coding.

**Q: Có thể đổi model không?**
A: Có, sửa `server.js` line: `model: "gemini-pro"` → khác model.

**Q: Nếu cả 2 API fail thì sao?**
A: App fallback về mock data - không bao giờ crash.

---

**Created:** 2026-06-06  
**Updated:** Latest
