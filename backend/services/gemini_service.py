"""
GeminiService — Core AI brain of SkillSetu
Uses Google Gemini 1.5 Flash (free tier) for all AI features.
Falls back to Groq (Llama3) if Gemini fails.

✅ UNIVERSAL — Works for ALL fields:
   CS/IT, Business, Finance, Civil/Mechanical Engineering,
   Medicine, Law, Arts, Writing, Teaching, Agriculture, and more.
"""

import json
import logging
import re
from typing import List, Optional, Dict, Any

from config.settings import settings

logger = logging.getLogger(__name__)

# =====================================================
# UNIVERSAL DEMO DATA — All fields, not just CS/IT
# =====================================================
DEMO_SKILLS = [
    "Communication", "Problem Solving", "Team Collaboration",
    "Microsoft Office", "Research", "Time Management",
]

DEMO_ROADMAP = {
    "goal": "Your Dream Career",
    "totalSteps": 8,
    "phases": [
        {
            "phase": 1,
            "title": "Foundation",
            "status": "in-progress",
            "steps": [
                {
                    "id": 1,
                    "title": "Core Subject Fundamentals",
                    "type": "course",
                    "platform": "NPTEL / YouTube",
                    "link": "https://nptel.ac.in",
                    "duration": "4 weeks",
                    "status": "in-progress",
                    "free": True
                },
                {
                    "id": 2,
                    "title": "Industry Overview & Trends",
                    "type": "course",
                    "platform": "Coursera (Audit Free)",
                    "link": "https://coursera.org",
                    "duration": "2 weeks",
                    "status": "pending",
                    "free": True
                },
            ],
        },
        {
            "phase": 2,
            "title": "Skill Development",
            "status": "locked",
            "steps": [
                {
                    "id": 3,
                    "title": "Practical Skill Training",
                    "type": "course",
                    "platform": "Skill India / PMKVY",
                    "link": "https://skillindia.gov.in",
                    "duration": "6 weeks",
                    "status": "pending",
                    "free": True
                },
                {
                    "id": 4,
                    "title": "Build a Portfolio Project",
                    "type": "project",
                    "platform": "Self",
                    "duration": "3 weeks",
                    "status": "pending",
                    "free": True
                },
            ],
        },
        {
            "phase": 3,
            "title": "Certification & Degree",
            "status": "locked",
            "steps": [
                {
                    "id": 5,
                    "title": "Relevant Degree Program",
                    "type": "degree",
                    "exam": "CUET / State Entrance / Professional Exam",
                    "duration": "3-4 years",
                    "status": "pending",
                    "free": False
                },
                {
                    "id": 6,
                    "title": "Industry Certification",
                    "type": "certification",
                    "platform": "Govt. / Industry Body",
                    "duration": "1-3 months",
                    "status": "pending",
                    "free": False
                },
            ],
        },
        {
            "phase": 4,
            "title": "Job Ready",
            "status": "locked",
            "steps": [
                {
                    "id": 7,
                    "title": "Internship / Apprenticeship",
                    "type": "internship",
                    "platform": "LinkedIn / Internshala",
                    "link": "https://internshala.com",
                    "duration": "3-6 months",
                    "status": "pending",
                    "free": True
                },
                {
                    "id": 8,
                    "title": "Apply & Get Placed",
                    "type": "job",
                    "platform": "SkillSetu",
                    "link": "https://skillsetu.in/jobs",
                    "duration": "Ongoing",
                    "status": "pending",
                    "free": True
                },
            ],
        },
    ],
}


class GeminiService:
    """All AI features powered by Google Gemini 1.5 Flash (free tier)."""

    def __init__(self):
        self.model = None
        self.groq_client = None
        self._init_models()

    def _init_models(self):
        if settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
                logger.info("✅ Gemini AI ready")
            except Exception as e:
                logger.warning(f"Gemini init failed: {e}")

        if settings.GROQ_API_KEY:
            try:
                from groq import Groq
                self.groq_client = Groq(api_key=settings.GROQ_API_KEY)
                logger.info("✅ Groq AI ready (fallback)")
            except Exception as e:
                logger.warning(f"Groq init failed: {e}")

    async def _call_ai(self, prompt: str, json_mode: bool = False) -> str:
        if self.model:
            try:
                response = self.model.generate_content(prompt)
                return response.text
            except Exception as e:
                logger.warning(f"Gemini call failed: {e}")

        if self.groq_client:
            try:
                response = self.groq_client.chat.completions.create(
                    model=settings.GROQ_MODEL,
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=2000,
                )
                return response.choices[0].message.content
            except Exception as e:
                logger.warning(f"Groq call failed: {e}")

        return None

    def _parse_json(self, text: str) -> Optional[Any]:
        if not text:
            return None
        try:
            clean = re.sub(r"```(?:json)?", "", text).strip().strip("`").strip()
            return json.loads(clean)
        except json.JSONDecodeError:
            match = re.search(r'\{.*\}|\[.*\]', text, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group())
                except Exception:
                    pass
        return None

    # ===================================================================
    # 1. SKILL EXTRACTION — Universal for ALL fields
    # ===================================================================
    async def extract_skills(
        self,
        projects: List[dict],
        education: List[dict],
        achievements: List[str],
        certificates: List[str],
    ) -> List[str]:

        prompt = f"""
You are a professional HR AI and career skills analyst for ALL industries — not just tech.
This includes: IT, Business, Finance, Civil Engineering, Medicine, Law, Teaching,
Writing, Arts, Agriculture, Hospitality, Fashion, Trading, Accounting, and more.

Analyze this student profile and extract ALL relevant skills:

PROJECTS: {json.dumps(projects, indent=2)}
EDUCATION: {json.dumps(education, indent=2)}
ACHIEVEMENTS: {json.dumps(achievements, indent=2)}
CERTIFICATES: {json.dumps(certificates, indent=2)}

Instructions:
- Extract technical skills relevant to their field (tools, software, methods, techniques)
- Extract soft skills (communication, leadership, teamwork, problem-solving)
- Extract domain knowledge (e.g., financial analysis, structural design, content writing)
- Infer skills from context — don't limit to CS/IT only
- Return ONLY a JSON array of skill strings, no duplicates
- Max 20 skills, sorted by relevance

Examples by field:
- Writer: ["Content Writing", "SEO", "Research", "Editing", "WordPress", "Storytelling"]
- Civil Eng: ["AutoCAD", "Structural Analysis", "Project Management", "Site Supervision"]
- Finance: ["Financial Modeling", "Excel", "Tally", "GST Filing", "Accounting", "Taxation"]
- Teacher: ["Curriculum Design", "Classroom Management", "EdTech", "Assessment"]
- Doctor: ["Patient Care", "Clinical Diagnosis", "Medical Research", "MBBS"]

Return ONLY the JSON array:
"""
        response = await self._call_ai(prompt)
        parsed = self._parse_json(response)
        if isinstance(parsed, list):
            return [str(s).strip() for s in parsed if s][:20]
        return DEMO_SKILLS

    # ===================================================================
    # 2. CAREER ROADMAP — Universal for ALL fields & careers
    # ===================================================================
    async def generate_roadmap(
        self,
        goal: str,
        current_skills: List[str],
        education: List[dict],
    ) -> dict:

        prompt = f"""
You are a career counselor AI for the INDIAN job market covering ALL fields and industries.
You help students from every background — CS/IT, Business, Civil Engineering, Medicine,
Law, Arts, Writing, Teaching, Finance, Agriculture, Fashion, Hospitality, and more.

DREAM CAREER / GOAL: {goal}
CURRENT SKILLS: {', '.join(current_skills) if current_skills else 'Beginner / No skills yet'}
EDUCATION: {json.dumps(education)}

Generate a realistic, actionable career roadmap with 3-4 phases. Each phase should have 2-3 steps.

For each step include:
- title: What to learn/do (specific to their field, NOT generic CS/IT)
- type: "course" | "project" | "degree" | "certification" | "exam" | "internship" | "license"
- platform: Where to learn — prefer FREE Indian platforms:
  * NPTEL (nptel.ac.in) for engineering/science
  * Skill India / PMKVY for vocational
  * ICAI/ICSI for CA/CS
  * Bar Council resources for law
  * NMC guidelines for medicine
  * FreeCodeCamp / YouTube for tech
  * Coursera audit mode (free) for all
  * Internshala for internships
  * Government portals for govt exams
- link: Actual URL of the platform
- duration: Realistic time estimate
- status: "pending"
- free: true/false
- exam: (if applicable — UPSC, GATE, JEE, NEET, CA Foundation, Bar Exam, CUET, etc.)

Field-specific guidance:
- Writer/Journalist: Portfolio, publications, internships at media houses
- Business/MBA: BBA/MBA, internships, case competitions
- Civil/Mechanical Eng: B.Tech + GATE, AutoCAD, site experience
- Doctor/MBBS: NEET, MBBS, residency, specialization
- CA/Accountant: CA Foundation → Intermediate → Final, Tally, GST
- Lawyer: LLB, Bar Exam, internship at law firms
- Teacher: B.Ed, CTET/TET, subject mastery
- Farmer/Agriculture: ICAR programs, modern farming tech, govt schemes
- Fashion Designer: NIFT entrance, portfolio, internship
- Chef: Culinary school, FSSAI, kitchen internship
- Content Creator: Portfolio, YouTube, social media, brand deals

Return ONLY this JSON structure (no explanation):
{{
  "goal": "{goal}",
  "totalSteps": <total number of all steps>,
  "phases": [
    {{
      "phase": 1,
      "title": "Phase Title",
      "status": "in-progress",
      "steps": [
        {{
          "id": 1,
          "title": "Step title",
          "type": "course|project|degree|certification|exam|internship",
          "platform": "Platform Name",
          "link": "https://...",
          "duration": "X weeks/months",
          "status": "pending",
          "free": true,
          "exam": "Optional exam name"
        }}
      ]
    }}
  ]
}}
"""
        response = await self._call_ai(prompt)
        parsed = self._parse_json(response)
        if isinstance(parsed, dict) and "phases" in parsed:
            return parsed
        demo = DEMO_ROADMAP.copy()
        demo["goal"] = goal
        return demo

    # ===================================================================
    # 3. RESUME BUILDER — Universal for ALL fields
    # ===================================================================
    async def build_resume(self, user, profile, target_role: str = None) -> dict:

        prompt = f"""
You are a professional resume writer for ALL industries in India — not just tech.
Write an ATS-optimized professional summary for this candidate.

Name: {user.name}
Target Role: {target_role or profile.suggested_role or 'Professional'}
Field/Industry: Detect from their profile
Skills: {', '.join(profile.skills or [])}
Education: {json.dumps(profile.education or [])}
Projects/Work: {json.dumps(profile.projects or [])}
Achievements: {json.dumps(profile.achievements or [])}
Certificates: {json.dumps(profile.certificates or [])}
Career Goal: {profile.career_goal or 'Career growth in my field'}

Write a 3-4 sentence professional summary that:
1. States who they are and their field (NOT always "software developer")
2. Highlights their top 2-3 relevant skills for their actual field
3. Mentions their strongest achievement or project
4. States their career goal

Examples:
- For writer: "Creative content writer with expertise in SEO and digital marketing..."
- For CA student: "Aspiring Chartered Accountant with strong foundation in financial analysis..."
- For civil engineer: "Civil engineering graduate with hands-on AutoCAD and structural design experience..."
- For teacher: "Passionate educator with B.Ed qualification and CTET certification..."

Return ONLY the summary paragraph text (no labels, no JSON):
"""
        response = await self._call_ai(prompt)
        summary_text = response if response else (
            f"Dedicated professional with expertise in {', '.join((profile.skills or [])[:3]) or 'my field'}. "
            f"Passionate about {profile.career_goal or 'delivering excellence'} with a strong foundation "
            f"in {profile.education[0].get('degree', 'relevant education') if profile.education else 'my domain'}."
        )

        return {
            "name": user.name,
            "target_role": target_role or profile.suggested_role or "Professional",
            "email": user.email,
            "phone": user.phone,
            "location": profile.location,
            "portfolio_url": profile.portfolio_url,
            "linkedin_url": profile.linkedin_url,
            "github_url": profile.github_url,
            "summary": summary_text.strip(),
            "skills": profile.skills,
            "education": profile.education,
            "projects": profile.projects,
            "achievements": [a for a in profile.achievements if a],
            "certificates": profile.certificates,
        }

    # ===================================================================
    # 4. MOCK INTERVIEW — Universal for ALL roles
    # ===================================================================
    async def evaluate_interview_answer(
        self,
        role: str,
        answer: str,
        question_index: int,
        history: List[dict],
    ) -> dict:

        # Universal questions that work for ANY field
        UNIVERSAL_QUESTIONS = [
            "Tell me about yourself and your background.",
            "What are your key skills and how have you applied them?",
            "Describe your most significant project or achievement.",
            "What challenges have you faced in your work/studies and how did you overcome them?",
            "Where do you see yourself in 5 years in this field?",
        ]

        # Field-specific question sets
        FIELD_QUESTIONS = {
            "software": [
                "Tell me about yourself and your technical background.",
                "Explain a complex technical problem you solved recently.",
                "How do you approach debugging a critical production issue?",
                "Describe your experience with system design.",
                "What's your approach to writing clean, maintainable code?",
            ],
            "finance": [
                "Tell me about yourself and your finance background.",
                "How do you analyze a company's financial health?",
                "Explain a financial model or analysis you've built.",
                "How do you stay updated with market trends?",
                "Describe a time you identified a financial risk.",
            ],
            "teaching": [
                "Tell me about yourself and your teaching philosophy.",
                "How do you handle a classroom with diverse learning abilities?",
                "Describe your most successful lesson plan.",
                "How do you assess student progress effectively?",
                "How do you incorporate technology in your teaching?",
            ],
            "writing": [
                "Tell me about yourself and your writing background.",
                "Walk me through your content creation process.",
                "How do you research and verify information for articles?",
                "Describe your most successful piece of content and why it worked.",
                "How do you handle tight deadlines and multiple projects?",
            ],
            "engineering": [
                "Tell me about yourself and your engineering background.",
                "Describe a complex engineering problem you solved.",
                "How do you ensure quality and safety in your work?",
                "Explain your experience with relevant tools and software.",
                "How do you handle project delays and resource constraints?",
            ],
            "business": [
                "Tell me about yourself and your business background.",
                "Describe a business problem you identified and solved.",
                "How do you approach market analysis?",
                "Tell me about a time you led a team project.",
                "How do you handle conflicts within a team?",
            ],
            "medical": [
                "Tell me about yourself and your medical background.",
                "How do you approach patient diagnosis?",
                "Describe a challenging patient case you handled.",
                "How do you stay updated with medical research?",
                "How do you handle high-pressure emergency situations?",
            ],
        }

        # Detect field from role name
        role_lower = role.lower()
        if any(k in role_lower for k in ["software", "developer", "programmer", "data", "ai", "ml", "tech", "it", "cyber"]):
            questions = FIELD_QUESTIONS["software"]
        elif any(k in role_lower for k in ["finance", "account", "ca ", "banker", "trading", "invest", "tax", "audit"]):
            questions = FIELD_QUESTIONS["finance"]
        elif any(k in role_lower for k in ["teach", "educat", "professor", "lecturer", "tutor", "faculty"]):
            questions = FIELD_QUESTIONS["teaching"]
        elif any(k in role_lower for k in ["write", "writer", "content", "journal", "editor", "blog", "media"]):
            questions = FIELD_QUESTIONS["writing"]
        elif any(k in role_lower for k in ["civil", "mechanical", "electrical", "structural", "architect", "engineer"]):
            questions = FIELD_QUESTIONS["engineering"]
        elif any(k in role_lower for k in ["business", "manager", "mba", "marketing", "sales", "hr", "admin"]):
            questions = FIELD_QUESTIONS["business"]
        elif any(k in role_lower for k in ["doctor", "medical", "nurse", "mbbs", "pharma", "health", "clinical"]):
            questions = FIELD_QUESTIONS["medical"]
        else:
            questions = UNIVERSAL_QUESTIONS

        is_last = question_index >= len(questions) - 1
        current_q = questions[question_index] if question_index < len(questions) else "What are your greatest strengths?"
        next_q = questions[question_index + 1] if question_index + 1 < len(questions) else "What questions do you have for us?"

        if is_last:
            instruction_line = "4. A final overall score out of 100 and a brief overall performance summary"
            json_extra_field = '"final_score": <number 1-100>, "summary": "Overall performance summary here"'
        else:
            instruction_line = f"4. The next interview question to ask the candidate"
            json_extra_field = f'"next_question": "{next_q}"'

        prompt = f"""
You are an experienced interviewer for the role of: {role}
This could be in ANY industry — tech, finance, teaching, writing, engineering, medicine, law, etc.

Current question ({question_index + 1}/{len(questions)}):
"{current_q}"

Candidate's answer:
"{answer}"

Evaluate the answer and provide:
1. Specific, constructive feedback (2-3 sentences) relevant to the {role} field
2. A score out of 10
3. One key improvement tip specific to this industry/role
{instruction_line}

Return ONLY this JSON (no explanation, no markdown):
{{
  "feedback": "Your feedback here...",
  "score": <number 1-10>,
  "tip": "Key improvement tip for {role}",
  {json_extra_field}
}}
"""
        response = await self._call_ai(prompt)
        parsed = self._parse_json(response)

        if parsed:
            return parsed

        demo = {
            "feedback": f"Good answer! You showed understanding of the {role} field. Consider adding specific examples with measurable outcomes to strengthen your response.",
            "score": 7,
            "tip": "Use the STAR method (Situation, Task, Action, Result) to structure your answers with concrete examples.",
        }
        if is_last:
            demo["final_score"] = 72
            demo["summary"] = f"Good overall performance for a {role} role! You demonstrated solid domain knowledge. Focus on adding specific quantifiable results and industry-specific examples."
        else:
            demo["next_question"] = next_q
        return demo

    # ===================================================================
    # 5. JOB DESCRIPTION — Universal for ALL fields
    # ===================================================================
    async def generate_job_description(
        self,
        title: str,
        company: Optional[str],
        skills: List[str],
    ) -> str:

        prompt = f"""
Write a professional, engaging job description for this role in India.
This could be ANY field — not just tech.

Title: {title}
Company: {company or 'Our Organization'}
Required Skills/Qualifications: {', '.join(skills) if skills else 'As per role requirements'}

Include:
- 2 sentence overview of the role and organization
- 4-5 key responsibilities (bullet points specific to this role/field)
- Required qualifications and skills
- What makes this opportunity exciting for Indian candidates
- Growth opportunities

Keep it professional (200-250 words). Suitable for Indian job market.
Do NOT default to software/tech responsibilities unless this is actually a tech role.
Return ONLY the job description text:
"""
        response = await self._call_ai(prompt)
        if response:
            return response.strip()

        return (
            f"We are looking for a talented {title} to join our growing team at {company or 'our organization'}. "
            f"You will contribute to exciting work using {', '.join(skills[:3]) if skills else 'your expertise'}.\n\n"
            f"Key Responsibilities:\n"
            f"• Deliver high-quality work in line with organizational goals\n"
            f"• Collaborate with cross-functional teams\n"
            f"• Continuously improve processes and outcomes\n"
            f"• Stay updated with industry best practices\n"
            f"• Contribute to team growth and knowledge sharing"
        )

    # ===================================================================
    # 6. SKILL GAP ANALYSIS — Universal for ALL fields
    # ===================================================================
    async def analyze_skill_gap(
        self,
        user_skills: List[str],
        job_skills: List[str],
        missing: List[str],
    ) -> List[dict]:

        if not missing:
            return []

        prompt = f"""
A candidate wants a job requiring: {', '.join(job_skills)}
They currently have: {', '.join(user_skills)}
They are MISSING: {', '.join(missing)}

This could be any field — tech, finance, civil engineering, writing, teaching, medicine, etc.

For each missing skill, recommend the BEST FREE or low-cost resource to learn it.
Prefer Indian platforms: NPTEL, Skill India, PMKVY, ICAI, YouTube, Coursera (audit mode).

Return ONLY a JSON array:
[
  {{
    "skill": "skill name",
    "priority": "high|medium|low",
    "time_to_learn": "X weeks/months",
    "resource": "Platform Name",
    "link": "https://...",
    "free": true
  }}
]
"""
        response = await self._call_ai(prompt)
        parsed = self._parse_json(response)
        if isinstance(parsed, list):
            return parsed

        return [
            {
                "skill": skill,
                "priority": "high",
                "time_to_learn": "2-4 weeks",
                "resource": "NPTEL / YouTube",
                "link": "https://nptel.ac.in",
                "free": True,
            }
            for skill in missing[:5]
        ]

    # ===================================================================
    # 7. SUGGEST JOB ROLES — Universal for ALL fields
    # ===================================================================
    async def suggest_job_roles(
        self,
        skills: List[str],
        education: List[dict],
        interests: List[str],
    ) -> List[str]:

        prompt = f"""
Based on this student profile, suggest the top 5 best-fit job roles in India.
Consider ALL industries — not just tech/IT.

SKILLS: {', '.join(skills) if skills else 'Not specified'}
INTERESTS: {', '.join(interests) if interests else 'Open to all fields'}
EDUCATION: {json.dumps(education)}

Examples by field:
- If skills include "writing, SEO" → ["Content Writer", "SEO Analyst", "Journalist", "Copywriter", "Social Media Manager"]
- If education is B.Com → ["Accountant", "Financial Analyst", "Tax Consultant", "CA Aspirant", "Business Analyst"]
- If skills include "AutoCAD, structural" → ["Civil Engineer", "Structural Engineer", "Site Engineer", "Project Manager"]
- If interests include "teaching" → ["School Teacher", "Online Educator", "Curriculum Designer", "Education Consultant"]
- If skills include "cooking, FSSAI" → ["Chef", "Food Consultant", "Catering Manager", "Restaurant Manager"]

Return ONLY a JSON array of 5 role titles that match their actual profile:
["Role 1", "Role 2", "Role 3", "Role 4", "Role 5"]
"""
        response = await self._call_ai(prompt)
        parsed = self._parse_json(response)
        if isinstance(parsed, list):
            return parsed[:5]

        return ["Professional", "Analyst", "Consultant", "Specialist", "Coordinator"]

    # ===================================================================
    # 8. NEW — RESUME SCORE CHECKER
    # ===================================================================
    async def score_resume(self, resume_text: str, target_role: str) -> dict:
        """Score an existing resume out of 100 with improvement tips."""

        prompt = f"""
You are a professional resume reviewer for the Indian job market, covering ALL fields.
Review this resume for a {target_role} position.

RESUME TEXT:
{resume_text[:3000]}

Score the resume out of 100 across these categories:
1. Content & Relevance (25 points) — Is content relevant to the target role?
2. Formatting & Structure (20 points) — Is it well-organized and readable?
3. Skills Match (25 points) — Does it highlight the right skills for {target_role}?
4. Achievements & Impact (20 points) — Are achievements quantified?
5. Language & Clarity (10 points) — Is it clear and professional?

Return ONLY this JSON:
{{
  "total_score": <0-100>,
  "breakdown": {{
    "content": <0-25>,
    "formatting": <0-20>,
    "skills": <0-25>,
    "achievements": <0-20>,
    "language": <0-10>
  }},
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "verdict": "Excellent|Good|Average|Needs Work"
}}
"""
        response = await self._call_ai(prompt)
        parsed = self._parse_json(response)
        if parsed:
            return parsed

        return {
            "total_score": 65,
            "breakdown": {"content": 16, "formatting": 14, "skills": 16, "achievements": 13, "language": 6},
            "strengths": ["Clear structure", "Relevant skills listed", "Good education section"],
            "improvements": ["Add quantifiable achievements", "Tailor to specific job", "Add a strong summary"],
            "verdict": "Good"
        }

    # ===================================================================
    # 9. NEW — SALARY INSIGHTS
    # ===================================================================
    async def get_salary_insights(self, role: str, location: str, experience: str) -> dict:
        """Get salary insights for a role in India."""

        prompt = f"""
Provide realistic salary insights for the Indian job market.

Role: {role}
Location: {location or 'India (General)'}
Experience Level: {experience or 'Fresher'}

Return ONLY this JSON:
{{
  "role": "{role}",
  "location": "{location or 'India'}",
  "fresher": "₹X - ₹Y LPA",
  "mid_level": "₹X - ₹Y LPA",
  "senior": "₹X - ₹Y LPA",
  "top_companies": ["Company 1", "Company 2", "Company 3"],
  "top_cities": ["City 1", "City 2", "City 3"],
  "growth_trend": "Growing|Stable|Declining",
  "tip": "One career tip for this role in India"
}}
"""
        response = await self._call_ai(prompt)
        parsed = self._parse_json(response)
        if parsed:
            return parsed

        return {
            "role": role,
            "location": location or "India",
            "fresher": "₹3 - ₹6 LPA",
            "mid_level": "₹6 - ₹12 LPA",
            "senior": "₹12 - ₹25 LPA",
            "top_companies": ["TCS", "Infosys", "Wipro"],
            "top_cities": ["Bangalore", "Mumbai", "Delhi"],
            "growth_trend": "Growing",
            "tip": "Build a strong portfolio and get certified to stand out in this competitive field."
        }

    # ===================================================================
    # 10. NEW — GOVERNMENT JOB FINDER
    # ===================================================================
    async def find_govt_jobs(self, field: str, education: str, state: str) -> dict:
        """Suggest relevant government job opportunities."""

        prompt = f"""
Suggest relevant Indian Government job opportunities for this candidate.

Field/Background: {field}
Education: {education}
State: {state or 'All India'}

Return ONLY this JSON:
{{
  "exams": [
    {{
      "name": "Exam Name",
      "body": "Conducting Body",
      "eligibility": "Qualification required",
      "posts": "Types of posts",
      "link": "https://official-website.gov.in",
      "frequency": "Annual/Twice a year/etc"
    }}
  ],
  "tip": "Key advice for government job preparation"
}}

Include relevant exams like UPSC, SSC, IBPS, Railway, State PSC, GATE, NEET, TET, CTET, etc.
Only suggest exams relevant to their field and education.
"""
        response = await self._call_ai(prompt)
        parsed = self._parse_json(response)
        if parsed:
            return parsed

        return {
            "exams": [
                {
                    "name": "SSC CGL",
                    "body": "Staff Selection Commission",
                    "eligibility": "Graduate in any stream",
                    "posts": "Assistant, Inspector, Auditor",
                    "link": "https://ssc.nic.in",
                    "frequency": "Annual"
                }
            ],
            "tip": "Start with SSC and State PSC exams while preparing for field-specific exams."
        }


# Singleton instance
gemini_service = GeminiService()