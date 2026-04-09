import datetime
from flask import Blueprint, request, jsonify
from db import get_db
from bson import ObjectId
from ai_engine import analyze_resume, skill_gap_analysis, predict_salary, generate_roadmap, chat_with_ai, generate_mock_test, get_job_recommendations

ai_bp = Blueprint('ai_services', __name__)


@ai_bp.route('/api/ai/analyze-resume', methods=['POST'])
def ai_analyze_resume():
    if 'resume_file' not in request.files:
        return jsonify({'error': 'Resume file is required'}), 400
        
    file = request.files['resume_file']
    target_role = request.form.get('target_role', 'Software Engineer')
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    resume_text = ""
    filename = file.filename.lower()
    
    try:
        if filename.endswith('.pdf'):
            import PyPDF2
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                extracted = page.extract_text()
                if extracted:
                    resume_text += extracted + "\n"
        elif filename.endswith(('.png', '.jpg', '.jpeg')):
            import pytesseract
            from PIL import Image
            image = Image.open(file.stream)
            resume_text = pytesseract.image_to_string(image)
        else:
            return jsonify({'error': 'Unsupported file format. Please upload PDF or Image.'}), 400
            
    except Exception as e:
        return jsonify({'error': f'Failed to process file: {str(e)}'}), 500

    if not resume_text.strip():
        return jsonify({'error': 'Could not extract text from the provided file.'}), 400

    result = analyze_resume(resume_text, target_role)
    return jsonify(result)


@ai_bp.route('/api/ai/skill-gap', methods=['POST'])
def ai_skill_gap():
    db = get_db()
    data = request.get_json()
    student_id = data.get('student_id')
    target_role = data.get('target_role', 'Software Engineer')
    skills = data.get('skills', [])

    student_info = None
    if student_id and ObjectId.is_valid(student_id):
        student = db.students.find_one({'_id': ObjectId(student_id)})
        if student:
            skills = student.get('skills', [])
            student_info = {
                'cgpa': student.get('cgpa', 0),
                'projects': student.get('projects', 0),
                'internships': student.get('internships', 0),
                'branch': student.get('branch', '')
            }

    if not skills:
        return jsonify({'error': 'Skills are required'}), 400

    result = skill_gap_analysis(skills, target_role, student_info)
    return jsonify(result)


@ai_bp.route('/api/ai/predict-salary', methods=['POST'])
def ai_predict_salary():
    data = request.get_json()
    cgpa = data.get('cgpa', 7.0)
    skills = data.get('skills', [])
    projects = data.get('projects', 0)
    internships = data.get('internships', 0)
    branch = data.get('branch', 'Computer Science')

    result = predict_salary(cgpa, skills, projects, internships, branch)
    return jsonify(result)


@ai_bp.route('/api/ai/roadmap', methods=['POST'])
def ai_roadmap():
    db = get_db()
    data = request.get_json()
    student_id = data.get('student_id')
    career_goal = data.get('career_goal', 'Software Engineer')
    target_package = data.get('target_package')

    student_info = {'name': 'Student', 'branch': 'CS', 'cgpa': 7.0, 'skills': [], 'projects': 0, 'internships': 0}

    if student_id and ObjectId.is_valid(student_id):
        student = db.students.find_one({'_id': ObjectId(student_id)})
        if student:
            student_info = {
                'name': student.get('name', ''),
                'branch': student.get('branch', ''),
                'cgpa': student.get('cgpa', 0),
                'skills': student.get('skills', []),
                'projects': student.get('projects', 0),
                'internships': student.get('internships', 0)
            }

    result = generate_roadmap(student_info, career_goal, target_package)
    return jsonify(result)


@ai_bp.route('/api/ai/chat', methods=['POST'])
def ai_chat():
    data = request.get_json()
    message = data.get('message', '')
    history = data.get('history', [])

    if not message:
        return jsonify({'error': 'Message is required'}), 400

    response = chat_with_ai(message, history)
    return jsonify({'response': response})

@ai_bp.route('/api/ai/generate-test', methods=['POST'])
def ai_generate_test():
    data = request.get_json()
    difficulty = data.get('difficulty', 'Medium')
    subject = data.get('subject', 'General Aptitude & Coding')
    student_id = data.get('student_id')

    result = generate_mock_test(difficulty, subject, student_id)
    return jsonify(result)

@ai_bp.route('/api/ai/save-test-result', methods=['POST'])
def ai_save_test_result():
    db = get_db()
    data = request.get_json()
    student_id = data.get('student_id')
    
    if not student_id or not ObjectId.is_valid(student_id):
        return jsonify({'error': 'Valid Student ID is required'}), 400

    test_result = {
        'student_id': ObjectId(student_id),
        'test_title': data.get('test_title'),
        'difficulty': data.get('difficulty'),
        'subject': data.get('subject'),
        'score': data.get('score'),
        'total_questions': data.get('total_questions'),
        'completed_at': datetime.datetime.utcnow(),
        'answers': data.get('answers'),
        'questions': data.get('questions')
    }
    
    db.test_history.insert_one(test_result)
    return jsonify({'message': 'Test result saved successfully'})


@ai_bp.route('/api/ai/test-history/<student_id>', methods=['GET'])
def ai_get_test_history(student_id):
    db = get_db()
    
    if not student_id or not ObjectId.is_valid(student_id):
        return jsonify({'error': 'Valid Student ID is required'}), 400

    history = list(db.test_history.find({'student_id': ObjectId(student_id)}).sort('completed_at', -1))
    
    # Format for JSON
    for h in history:
        h['_id'] = str(h['_id'])
        h['student_id'] = str(h['student_id'])
        h['completed_at'] = h['completed_at'].isoformat()
        
    return jsonify(history)

@ai_bp.route('/api/ai/job-recommendations/<student_id>', methods=['GET'])
def ai_get_job_recommendations(student_id):
    db = get_db()
    if not student_id or not ObjectId.is_valid(student_id):
        return jsonify({'error': 'Valid Student ID is required'}), 400

    student = db.students.find_one({'_id': ObjectId(student_id)})
    if not student:
        return jsonify({'error': 'Student not found'}), 404

    companies = list(db.companies.find({}))
    for c in companies:
        c['_id'] = str(c['_id'])
        if 'created_at' in c:
            c['created_at'] = c['created_at'].isoformat()

    profile_text = f"Student Profile:\nBranch: {student.get('branch', 'N/A')}\nCGPA: {student.get('cgpa', 'N/A')}\nSkills: {', '.join(student.get('skills', []))}"

    result = get_job_recommendations(profile_text, companies)
    return jsonify(result)

@ai_bp.route('/api/ai/job-match-resume', methods=['POST'])
def ai_job_match_resume():
    if 'resume_file' not in request.files:
        return jsonify({'error': 'Resume file is required'}), 400
        
    file = request.files['resume_file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    resume_text = ""
    filename = file.filename.lower()
    
    try:
        if filename.endswith('.pdf'):
            import PyPDF2
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                extracted = page.extract_text()
                if extracted:
                    resume_text += extracted + "\n"
        elif filename.endswith(('.png', '.jpg', '.jpeg')):
            import pytesseract
            from PIL import Image
            image = Image.open(file.stream)
            resume_text = pytesseract.image_to_string(image)
        else:
            return jsonify({'error': 'Unsupported file format'}), 400
            
    except Exception as e:
        return jsonify({'error': f'Failed to process file: {str(e)}'}), 500

    if not resume_text.strip():
        return jsonify({'error': 'Could not extract text from the provided file.'}), 400

    db = get_db()
    companies = list(db.companies.find({}))
    for c in companies:
        c['_id'] = str(c['_id'])
        if 'created_at' in c:
            c['created_at'] = c['created_at'].isoformat()

    result = get_job_recommendations(resume_text, companies)
    return jsonify(result)


# ─── AI INTERVIEW ENDPOINT ────────────────────────────────────────────────────
@ai_bp.route('/api/ai/interview', methods=['POST'])
def ai_interview():
    """Multi-turn voice-based AI interview — unlimited turns, no JSON leaks."""
    from config import Config
    try:
        from groq import Groq
        client = Groq(api_key=Config.GROQ_API_KEY)
    except Exception:
        return jsonify({'error': 'Groq not configured'}), 503

    data = request.get_json()
    message   = data.get('message', '')
    history   = data.get('history', [])
    role      = data.get('role', 'Software Engineer')
    difficulty= data.get('difficulty', 'Intermediate')
    language  = data.get('language', 'en-US')
    is_finish = message == '__FINISH__'
    is_start  = message == '__START__'

    q_asked = sum(1 for m in history if m.get('role') == 'user')

    # Language hint for the LLM
    lang_map = {
        'en-US': 'English',  'en-IN': 'English (Indian accent)',
        'hi-IN': 'Hindi',    'mr-IN': 'Marathi',
        'ta-IN': 'Tamil',    'te-IN': 'Telugu',
        'kn-IN': 'Kannada',  'gu-IN': 'Gujarati',
        'fr-FR': 'French',   'de-DE': 'German', 'es-ES': 'Spanish',
    }
    lang_label = lang_map.get(language, 'English')

    if is_finish:
        # ── Generate honest comprehensive final report ──────────────────
        system_prompt = f"""You are ARIA, a professional AI interviewer.
The candidate has requested to finish the interview. You have conducted {q_asked} questions so far.

Write a FINAL comprehensive, honest, and constructive performance report for the candidate.
Speak directly to the candidate in {lang_label}.
Highlight:
- Overall performance and communication quality
- Technical depth observed
- Confidence and tone
- Clear, actionable strengths and areas to improve
- An honest overall score (0-100) with justification

Respond ONLY in this exact JSON format:
{{
  "reply": "<warm, spoken closing statement in {lang_label}>",
  "score": null,
  "feedback": null,
  "is_last": true,
  "overall_feedback": "<honest 3-5 sentence comprehensive assessment in {lang_label}>"
}}"""
        messages = [{"role": "system", "content": system_prompt}]
        for m in history[-20:]:
            r = m.get('role', 'user')
            if r not in ('user', 'assistant', 'system'):
                r = 'assistant'
            messages.append({"role": r, "content": m.get('content', '')})
    else:
        # ── Normal interview turn ──────────────────────────────────────
        system_prompt = f"""You are ARIA — a highly professional, empathetic, and sharp AI technical interviewer at a top-tier tech company.

You are conducting an UNLIMITED mock interview for the role of: {role}
Difficulty level: {difficulty}
Candidate's preferred language: {lang_label}

STRICT RULES:
1. Always stay in character as a real human interviewer. Never reveal you are AI.
2. Ask ONE focused question per turn.
3. After each candidate answer: give brief warm feedback (1 sentence), silently score it (0-100), then ask the next question.
4. Vary question types: technical, situational, behavioral, problem-solving.
5. NEVER stop the interview yourself — it runs until the candidate clicks "Finish".
6. If candidate speaks in {lang_label}, respond in {lang_label}.
7. CRITICAL: Your entire response must be ONLY valid JSON — no extra text, no markdown, no explanation outside the JSON.

Response format (STRICT — no deviation):
{{
  "reply": "<your complete spoken response as interviewer in {lang_label} — includes feedback on previous answer AND the next question>",
  "score": <integer 0-100 for the candidate's latest answer, or null if this is the opening>,
  "feedback": "<one-sentence constructive feedback on the latest answer, or null>",
  "is_last": false,
  "overall_feedback": null
}}

Questions asked so far: {q_asked}"""

        messages = [{"role": "system", "content": system_prompt}]
        for m in history[-20:]:
            r = m.get('role', 'user')
            if r not in ('user', 'assistant', 'system'):
                r = 'assistant'
            messages.append({"role": r, "content": m.get('content', '')})

        if not is_start:
            messages.append({"role": "user", "content": message})

    try:
        response = client.chat.completions.create(
            model=Config.GROQ_MODEL or 'llama-3.3-70b-versatile',
            messages=messages,
            temperature=0.75,
            max_tokens=700,
            response_format={"type": "json_object"},  # force Groq JSON mode
        )
        raw = response.choices[0].message.content.strip()

        import json as _json
        try:
            result = _json.loads(raw)
        except Exception:
            # Safeguard: strip markdown fences and retry
            for fence in ['```json', '```']:
                if fence in raw:
                    raw = raw.split(fence)[1].split('```')[0].strip()
                    break
            try:
                result = _json.loads(raw)
            except Exception:
                result = {
                    "reply": raw,
                    "score": None,
                    "feedback": None,
                    "is_last": is_finish,
                    "overall_feedback": raw if is_finish else None,
                }

        # Safety: if reply accidentally contains JSON characters, strip them
        reply_text = result.get('reply', '')
        if reply_text.startswith('{') or reply_text.startswith('['):
            result['reply'] = "Thank you for your answer. Let me ask you the next question."

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def ai_interview():
    """Multi-turn voice-based AI interview with scoring and feedback."""
    from config import Config
    try:
        from groq import Groq
        client = Groq(api_key=Config.GROQ_API_KEY)
    except Exception:
        return jsonify({'error': 'Groq not available'}), 503

    data = request.get_json()
    message = data.get('message', '')
    history = data.get('history', [])          # list of {role, content}
    role = data.get('role', 'Software Engineer')
    difficulty = data.get('difficulty', 'Intermediate')
    num_questions = int(data.get('num_questions', 5))

    # Count how many questions the AI has already asked
    ai_turns = [m for m in history if m.get('role') == 'assistant']
    candidate_turns = [m for m in history if m.get('role') == 'user']
    q_asked = len(candidate_turns)

    system_prompt = f"""You are ARIA — a professional, empathetic and sharp AI technical interviewer at a top tech firm.

You are conducting a {difficulty} level mock interview for the role of {role}.
Total questions to ask: {num_questions}.

STRICT RULES:
1. Always stay in character as a professional interviewer.
2. Ask exactly ONE question per response.
3. After the candidate answers, give brief encouraging feedback (1-2 sentences), score it (0-100), then ask the next question.
4. Do NOT reveal you are an AI. Act human and natural.
5. After the final ({num_questions}th) answer, give comprehensive feedback and close the interview graciously.
6. Respond ONLY in JSON with this exact format:
{{
  "reply": "<your spoken response as interviewer>",
  "score": <null or integer 0-100 for the latest answer>,
  "feedback": "<null or concise feedback for the latest answer>",
  "is_last": <true if this was the last question and interview is complete, else false>,
  "overall_feedback": "<null or 2-3 sentence holistic feedback only when is_last is true>"
}}

Questions asked so far: {q_asked} / {num_questions}
"""

    messages = [{"role": "system", "content": system_prompt}]

    # Add conversation history
    for m in history:
        r = m.get('role', 'user')
        if r not in ('user', 'assistant', 'system'):
            r = 'assistant'
        messages.append({"role": r, "content": m.get('content', '')})

    # Add current user message (unless it's the start signal)
    if message != '__START__':
        messages.append({"role": "user", "content": message})

    try:
        response = client.chat.completions.create(
            model=Config.GROQ_MODEL or 'llama-3.3-70b-versatile',
            messages=messages,
            temperature=0.75,
            max_tokens=600
        )
        raw = response.choices[0].message.content.strip()

        # Try to parse JSON
        import json as _json
        try:
            if '```json' in raw:
                raw = raw.split('```json')[1].split('```')[0].strip()
            elif '```' in raw:
                raw = raw.split('```')[1].split('```')[0].strip()
            result = _json.loads(raw)
        except Exception:
            # Fallback: wrap raw text as a reply
            result = {
                "reply": raw,
                "score": None,
                "feedback": None,
                "is_last": q_asked >= num_questions,
                "overall_feedback": None
            }

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

