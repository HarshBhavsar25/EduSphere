import os
import json
from config import Config

try:
    from groq import Groq
    GROQ_AVAILABLE = True
except ImportError:
    GROQ_AVAILABLE = False


def _get_client():
    """Return a Groq client if API key is configured, else None."""
    if not GROQ_AVAILABLE:
        return None
    api_key = Config.GROQ_API_KEY
    if not api_key or api_key == 'your_groq_api_key_here':
        return None
    return Groq(api_key=api_key)


def _call_groq(prompt: str, system: str = "You are a helpful AI career advisor.", max_tokens: int = 2048) -> str | None:
    """Call Groq API directly and return the text response, or None on failure."""
    client = _get_client()
    if not client:
        return None

    models_to_try = [
        Config.GROQ_MODEL or "openai/gpt-oss-120b",
        "openai/gpt-oss-120b",
        "llama-3.3-70b-versatile"
    ]
    models_to_try = list(dict.fromkeys([m for m in models_to_try if m]))

    for model in models_to_try:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=max_tokens
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Groq API error with model '{model}': {e}")
            continue
    return None


def _parse_json(text):
    """Parse JSON from AI response, handling markdown code blocks."""
    if not text:
        return None
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        try:
            if "```json" in text:
                content = text.split("```json")[1].split("```")[0].strip()
                return json.loads(content)
            elif "```" in text:
                content = text.split("```")[1].split("```")[0].strip()
                return json.loads(content)
        except (IndexError, json.JSONDecodeError):
            pass
    return None


# ─── Resume Analyzer ──────────────────────────────────────────────────────────

def analyze_resume(resume_text, target_role="Software Engineer"):
    prompt = f"""Analyze the following resume for the target role of {target_role}.

Resume:
{resume_text}

Respond in valid JSON format only:
{{
    "skills_found": ["skill1", "skill2"],
    "experience_years": 0,
    "education": "degree details",
    "match_score": 75,
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "recommendations": ["rec1", "rec2"],
    "summary": "Brief professional summary"
}}"""

    result = _call_groq(prompt)
    if result:
        parsed = _parse_json(result)
        if parsed:
            return parsed
    return _fallback_resume_analysis(resume_text, target_role)


# ─── Skill Gap Analysis ───────────────────────────────────────────────────────

def skill_gap_analysis(student_skills, target_role, student_info=None):
    info_str = ""
    if student_info:
        info_str = f"\nStudent CGPA: {student_info.get('cgpa', 'N/A')}, Projects: {student_info.get('projects', 0)}, Internships: {student_info.get('internships', 0)}, Branch: {student_info.get('branch', 'N/A')}"

    prompt = f"""Analyze the skill gap for a student targeting the role of {target_role}.

Current Skills: {', '.join(student_skills)}{info_str}

Respond in valid JSON format only:
{{
    "missing_skills": ["skill1", "skill2"],
    "skills_to_improve": ["skill1", "skill2"],
    "learning_path": [
        {{"skill": "skill_name", "resource": "resource_name", "duration": "2 weeks", "priority": "high"}}
    ],
    "estimated_time_to_ready": "3-6 months",
    "match_percentage": 60,
    "recommendations": ["rec1", "rec2"]
}}"""

    result = _call_groq(prompt)
    if result:
        parsed = _parse_json(result)
        if parsed:
            return parsed
    return _fallback_skill_gap(student_skills, target_role)


# ─── Salary Predictor ─────────────────────────────────────────────────────────

def predict_salary(cgpa, skills, projects, internships, branch):
    skills_str = ', '.join(skills) if isinstance(skills, list) else skills

    prompt = f"""Predict a realistic salary range for a fresh graduate in India with this profile:

CGPA: {cgpa}
Skills: {skills_str}
Number of Projects: {projects}
Internships: {internships}
Branch: {branch}

Respond in valid JSON format only:
{{
    "predicted_min_lpa": 4.5,
    "predicted_max_lpa": 8.0,
    "predicted_avg_lpa": 6.0,
    "confidence": "medium",
    "factors": [
        {{"factor": "CGPA", "impact": "positive", "detail": "Above average CGPA"}},
        {{"factor": "Skills", "impact": "positive", "detail": "In-demand technology stack"}}
    ],
    "recommendations_to_increase": ["Learn cloud computing", "Get AWS certification"],
    "market_insight": "Brief market insight for this profile"
}}"""

    result = _call_groq(prompt, system="You are an expert salary prediction AI for fresh graduates in India.")
    if result:
        parsed = _parse_json(result)
        if parsed:
            return parsed
    return _fallback_salary_prediction(cgpa, skills, projects, internships, branch)


# ─── Career Roadmap ───────────────────────────────────────────────────────────

def generate_roadmap(student_info, career_goal, target_package=None):
    pkg_str = f"\nTarget Package: {target_package} LPA" if target_package else ""

    prompt = f"""Create a personalized 6-month career roadmap for this student.

Student Profile:
- Name: {student_info.get('name', 'Student')}
- Branch: {student_info.get('branch', 'N/A')}
- CGPA: {student_info.get('cgpa', 'N/A')}
- Current Skills: {', '.join(student_info.get('skills', []))}
- Projects: {student_info.get('projects', 0)}
- Internships: {student_info.get('internships', 0)}{pkg_str}

Career Goal: {career_goal}

Respond in valid JSON format only:
{{
    "career_goal": "{career_goal}",
    "current_readiness": 45,
    "months": [
        {{
            "month": 1,
            "title": "Foundation Building",
            "focus_areas": ["area1", "area2"],
            "skills_to_learn": ["skill1", "skill2"],
            "projects": ["project1"],
            "certifications": ["cert1"],
            "milestones": ["milestone1"]
        }}
    ],
    "resources": ["resource1", "resource2"],
    "tips": ["tip1", "tip2"]
}}"""

    result = _call_groq(prompt, system="You are an expert career counselor for engineering students in India.")
    if result:
        parsed = _parse_json(result)
        if parsed:
            return parsed
    return _fallback_roadmap(student_info, career_goal)


# ─── Job Match ────────────────────────────────────────────────────────────────

def get_job_recommendations(profile_text, companies_info):
    companies_subset = companies_info[:20]
    companies_str = json.dumps(companies_subset, default=str)
    
    prompt = f"""Match the following candidate profile against the provided list of companies and pick the top 3-5 matches.

Candidate Profile/Resume:
{profile_text}

Companies Available (JSON list):
{companies_str}

Respond in valid JSON format only, matching this exact structure:
{{
    "matches": [
        {{
            "company": "Company Name",
            "role": "Suggested Role",
            "industry": "Industry",
            "match_score": 85,
            "package": "Expected Package (number)",
            "reason": "Why this is a good match",
            "matched_skills": ["skill1", "skill2"]
        }}
    ]
}}
"""

    result = _call_groq(prompt, system="You are an expert AI recruiter matching candidates to companies.")
    if result:
        parsed = _parse_json(result)
        if parsed and isinstance(parsed.get("matches"), list):
            return parsed
    return _fallback_job_match(profile_text, companies_subset)


# ─── Chat with AI ─────────────────────────────────────────────────────────────

def chat_with_ai(message, conversation_history=None):
    client = _get_client()
    if not client:
        return _fallback_chat(message)

    messages = [{
        "role": "system",
        "content": (
            "You are an expert AI Placement Assistant for the EduSphere campus placement portal. "
            "Help students with career guidance, DSA & coding roadmaps, technical & HR interview preparation, "
            "resume reviews, salary negotiation, and placement strategy.\n\n"
            "CRITICAL FORMATTING GUIDELINES:\n"
            "1. Output clean, structured Markdown.\n"
            "2. Use clear headings (###) for major sections.\n"
            "3. Use bullet points (-) and numbered steps (1., 2.) with **bold keywords** for high scannability.\n"
            "4. NEVER output raw HTML tags like <br>, <div>, <span>, or <p>.\n"
            "5. Avoid dense, wide Markdown tables in chat bubbles; prefer structured bullet points or step-by-step lists so it reads beautifully on all screens.\n"
            "6. Use triple-backtick markdown blocks with language identifier for code snippets.\n"
            "7. Keep responses concise, organized, actionable, and encouraging."
        )
    }]

    if conversation_history:
        for msg in conversation_history[-6:]:
            role = msg.get("role", "user")
            # Groq only accepts: 'user', 'assistant', 'system'
            # Frontend uses 'ai' as display role — map it to 'assistant'
            if role not in ("user", "assistant", "system"):
                role = "assistant"
            messages.append({"role": role, "content": msg.get("content", "")})

    messages.append({"role": "user", "content": message})

    models_to_try = [
        Config.GROQ_MODEL or "openai/gpt-oss-120b",
        "openai/gpt-oss-120b",
        "llama-3.3-70b-versatile"
    ]
    models_to_try = list(dict.fromkeys([m for m in models_to_try if m]))

    last_error = None
    for model in models_to_try:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0.7,
                max_tokens=1200
            )
            content = response.choices[0].message.content or ""
            # Clean up any accidental HTML tags or table breaks
            import re
            content = re.sub(r'<br\s*/?>', '\n', content, flags=re.IGNORECASE)
            return content.strip()
        except Exception as e:
            print(f"Groq chat error with model '{model}': {e}")
            last_error = e
            continue
    return f"I'm having trouble connecting to the AI service. Error: {str(last_error)}"



# ─── Mock Test Generator ─────────────────────────────────────────────────────

def generate_mock_test(difficulty="Medium", subject="General Aptitude & Coding", student_id=None):
    """Generate a list of multiple choice questions based on difficulty and subject."""
    
    prompt = f"""Generate a mock placement test with 20 multiple-choice questions. 
    Make sure the questions are diverse and strictly follow the {difficulty} difficulty level for {subject}.
    
    Respond in valid JSON format only. Use this exact structure:
{{
    "test_title": "{difficulty} level {subject} Test",
    "difficulty": "{difficulty}",
    "subject": "{subject}",
    "questions": [
        {{
            "question": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": 0,
            "explanation": "Brief explanation."
        }}
    ]
}}"""

    # Higher token limit for 20 questions
    result = _call_groq(prompt, system="You are an expert technical interviewer. Provide 20 diverse MCQs.", max_tokens=4096)
    if result:
        parsed = _parse_json(result)
        if parsed and isinstance(parsed.get('questions'), list) and len(parsed['questions']) > 0:
            return parsed
    return _fallback_mock_test(difficulty, subject)


# ─── Fallback functions (when Groq API is unavailable) ───────────────────────

def _fallback_mock_test(difficulty, subject):
    # Providing some static questions as fallback
    return {
        "test_title": f"{difficulty} level {subject} Test (Static)",
        "difficulty": difficulty,
        "subject": subject,
        "questions": [
            {
                "question": "What is the time complexity of searching an element in a binary search tree in the worst case?",
                "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                "correct_answer": 2,
                "explanation": "In the worst case (skewed tree), BST search takes O(n)."
            },
            {
                "question": "Which data structure uses LIFO (Last In First Out) principle?",
                "options": ["Queue", "Stack", "Linked List", "Array"],
                "correct_answer": 1,
                "explanation": "Stack follows LIFO principle."
            },
            {
                "question": "In Python, which of the following is an immutable data type?",
                "options": ["List", "Dictionary", "Set", "Tuple"],
                "correct_answer": 3,
                "explanation": "Tuples are immutable in Python."
            },
            {
                "question": "What does SQL stand for?",
                "options": ["Structured Query Language", "Sequential Query Language", "Simple Query Language", "System Query Language"],
                "correct_answer": 0,
                "explanation": "SQL stands for Structured Query Language."
            },
            {
                "question": "Which of the following is NOT a fundamental principle of OOP?",
                "options": ["Encapsulation", "Inheritance", "Compilation", "Polymorphism"],
                "correct_answer": 2,
                "explanation": "Compilation is a process, not an OOP principle (which are Encapsulation, Inheritance, Polymorphism, Abstraction)."
            }
        ]
    }


def _fallback_resume_analysis(resume_text, target_role):
    words = resume_text.lower().split()
    common_skills = ['python', 'java', 'javascript', 'react', 'node', 'sql', 'html', 'css',
                     'c++', 'machine learning', 'flask', 'django', 'aws', 'docker', 'git']
    found_skills = [s for s in common_skills if s in words]
    return {
        "skills_found": found_skills,
        "experience_years": 0,
        "education": "Extracted from resume",
        "match_score": min(len(found_skills) * 10, 85),
        "strengths": [skip for i, skip in enumerate(found_skills) if i < 3] if found_skills else ["Resume submitted"],
        "weaknesses": ["AI analysis unavailable — Groq API key not configured"],
        "recommendations": ["Add your Groq API key in Render environment variables for full AI analysis"],
        "summary": f"Basic keyword analysis for {target_role}."
    }


def _fallback_skill_gap(skills, target_role):
    role_requirements = {
        "Software Engineer": ["DSA", "System Design", "Python", "Java", "Git", "SQL", "REST APIs"],
        "Data Scientist": ["Python", "Machine Learning", "Statistics", "SQL", "TensorFlow", "Pandas"],
        "Web Developer": ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "Git"],
        "DevOps Engineer": ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform"],
    }
    required = role_requirements.get(target_role, role_requirements["Software Engineer"])
    skills_lower = [s.lower() for s in skills]
    missing = [r for r in required if r.lower() not in skills_lower]
    return {
        "missing_skills": missing,
        "skills_to_improve": [s for i, s in enumerate(skills) if i < 3],
        "learning_path": [{"skill": s, "resource": f"Learn {s} online", "duration": "2-4 weeks", "priority": "high"} for i, s in enumerate(missing) if i < 5],
        "estimated_time_to_ready": "3-6 months",
        "match_percentage": max(0, 100 - len(missing) * 15),
        "recommendations": [
            "Focus on high-frequency DSA topics (Trees, Graphs, DP)",
            "Build full-stack applications with user authentication and database optimization",
            "Participate regularly in coding contests on LeetCode or CodeChef"
        ]
    }


def _fallback_salary_prediction(cgpa, skills, projects, internships, branch):
    base = 4.5
    base += (cgpa - 6) * 1.2 if cgpa > 6 else 0
    skill_count = len(skills) if isinstance(skills, list) else len(skills.split(','))
    base += skill_count * 0.35
    base += projects * 0.5
    base += internships * 1.0
    return {
        "predicted_min_lpa": float(f"{max(3.0, base - 1.5):.1f}"),
        "predicted_max_lpa": float(f"{base + 3.0:.1f}"),
        "predicted_avg_lpa": float(f"{base:.1f}"),
        "confidence": "medium",
        "factors": [
            {"factor": "CGPA", "impact": "positive" if cgpa > 7.5 else "neutral", "detail": f"CGPA: {cgpa}"},
            {"factor": "Skills", "impact": "positive", "detail": f"{skill_count} relevant technologies listed"},
            {"factor": "Practical Experience", "impact": "positive" if (projects + internships) > 2 else "neutral", "detail": f"{projects} projects, {internships} internships"}
        ],
        "recommendations_to_increase": [
            "Earn industry certifications in Cloud Computing (AWS/GCP)",
            "Deploy live full-stack projects showcasing real scalability",
            "Master Low-Level and High-Level System Design principles"
        ],
        "market_insight": "Market demand is highest for candidates with strong DSA fundamentals, distributed systems knowledge, and hands-on cloud experience."
    }


def _fallback_roadmap(student_info, career_goal):
    goal = career_goal or "Software Engineering"
    return {
        "career_goal": goal,
        "current_readiness": 55,
        "months": [
            {
                "month": 1,
                "title": "Month 1: DSA Foundations & Language Mastery",
                "focus_areas": ["Data Structures Basics", "Time & Space Complexity"],
                "skills_to_learn": ["Arrays & Strings", "Recursion", "Two Pointers"],
                "projects": ["Algorithm Visualizer CLI"],
                "certifications": ["HackerRank Problem Solving (Intermediate)"],
                "milestones": ["Solve 35+ easy and medium problems on LeetCode"]
            },
            {
                "month": 2,
                "title": "Month 2: Core Data Structures & OOP",
                "focus_areas": ["Linear & Non-Linear Structures", "Object-Oriented Design"],
                "skills_to_learn": ["Linked Lists", "Stacks & Queues", "Trees & BST"],
                "projects": ["In-Memory Key-Value Storage Engine"],
                "certifications": ["LeetCode 50 Days Badge"],
                "milestones": ["Master Binary Tree and BST Traversals"]
            },
            {
                "month": 3,
                "title": "Month 3: Advanced Algorithms & CS Core",
                "focus_areas": ["Graphs, DP & Database Fundamentals", "Operating Systems"],
                "skills_to_learn": ["BFS / DFS", "Dynamic Programming", "SQL Queries & Indexing"],
                "projects": ["Full-Stack CRUD Application with Authentication"],
                "certifications": ["SQL Intermediate Certificate"],
                "milestones": ["Solve 50+ medium LeetCode questions"]
            },
            {
                "month": 4,
                "title": "Month 4: System Design & Frameworks",
                "focus_areas": ["REST APIs", "Low-Level Design (LLD)", "Docker & Microservices"],
                "skills_to_learn": ["Design Patterns", "Caching with Redis", "Containerization"],
                "projects": ["E-Commerce Backend or Realtime Chat System"],
                "certifications": ["AWS Certified Cloud Practitioner"],
                "milestones": ["Build and deploy production-ready cloud API"]
            },
            {
                "month": 5,
                "title": "Month 5: Mock Interviews & Behavioral Prep",
                "focus_areas": ["Whiteboard Coding", "System Design Rounds", "STAR Method"],
                "skills_to_learn": ["Mock Interviewing", "Resume Optimization", "HR Prep"],
                "projects": ["Capstone Project Deployment with CI/CD"],
                "certifications": ["Advanced Problem Solving"],
                "milestones": ["Complete 5 peer mock interviews"]
            },
            {
                "month": 6,
                "title": "Month 6: Placement Drives & Negotiation",
                "focus_areas": ["Targeted Company Applications", "Technical Test Sprints"],
                "skills_to_learn": ["Speed Coding", "Offer Evaluation", "Salary Negotiation"],
                "projects": ["Portfolio Website with Live Demo Links"],
                "certifications": [],
                "milestones": ["Ace on-campus and off-campus technical rounds"]
            }
        ],
        "resources": [
            "Striver's A2Z DSA Sheet",
            "NeetCode 150 & Blind 75",
            "System Design Primer by Donne Martin",
            "InterviewBit Placement Prep Portal"
        ],
        "tips": [
            "Solve 1-2 coding problems consistently every day instead of cramming.",
            "Explain your thought process out loud before writing any code.",
            "Build at least 2 full-stack projects showcasing real deployment and testing."
        ]
    }


def _fallback_chat(message):
    return "👋 I'm the AI placement assistant! To unlock full AI-powered responses, please add your GROQ_API_KEY in the Render environment variables dashboard. In the meantime, I can tell you that consistent practice, building projects, and networking are key to landing a great placement!"


def _fallback_job_match(profile_text, companies):
    matches = []
    safe_companies = companies or []
    for j, c in enumerate(safe_companies):
        if j >= 3:
            break
        min_pkg = c.get('min_package')
        pkg = min_pkg if isinstance(min_pkg, (int, float)) else 5
        reqs = c.get('requirements')
        reqs_list = reqs if isinstance(reqs, list) else []
        
        matches.append({
            "company": c.get('name') or 'Unknown',
            "role": "Software Engineer",
            "industry": c.get('industry') or 'Technology',
            "match_score": 75,
            "package": pkg + 2,
            "reason": "AI unavailable - basic fallback match",
            "matched_skills": [s for i, s in enumerate(reqs_list) if i < 3]
        })
    return {"matches": matches}
