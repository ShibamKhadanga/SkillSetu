# SkillSetu — Kaushal se Rojgar tak 🌉

> **AI-powered career bridge platform connecting Indian students to dream jobs — from learning roadmap to resume to placement, all in one place.**

Built for **Smart India Hackathon (SIH) 2026** | Team from Kalinga University, Raipur

---

## 🚀 What is SkillSetu?

SkillSetu solves 4 critical problems Indian students face:

| Problem | Solution |
|---|---|
| Don't know what to learn | AI Career Roadmap with phase-by-phase learning path |
| Can't make a good resume | AI Resume Builder — one click, ATS-optimized PDF |
| Waste hours on applications | One-Click Apply — AI auto-fills every form field |
| Miss opportunities | WhatsApp + SMS alerts the moment a recruiter contacts them |

Recruiters face the opposite — too many applications, no easy way to find the right candidate. SkillSetu's AI ranks ALL students by match score instantly.

---

## ✨ Features

### 👨‍🎓 Student / Candidate
| Feature | Description |
|---|---|
| 🗺️ Education Flowchart | Visual tree diagram: 10th → 12th (Science/Commerce/Arts) / ITI / Diploma → Degree nodes with subjects → Job roles with salary |
| 🧠 AI Career Roadmap | Enter dream job → AI generates personalized phase-by-phase path with courses, Indian exams (JEE, GATE, CUET), NPTEL, FreeCodeCamp |
| 🤖 AI Skill Extractor | Upload certificates, projects, degrees → AI detects hidden skills automatically |
| 📄 AI Resume Builder | One click → professional ATS-optimized resume → **center-aligned header** → downloadable PDF (4 templates) |
| 📊 Resume Score Checker | **Upload PDF/TXT** or paste text → AI scores resume (content, structure, skills, achievements) → improvement tips |
| 💼 Job Explorer | All jobs ranked by AI match score (0–100%) based on your skills |
| ⚡ One-Click Apply | AI pre-fills every application field → review → send |
| 📋 Application Tracker | Track all applications — Applied, Reviewing, Interview, Offered, Rejected |
| 🎤 AI Mock Interview | Chat-based AI interviewer → scored out of 10 per answer → final score out of 100 |
| 🌐 Public Portfolio | Auto-generated shareable profile page like a personal LinkedIn |
| 📱 WhatsApp + SMS Alerts | Instant alerts when recruiters contact you or new matching jobs are posted |
| 💬 In-Platform Messaging | Chat directly with recruiters inside SkillSetu |
| ⭐ Rate SkillSetu | Submit feedback with star rating — public reviews shown on landing page |
| 🗑️ Delete Account | Permanently delete account and all data from settings |

### 🏢 Recruiter / Company
| Feature | Description |
|---|---|
| 📝 Post a Job | Fill requirements → AI auto-writes the job description |
| 🤖 AI Candidate Matching | AI instantly ranks ALL students by match % for your job |
| 📣 Auto-Notify on Post | Platform automatically sends WhatsApp alerts to all matching students (70%+ match) |
| 👥 Candidate Dashboard | View shortlisted candidates with full resume + portfolio |
| 📋 Application Manager | Filter by job post → update status → candidates auto-notified |
| 💬 In-Platform Messaging | Message candidates directly |
| 📈 Analytics Dashboard | Job views, application trends, hiring funnel, top skills |

---

## 🤖 AI Features (All Free APIs)

| AI Feature | Technology |
|---|---|
| Career Roadmap Generation | Google Gemini 1.5 Flash (free) |
| Resume Writing | Google Gemini 1.5 Flash (free) |
| Skill Extraction from Documents | Google Gemini 1.5 Flash (free) |
| Mock Interview & Scoring | Google Gemini 1.5 Flash (free) |
| Job Description Generation | Google Gemini 1.5 Flash (free) |
| Skill Gap Analysis | Google Gemini 1.5 Flash (free) |
| Smart Job Match Alerts | Gemini + Custom Algorithm → WhatsApp via Twilio |
| Job-Candidate Matching | Custom fuzzy matching algorithm |
| Fallback AI | Groq Llama3 (free) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| State Management | Zustand |
| Backend | Python FastAPI |
| Database | SQLite (zero setup, file-based) |
| AI | Google Gemini 1.5 Flash (free tier) |
| Notifications | Twilio (WhatsApp + SMS) |
| File Storage | Cloudinary |
| Auth | JWT + Google Sign-In (Firebase) |
| PDF Generation | ReportLab |

---

## 🎨 Design

- **Light Theme** — Orange + White (energetic, professional)
- **Dark Theme** — Neon Cyan + Dark (modern, tech-focused)
- Fully responsive — mobile, tablet, desktop
- Smooth animations, glassmorphism UI cards

---

## 🏃 How to Run Locally

### Prerequisites
- Node.js 18+
- Python 3.10+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/ShibamKhadanga/SkillSetu.git
cd SkillSetu
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:
```env
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_secret_key_here
TWILIO_ACCOUNT_SID=optional
TWILIO_AUTH_TOKEN=optional
```

Start the backend:
```bash
uvicorn main:app --reload --port 8000
```

### 3. Seed Demo Data
Open a new terminal:
```bash
cd backend
python seed.py
```

### 4. Frontend Setup
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```

### 5. Open the app
```
http://localhost:5173
```

---

## 👤 Demo Accounts

> All passwords: `Demo@1234`

| Role | Email | What to see |
|---|---|---|
| 👨‍🎓 CS Student | `priya@demo.com` | Interview scheduled, messages from TechCorp |
| 👨‍🎓 ML Engineer | `rahul@demo.com` | Job OFFER from AI Solutions! |
| 👨‍🎓 CA Student | `ananya@demo.com` | Education flowchart → Commerce path → CA route |
| 👩‍⚕️ MBBS Student | `kavitha@demo.com` | Science path → NEET → Medical career roles |
| ⚖️ Law Student | `meera@demo.com` | Arts path → CLAT → Legal career roles |
| 🏢 Recruiter | `hr@techcorp.demo` | 4 applications, 2 active jobs, messages |
| 🏢 Recruiter | `hr@aisolutions.demo` | 2 applications, 2 active jobs |

---

## 📁 Project Structure

```
SkillSetu/
├── backend/
│   ├── config/          # DB, settings, Gemini config
│   ├── models/          # SQLAlchemy models (User, Job, Application, Feedback...)
│   ├── routes/          # API route modules
│   │   ├── auth_routes.py
│   │   ├── student_routes.py
│   │   ├── recruiter_routes.py
│   │   ├── job_routes.py
│   │   ├── application_routes.py
│   │   ├── ai_routes.py
│   │   ├── message_routes.py
│   │   ├── notification_routes.py
│   │   └── feedback_routes.py
│   ├── services/        # Gemini AI, matching, resume generation
│   ├── utils/           # JWT, response helpers
│   ├── main.py          # FastAPI app entry point
│   ├── seed.py          # Demo data seeder
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── layouts/     # StudentLayout, RecruiterLayout
│       │   └── common/      # FeedbackModal
│       ├── pages/
│       │   ├── auth/        # Login, Register
│       │   ├── student/     # Dashboard, Profile, Roadmap, Resume, Jobs...
│       │   └── recruiter/   # Dashboard, Candidates, Applications...
│       ├── store/           # Zustand state (auth, theme)
│       └── services/        # Axios API client
│
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── SETUP.md
│
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

The backend exposes a full REST API. View interactive docs at:
```
http://localhost:8000/docs
```

Key endpoints:
- `POST /auth/register` — Create account
- `POST /auth/login` — Login
- `GET /auth/all-users` — View all registered users (requires token)
- `GET /student/profile` — Get student profile
- `GET /jobs/` — List all active jobs
- `POST /ai/generate-roadmap` — Generate AI career roadmap
- `POST /ai/build-resume` — Generate AI resume
- `POST /feedback/submit` — Submit feedback/rating
- `DELETE /feedback/account` — Delete account permanently

---

## 🏆 Built For

**Smart India Hackathon (SIH) 2026**

> SkillSetu is 100% free for students — forever. Built for Bharat. 🇮🇳

---

## 👨‍💻 Developer

**Shibam Khadanga**
- B.Tech CS @ Kalinga University, Raipur
- Python Developer | AI/ML Engineer | Full-Stack Builder
- GitHub: [@ShibamKhadanga](https://github.com/ShibamKhadanga)

---

*Made with ❤️ in Bharat*