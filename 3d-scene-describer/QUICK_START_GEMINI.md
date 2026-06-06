# 🚀 Quick Start: Gemini Setup

## 5 Bước Setup Gemini trong 2 phút

### ✅ Bước 1: Lấy Gemini API Key (1 phút)

1. Mở: https://aistudio.google.com/apikey
2. Nhấn **"Create API key"**
3. Chọn **"Create new free API key"**
4. **Copy key** (format: `AIzaSy...`)

⚠️ **Đừng share key public!**

---

### ✅ Bước 2: Tạo .env file (30 giây)

```bash
cd 3d-scene-describer/backend
cp .env.example .env  # Copy template
```

---

### ✅ Bước 3: Điền API keys vào .env

Mở `backend/.env` với text editor:

```env
# Claude (nếu có)
ANTHROPIC_API_KEY=sk-ant-your-claude-key

# Gemini (bắt buộc - paste key bạn vừa copy)
GOOGLE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

PORT=3001
```

**Lưu file.**

---

### ✅ Bước 4: Cài dependencies (30 giây)

```bash
# Vẫn ở folder backend
npm install

# Sẽ download @google/generative-ai
```

---

### ✅ Bước 5: Test (30 giây)

```bash
npm start

# Output mong đợi:
# Backend running on http://localhost:3001
# AI Services: ✓ Claude API | ✓ Gemini API
```

Test health endpoint:
```bash
curl http://localhost:3001/api/health

# Response:
# {
#   "status": "ok",
#   "mode": "claude-ai",
#   "description": "Using Claude (Gemini fallback)"
# }
```

---

## 🎉 Xong! 

Giờ bạn có:
- ✅ Claude API (nếu có key)
- ✅ Gemini API (fallback)
- ✅ Mock Data (emergency fallback)

**Ưu tiên:** Claude → Gemini → Mock

---

## ❓ Có vấn đề?

### "Cannot find module '@google/generative-ai'"

```bash
npm install  # Cài lại
npm start
```

### "API key not valid"

1. Copy key lại từ https://aistudio.google.com/apikey
2. Paste vào `.env`
3. Đảm bảo không có space thừa
4. Restart: `npm start`

### "GOOGLE_GEMINI_API_KEY is not defined"

Lỗi này không ảnh hưởng - app sẽ auto fallback.

---

## 📚 Tài liệu đầy đủ

- **Detailed Setup:** [GEMINI_SETUP.md](GEMINI_SETUP.md)
- **AI Usage:** [docs/AI_USAGE.md](docs/AI_USAGE.md)
- **Full Guide:** [README.md](README.md)

---

**Done!** 🚀
