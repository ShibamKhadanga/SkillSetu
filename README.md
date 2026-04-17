# SkillSetu — Kaushal se Rojgar tak 🌉

> **AI-powered career bridge platform connecting Indian students to dream jobs — from career guidance to resume to placement, all in one place.**

Built for **Smart India Hackathon (SIH) 2026** | Team from Kalinga University, Raipur

---

## 🚀 What is SkillSetu?

India produces **1 crore+ graduates every year**, but most face the same 4 problems:

| Problem | SkillSetu Solution |
|---|---|
| Don't know what to study after 10th/12th | 🗺️ Interactive Career Roadmap — visual education flowchart covering every Indian stream |
| Can't figure out skill gaps | 📊 AI Skill Gap Analyzer — compare your skills vs job requirements |
| Can't make a good resume | 📄 AI Resume Builder — one click, ATS-optimized PDF |
| Miss opportunities & govt exams | 🏛️ Govt Job Finder + 🎓 Scholarship Finder + 📱 WhatsApp alerts |
| No idea about market trends | 📈 Industry Trends Dashboard + 💰 Salary Insights |
| Don't know which career is better | 📊 Career Comparison Tool — side-by-side analysis |

**For Recruiters:** AI ranks ALL students by match score — find the right candidate in seconds.

---

## ✨ Features (30+ Total)

### 👨‍🎓 Student / Candidate

| Feature | Description |
|---|---|
| 🗺️ **Career Roadmap** | 3-tab system: Pathway Explorer (tree) + Horizontal Flowchart + AI Personalized Phases |
| 📊 **Career Comparison** | Side-by-side compare any 2 paths — B.Tech vs BCA, MBBS vs B.Pharm, CA vs MBA |
| 📊 **AI Skill Gap Analyzer** | Select any job → AI shows matched skills, missing skills & free learning resources |
| 🏛️ **Govt Job Finder** | Enter background → AI finds matching exams (UPSC, SSC, IBPS, Railway, State PSC) |
| 🎓 **Scholarship Finder** | AI finds scholarships by category (SC/ST/OBC/EWS/General), education & income |
| 💰 **Salary Insights** | AI shows fresher/mid/senior salary, top companies, cities & market trends |
| 📈 **Industry Trends** | Live dashboard — skill demand index, hottest roles, top hiring cities in India |
| 🧪 **Skill Assessment Quiz** | 6 quizzes (Python, React, SQL, JS, DSA, GK India) — instant score & level |
| 🏆 **Achievement Badges** | 10 milestones with progress bar — Profile Pro, Resume Master, Dream Achieved 🏆 |
| 📄 **AI Resume Builder** | One click → professional ATS-optimized resume → downloadable PDF (4 templates) |
| 📊 **Resume Score Checker** | Upload PDF/TXT → AI scores resume (content, structure, skills) → improvement tips |
| 🤖 **AI Skill Extractor** | Upload certificates/projects → AI detects hidden skills automatically |
| 💼 **Job Explorer** | All jobs ranked by AI match score (0–100%) |
| ⚡ **One-Click Apply** | AI pre-fills every application field → review → send |
| 📋 **Application Tracker** | Track applications — Applied, Reviewing, Interview, Offered, Rejected |
| 🎤 **AI Mock Interview** | Chat-based AI interviewer → scored out of 10 per answer → final score /100 |
| 🌐 **Public Portfolio** | Auto-generated shareable profile page |
| 📱 **WhatsApp + SMS Alerts** | Instant Twilio-powered alerts for status changes, new matches & messages |
| 💬 **In-Platform Messaging** | Chat directly with recruiters |
| 🌍 **Multi-Language** | Full UI in English, Hindi, Tamil, Telugu & Bengali |
| ⭐ **Rate SkillSetu** | Feedback with star rating — reviews shown on landing page |
| 🗑️ **Delete Account** | GDPR-style permanent account deletion |

### 🗺️ Career Roadmap — Deep Dive

The Career Roadmap has **3 interactive tabs**:

#### Tab 1: Pathway Explorer (Tree View)
- Expandable tree: **10th → 12th (PCM/PCB/Commerce/Arts) / ITI / Diploma**
- Interactive subject chips — click "PCM" to filter children
- **"I am here" marker (📍)** — mark your current position
- Streams covered: B.Tech, BCA→MCA, MBBS, BDS, B.Pharm/D.Pharm, B.Sc Nursing, BPT, CA, CS, BA LLB, B.Des, B.Ed, UPSC, NDA, ITI, Diploma→Lateral Entry B.Tech
- Terminal nodes show **job roles with salary ranges**

#### Tab 2: Flowchart (Horizontal)
- **Left-to-right horizontal flow** — visually traces your path
- Uses same unified PATHWAY_TREE data
- Interactive node selection with career outcomes at the end

#### Tab 3: AI Phases (Personalized)
- Enter dream job → AI generates phase-by-phase learning path
- Indian exams (JEE, GATE, CUET, NEET), NPTEL, FreeCodeCamp, YouTube channels

### 🏢 Recruiter / Company

| Feature | Description |
|---|---|
| 📝 **Post a Job** | Fill requirements → AI auto-writes job description |
| 🤖 **AI Candidate Matching** | AI ranks ALL students by match % |
| 📣 **Auto-Notify** | WhatsApp alerts to matching students (≥50% match) via Twilio |
| 👥 **Candidate Dashboard** | View shortlisted candidates with resume + portfolio |
| 📋 **Application Manager** | Filter by job → update status → auto-notify candidates |
| 💬 **Messaging** | Message candidates directly |
| 📈 **Analytics Dashboard** | Job views, trends, hiring funnel, top skills |

---

## 🤖 AI Features (All Free APIs)

| AI Feature | Technology |
|---|---|
| Career Roadmap | Google Gemini 1.5 Flash |
| Resume Writing & Scoring | Google Gemini 1.5 Flash |
| Skill Extraction | Google Gemini 1.5 Flash |
| Skill Gap Analysis | Google Gemini 1.5 Flash |
| Mock Interview | Google Gemini 1.5 Flash |
| JD Generation | Google Gemini 1.5 Flash |
| Salary Insights | Google Gemini 1.5 Flash |
| Govt Job Finder | Google Gemini 1.5 Flash |
| Scholarship Finder | Google Gemini 1.5 Flash |
| Job Match Alerts | Custom algorithm → Twilio WhatsApp + SMS |
| Status Notifications | Notification Service → In-app + WhatsApp |
| Candidate Matching | Custom fuzzy matching algorithm |
| Fallback AI | Groq Llama3 (free) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| State Management | Zustand (+ persist for language/theme) |
| Backend | Python FastAPI (async) |
| Database | SQLite (zero setup) → PostgreSQL (production) |
| AI | Google Gemini 1.5 Flash (free tier) |
| Notifications | Twilio (WhatsApp + SMS) |
| File Storage | Cloudinary |
| Auth | JWT + bcrypt |
| PDF Generation | ReportLab |
| Multi-Language | Custom i18n store (5 languages) |

---

## 🎨 Design

- **Light Theme** — Orange + White (energetic, professional)
- **Dark Theme** — Neon Cyan + Dark (modern, tech-focused) with adaptive `--neon-box-text` for readability
- Fully responsive — mobile, tablet, desktop (auto-fit stat grids)
- Glassmorphism cards, smooth micro-animations
- Horizontal scrollable flowchart with interactive chips
- Compact sidebar with language selector
- Theme toggle in header (next to notification bell)
- Profile photo upload with image preview

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

Create a `.env` file in `backend/`:
```env
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

Start the backend:
```bash
uvicorn main:app --reload --port 8000
```

### 3. Seed Demo Data
```bash
cd backend
python seed.py
```

### 4. Frontend Setup
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
| 👨‍🎓 CS Student | `priya@demo.com` | Full student experience, messages from TechCorp |
| 👨‍🎓 ML Engineer | `rahul@demo.com` | Job OFFER received! |
| 👨‍🎓 CA Student | `ananya@demo.com` | Career Roadmap → Commerce → CA path |
| 👩‍⚕️ MBBS Student | `kavitha@demo.com` | Science PCB → MBBS / D.Pharm / Nursing |
| ⚖️ Law Student | `meera@demo.com` | Arts → CLAT → Legal careers |
| 🏢 Recruiter | `hr@techcorp.demo` | 4 applications, 2 jobs, messages |
| 🏢 Recruiter | `hr@aisolutions.demo` | 2 applications, 2 jobs |

---

## 📁 Project Structure

```
SkillSetu/
├── backend/
│   ├── config/              # DB, settings, Gemini, Cloudinary config
│   ├── models/models.py     # SQLAlchemy models (User, Job, Application, Notification, etc.)
│   ├── routes/
│   │   ├── auth_routes.py         # Register, Login, Google OAuth
│   │   ├── student_routes.py      # Profile, Dashboard, Avatar upload
│   │   ├── recruiter_routes.py    # Recruiter Dashboard, Candidates
│   │   ├── job_routes.py          # Post, Apply, Search (+ auto-notify)
│   │   ├── application_routes.py  # Status update (+ WhatsApp notify)
│   │   ├── ai_routes.py           # All AI features (Gemini)
│   │   ├── message_routes.py      # In-platform messaging
│   │   ├── notification_routes.py # In-app notifications
│   │   └── feedback_routes.py     # User feedback & account deletion
│   ├── services/
│   │   ├── notification_service.py  # In-app + WhatsApp + SMS via Twilio
│   │   ├── gemini_service.py        # Google Gemini AI integration
│   │   ├── matching_service.py      # Skill match algorithm
│   │   └── resume_service.py        # PDF resume generation
│   ├── utils/               # JWT, response helpers
│   ├── main.py              # FastAPI entry point
│   ├── seed.py              # Demo data seeder
│   └── requirements.txt
│
├── frontend/src/
│   ├── components/layouts/   # StudentLayout, RecruiterLayout (sidebar + header)
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── auth/             # Login, Register (Google OAuth)
│   │   ├── student/          # 18 pages (Dashboard, Roadmap, Resume, SkillGap, Quiz, etc.)
│   │   └── recruiter/        # 6 pages (Dashboard, PostJob, Candidates, etc.)
│   ├── store/                # Zustand (auth, theme, language)
│   └── services/             # Axios API client
│
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

Interactive docs: `http://localhost:8000/docs`

Key endpoints:
- `POST /auth/register` | `POST /auth/login`
- `GET /student/profile` | `PUT /student/profile`
- `GET /jobs/` | `POST /jobs/`
- `POST /ai/generate-roadmap` | `POST /ai/build-resume`
- `POST /ai/score-resume` | `POST /ai/skill-gap`
- `POST /ai/salary-insights` | `POST /ai/govt-jobs`
- `POST /ai/scholarships` | `POST /ai/mock-interview`
- `POST /feedback/submit` | `DELETE /feedback/account`

---

## 🌐 Deployment

| Service | Platform | Cost |
|---|---|---|
| Frontend | Vercel | Free |
| Backend API | Render | Free |
| Database | SQLite (built-in) / PostgreSQL | Free |
| AI | Google Gemini 1.5 Flash | Free tier |
| Notifications | Twilio WhatsApp + SMS | Free trial ($15 credit) |
| File Storage | Cloudinary | Free tier |

See [Deployment Guide](./DEPLOYMENT.md) for step-by-step hosting instructions.

---

## 📱 WhatsApp Notification Flow

```
Recruiter updates status → notification_service.py → Twilio API → Student receives WhatsApp
Student applies          → notification_service.py → Twilio API → Recruiter receives WhatsApp
New job posted           → find matching students  → Twilio API → Students get WhatsApp
Recruiter sends message  → notification_service.py → Twilio API → Student receives WhatsApp
```

All notifications also appear **in-app** (bell icon). WhatsApp is optional — works without Twilio configured.

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