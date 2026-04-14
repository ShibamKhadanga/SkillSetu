# SkillSetu — System Architecture
## "Kaushal se Rojgar tak"

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│                                                             │
│   ┌──────────────┐          ┌──────────────────────────┐   │
│   │   Student    │          │       Recruiter           │   │
│   │   Browser    │          │       Browser             │   │
│   └──────┬───────┘          └────────────┬─────────────┘   │
│          │                               │                  │
│          └──────────┬────────────────────┘                  │
│                     │                                       │
│            React + Vite Frontend                            │
│            Tailwind CSS (Orange/Cyan theme)                 │
│            Zustand (state) | React Query (data)             │
└─────────────────────────────┬───────────────────────────────┘
                              │ HTTP / REST
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                               │
│                                                             │
│              Python FastAPI (Uvicorn ASGI)                  │
│              Port: 8000                                     │
│                                                             │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐  │
│   │  /auth   │ │ /student │ │/recruiter│ │    /jobs    │  │
│   └──────────┘ └──────────┘ └──────────┘ └─────────────┘  │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐  │
│   │   /ai    │ │/messages │ │  /apps   │ │   /notifs   │  │
│   └──────────┘ └──────────┘ └──────────┘ └─────────────┘  │
│                                                             │
│              JWT Auth Middleware                            │
│              Role Guard (Student / Recruiter)               │
└──────┬──────────────┬───────────────┬───────────────────────┘
       │              │               │
       ▼              ▼               ▼
┌────────────┐ ┌────────────┐ ┌─────────────────────────────┐
│  MongoDB   │ │ Gemini AI  │ │     External Services        │
│  (Beanie)  │ │ (Free API) │ │                             │
│            │ │            │ │  Twilio → WhatsApp + SMS    │
│  Users     │ │ Roadmap    │ │  Gmail SMTP → Email         │
│  Students  │ │ Resume     │ │  Cloudinary → File Storage  │
│  Jobs      │ │ Skills     │ │  Firebase → Google Auth     │
│  Apps      │ │ Interview  │ │                             │
│  Messages  │ └────────────┘ └─────────────────────────────┘
│  Notifs    │
└────────────┘
```

---

## 🔄 Key Data Flows

### 1. Student Registration + AI Skill Extraction
```
Student fills profile
    → POST /student/profile
    → POST /ai/extract-skills
    → Gemini analyzes projects + education
    → Returns skill list
    → Saved to StudentProfile.skills
    → Profile strength recalculated
```

### 2. Job Matching Algorithm
```
Student opens Job Explorer
    → GET /jobs (with student JWT)
    → Backend fetches all active jobs
    → For each job: calculate_match_score(student.skills, job.required_skills)
    → Fuzzy matching + alias resolution (JS == JavaScript)
    → Jobs sorted by match % descending
    → Returned to frontend
```

### 3. One-Click Apply Flow
```
Student clicks "Apply"
    → ApplyModal opens (pre-filled from profile)
    → Student reviews + edits fields
    → POST /jobs/{id}/apply
    → Application saved to DB
    → Job applicants_count++
    → Recruiter notified via:
        → In-app Notification
        → Email (Gmail SMTP)
```

### 4. Recruiter Messages Student → WhatsApp Alert
```
Recruiter sends message
    → POST /messages/send
    → Message saved to DB
    → notify_new_message() called
    → Twilio sends WhatsApp to student's phone
    → Twilio sends SMS to student's phone
    → In-app notification created
    → Student sees badge on Messages icon
```

### 5. AI Resume Generation
```
Student clicks "Generate Resume"
    → POST /ai/generate-resume
    → GeminiService.generate_resume()
    → Gemini writes professional summary
    → Resume data assembled from StudentProfile
    → Returned to frontend (live preview)
    → Student clicks Download
    → POST /student/resume/download
    → ReportLab generates PDF
    → PDF returned as binary response
    → Browser downloads file
```

### 6. Interview Status Update → WhatsApp
```
Recruiter marks application as "interview"
    → PATCH /applications/{id}/status
    → Application.status = "interview"
    → Student notified:
        → In-app notification
        → WhatsApp: "🎉 You've been shortlisted!"
        → SMS alert
```

---

## 🗄️ Database Schema

### Users Collection
```
{
  _id, name, username, email, phone,
  password_hash, role (student|recruiter),
  avatar_url, is_verified, google_uid,
  created_at, updated_at
}
```

### StudentProfiles Collection
```
{
  user_id, bio, location, portfolio_url,
  career_goal, interests[], suggested_role,
  skills[], skill_scores{},
  education[], projects[], achievements[],
  certificates[], uploaded_documents[],
  ai_resume_url, ai_roadmap{},
  profile_strength (0-100),
  github_url, linkedin_url
}
```

### Jobs Collection
```
{
  recruiter_id, company, title, description,
  location, job_type, salary, experience,
  required_skills[], perks,
  is_remote, urgent, deadline,
  is_active, views, applicants_count
}
```

### Applications Collection
```
{
  job_id, student_id, recruiter_id,
  name, email, phone, cover_letter,
  experience, notice_period, resume_url,
  match_score (0-100),
  status (new|reviewing|interview|offered|rejected),
  notes, applied_at, updated_at
}
```

### Messages Collection
```
{
  sender_id, receiver_id,
  conversation_id (sorted "{id1}_{id2}"),
  content, is_read, sent_at
}
```

### Notifications Collection
```
{
  user_id, title, body,
  type (message|application|interview|system),
  is_read, link,
  whatsapp_sent, sms_sent, email_sent,
  created_at
}
```

---

## 🤖 AI Architecture

```
GeminiService (gemini_service.py)
│
├── Primary:  Google Gemini 1.5 Flash (Free — 60 req/min)
├── Fallback: Groq Llama3-8b (Free — 6000 tok/min)
└── Demo:     Static responses (no API key needed)

AI Features:
├── extract_skills()        → NLP skill detection from profile
├── generate_roadmap()      → Phase-based career path
├── generate_resume()       → Professional summary writing
├── evaluate_interview()    → Answer scoring + feedback
├── generate_job_desc()     → Job description writing
├── analyze_skill_gap()     → Missing skills + resources
└── suggest_job_roles()     → Best-fit role recommendations
```

---

## 🔐 Security

- **JWT tokens** — HS256, 7-day expiry
- **bcrypt** — password hashing (12 rounds)
- **Firebase** — Google OAuth token verification
- **Role guards** — student/recruiter route separation
- **CORS** — whitelist of allowed origins
- **Rate limiting** — via fastapi-limiter (Redis)
- **File validation** — type + size checks before Cloudinary upload

---

## 📦 Tech Stack Summary

| Layer | Technology | Version |
|---|---|---|
| Frontend | React | 18.3 |
| Build Tool | Vite | 5.3 |
| Styling | Tailwind CSS | 3.4 |
| State | Zustand | 4.5 |
| Data Fetching | TanStack Query | 5.x |
| Backend | Python FastAPI | 0.111 |
| ASGI Server | Uvicorn | 0.30 |
| Database | MongoDB + Beanie ODM | 7.x |
| Auth | JWT + Firebase | - |
| AI (Primary) | Google Gemini 1.5 Flash | Free |
| AI (Fallback) | Groq Llama3 | Free |
| File Storage | Cloudinary | Free |
| Notifications | Twilio (WhatsApp + SMS) | - |
| Email | Gmail SMTP | - |
| PDF Generation | ReportLab | 4.2 |
| Containerization | Docker + Docker Compose | - |

---

*SkillSetu — Built for Smart India Hackathon 2024*
*Kaushal se Rojgar tak 🌉*
