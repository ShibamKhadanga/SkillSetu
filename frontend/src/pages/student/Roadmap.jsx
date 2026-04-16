import { useState, useEffect, useCallback } from 'react'
import {
  ExternalLink, Check, Lock, Play, RefreshCw, Sparkles,
  ChevronRight, ChevronDown, GraduationCap, Briefcase, BookOpen,
  Award, Clock, IndianRupee, MapPin, GitBranch, Zap, Star,
  Bookmark, ArrowRight, X
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import api from '@/services/api'
import toast from 'react-hot-toast'

// ════════════════════════════════════════════════════════════════
// COMPREHENSIVE INDIAN EDUCATION PATHWAY DATA (WITH COURSES)
// ════════════════════════════════════════════════════════════════
const PATHWAY_TREE = {
  id: 'root',
  name: 'After 10th Standard',
  type: 'milestone',
  description: 'Choose your path after completing Class 10 (SSC/CBSE/ICSE)',
  icon: '🎓',
  children: [
    // ── 12th SCIENCE ──────────────────────────────────────────
    {
      id: 'sci',
      name: '12th Science',
      type: 'stream',
      color: '#3b82f6',
      icon: '🔬',
      duration: '2 years',
      description: 'Physics, Chemistry, Maths/Biology — Board Exams (CBSE/State)',
      courses: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Computer Science', 'Physical Education'],
      children: [
        {
          id: 'sci-pcm',
          name: 'PCM (Physics, Chemistry, Maths)',
          type: 'combination',
          color: '#3b82f6',
          icon: '📐',
          description: 'Engineering, Architecture, Pure Sciences, Defence',
          courses: ['Physics', 'Chemistry', 'Mathematics', 'English', 'CS/IP (optional)'],
          children: [
            {
              id: 'sci-pcm-btech',
              name: 'B.Tech / B.E.',
              type: 'degree',
              color: '#3b82f6',
              icon: '⚙️',
              duration: '4 years',
              exams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'COMEDK', 'State CETs (MHT-CET, KCET, etc.)'],
              description: 'Bachelor of Technology / Bachelor of Engineering',
              courses: ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Chemical', 'Aerospace', 'AI & ML', 'Data Science', 'IT', 'Robotics', 'Biotech'],
              children: [
                {
                  id: 'sci-pcm-btech-mtech',
                  name: 'M.Tech / MS',
                  type: 'degree',
                  color: '#3b82f6',
                  icon: '🎓',
                  duration: '2 years',
                  exams: ['GATE', 'GRE (for abroad)'],
                  description: 'Specialization & Research',
                  courses: ['AI/ML', 'Data Science', 'VLSI', 'Structural Engg', 'Cyber Security', 'Embedded Systems', 'Cloud Computing'],
                  children: [
                    { id: 'sci-pcm-btech-mtech-j1', name: 'Senior Software Engineer', type: 'job', salary: '₹15-40 LPA', icon: '💼' },
                    { id: 'sci-pcm-btech-mtech-j2', name: 'Data Scientist', type: 'job', salary: '₹12-35 LPA', icon: '💼' },
                    { id: 'sci-pcm-btech-mtech-j3', name: 'Research Scientist', type: 'job', salary: '₹10-30 LPA', icon: '💼' },
                    { id: 'sci-pcm-btech-mtech-j4', name: 'University Professor', type: 'job', salary: '₹8-20 LPA (+ NET/SET)', icon: '💼' },
                  ]
                },
                {
                  id: 'sci-pcm-btech-mba',
                  name: 'MBA (after B.Tech)',
                  type: 'degree',
                  color: '#22c55e',
                  icon: '📊',
                  duration: '2 years',
                  exams: ['CAT', 'XAT', 'GMAT'],
                  courses: ['Product Management', 'Operations', 'Analytics', 'Finance'],
                  children: [
                    { id: 'sci-pcm-btech-mba-j1', name: 'Product Manager', type: 'job', salary: '₹20-50 LPA', icon: '💼' },
                    { id: 'sci-pcm-btech-mba-j2', name: 'Management Consultant', type: 'job', salary: '₹18-40 LPA', icon: '💼' },
                  ]
                },
                { id: 'sci-pcm-btech-j1', name: 'Software Developer', type: 'job', salary: '₹4-15 LPA', icon: '💼' },
                { id: 'sci-pcm-btech-j2', name: 'DevOps Engineer', type: 'job', salary: '₹5-18 LPA', icon: '💼' },
                { id: 'sci-pcm-btech-j3', name: 'Civil / Mechanical Engineer', type: 'job', salary: '₹3-10 LPA', icon: '💼' },
                { id: 'sci-pcm-btech-j4', name: 'GATE → PSU Jobs (NTPC, BHEL, ONGC)', type: 'job', salary: '₹8-15 LPA', icon: '🏛️' },
              ]
            },
            {
              id: 'sci-pcm-barch',
              name: 'B.Arch (Architecture)',
              type: 'degree',
              color: '#8b5cf6',
              icon: '🏗️',
              duration: '5 years',
              exams: ['NATA', 'JEE Main Paper 2'],
              description: 'Bachelor of Architecture',
              courses: ['Architectural Design', 'Building Construction', 'Structures', 'Urban Planning', 'Interior Design', 'Landscape Architecture'],
              children: [
                { id: 'sci-pcm-barch-j1', name: 'Architect', type: 'job', salary: '₹4-15 LPA', icon: '💼' },
                { id: 'sci-pcm-barch-j2', name: 'Urban Planner', type: 'job', salary: '₹5-12 LPA', icon: '💼' },
                { id: 'sci-pcm-barch-j3', name: 'Interior Designer', type: 'job', salary: '₹3-10 LPA', icon: '💼' },
              ]
            },
            {
              id: 'sci-pcm-bsc',
              name: 'B.Sc (Pure Science)',
              type: 'degree',
              color: '#06b6d4',
              icon: '🔬',
              duration: '3 years',
              exams: ['CUET', 'University Entrance'],
              description: 'Bachelor of Science — Physics, Maths, Chemistry, CS, Statistics',
              courses: ['B.Sc Physics', 'B.Sc Mathematics', 'B.Sc Chemistry', 'B.Sc Computer Science', 'B.Sc Statistics', 'B.Sc Electronics'],
              children: [
                {
                  id: 'sci-pcm-bsc-msc',
                  name: 'M.Sc → Research / NET',
                  type: 'degree',
                  color: '#06b6d4',
                  icon: '🔬',
                  duration: '2 years',
                  exams: ['IIT JAM', 'CUET PG', 'University Entrance'],
                  courses: ['M.Sc Physics', 'M.Sc Maths', 'M.Sc CS', 'M.Sc Data Science', 'M.Sc Statistics'],
                  children: [
                    { id: 'sci-pcm-bsc-msc-j1', name: 'Researcher / Scientist (ISRO, DRDO, CSIR)', type: 'job', salary: '₹6-20 LPA', icon: '🏛️' },
                    { id: 'sci-pcm-bsc-msc-j2', name: 'Professor (after NET/SET)', type: 'job', salary: '₹7-18 LPA', icon: '💼' },
                    { id: 'sci-pcm-bsc-msc-j3', name: 'Data Analyst', type: 'job', salary: '₹4-12 LPA', icon: '💼' },
                  ]
                },
                { id: 'sci-pcm-bsc-j1', name: 'Lab Technician', type: 'job', salary: '₹2-5 LPA', icon: '💼' },
                { id: 'sci-pcm-bsc-j2', name: 'Content Writer (Science)', type: 'job', salary: '₹3-8 LPA', icon: '💼' },
              ]
            },
            {
              id: 'sci-pcm-nda',
              name: 'NDA / Defence',
              type: 'degree',
              color: '#059669',
              icon: '🎖️',
              duration: '3 years + Training',
              exams: ['NDA (UPSC)', 'CDS', 'AFCAT'],
              description: 'National Defence Academy — Join Indian Armed Forces',
              courses: ['Army', 'Navy', 'Air Force'],
              children: [
                { id: 'sci-pcm-nda-j1', name: 'Indian Army Officer', type: 'job', salary: '₹8-20 LPA + Perks', icon: '🎖️' },
                { id: 'sci-pcm-nda-j2', name: 'Indian Navy Officer', type: 'job', salary: '₹8-20 LPA + Perks', icon: '🎖️' },
                { id: 'sci-pcm-nda-j3', name: 'Indian Air Force Officer', type: 'job', salary: '₹8-20 LPA + Perks', icon: '🎖️' },
              ]
            },
          ]
        },
        {
          id: 'sci-pcb',
          name: 'PCB (Physics, Chemistry, Biology)',
          type: 'combination',
          color: '#22c55e',
          icon: '🧬',
          description: 'Medical, Pharma, Biotech, Nursing, Agriculture',
          courses: ['Physics', 'Chemistry', 'Biology', 'English', 'Psychology (optional)'],
          children: [
            {
              id: 'sci-pcb-mbbs',
              name: 'MBBS',
              type: 'degree',
              color: '#22c55e',
              icon: '🩺',
              duration: '5.5 years (incl. Internship)',
              exams: ['NEET UG'],
              description: 'Bachelor of Medicine & Bachelor of Surgery',
              courses: ['Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Microbiology', 'Forensic Medicine', 'Surgery', 'Medicine', 'Obstetrics', 'Paediatrics'],
              children: [
                {
                  id: 'sci-pcb-mbbs-md',
                  name: 'MD / MS (Specialization)',
                  type: 'degree',
                  color: '#22c55e',
                  icon: '🏥',
                  duration: '3 years',
                  exams: ['NEET PG'],
                  courses: ['General Medicine', 'General Surgery', 'Cardiology', 'Neurology', 'Orthopaedics', 'Dermatology', 'Radiology', 'Anaesthesia'],
                  children: [
                    { id: 'sci-pcb-mbbs-md-j1', name: 'Specialist Doctor', type: 'job', salary: '₹15-50+ LPA', icon: '💼' },
                    { id: 'sci-pcb-mbbs-md-j2', name: 'Surgeon', type: 'job', salary: '₹20-60+ LPA', icon: '💼' },
                  ]
                },
                { id: 'sci-pcb-mbbs-j1', name: 'General Physician (MBBS)', type: 'job', salary: '₹6-15 LPA', icon: '💼' },
                { id: 'sci-pcb-mbbs-j2', name: 'Govt Medical Officer', type: 'job', salary: '₹8-16 LPA', icon: '🏛️' },
              ]
            },
            {
              id: 'sci-pcb-bds',
              name: 'BDS (Dentistry)',
              type: 'degree',
              color: '#14b8a6',
              icon: '🦷',
              duration: '5 years',
              exams: ['NEET UG'],
              courses: ['Oral Surgery', 'Prosthodontics', 'Orthodontics', 'Conservative Dentistry', 'Public Health Dentistry'],
              children: [
                { id: 'sci-pcb-bds-j1', name: 'Dentist', type: 'job', salary: '₹4-15 LPA', icon: '💼' },
              ]
            },
            {
              id: 'sci-pcb-bpharm',
              name: 'B.Pharm (Pharmacy)',
              type: 'degree',
              color: '#f59e0b',
              icon: '💊',
              duration: '4 years',
              exams: ['GPAT', 'State Entrance'],
              courses: ['Pharmaceutics', 'Pharmacology', 'Medicinal Chemistry', 'Pharmacognosy', 'Pharmaceutical Analysis'],
              children: [
                { id: 'sci-pcb-bpharm-j1', name: 'Pharmacist', type: 'job', salary: '₹3-8 LPA', icon: '💼' },
                { id: 'sci-pcb-bpharm-j2', name: 'Drug Inspector', type: 'job', salary: '₹5-10 LPA', icon: '🏛️' },
                { id: 'sci-pcb-bpharm-j3', name: 'Clinical Research Associate', type: 'job', salary: '₹4-12 LPA', icon: '💼' },
              ]
            },
            {
              id: 'sci-pcb-bsc-bio',
              name: 'B.Sc (Biotech / Nursing / Agriculture)',
              type: 'degree',
              color: '#84cc16',
              icon: '🌱',
              duration: '3-4 years',
              exams: ['ICAR AIEEA', 'State Nursing', 'University Entrance'],
              courses: ['B.Sc Biotechnology', 'B.Sc Nursing', 'B.Sc Agriculture', 'B.Sc Microbiology', 'B.Sc Zoology', 'B.Sc Botany', 'B.Sc Food Technology'],
              children: [
                { id: 'sci-pcb-bsc-bio-j1', name: 'Nurse (Govt/Private)', type: 'job', salary: '₹3-8 LPA', icon: '💼' },
                { id: 'sci-pcb-bsc-bio-j2', name: 'Agriculture Officer', type: 'job', salary: '₹4-10 LPA', icon: '🏛️' },
                { id: 'sci-pcb-bsc-bio-j3', name: 'Biotech Researcher', type: 'job', salary: '₹4-12 LPA', icon: '💼' },
                { id: 'sci-pcb-bsc-bio-j4', name: 'Food Technologist', type: 'job', salary: '₹3-8 LPA', icon: '💼' },
              ]
            },
            {
              id: 'sci-pcb-vet',
              name: 'B.V.Sc (Veterinary Science)',
              type: 'degree',
              color: '#10b981',
              icon: '🐾',
              duration: '5.5 years',
              exams: ['NEET UG', 'State Entrance'],
              courses: ['Animal Anatomy', 'Surgery', 'Medicine', 'Gynaecology', 'Public Health'],
              children: [
                { id: 'sci-pcb-vet-j1', name: 'Veterinary Doctor', type: 'job', salary: '₹4-12 LPA', icon: '💼' },
                { id: 'sci-pcb-vet-j2', name: 'Animal Husbandry Officer (Govt)', type: 'job', salary: '₹5-10 LPA', icon: '🏛️' },
              ]
            },
          ]
        },
      ]
    },
    // ── 12th COMMERCE ────────────────────────────────────────
    {
      id: 'com',
      name: '12th Commerce',
      type: 'stream',
      color: '#22c55e',
      icon: '📊',
      duration: '2 years',
      description: 'Accountancy, Business Studies, Economics — Board Exams',
      courses: ['Accountancy', 'Business Studies', 'Economics', 'English', 'Maths (optional)', 'Informatics Practices'],
      children: [
        {
          id: 'com-bcom',
          name: 'B.Com (Bachelor of Commerce)',
          type: 'degree',
          color: '#22c55e',
          icon: '📒',
          duration: '3 years',
          exams: ['CUET', 'DU JAT', 'University Entrance'],
          description: 'Foundation for CA, CS, CMA, MBA',
          courses: ['B.Com General', 'B.Com Hons (Accounting)', 'B.Com Hons (Finance)', 'B.Com Hons (Banking)', 'B.Com (Tax Procedure)', 'B.Com (Computer Applications)'],
          children: [
            {
              id: 'com-bcom-mcom',
              name: 'M.Com',
              type: 'degree',
              color: '#22c55e',
              icon: '📊',
              duration: '2 years',
              exams: ['CUET PG', 'University Entrance'],
              courses: ['M.Com Finance', 'M.Com Accounting', 'M.Com Business Analytics'],
              children: [
                { id: 'com-bcom-mcom-j1', name: 'Finance Manager', type: 'job', salary: '₹6-15 LPA', icon: '💼' },
                { id: 'com-bcom-mcom-j2', name: 'University Lecturer (NET)', type: 'job', salary: '₹7-16 LPA', icon: '💼' },
              ]
            },
            { id: 'com-bcom-j1', name: 'Accountant', type: 'job', salary: '₹2.5-6 LPA', icon: '💼' },
            { id: 'com-bcom-j2', name: 'Tax Consultant', type: 'job', salary: '₹3-10 LPA', icon: '💼' },
            { id: 'com-bcom-j3', name: 'Bank PO / Clerk (IBPS/SBI)', type: 'job', salary: '₹4-10 LPA', icon: '🏛️' },
          ]
        },
        {
          id: 'com-ca',
          name: 'CA (Chartered Accountant)',
          type: 'degree',
          color: '#eab308',
          icon: '🏅',
          duration: '4-5 years (Foundation → Inter → Final)',
          exams: ['CA Foundation', 'CA Intermediate', 'CA Final'],
          description: 'Most prestigious commerce career — can start after 12th',
          courses: ['Accounting', 'Auditing', 'Taxation', 'Company Law', 'Cost Accounting', 'Financial Management', 'Strategic Management', 'ICITSS/AICITSS'],
          children: [
            { id: 'com-ca-j1', name: 'Chartered Accountant', type: 'job', salary: '₹7-30+ LPA', icon: '💼' },
            { id: 'com-ca-j2', name: 'CFO / Finance Director', type: 'job', salary: '₹25-80+ LPA', icon: '💼' },
            { id: 'com-ca-j3', name: 'Audit Manager (Big 4)', type: 'job', salary: '₹10-25 LPA', icon: '💼' },
          ]
        },
        {
          id: 'com-cs',
          name: 'CS (Company Secretary)',
          type: 'degree',
          color: '#8b5cf6',
          icon: '📋',
          duration: '3-4 years',
          exams: ['CS Foundation', 'CS Executive', 'CS Professional'],
          courses: ['Company Law', 'Securities Law', 'Corporate Governance', 'Drafting & Conveyancing', 'Capital Markets'],
          children: [
            { id: 'com-cs-j1', name: 'Company Secretary', type: 'job', salary: '₹5-20 LPA', icon: '💼' },
            { id: 'com-cs-j2', name: 'Compliance Officer', type: 'job', salary: '₹6-18 LPA', icon: '💼' },
          ]
        },
        {
          id: 'com-bba',
          name: 'BBA (Bachelor of Business Admin)',
          type: 'degree',
          color: '#f97316',
          icon: '📈',
          duration: '3 years',
          exams: ['CUET', 'IPMAT', 'NPAT', 'SET'],
          courses: ['Marketing Management', 'Financial Management', 'Human Resource Mgmt', 'Operations Management', 'Business Analytics', 'Entrepreneurship'],
          children: [
            {
              id: 'com-bba-mba',
              name: 'MBA',
              type: 'degree',
              color: '#f97316',
              icon: '🏢',
              duration: '2 years',
              exams: ['CAT', 'XAT', 'SNAP', 'GMAT', 'NMAT', 'MAT'],
              courses: ['MBA Finance', 'MBA Marketing', 'MBA HR', 'MBA Operations', 'MBA IT', 'MBA Analytics', 'MBA International Business'],
              children: [
                { id: 'com-bba-mba-j1', name: 'Management Consultant', type: 'job', salary: '₹15-50 LPA', icon: '💼' },
                { id: 'com-bba-mba-j2', name: 'Investment Banker', type: 'job', salary: '₹12-40 LPA', icon: '💼' },
                { id: 'com-bba-mba-j3', name: 'Marketing Manager', type: 'job', salary: '₹10-30 LPA', icon: '💼' },
                { id: 'com-bba-mba-j4', name: 'HR Director', type: 'job', salary: '₹12-35 LPA', icon: '💼' },
              ]
            },
            { id: 'com-bba-j1', name: 'Business Analyst', type: 'job', salary: '₹3-8 LPA', icon: '💼' },
            { id: 'com-bba-j2', name: 'Sales Executive', type: 'job', salary: '₹2.5-6 LPA', icon: '💼' },
          ]
        },
        {
          id: 'com-cma',
          name: 'CMA (Cost & Mgmt Accountant)',
          type: 'degree',
          color: '#14b8a6',
          icon: '💰',
          duration: '3-4 years',
          exams: ['CMA Foundation', 'CMA Intermediate', 'CMA Final'],
          courses: ['Cost Accounting', 'Financial Management', 'Taxation', 'Auditing', 'Strategic Management'],
          children: [
            { id: 'com-cma-j1', name: 'Cost Accountant', type: 'job', salary: '₹5-15 LPA', icon: '💼' },
            { id: 'com-cma-j2', name: 'Financial Controller', type: 'job', salary: '₹8-25 LPA', icon: '💼' },
          ]
        },
      ]
    },
    // ── 12th ARTS / HUMANITIES ────────────────────────────────
    {
      id: 'arts',
      name: '12th Arts / Humanities',
      type: 'stream',
      color: '#a855f7',
      icon: '🎨',
      duration: '2 years',
      description: 'History, Political Science, Psychology, Sociology — Board Exams',
      courses: ['History', 'Political Science', 'Geography', 'Psychology', 'Sociology', 'Economics', 'English Literature', 'Hindi', 'Philosophy'],
      children: [
        {
          id: 'arts-ba',
          name: 'BA (Bachelor of Arts)',
          type: 'degree',
          color: '#a855f7',
          icon: '📖',
          duration: '3 years',
          exams: ['CUET', 'University Entrance'],
          description: 'Wide range of specializations',
          courses: ['BA English', 'BA History', 'BA Political Science', 'BA Psychology', 'BA Sociology', 'BA Economics', 'BA Philosophy', 'BA Geography', 'BA Hindi Literature'],
          children: [
            {
              id: 'arts-ba-ma',
              name: 'MA (Master of Arts)',
              type: 'degree',
              color: '#a855f7',
              icon: '📚',
              duration: '2 years',
              exams: ['CUET PG', 'JNU Entrance', 'University Entrance'],
              courses: ['MA English', 'MA History', 'MA Psychology', 'MA Sociology', 'MA Economics', 'MA Political Science'],
              children: [
                { id: 'arts-ba-ma-j1', name: 'Professor/Lecturer (UGC NET)', type: 'job', salary: '₹7-18 LPA', icon: '💼' },
                { id: 'arts-ba-ma-j2', name: 'Researcher / PhD Scholar', type: 'job', salary: '₹3-8 LPA (fellowship)', icon: '💼' },
              ]
            },
            {
              id: 'arts-ba-upsc',
              name: 'UPSC Civil Services',
              type: 'exam',
              color: '#dc2626',
              icon: '🏛️',
              duration: '1-3 years preparation',
              exams: ['UPSC CSE (Prelims → Mains → Interview)'],
              courses: ['General Studies', 'Optional Subject', 'Essay Writing', 'Ethics', 'Current Affairs'],
              children: [
                { id: 'arts-ba-upsc-j1', name: 'IAS Officer', type: 'job', salary: '₹8-20 LPA + Perks', icon: '🏛️' },
                { id: 'arts-ba-upsc-j2', name: 'IPS Officer', type: 'job', salary: '₹7-18 LPA + Perks', icon: '🏛️' },
                { id: 'arts-ba-upsc-j3', name: 'IFS Officer', type: 'job', salary: '₹7-18 LPA + Perks', icon: '🏛️' },
              ]
            },
            { id: 'arts-ba-j1', name: 'Content Writer / Journalist', type: 'job', salary: '₹3-10 LPA', icon: '💼' },
            { id: 'arts-ba-j2', name: 'HR Executive', type: 'job', salary: '₹2.5-6 LPA', icon: '💼' },
            { id: 'arts-ba-j3', name: 'Social Worker / NGO', type: 'job', salary: '₹2-6 LPA', icon: '💼' },
          ]
        },
        {
          id: 'arts-llb',
          name: 'BA LLB / LLB (Law)',
          type: 'degree',
          color: '#dc2626',
          icon: '⚖️',
          duration: '5 years (integrated) / 3 years (after BA)',
          exams: ['CLAT', 'AILET', 'LSAT', 'MH-CET Law'],
          courses: ['Constitutional Law', 'Criminal Law', 'Corporate Law', 'Property Law', 'International Law', 'Cyber Law', 'IPR Law', 'Environmental Law'],
          children: [
            { id: 'arts-llb-j1', name: 'Advocate / Lawyer', type: 'job', salary: '₹3-30+ LPA', icon: '💼' },
            { id: 'arts-llb-j2', name: 'Corporate Counsel', type: 'job', salary: '₹8-25 LPA', icon: '💼' },
            { id: 'arts-llb-j3', name: 'Judge (after JMFC Exam)', type: 'job', salary: '₹10-25 LPA', icon: '🏛️' },
            { id: 'arts-llb-j4', name: 'Legal Advisor', type: 'job', salary: '₹5-15 LPA', icon: '💼' },
          ]
        },
        {
          id: 'arts-bjmc',
          name: 'BJMC / BMM (Journalism & Mass Comm)',
          type: 'degree',
          color: '#f59e0b',
          icon: '📺',
          duration: '3 years',
          exams: ['CUET', 'IPU CET', 'IIMC Entrance'],
          courses: ['Print Journalism', 'TV Journalism', 'Digital Media', 'Public Relations', 'Advertising', 'Documentary Filmmaking', 'Radio Journalism'],
          children: [
            { id: 'arts-bjmc-j1', name: 'Journalist / News Anchor', type: 'job', salary: '₹3-15 LPA', icon: '💼' },
            { id: 'arts-bjmc-j2', name: 'PR Manager', type: 'job', salary: '₹4-12 LPA', icon: '💼' },
            { id: 'arts-bjmc-j3', name: 'Digital Marketing Specialist', type: 'job', salary: '₹3-12 LPA', icon: '💼' },
          ]
        },
        {
          id: 'arts-design',
          name: 'B.Des / BFA (Design & Fine Arts)',
          type: 'degree',
          color: '#ec4899',
          icon: '🎭',
          duration: '4 years',
          exams: ['NIFT', 'NID DAT', 'UCEED', 'BHU UET'],
          courses: ['Fashion Design', 'Product Design', 'Graphic Design', 'Animation', 'Textile Design', 'UI/UX Design', 'Painting', 'Sculpture', 'Applied Arts'],
          children: [
            { id: 'arts-design-j1', name: 'Fashion Designer', type: 'job', salary: '₹3-15 LPA', icon: '💼' },
            { id: 'arts-design-j2', name: 'UI/UX Designer', type: 'job', salary: '₹4-18 LPA', icon: '💼' },
            { id: 'arts-design-j3', name: 'Graphic Designer', type: 'job', salary: '₹3-10 LPA', icon: '💼' },
            { id: 'arts-design-j4', name: 'Animator / VFX Artist', type: 'job', salary: '₹3-12 LPA', icon: '💼' },
          ]
        },
        {
          id: 'arts-bed',
          name: 'B.Ed (Teaching)',
          type: 'degree',
          color: '#0ea5e9',
          icon: '📝',
          duration: '2 years (after graduation)',
          exams: ['State B.Ed CET', 'CTET', 'TET'],
          courses: ['Pedagogy', 'Child Development', 'Educational Psychology', 'Curriculum Design', 'ICT in Education', 'Subject Teaching Methods'],
          children: [
            { id: 'arts-bed-j1', name: 'School Teacher (Govt/Private)', type: 'job', salary: '₹3-10 LPA', icon: '💼' },
            { id: 'arts-bed-j2', name: 'TGT / PGT (Govt School)', type: 'job', salary: '₹5-12 LPA', icon: '🏛️' },
            { id: 'arts-bed-j3', name: 'Education Consultant', type: 'job', salary: '₹4-10 LPA', icon: '💼' },
          ]
        },
        {
          id: 'arts-bsw',
          name: 'BSW / MSW (Social Work)',
          type: 'degree',
          color: '#6366f1',
          icon: '🤝',
          duration: '3 years + 2 years (MSW)',
          exams: ['TISS Entrance', 'University Entrance'],
          courses: ['Social Case Work', 'Community Development', 'Rural Development', 'Human Rights', 'Child Welfare', 'Mental Health Social Work'],
          children: [
            { id: 'arts-bsw-j1', name: 'Social Worker', type: 'job', salary: '₹3-8 LPA', icon: '💼' },
            { id: 'arts-bsw-j2', name: 'NGO Program Manager', type: 'job', salary: '₹4-12 LPA', icon: '💼' },
            { id: 'arts-bsw-j3', name: 'Counsellor', type: 'job', salary: '₹3-10 LPA', icon: '💼' },
          ]
        },
      ]
    },
    // ── DIPLOMA / POLYTECHNIC ────────────────────────────────
    {
      id: 'dip',
      name: 'Diploma (Polytechnic)',
      type: 'stream',
      color: '#f97316',
      icon: '🔧',
      duration: '3 years',
      description: 'Technical diploma — directly employable. Can also do lateral entry into B.Tech 2nd year.',
      courses: ['Computer Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Electronics', 'Automobile Engineering', 'Information Technology', 'Chemical Engineering'],
      exams: ['State Polytechnic Entrance (CET)'],
      children: [
        {
          id: 'dip-lateral',
          name: 'Lateral Entry → B.Tech (2nd Year)',
          type: 'degree',
          color: '#3b82f6',
          icon: '🔄',
          duration: '3 years',
          exams: ['State Lateral Entry Exam'],
          description: 'Join B.Tech directly in 2nd year with diploma',
          courses: ['All B.Tech branches available'],
          children: [
            { id: 'dip-lateral-j1', name: 'Software Developer', type: 'job', salary: '₹4-15 LPA', icon: '💼' },
            { id: 'dip-lateral-j2', name: 'Engineer (Any Field)', type: 'job', salary: '₹3-12 LPA', icon: '💼' },
          ]
        },
        { id: 'dip-j1', name: 'Junior Engineer (Govt)', type: 'job', salary: '₹3-7 LPA', icon: '🏛️' },
        { id: 'dip-j2', name: 'Technician / Supervisor', type: 'job', salary: '₹2.5-6 LPA', icon: '💼' },
        { id: 'dip-j3', name: 'Site Engineer', type: 'job', salary: '₹2.5-5 LPA', icon: '💼' },
        { id: 'dip-j4', name: 'Lab Assistant', type: 'job', salary: '₹2-4 LPA', icon: '💼' },
        { id: 'dip-j5', name: 'Railway Technician (RRB)', type: 'job', salary: '₹3-6 LPA', icon: '🏛️' },
      ]
    },
    // ── ITI ──────────────────────────────────────────────────
    {
      id: 'iti',
      name: 'ITI (Industrial Training Institute)',
      type: 'stream',
      color: '#ef4444',
      icon: '🛠️',
      duration: '1-2 years',
      description: 'Skill-based vocational training — fastest route to employment',
      courses: ['Fitter', 'Electrician', 'Welder', 'Turner', 'Machinist', 'Plumber', 'COPA (Computer)', 'Mechanic Motor Vehicle', 'Electronics Mechanic', 'Carpenter', 'Wireman', 'Painter', 'Sheet Metal Worker', 'Draughtsman (Civil/Mechanical)'],
      exams: ['ITI Entrance / Direct Admission'],
      children: [
        {
          id: 'iti-apprentice',
          name: 'Apprenticeship (after ITI)',
          type: 'training',
          color: '#f59e0b',
          icon: '🏭',
          duration: '1-2 years',
          description: 'Practical training in govt/private factories',
          courses: ['On-the-job training in relevant trade'],
          children: [
            { id: 'iti-apprentice-j1', name: 'Skilled Technician (Pvt/Govt)', type: 'job', salary: '₹2.5-6 LPA', icon: '💼' },
          ]
        },
        { id: 'iti-j1', name: 'Railway Technician (RRB)', type: 'job', salary: '₹3-6 LPA', icon: '🏛️' },
        { id: 'iti-j2', name: 'Factory Worker / Operator', type: 'job', salary: '₹2-4 LPA', icon: '💼' },
        { id: 'iti-j3', name: 'Electrician / Plumber (Self-Employed)', type: 'job', salary: '₹2.5-8 LPA', icon: '💼' },
        { id: 'iti-j4', name: 'Defence (Indian Army Technical)', type: 'job', salary: '₹3-7 LPA + Perks', icon: '🎖️' },
        { id: 'iti-j5', name: 'Govt Technical Posts (SSC/RRB)', type: 'job', salary: '₹3-6 LPA', icon: '🏛️' },
      ]
    },
  ]
}

// ════════════════════════════════════════════════════════════════
// TREE NODE COMPONENT
// ════════════════════════════════════════════════════════════════
const TreeNode = ({ node, depth = 0, markedNode, setMarkedNode }) => {
  const [expanded, setExpanded] = useState(depth < 1)
  const [showDetail, setShowDetail] = useState(false)
  const hasChildren = node.children && node.children.length > 0
  const isJob = node.type === 'job'
  const isMarked = markedNode === node.id

  const streamColors = {
    '#3b82f6': { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', text: '#3b82f6' },
    '#22c55e': { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)', text: '#22c55e' },
    '#a855f7': { bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.25)', text: '#a855f7' },
    '#f97316': { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)', text: '#f97316' },
    '#ef4444': { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', text: '#ef4444' },
    '#eab308': { bg: 'rgba(234,179,8,0.08)', border: 'rgba(234,179,8,0.25)', text: '#eab308' },
    '#dc2626': { bg: 'rgba(220,38,38,0.08)', border: 'rgba(220,38,38,0.25)', text: '#dc2626' },
    '#8b5cf6': { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)', text: '#8b5cf6' },
    '#06b6d4': { bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.25)', text: '#06b6d4' },
    '#ec4899': { bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.25)', text: '#ec4899' },
    '#f59e0b': { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', text: '#f59e0b' },
    '#14b8a6': { bg: 'rgba(20,184,166,0.08)', border: 'rgba(20,184,166,0.25)', text: '#14b8a6' },
    '#0ea5e9': { bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.25)', text: '#0ea5e9' },
    '#84cc16': { bg: 'rgba(132,204,22,0.08)', border: 'rgba(132,204,22,0.25)', text: '#84cc16' },
    '#10b981': { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', text: '#10b981' },
    '#6366f1': { bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.25)', text: '#6366f1' },
    '#059669': { bg: 'rgba(5,150,105,0.08)', border: 'rgba(5,150,105,0.25)', text: '#059669' },
  }

  const resolvedColor = node.color || 'var(--accent)'
  const cs = streamColors[resolvedColor] || { bg: 'var(--accent-light)', border: 'var(--border)', text: 'var(--accent)' }

  if (isJob) {
    return (
      <div className="flex items-center gap-3 py-2 px-3 rounded-xl transition-all duration-200 group"
        style={{ background: isMarked ? cs.bg : 'transparent' }}>
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: resolvedColor }} />
        <span className="text-base flex-shrink-0">{node.icon}</span>
        <span className="font-body text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{node.name}</span>
        {node.salary && (
          <span className="font-body text-xs px-2 py-0.5 rounded-lg flex-shrink-0"
            style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
            {node.salary}
          </span>
        )}
        <button onClick={() => setMarkedNode(isMarked ? null : node.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
          title={isMarked ? 'Unmark' : 'Mark as goal'}
          style={isMarked ? { background: resolvedColor, color: 'white' } : { background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
          <Star size={11} className={isMarked ? 'fill-current' : ''} />
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Connector line */}
      {depth > 0 && (
        <div className="absolute left-4 -top-2 w-0.5 h-2"
          style={{ background: `${resolvedColor}33` }} />
      )}

      {/* Node card */}
      <div className="rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: cs.bg,
          border: `1.5px solid ${expanded ? cs.border : 'transparent'}`,
          marginLeft: depth > 1 ? 16 : 0,
          boxShadow: expanded ? `0 4px 20px ${resolvedColor}15` : 'none',
        }}>

        {/* Header */}
        <button
          onClick={() => { if (hasChildren) setExpanded(!expanded) }}
          className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200"
          style={{ cursor: hasChildren ? 'pointer' : 'default' }}>

          {/* Expand icon */}
          {hasChildren ? (
            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200"
              style={{ background: `${resolvedColor}22`, color: resolvedColor, transform: expanded ? 'rotate(90deg)' : 'rotate(0)' }}>
              <ChevronRight size={13} />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${resolvedColor}22` }}>
              <div className="w-2 h-2 rounded-full" style={{ background: resolvedColor }} />
            </div>
          )}

          {/* Icon */}
          <span className="text-xl flex-shrink-0">{node.icon}</span>

          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-display font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                {node.name}
              </p>
              {node.type === 'stream' && (
                <span className="text-xs px-2 py-0.5 rounded-full font-body" style={{ background: `${resolvedColor}22`, color: resolvedColor }}>
                  Stream
                </span>
              )}
              {node.type === 'degree' && (
                <span className="text-xs px-2 py-0.5 rounded-full font-body" style={{ background: `${resolvedColor}22`, color: resolvedColor }}>
                  Degree
                </span>
              )}
              {node.type === 'exam' && (
                <span className="text-xs px-2 py-0.5 rounded-full font-body" style={{ background: `${resolvedColor}22`, color: resolvedColor }}>
                  Exam
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
              {node.duration && (
                <span className="font-body text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <Clock size={10} /> {node.duration}
                </span>
              )}
              {node.exams && (
                <span className="font-body text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                  <Award size={10} /> {node.exams[0]}{node.exams.length > 1 ? ` +${node.exams.length - 1}` : ''}
                </span>
              )}
            </div>
          </div>

          {/* "I am here" marker */}
          <button
            onClick={(e) => { e.stopPropagation(); setMarkedNode(isMarked ? null : node.id) }}
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
            title={isMarked ? 'Unmark position' : 'I am here'}
            style={isMarked
              ? { background: resolvedColor, color: 'white', boxShadow: `0 2px 8px ${resolvedColor}44` }
              : { background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
            <MapPin size={13} className={isMarked ? 'fill-current' : ''} />
          </button>

          {/* Info button */}
          {(node.courses || node.description) && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowDetail(!showDetail) }}
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
              style={{ background: showDetail ? resolvedColor : 'var(--bg-input)', color: showDetail ? 'white' : 'var(--text-muted)' }}>
              <BookOpen size={13} />
            </button>
          )}

          {/* Children count */}
          {hasChildren && (
            <span className="font-body text-xs flex-shrink-0 px-2 py-0.5 rounded-lg"
              style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
              {node.children.length}
            </span>
          )}
        </button>

        {/* Detail panel */}
        {showDetail && (
          <div className="px-4 pb-4 space-y-3 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
            {node.description && (
              <p className="font-body text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {node.description}
              </p>
            )}
            {node.exams && node.exams.length > 0 && (
              <div>
                <p className="font-display font-semibold text-xs mb-1.5 flex items-center gap-1.5" style={{ color: cs.text }}>
                  <Award size={11} /> Entrance Exams
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {node.exams.map(exam => (
                    <span key={exam} className="text-xs px-2 py-1 rounded-lg font-body"
                      style={{ background: `${resolvedColor}15`, color: cs.text, border: `1px solid ${resolvedColor}30` }}>
                      {exam}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {node.courses && node.courses.length > 0 && (
              <div>
                <p className="font-display font-semibold text-xs mb-1.5 flex items-center gap-1.5" style={{ color: cs.text }}>
                  <BookOpen size={11} /> Available Courses / Subjects
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {node.courses.map(course => (
                    <span key={course} className="text-xs px-2 py-1 rounded-lg font-body"
                      style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                      📘 {course}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Children */}
        {expanded && hasChildren && (
          <div className="px-3 pb-3 space-y-1.5" style={{ borderTop: `1px dashed ${resolvedColor}22` }}>
            {node.children.map(child => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                markedNode={markedNode}
                setMarkedNode={setMarkedNode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


// ════════════════════════════════════════════════════════════════
// TAB 1: PATHWAY EXPLORER
// ════════════════════════════════════════════════════════════════
const PathwayExplorer = () => {
  const [markedNode, setMarkedNode] = useState(null)

  return (
    <div className="space-y-5">
      {/* Instructions */}
      <div className="glass-card rounded-2xl p-4 flex items-start gap-3"
        style={{ borderColor: 'var(--accent)' }}>
        <Zap size={18} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
        <div>
          <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            Interactive Career Pathway Tree
          </p>
          <p className="font-body text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Click to expand branches • Press <BookOpen size={10} className="inline" /> to see courses & subjects • Press <MapPin size={10} className="inline" /> to mark "I am here" • Job roles show salary ranges
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Science', color: '#3b82f6' },
          { label: 'Commerce', color: '#22c55e' },
          { label: 'Arts', color: '#a855f7' },
          { label: 'Diploma', color: '#f97316' },
          { label: 'ITI', color: '#ef4444' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: l.color }} />
            <span className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>{l.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-auto">
          <Star size={12} style={{ color: 'var(--accent)' }} />
          <span className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>
            {markedNode ? 'Position marked!' : 'Mark your position'}
          </span>
        </div>
      </div>

      {/* Tree */}
      <div className="space-y-3">
        {/* Root */}
        <div className="rounded-2xl p-5 text-center"
          style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))', boxShadow: '0 8px 30px var(--shadow)' }}>
          <p className="text-3xl mb-2">🎓</p>
          <h3 className="font-display font-black text-lg text-white">After 10th Standard</h3>
          <p className="font-body text-xs text-white/70 mt-1">Choose your stream — each path leads to unique career opportunities</p>
        </div>

        {/* Branches */}
        {PATHWAY_TREE.children.map(child => (
          <TreeNode
            key={child.id}
            node={child}
            depth={0}
            markedNode={markedNode}
            setMarkedNode={setMarkedNode}
          />
        ))}
      </div>
    </div>
  )
}


// ════════════════════════════════════════════════════════════════
// TAB 2: AI ROADMAP (refactored from old Roadmap.jsx)
// ════════════════════════════════════════════════════════════════
const StepCard = ({ step, onToggle }) => {
  const done = step.status === 'done'
  const inProgress = step.status === 'in-progress'
  const typeColor = {
    course:        { bg: 'rgba(249,115,22,0.1)', color: '#f97316', label: 'Course' },
    project:       { bg: 'rgba(34,197,94,0.1)',  color: '#22c55e', label: 'Project' },
    degree:        { bg: 'rgba(168,85,247,0.1)', color: '#a855f7', label: 'Degree' },
    certification: { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', label: 'Cert' },
    exam:          { bg: 'rgba(234,179,8,0.1)',  color: '#eab308', label: 'Exam' },
    internship:    { bg: 'rgba(20,184,166,0.1)', color: '#14b8a6', label: 'Internship' },
    job:           { bg: 'rgba(236,72,153,0.1)', color: '#ec4899', label: 'Job' },
  }[step.type] || { bg: 'var(--accent-light)', color: 'var(--accent)', label: step.type }

  return (
    <div className="flex items-start gap-4 p-4 rounded-xl transition-all duration-200 glass-card-hover"
      style={{ opacity: step.status === 'pending' ? 0.75 : 1 }}>
      <button onClick={() => onToggle(step.id)}
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200"
        style={done
          ? { background: '#22c55e', color: 'white' }
          : inProgress
          ? { background: 'var(--accent)', color: 'white' }
          : { background: 'var(--bg-input)', border: '2px solid var(--border)', color: 'transparent' }}>
        {done && <Check size={14} />}
        {inProgress && <Play size={12} />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{step.title}</p>
          <span className="text-xs px-2 py-0.5 rounded-full font-body" style={{ background: typeColor.bg, color: typeColor.color }}>{typeColor.label}</span>
          {step.free && (
            <span className="text-xs px-2 py-0.5 rounded-full font-body" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>Free</span>
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-xs font-body" style={{ color: 'var(--text-muted)' }}>
          {step.platform && <span>📚 {step.platform}</span>}
          {step.exam && <span>📝 Exam: {step.exam}</span>}
          {step.duration && <span>⏱ {step.duration}</span>}
        </div>
      </div>
      {step.link && (
        <a href={step.link} target="_blank" rel="noopener noreferrer"
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
          style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          <ExternalLink size={14} />
        </a>
      )}
    </div>
  )
}

const AIRoadmap = () => {
  const { user } = useAuthStore()
  const [roadmap, setRoadmap] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [goalInput, setGoalInput] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/student/profile')
        const saved = res.data.data?.ai_roadmap
        const goal = res.data.data?.career_goal
        if (saved && saved.phases) {
          setRoadmap(saved)
          if (goal) setGoalInput(goal)
        }
      } catch { /* ignore */ } finally { setLoading(false) }
    }
    load()
  }, [])

  const generateRoadmap = async () => {
    if (!goalInput.trim()) { toast.error('Enter your career goal first!'); return }
    setGenerating(true)
    try {
      const profileRes = await api.get('/student/profile')
      const profile = profileRes.data.data || {}
      const res = await api.post('/ai/generate-roadmap', {
        goal: goalInput.trim(),
        current_skills: profile.skills || [],
        education: profile.education || [],
      })
      setRoadmap(res.data.data)
      toast.success('🗺️ Your personalized roadmap is ready!')
    } catch {
      const demo = {
        goal: goalInput,
        totalSteps: 8,
        phases: [
          { phase: 1, title: 'Foundation', status: 'in-progress', steps: [
            { id: 1, title: 'HTML & CSS Basics', type: 'course', platform: 'FreeCodeCamp', link: 'https://freecodecamp.org', duration: '2 weeks', status: 'in-progress', free: true },
            { id: 2, title: 'JavaScript Fundamentals', type: 'course', platform: 'The Odin Project', link: 'https://theodinproject.com', duration: '3 weeks', status: 'pending', free: true },
          ]},
          { phase: 2, title: 'Core Skills', status: 'locked', steps: [
            { id: 3, title: `${goalInput} — Main Course`, type: 'course', platform: 'Coursera', link: 'https://coursera.org', duration: '4 weeks', status: 'pending', free: false },
            { id: 4, title: 'Build 2 Real Projects', type: 'project', platform: 'Self', duration: '3 weeks', status: 'pending', free: true },
          ]},
          { phase: 3, title: 'Degree & Certification', status: 'locked', steps: [
            { id: 5, title: 'B.Tech / BCA CS (Recommended)', type: 'degree', exam: 'JEE Mains / CUET', duration: '3-4 years', status: 'pending', free: false },
            { id: 6, title: 'Relevant Certification', type: 'certification', platform: 'Coursera', link: 'https://coursera.org', duration: '1 month', status: 'pending', free: false },
          ]},
          { phase: 4, title: 'Job Ready', status: 'locked', steps: [
            { id: 7, title: 'Build Portfolio Website', type: 'project', platform: 'Self', duration: '1 week', status: 'pending', free: true },
            { id: 8, title: 'Apply via SkillSetu 🚀', type: 'project', platform: 'SkillSetu', duration: 'Ongoing', status: 'pending', free: true },
          ]},
        ],
      }
      setRoadmap(demo)
      toast.success('🗺️ Roadmap generated! (Demo mode)')
    } finally { setGenerating(false) }
  }

  const toggleStep = (stepId) => {
    setRoadmap(prev => {
      if (!prev) return prev
      return {
        ...prev,
        phases: prev.phases.map(phase => ({
          ...phase,
          steps: phase.steps.map(step => {
            if (step.id !== stepId) return step
            const cycle = { 'pending': 'in-progress', 'in-progress': 'done', 'done': 'pending' }
            return { ...step, status: cycle[step.status] || 'in-progress' }
          }),
        })),
      }
    })
  }

  const allSteps = roadmap?.phases?.flatMap(p => p.steps) || []
  const doneSteps = allSteps.filter(s => s.status === 'done').length
  const totalSteps = allSteps.length
  const progress = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48 rounded-xl" />
        <div className="skeleton h-32 rounded-2xl" />
        <div className="skeleton h-48 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {!roadmap && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-5xl"
            style={{ background: 'var(--accent-light)' }}>🗺️</div>
          <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>No roadmap yet</h3>
          <p className="font-body text-sm mb-8 max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
            Tell us your dream career and we'll build a personalized step-by-step learning path.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input value={goalInput} onChange={e => setGoalInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generateRoadmap()}
              className="input-field flex-1" placeholder="e.g. Full Stack Developer, CA..." />
            <button onClick={generateRoadmap} disabled={generating || !goalInput.trim()}
              className="btn-primary px-5 flex items-center gap-2 disabled:opacity-50">
              {generating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Sparkles size={16} />}
              Generate
            </button>
          </div>
        </div>
      )}

      {roadmap && (
        <>
          <div className="glass-card rounded-2xl p-4">
            <p className="font-display font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
              ✨ Generate a different roadmap
            </p>
            <div className="flex gap-3">
              <input value={goalInput} onChange={e => setGoalInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && generateRoadmap()}
                className="input-field flex-1 text-sm" placeholder="Enter new career goal..." />
              <button onClick={generateRoadmap} disabled={generating || !goalInput.trim()}
                className="btn-primary px-4 flex items-center gap-2 disabled:opacity-50 text-sm">
                {generating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Sparkles size={14} />}
                Generate
              </button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                  Path to: <span style={{ color: 'var(--accent)' }}>{roadmap.goal}</span>
                </h3>
                <p className="font-body text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {doneSteps} of {totalSteps} steps completed
                </p>
              </div>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-display font-black text-2xl"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                {progress}%
              </div>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-input)' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: 'var(--accent)', boxShadow: '0 0 10px var(--shadow)' }} />
            </div>
          </div>

          {roadmap?.phases?.map(phase => (
            <div key={phase.phase} className="glass-card rounded-2xl overflow-hidden">
              <div className="flex items-center gap-4 p-5 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm"
                  style={phase.status === 'completed'
                    ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e' }
                    : phase.status === 'in-progress'
                    ? { background: 'var(--accent-light)', color: 'var(--accent)' }
                    : { background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
                  {phase.status === 'completed' ? <Check size={16} /> : phase.status === 'locked' ? <Lock size={14} /> : `0${phase.phase}`}
                </div>
                <div>
                  <p className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                    Phase {phase.phase}: {phase.title}
                  </p>
                  <p className="font-body text-xs capitalize" style={{
                    color: phase.status === 'completed' ? '#22c55e' : phase.status === 'in-progress' ? 'var(--accent)' : 'var(--text-muted)'
                  }}>
                    {phase.status?.replace('-', ' ')}
                  </p>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {phase.steps?.map(step => (
                  <StepCard key={step.id} step={step} onToggle={toggleStep} />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}


// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT — TABS
// ════════════════════════════════════════════════════════════════
export default function Roadmap() {
  const [activeTab, setActiveTab] = useState('tree')

  const tabs = [
    { id: 'tree', label: 'Pathway Explorer', icon: GitBranch, desc: 'Indian Education Tree' },
    { id: 'ai',   label: 'AI Roadmap',       icon: Sparkles,  desc: 'Personalized Path' },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
          🗺️ Career Roadmap
        </h2>
        <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
          Explore all career paths or get a personalized AI roadmap
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        {tabs.map(tab => {
          const active = activeTab === tab.id
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl font-display font-semibold text-sm transition-all duration-200"
              style={active
                ? { background: 'var(--accent)', color: 'white', boxShadow: '0 4px 16px var(--shadow)' }
                : { background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
              <tab.icon size={16} />
              <div className="text-left">
                <p>{tab.label}</p>
                <p className="text-xs font-body font-normal" style={{ opacity: 0.7 }}>{tab.desc}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'tree' ? <PathwayExplorer /> : <AIRoadmap />}
    </div>
  )
}