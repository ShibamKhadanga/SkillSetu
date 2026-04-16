# SkillSetu — Kaushal se Rojgar tak 🌉

> **AI-powered career bridge platform connecting Indian students to dream jobs — from learning roadmap to resume to placement, all in one place.**

Built for **Smart India Hackathon (SIH) 2026** | Team from Kalinga University, Raipur

---

## 🚀 What is SkillSetu?

SkillSetu solves the critical problems Indian students face after 10th/12th — **"What should I study? What career path fits me? How do I get hired?"**

| Problem | SkillSetu Solution |
|---|---|
| Don't know what to study after 10th/12th | Interactive Career Roadmap — visual education flowchart with every Indian stream, degree, exam & job role |
| Can't figure out skill gaps | AI Skill Gap Analyzer — compare your skills vs job requirements instantly |
| Can't make a good resume | AI Resume Builder — one click, ATS-optimized PDF with 4 templates |
| Waste hours on applications | One-Click Apply — AI auto-fills every form field |
| No idea about salaries | AI Salary Insights — real data for any role, city & experience level |
| Miss government job deadlines | Govt Job Finder — AI finds matching exams (SSC, UPSC, IBPS, etc.) |
| Miss opportunities | WhatsApp + SMS alerts the moment a recruiter contacts them |

Recruiters face the opposite — too many unqualified applications. SkillSetu's AI ranks ALL students by match score instantly.

---

## ✨ Features

### 👨‍🎓 Student / Candidate

| Feature | Description |
|---|---|
| 🗺️ **Career Roadmap** | 3-tab comprehensive career guidance system (see details below) |
| 📊 **AI Skill Gap Analyzer** | Select any job → AI compares your skills vs requirements → shows matched, missing & learning resources |
| 🏛️ **Govt Job Finder** | Enter field + education + state → AI finds matching govt exams (UPSC, SSC, IBPS, Railway, State PSC) |
| 💰 **Salary Insights** | Enter any role → AI shows fresher/mid/senior salary, top companies, top cities, market trend |
| 📄 **AI Resume Builder** | One click → professional ATS-optimized resume → center-aligned header → downloadable PDF (4 templates) |
| 📊 **Resume Score Checker** | Upload PDF/TXT or paste text → AI scores resume (content, structure, skills, achievements) → improvement tips |
| 🤖 **AI Skill Extractor** | Upload certificates, projects, degrees → AI detects hidden skills automatically |
| 💼 **Job Explorer** | All jobs ranked by AI match score (0–100%) based on your skills |
| ⚡ **One-Click Apply** | AI pre-fills every application field → review → send |
| 📋 **Application Tracker** | Track all applications — Applied, Reviewing, Interview, Offered, Rejected |
| 🎤 **AI Mock Interview** | Chat-based AI interviewer → scored out of 10 per answer → final score out of 100 |
| 🌐 **Public Portfolio** | Auto-generated shareable profile page like a personal LinkedIn |
| 📱 **WhatsApp + SMS Alerts** | Instant alerts when recruiters contact you or new matching jobs are posted |
| 💬 **In-Platform Messaging** | Chat directly with recruiters inside SkillSetu |
| ⭐ **Rate SkillSetu** | Submit feedback with star rating — public reviews shown on landing page |
| 🗑️ **Delete Account** | Permanently delete account and all data from settings |

### 🗺️ Career Roadmap — Deep Dive

The Career Roadmap has **3 interactive tabs**:

#### Tab 1: Pathway Explorer (Tree View)
- Expandable tree: **10th → 12th (Science PCM/PCB / Commerce / Arts) / ITI / Diploma**
- Each node shows: duration, entrance exams, available courses
- **Interactive subject chips** — click "PCM" to filter and show only PCM-relevant children
- **"I am here" marker (📍)** — mark your current position in the tree
- Degree paths covered:
  - **Science PCM**: B.Tech, B.Sc, NDA, **BCA → MCA**
  - **Science PCB**: MBBS, BDS, **B.Pharm / D.Pharm**, **B.Sc Nursing**, **BPT (Physiotherapy)**, B.Sc (Agri/Bio/Biotech), B.V.Sc
  - **Commerce**: B.Com, CA, CS, BBA → MBA, CMA
  - **Arts**: BA → MA, UPSC Civil Services, BA LLB, B.Des / Fine Arts, B.Ed, BSW
  - **Diploma**: Lateral Entry → B.Tech (2nd Year), Govt Junior Engineer
  - **ITI**: Apprenticeship, Railway Technician, Govt Technical Posts
- Terminal nodes show **job roles with salary ranges**

#### Tab 2: Flowchart (Horizontal Step-by-Step)
- **Left-to-right horizontal flow** — visually traces your path
- Uses the **same unified data** as Pathway Explorer (PATHWAY_TREE)
- Click nodes to select → siblings dim → next level appears to the right
- Interactive course chips with collapse/change behavior
- Career outcomes panel appears at the end of your selected path
- Breadcrumb trail shows your complete path

#### Tab 3: AI Phases (Personalized Roadmap)
- Enter your dream job role → AI generates a **phase-by-phase learning path**
- Includes: Indian exams (JEE, GATE, CUET, NEET), NPTEL courses, FreeCodeCamp, YouTube channels
- Personalized based on your profile skills

### 🏢 Recruiter / Company

| Feature | Description |
|---|---|
| 📝 **Post a Job** | Fill requirements → AI auto-writes the job description |
| 🤖 **AI Candidate Matching** | AI instantly ranks ALL students by match % for your job |
| 📣 **Auto-Notify on Post** | Platform automatically sends WhatsApp alerts to all matching students (70%+ match) |
| 👥 **Candidate Dashboard** | View shortlisted candidates with full resume + portfolio |
| 📋 **Application Manager** | Filter by job post → update status → candidates auto-notified |
| 💬 **In-Platform Messaging** | Message candidates directly |
| 📈 **Analytics Dashboard** | Job views, application trends, hiring funnel, top skills |

---

## 🤖 AI Features (All Free APIs)

| AI Feature | Technology |
|---|---|
| Career Roadmap Generation | Google Gemini 1.5 Flash (free) |
| Resume Writing | Google Gemini 1.5 Flash (free) |
| Resume Scoring & Analysis | Google Gemini 1.5 Flash (free) |
| Skill Extraction from Documents | Google Gemini 1.5 Flash (free) |
| Skill Gap Analysis | Google Gemini 1.5 Flash (free) |
| Mock Interview & Scoring | Google Gemini 1.5 Flash (free) |
| Job Description Generation | Google Gemini 1.5 Flash (free) |
| Salary Insights | Google Gemini 1.5 Flash (free) |
| Government Job Finder | Google Gemini 1.5 Flash (free) |
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
- Horizontal scrollable flowchart with interactive chip selection
- Collapsible tree nodes with depth-based indentation

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
| 👨‍🎓 CA Student | `ananya@demo.com` | Career Roadmap → Commerce path → CA route |
| 👩‍⚕️ MBBS Student | `kavitha@demo.com` | Career Roadmap → Science PCB → MBBS / D.Pharm / Nursing |
| ⚖️ Law Student | `meera@demo.com` | Career Roadmap → Arts → CLAT → Legal careers |
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
│   │   ├── ai_routes.py         # Roadmap, Resume, SkillGap, Salary, GovtJobs, Interview
│   │   ├── message_routes.py
│   │   ├── notification_routes.py
│   │   └── feedback_routes.py
│   ├── services/
│   │   ├── gemini_service.py    # All AI prompt engineering (Gemini 1.5 Flash)
│   │   ├── matching_service.py  # Fuzzy skill-job matching algorithm
│   │   └── resume_service.py    # PDF generation with ReportLab
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
│       │   ├── Landing.jsx       # Public homepage with reviews
│       │   ├── auth/             # Login, Register
│       │   ├── student/
│       │   │   ├── StudentDashboard.jsx
│       │   │   ├── StudentProfile.jsx
│       │   │   ├── Roadmap.jsx          # Pathway Explorer + Flowchart + AI Phases
│       │   │   ├── ResumeBuilder.jsx
│       │   │   ├── ResumeScore.jsx      # Resume checker with upload
│       │   │   ├── SkillGap.jsx         # AI Skill Gap Analyzer
│       │   │   ├── SalaryInsights.jsx   # AI Salary data
│       │   │   ├── GovtJobs.jsx         # Government Job Finder
│       │   │   ├── JobExplorer.jsx
│       │   │   ├── Applications.jsx
│       │   │   ├── MockInterview.jsx
│       │   │   ├── Portfolio.jsx
│       │   │   └── StudentMessages.jsx
│       │   └── recruiter/
│       │       ├── RecruiterDashboard.jsx
│       │       ├── PostJob.jsx
│       │       ├── Candidates.jsx
│       │       ├── RecruiterApplications.jsx
│       │       ├── Analytics.jsx
│       │       └── RecruiterMessages.jsx
│       ├── store/           # Zustand state (auth, theme)
│       └── services/        # Axios API client
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
- `POST /ai/score-resume` — Score and analyze resume
- `POST /ai/skill-gap` — Analyze skill gap for a job
- `POST /ai/salary-insights` — Get salary data for a role
- `POST /ai/govt-jobs` — Find matching government exams
- `POST /ai/mock-interview` — AI mock interview session
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