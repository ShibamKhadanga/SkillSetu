"""
GeminiService — Core AI brain of SkillSetu
Uses Google Gemini 1.5 Flash (free tier) for all AI features.
Falls back to Groq (Llama3) if Gemini fails.
"""

import json
import logging
import re
from typing import List, Optional, Dict, Any

from config.settings import settings

logger = logging.getLogger(__name__)

# ===== DEMO DATA (used when AI keys are not configured) =====
DEMO_SKILLS = [
    "Python", "JavaScript", "React", "Problem Solving",
    "Team Collaboration", "Git", "SQL", "REST APIs",
]

DEMO_ROADMAP = {
    "goal": "Full Stack Developer",
    "totalSteps": 8,
    "phases": [
        {
            "phase": 1,
            "title": "Foundation",
            "status": "in-progress",
            "steps": [
                {"id": 1, "title": "HTML & CSS Mastery", "type": "course", "platform": "FreeCodeCamp",
                 "link": "https://freecodecamp.org", "duration": "2 weeks", "status": "done", "free": True},
                {"id": 2, "title": "JavaScript Fundamentals", "type": "course", "platform": "The Odin Project",
                 "link": "https://theodinproject.com", "duration": "3 weeks", "status": "in-progress", "free": True},
            ],
        },
        {
            "phase": 2,
            "title": "Frontend Development",
            "status": "locked",
            "steps": [
                {"id": 3, "title": "React.js Complete Course", "type": "course", "platform": "Coursera",
                 "link": "https://coursera.org", "duration": "4 weeks", "status": "pending", "free": False},
                {"id": 4, "title": "Build 3 Projects", "type": "project", "platform": "Self",
                 "duration": "2 weeks", "status": "pending", "free": True},
            ],
        },
        {
            "phase": 3,
            "title": "Backend Development",
            "status": "locked",
            "steps": [
                {"id": 5, "title": "Node.js & Express", "type": "course", "platform": "Udemy",
                 "link": "https://udemy.com", "duration": "3 weeks", "status": "pending", "free": False},
                {"id": 6, "title": "MongoDB & Databases", "type": "course", "platform": "MongoDB University",
                 "link": "https://university.mongodb.com", "duration": "2 weeks", "status": "pending", "free": True},
            ],
        },
        {
            "phase": 4,
            "title": "Degree & Certification",
            "status": "locked",
            "steps": [
                {"id": 7, "title": "B.Tech / BCA CS — Recommended Degree", "type": "degree",
                 "exam": "JEE Mains / CUET", "duration": "3-4 years", "status": "pending", "free": False},
                {"id": 8, "title": "AWS Cloud Practitioner", "type": "certification", "platform": "AWS",
                 "link": "https://aws.amazon.com/certification", "duration": "1 month", "status": "pending", "free": False},
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
        """Initialize Gemini and Groq models."""
        # Try Gemini
        if settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
                logger.info("✅ Gemini AI ready")
            except Exception as e:
                logger.warning(f"Gemini init failed: {e}")

        # Try Groq as fallback
        if settings.GROQ_API_KEY:
            try:
                from groq import Groq
                self.groq_client = Groq(api_key=settings.GROQ_API_KEY)
                logger.info("✅ Groq AI ready (fallback)")
            except Exception as e:
                logger.warning(f"Groq init failed: {e}")

    async def _call_ai(self, prompt: str, json_mode: bool = False) -> str:
        """Call AI with Gemini first, fallback to Groq, fallback to demo."""
        # Try Gemini
        if self.model:
            try:
                response = self.model.generate_content(prompt)
                return response.text
            except Exception as e:
                logger.warning(f"Gemini call failed: {e}")

        # Try Groq
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

        # Return None to trigger demo fallback
        return None

    def _parse_json(self, text: str) -> Optional[Any]:
        """Safely parse JSON from AI response."""
        if not text:
            return None
        try:
            # Strip markdown code blocks if present
            clean = re.sub(r"```(?:json)?", "", text).strip().strip("`").strip()
            return json.loads(clean)
        except json.JSONDecodeError:
            # Try to extract JSON from text
            match = re.search(r'\{.*\}|\[.*\]', text, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group())
                except Exception:
                    pass
        return None

    # ===================================================================
    # 1. SKILL EXTRACTION
    # ===================================================================
    async def extract_skills(
        self,
        projects: List[dict],
        education: List[dict],
        achievements: List[str],
        certificates: List[str],
    ) -> List[str]:
        """Extract technical and soft skills from user's profile data."""

        prompt = f"""
You are a professional HR AI and skills analyst. Analyze the following student profile data
and extract ALL relevant technical skills, tools, and soft skills.

PROJECTS:
{json.dumps(projects, indent=2)}

EDUCATION:
{json.dumps(education, indent=2)}

ACHIEVEMENTS:
{json.dumps(achievements, indent=2)}

CERTIFICATES:
{json.dumps(certificates, indent=2)}

Instructions:
- Extract technical skills (programming languages, frameworks, tools, platforms)
- Extract soft skills (leadership, teamwork, communication, etc.)
- Infer skills from project descriptions (e.g., "built a web app" implies HTML/CSS/JS)
- Return ONLY a JSON array of skill strings, no duplicates, no explanation
- Max 20 skills, sorted by relevance

Example output: ["Python", "React", "Machine Learning", "Team Leadership", "Git", "SQL"]

Return ONLY the JSON array:
"""
        response = await self._call_ai(prompt)
        parsed = self._parse_json(response)
        if isinstance(parsed, list):
            return [str(s).strip() for s in parsed if s][:20]
        return DEMO_SKILLS

    # ===================================================================
    # 2. CAREER ROADMAP GENERATION
    # ===================================================================
    async def generate_roadmap(
        self,
        goal: str,
        current_skills: List[str],
        education: List[dict],
    ) -> dict:
        """Generate a personalized career roadmap."""

        prompt = f"""
You are a career counselor AI specialized in Indian tech job market.
Generate a detailed, actionable career roadmap for the following student.

GOAL / DREAM CAREER: {goal}
CURRENT SKILLS: {', '.join(current_skills) if current_skills else 'Beginner'}
EDUCATION: {json.dumps(education)}

Generate a roadmap with 3-4 phases. Each phase should have 2-3 steps.
For each step include:
- title: What to learn/do
- type: "course" | "project" | "degree" | "certification" | "exam"
- platform: Where to learn (FreeCodeCamp, Coursera, Udemy, NPTEL, YouTube, etc.)
- link: URL of the platform
- duration: How long it takes
- status: "pending"
- free: true/false (prefer free resources where possible)
- exam: Only for degree type (e.g., "JEE Mains", "GATE", "CUET")

Also include relevant Indian competitive exams and degree recommendations if applicable.

Return ONLY this JSON structure (no explanation):
{{
  "goal": "{goal}",
  "totalSteps": <number>,
  "phases": [
    {{
      "phase": 1,
      "title": "Phase Title",
      "status": "in-progress",
      "steps": [
        {{
          "id": 1,
          "title": "Step title",
          "type": "course",
          "platform": "Platform name",
          "link": "https://...",
          "duration": "X weeks",
          "status": "pending",
          "free": true
        }}
      ]
    }}
  ]
}}
"""
        response = await self._call_ai(prompt)
        parsed = self._parse_json(response)
        if parsed and "phases" in parsed:
            return parsed
        # Return demo with goal updated
        demo = DEMO_ROADMAP.copy()
        demo["goal"] = goal
        return demo

    # ===================================================================
    # 3. RESUME GENERATION
    # ===================================================================
    async def generate_resume(
        self,
        user,
        profile,
        target_role: Optional[str] = None,
    ) -> dict:
        """Generate professional resume content with AI-written summary."""

        if not profile:
            return {
                "name": user.name,
                "email": user.email,
                "target_role": target_role or "Software Developer",
                "summary": "Passionate and driven professional seeking opportunities to grow.",
                "skills": [],
                "education": [],
                "projects": [],
                "achievements": [],
            }

        prompt = f"""
You are a professional resume writer for the Indian job market.
Write a compelling, ATS-optimized professional summary for this candidate.

NAME: {user.name}
TARGET ROLE: {target_role or profile.suggested_role or 'Software Developer'}
SKILLS: {', '.join(profile.skills)}
EDUCATION: {json.dumps(profile.education)}
PROJECTS: {json.dumps([p.get('name', '') + ': ' + p.get('description', '') for p in profile.projects[:3]])}
ACHIEVEMENTS: {json.dumps(profile.achievements[:5])}

Write a 3-sentence professional summary that:
1. Highlights their strongest skills
2. Mentions their target role specifically
3. Shows passion and impact
4. Is ATS-friendly with relevant keywords

Return ONLY the summary text (no quotes, no explanation):
"""
        summary_text = await self._call_ai(prompt)

        if not summary_text:
            summary_text = (
                f"Passionate {target_role or 'software professional'} with expertise in "
                f"{', '.join(profile.skills[:3]) if profile.skills else 'technology'}. "
                f"Proven track record of building innovative solutions through academic projects "
                f"and hands-on experience. Eager to contribute technical skills and creativity "
                f"to drive meaningful impact."
            )

        return {
            "name": user.name,
            "target_role": target_role or profile.suggested_role or "Software Developer",
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
    # 4. MOCK INTERVIEW
    # ===================================================================
    async def evaluate_interview_answer(
        self,
        role: str,
        answer: str,
        question_index: int,
        history: List[dict],
    ) -> dict:
        """Evaluate interview answer and provide feedback + next question."""

        QUESTIONS = {
            "default": [
                "Tell me about yourself and your background.",
                "What are your key technical skills and how have you used them?",
                "Describe your most challenging project.",
                "Where do you see yourself in 5 years?",
                "Why do you want to work in this field?",
            ]
        }

        questions = QUESTIONS.get(role.lower(), QUESTIONS["default"])
        is_last = question_index >= len(questions) - 1

        # Build these parts separately to avoid backslash-in-fstring error
        current_q = questions[question_index] if question_index < len(questions) else "Tell me about your greatest strength."
        next_q    = questions[question_index + 1] if question_index + 1 < len(questions) else "What questions do you have for us?"

        if is_last:
            instruction_line = "4. A final overall score out of 100 and a brief overall performance summary"
            json_extra_field = '"final_score": <number 1-100>, "summary": "Overall performance summary here"'
        else:
            instruction_line = f"4. The next interview question to ask the candidate"
            json_extra_field = f'"next_question": "{next_q}"'

        prompt = f"""
You are an experienced technical interviewer at a top Indian tech company.
You are interviewing a candidate for the role of: {role}

Current question ({question_index + 1}/{len(questions)}):
"{current_q}"

Candidate's answer:
"{answer}"

Evaluate the answer and provide:
1. Specific, constructive feedback (2-3 sentences)
2. A score out of 10
3. One key improvement tip
{instruction_line}

Return ONLY this JSON (no explanation, no markdown):
{{
  "feedback": "Your feedback here...",
  "score": <number 1-10>,
  "tip": "Key improvement tip",
  {json_extra_field}
}}
"""
        response = await self._call_ai(prompt)
        parsed = self._parse_json(response)

        if parsed:
            return parsed

        # Demo fallback
        demo = {
            "feedback": f"Good answer! You showed understanding of the topic. Consider adding specific examples with measurable outcomes to make your response stronger.",
            "score": 7,
            "tip": "Use the STAR method (Situation, Task, Action, Result) for behavioral questions.",
        }
        if is_last:
            demo["final_score"] = 72
            demo["summary"] = f"Good overall performance for a {role} role! Strong technical knowledge. Work on structuring answers with the STAR method and adding quantifiable results."
        else:
            next_q = questions[question_index + 1] if question_index + 1 < len(questions) else "What are your salary expectations?"
            demo["next_question"] = next_q
        return demo

    # ===================================================================
    # 5. JOB DESCRIPTION GENERATION
    # ===================================================================
    async def generate_job_description(
        self,
        title: str,
        company: Optional[str],
        skills: List[str],
    ) -> str:
        """Generate a professional job description."""

        prompt = f"""
Write a professional, engaging job description for:
Title: {title}
Company: {company or 'Our Company'}
Required Skills: {', '.join(skills) if skills else 'To be determined'}

Include:
- 2 sentence overview of the role
- 4-5 key responsibilities (bullet points)  
- What makes this opportunity exciting
- Mention the skills naturally

Keep it concise (200 words max). Professional Indian tech company tone.
Return ONLY the job description text:
"""
        response = await self._call_ai(prompt)
        if response:
            return response.strip()

        return (
            f"We are looking for a talented {title} to join our growing team at {company or 'our company'}. "
            f"You will work on exciting projects using {', '.join(skills[:3]) if skills else 'modern technologies'}.\n\n"
            f"Responsibilities:\n"
            f"• Design and develop scalable software solutions\n"
            f"• Collaborate with cross-functional teams\n"
            f"• Write clean, maintainable code\n"
            f"• Participate in code reviews and technical discussions\n"
            f"• Stay updated with latest industry trends"
        )

    # ===================================================================
    # 6. SKILL GAP ANALYSIS
    # ===================================================================
    async def analyze_skill_gap(
        self,
        user_skills: List[str],
        job_skills: List[str],
        missing: List[str],
    ) -> List[dict]:
        """Provide recommendations for missing skills."""

        if not missing:
            return []

        prompt = f"""
A student wants to apply for a job requiring: {', '.join(job_skills)}
They currently have: {', '.join(user_skills)}
They are MISSING: {', '.join(missing)}

For each missing skill, recommend the BEST FREE resource to learn it quickly.
Focus on Indian students — prefer NPTEL, FreeCodeCamp, YouTube, Coursera free tier.

Return ONLY a JSON array:
[
  {{
    "skill": "skill name",
    "priority": "high|medium|low",
    "time_to_learn": "X weeks",
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

        # Demo fallback
        return [
            {
                "skill": skill,
                "priority": "high",
                "time_to_learn": "2-3 weeks",
                "resource": "FreeCodeCamp",
                "link": "https://freecodecamp.org",
                "free": True,
            }
            for skill in missing[:5]
        ]

    # ===================================================================
    # 7. SUGGEST JOB ROLES
    # ===================================================================
    async def suggest_job_roles(
        self,
        skills: List[str],
        education: List[dict],
        interests: List[str],
    ) -> List[str]:
        """Suggest best-fit job roles based on profile."""

        prompt = f"""
Based on this student profile, suggest the top 5 best-fit job roles in Indian tech market:

SKILLS: {', '.join(skills)}
INTERESTS: {', '.join(interests) if interests else 'General IT'}
EDUCATION: {json.dumps(education)}

Return ONLY a JSON array of role titles:
["Role 1", "Role 2", "Role 3", "Role 4", "Role 5"]
"""
        response = await self._call_ai(prompt)
        parsed = self._parse_json(response)
        if isinstance(parsed, list):
            return parsed[:5]

        return ["Full Stack Developer", "Software Engineer", "Data Analyst", "Backend Developer", "ML Engineer"]