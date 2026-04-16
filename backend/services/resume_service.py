"""
Resume PDF Generation Service
Generates professional PDF resumes using ReportLab.
"""

import io
import logging
from typing import Optional

logger = logging.getLogger(__name__)


TEMPLATE_COLORS = {
    "modern":   {"primary": (0.98, 0.45, 0.09), "secondary": (0.95, 0.35, 0.05)},  # Orange
    "classic":  {"primary": (0.10, 0.10, 0.20), "secondary": (0.30, 0.30, 0.40)},  # Dark navy
    "minimal":  {"primary": (0.20, 0.20, 0.20), "secondary": (0.50, 0.50, 0.50)},  # Gray
    "creative": {"primary": (0.55, 0.35, 0.97), "secondary": (0.40, 0.20, 0.80)},  # Purple
}


async def generate_resume_pdf(resume_data: dict, template: str = "modern") -> bytes:
    """Generate a professional PDF resume from resume data."""
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib import colors
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import cm, mm
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
        from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=1.5 * cm,
            leftMargin=1.5 * cm,
            topMargin=1.5 * cm,
            bottomMargin=1.5 * cm,
        )

        # Colors from template
        tpl = TEMPLATE_COLORS.get(template, TEMPLATE_COLORS["modern"])
        primary_r, primary_g, primary_b = tpl["primary"]
        primary_color = colors.Color(primary_r, primary_g, primary_b)
        dark_color = colors.Color(0.1, 0.1, 0.2)
        muted_color = colors.Color(0.4, 0.4, 0.5)
        light_bg = colors.Color(0.97, 0.97, 0.99)

        styles = getSampleStyleSheet()

        # Custom styles
        name_style = ParagraphStyle(
            "NameStyle",
            parent=styles["Normal"],
            fontSize=24,
            fontName="Helvetica-Bold",
            textColor=dark_color,
            spaceAfter=6,
            spaceBefore=0,
            leading=28,
            alignment=TA_CENTER,
        )
        role_style = ParagraphStyle(
            "RoleStyle",
            parent=styles["Normal"],
            fontSize=13,
            fontName="Helvetica",
            textColor=primary_color,
            spaceAfter=6,
            spaceBefore=0,
            leading=16,
            alignment=TA_CENTER,
        )
        contact_style = ParagraphStyle(
            "ContactStyle",
            parent=styles["Normal"],
            fontSize=9,
            fontName="Helvetica",
            textColor=muted_color,
            spaceAfter=4,
            leading=13,
            alignment=TA_CENTER,
        )
        section_title_style = ParagraphStyle(
            "SectionTitle",
            parent=styles["Normal"],
            fontSize=11,
            fontName="Helvetica-Bold",
            textColor=primary_color,
            spaceBefore=12,
            spaceAfter=4,
            textTransform="uppercase",
        )
        body_style = ParagraphStyle(
            "BodyStyle",
            parent=styles["Normal"],
            fontSize=9,
            fontName="Helvetica",
            textColor=dark_color,
            spaceAfter=3,
            leading=14,
        )
        bold_style = ParagraphStyle(
            "BoldStyle",
            parent=styles["Normal"],
            fontSize=10,
            fontName="Helvetica-Bold",
            textColor=dark_color,
            spaceAfter=1,
        )
        muted_style = ParagraphStyle(
            "MutedStyle",
            parent=styles["Normal"],
            fontSize=8,
            fontName="Helvetica",
            textColor=muted_color,
            spaceAfter=2,
        )

        story = []

        # ===== HEADER =====
        name = resume_data.get("name", "Your Name")
        story.append(Paragraph(name, name_style))

        role = resume_data.get("target_role", "Software Professional")
        story.append(Paragraph(role, role_style))

        # Contact line
        contacts = []
        if resume_data.get("email"):
            contacts.append(f"📧 {resume_data['email']}")
        if resume_data.get("phone"):
            contacts.append(f"📱 {resume_data['phone']}")
        if resume_data.get("location"):
            contacts.append(f"📍 {resume_data['location']}")
        if resume_data.get("linkedin_url"):
            contacts.append(f"💼 LinkedIn")
        if resume_data.get("github_url"):
            contacts.append(f"🐙 GitHub")

        if contacts:
            story.append(Paragraph("   |   ".join(contacts), contact_style))

        story.append(Spacer(1, 4))
        story.append(HRFlowable(width="100%", thickness=2, color=primary_color))
        story.append(Spacer(1, 6))

        # ===== SUMMARY =====
        if resume_data.get("summary"):
            story.append(Paragraph("PROFESSIONAL SUMMARY", section_title_style))
            story.append(Paragraph(resume_data["summary"], body_style))
            story.append(HRFlowable(width="100%", thickness=0.5, color=colors.Color(0.9, 0.9, 0.9)))

        # ===== SKILLS =====
        skills = resume_data.get("skills", [])
        if skills:
            story.append(Paragraph("SKILLS", section_title_style))
            # Make skill chips in a table
            skills_text = "  •  ".join(skills)
            story.append(Paragraph(skills_text, body_style))
            story.append(HRFlowable(width="100%", thickness=0.5, color=colors.Color(0.9, 0.9, 0.9)))

        # ===== EDUCATION =====
        education = resume_data.get("education", [])
        if education:
            story.append(Paragraph("EDUCATION", section_title_style))
            for edu in education:
                story.append(Paragraph(edu.get("degree", "Degree"), bold_style))
                line = edu.get("institution", "Institution")
                if edu.get("year"):
                    line += f"  |  Class of {edu['year']}"
                if edu.get("cgpa"):
                    line += f"  |  CGPA: {edu['cgpa']}"
                story.append(Paragraph(line, muted_style))
                story.append(Spacer(1, 4))
            story.append(HRFlowable(width="100%", thickness=0.5, color=colors.Color(0.9, 0.9, 0.9)))

        # ===== PROJECTS =====
        projects = resume_data.get("projects", [])
        if projects:
            story.append(Paragraph("PROJECTS", section_title_style))
            for proj in projects[:4]:  # Max 4 projects
                name_line = proj.get("name", "Project")
                if proj.get("link"):
                    name_line += f"  |  {proj['link']}"
                story.append(Paragraph(name_line, bold_style))

                if proj.get("tech"):
                    story.append(Paragraph(f"Tech: {proj['tech']}", muted_style))

                if proj.get("description"):
                    desc = proj["description"][:300]
                    story.append(Paragraph(f"• {desc}", body_style))
                story.append(Spacer(1, 4))
            story.append(HRFlowable(width="100%", thickness=0.5, color=colors.Color(0.9, 0.9, 0.9)))

        # ===== ACHIEVEMENTS =====
        achievements = [a for a in resume_data.get("achievements", []) if a]
        if achievements:
            story.append(Paragraph("ACHIEVEMENTS & CERTIFICATIONS", section_title_style))
            for ach in achievements[:6]:
                story.append(Paragraph(f"🏆  {ach}", body_style))

        # ===== FOOTER =====
        story.append(Spacer(1, 20))
        footer_style = ParagraphStyle(
            "Footer",
            parent=styles["Normal"],
            fontSize=7,
            fontName="Helvetica",
            textColor=colors.Color(0.7, 0.7, 0.7),
            alignment=TA_CENTER,
        )
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.Color(0.9, 0.9, 0.9)))
        story.append(Paragraph("Generated by SkillSetu — Kaushal se Rojgar tak | skillsetu.in", footer_style))

        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()

    except ImportError:
        logger.error("ReportLab not installed. Run: pip install reportlab")
        # Return a minimal valid PDF
        return b"%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF"
    except Exception as e:
        logger.error(f"PDF generation error: {e}")
        raise
