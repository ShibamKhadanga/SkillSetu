# SkillSetu API Documentation

Base URL: `http://localhost:8000`
Interactive Docs: `http://localhost:8000/docs`

---

## Authentication

All protected routes require:
```
Authorization: Bearer <jwt_token>
```

---

## 🔐 Auth Endpoints

### POST /auth/register
Register new user.
```json
{
  "name": "Rahul Sharma",
  "username": "rahul_sharma",
  "email": "rahul@example.com",
  "phone": "9876543210",
  "password": "SecurePass123",
  "role": "student"
}
```

### POST /auth/login
```json
{ "email": "rahul@example.com", "password": "SecurePass123" }
```
Response: `{ user, token }`

### POST /auth/google
```json
{ "token": "<firebase_id_token>", "role": "student" }
```

---

## 👨‍🎓 Student Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /student/dashboard | Dashboard stats + job matches |
| GET | /student/profile | Get full profile |
| PUT | /student/profile | Update profile |
| POST | /student/upload-document | Upload certificate/degree |
| POST | /student/resume/download | Generate & download PDF resume |

---

## 🤖 AI Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /ai/extract-skills | Extract skills from profile data |
| POST | /ai/generate-roadmap | Generate career roadmap |
| POST | /ai/generate-resume | Generate resume content |
| POST | /ai/mock-interview | Conduct AI mock interview |
| POST | /ai/skill-gap | Analyze skill gap for a job |
| POST | /ai/suggest-roles | Suggest best job roles |
| POST | /ai/generate-job-description | Generate job description |

### Example: Generate Roadmap
```json
{
  "goal": "Machine Learning Engineer",
  "current_skills": ["Python", "SQL"],
  "education": [{"degree": "B.Tech CS", "institution": "NIT", "year": "2024"}]
}
```

### Example: Mock Interview
```json
{
  "role": "Full Stack Developer",
  "answer": "I have 2 years of experience with React...",
  "question_index": 0,
  "history": []
}
```

---

## 💼 Jobs Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /jobs | List all jobs (with match scores for students) |
| POST | /jobs | Post a new job (recruiter) |
| GET | /jobs/my-jobs | Recruiter's own jobs |
| GET | /jobs/{id}/candidates | Get matched candidates |
| POST | /jobs/{id}/apply | Apply to a job (student) |
| DELETE | /jobs/{id} | Deactivate a job |

### Query Params for GET /jobs
- `search` — search by title, company, skill
- `job_type` — full-time | internship | part-time | contract
- `remote` — true | false
- `page` — page number
- `limit` — items per page (max 100)

---

## 📋 Applications Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /applications/my | Student's applications |
| GET | /applications/job/{job_id} | All apps for a job |
| PATCH | /applications/{id}/status | Update status |

### Status values
`new` → `reviewing` → `interview` → `offered` | `rejected`

---

## 💬 Messages Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /messages/send | Send message |
| GET | /messages/conversations | All conversations |
| GET | /messages/{conversation_id} | Get messages in conversation |

---

## 🔔 Notifications Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /notifications | Get all notifications |
| GET | /notifications/unread-count | Get unread count |
| PATCH | /notifications/read-all | Mark all as read |
| PATCH | /notifications/{id}/read | Mark one as read |

---

## Response Format

All responses follow this format:
```json
{
  "success": true,
  "message": "Success",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "data": null
}
```
