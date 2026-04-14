# SkillSetu — Setup Guide
## "Kaushal se Rojgar tak"

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB (local or Atlas free tier)
- Git

---

## 1️⃣ Clone & Configure

```bash
git clone https://github.com/your-team/skillsetu.git
cd skillsetu
cp .env.example .env
```

Edit `.env` with your API keys (see step 4 for free API keys).

---

## 2️⃣ Backend Setup (Python FastAPI)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate          # Linux/Mac
venv\Scripts\activate             # Windows

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API Docs (Swagger): http://localhost:8000/docs

---

## 3️⃣ Frontend Setup (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend runs at: http://localhost:5173

---

## 4️⃣ Free API Keys Setup

### Google Gemini AI (Primary AI — FREE)
1. Go to https://makersuite.google.com/app/apikey
2. Create API key
3. Add to .env: `GEMINI_API_KEY=your_key`
4. Free tier: 60 requests/minute, 1500/day ✅

### Groq AI (Fallback — FREE)
1. Go to https://console.groq.com
2. Create API key
3. Add to .env: `GROQ_API_KEY=your_key`
4. Free tier: 6000 tokens/min ✅

### MongoDB Atlas (Database — FREE)
1. Go to https://www.mongodb.com/atlas
2. Create free M0 cluster
3. Get connection string
4. Add to .env: `MONGODB_URL=mongodb+srv://...`

### Firebase (Google Sign-In — FREE)
1. Go to https://console.firebase.google.com
2. Create project → Authentication → Google
3. Get config from Project Settings → Web App
4. Download service account JSON → save as `backend/config/firebase-adminsdk.json`
5. Add all VITE_FIREBASE_* keys to .env

### Cloudinary (File Storage — FREE)
1. Go to https://cloudinary.com
2. Free tier: 25GB storage ✅
3. Add CLOUDINARY_* keys to .env

### Twilio (WhatsApp + SMS — FREE TRIAL)
1. Go to https://twilio.com
2. Free trial: $15 credit
3. Join WhatsApp Sandbox: https://www.twilio.com/console/messaging/whatsapp/sandbox
4. Add TWILIO_* keys to .env

---

## 5️⃣ Seed Demo Data

```bash
cd backend
python ../database/seeds/seed.py
```

This creates demo accounts for the SIH presentation:
- **Student:** priya@demo.skillsetu.in / Demo@1234
- **Student:** rahul@demo.skillsetu.in / Demo@1234
- **Recruiter:** hr@techcorp.demo.skillsetu.in / Demo@1234

---

## 6️⃣ Docker Setup (Optional)

```bash
# Run everything with Docker
docker-compose up -d
```

---

## 📁 Project Structure

```
skillsetu/
├── frontend/          React + Vite + Tailwind
├── backend/           Python FastAPI
├── database/          Schemas + Seeds
└── docs/              Documentation
```

---

## 🔑 Key Features

| Feature | Tech | Status |
|---|---|---|
| AI Career Roadmap | Gemini 1.5 Flash | ✅ |
| AI Resume Builder | Gemini + ReportLab | ✅ |
| Skill Extraction | Gemini NLP | ✅ |
| Job Matching | Custom Algorithm | ✅ |
| One-Click Apply | Auto-fill | ✅ |
| Mock Interview | Gemini | ✅ |
| WhatsApp Alerts | Twilio | ✅ |
| SMS Alerts | Twilio | ✅ |
| Google Sign-In | Firebase | ✅ |
| PDF Resume | ReportLab | ✅ |
| File Upload | Cloudinary | ✅ |

---

## 🏆 SIH Demo Flow

1. Open landing page → show dual theme (light/dark)
2. Register as Student → Google Sign-In
3. Complete profile → show AI skill extraction
4. Generate Roadmap → show phases
5. Build Resume → download PDF
6. Explore Jobs → show match scores
7. One-Click Apply → show auto-fill
8. Login as Recruiter → show dashboard
9. View matched candidates → send message
10. Student receives WhatsApp alert (live demo!)

---

## 📞 Support

Built for **Smart India Hackathon 2024**
Team: SkillSetu
Tagline: *Kaushal se Rojgar tak* 🌉
