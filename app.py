# AI model imports
from sklearn.ensemble import RandomForestClassifier
import numpy as np
from datetime import datetime, timedelta

# Dummy training data for demonstration (to be replaced with real data)
X_train = np.array([
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
])
y_train = np.array([0, 1, 2, 3])  # 0: low risk, 1: moderate, 2: high, 3: needs urgent care

# Train a simple classifier
rf_model = RandomForestClassifier()
rf_model.fit(X_train, y_train)

# AI-driven answer confirmation and next question prediction
def ai_confirm_answer_and_predict_next(answers):
    # Pad or trim answers to length 5 for demo
    arr = np.array(answers[-5:]) if len(answers) >= 5 else np.pad(answers, (5-len(answers),0), 'constant')
    arr = arr.reshape(1, -1)
    risk_pred = rf_model.predict(arr)[0]
    # Next question logic: just pick a random one for demo
    # Use session['questions'] if available, else default to 20
    from flask import session
    num_q = len(session.get('questions', [])) or 20
    next_q_idx = random.randint(0, num_q-1)
    return risk_pred, next_q_idx

# AI-driven prescription/recommendation
def ai_generate_prescription(risk_pred):
    prescriptions = {
        0: "Low risk. Maintain healthy habits and regular checkups.",
        1: "Moderate risk. Consult your doctor and monitor symptoms.",
        2: "High risk. Schedule a medical assessment soon.",
        3: "Urgent care needed. Contact a healthcare professional immediately."
    }
    return prescriptions.get(risk_pred, "Consult a healthcare professional.")


from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = 'replace_this_with_a_random_secret_key'

# Hospital suggestion route
@app.route('/suggest_hospital', methods=['GET'])
def suggest_hospital():
    location = request.args.get('location', '').strip().lower()
    # Dummy hospital data for demonstration
    cities = [
        'agra','ahmedabad','allahabad','amritsar','bangalore','bhopal','bhubaneswar','chandigarh','chennai','coimbatore','dehradun','delhi','durgapur','faridabad','ghaziabad','goa','gurgaon','guwahati','hyderabad','indore','jaipur','jalandhar','jammu','jamshedpur','kanpur','kochi','kolkata','lucknow','ludhiana','madurai','mangalore','meerut','mumbai','nagpur','nashik','noida','patna','pune','raipur','rajkot','ranchi','siliguri','surat','thane','thiruvananthapuram','tiruchirappalli','udaipur','vadodara','varanasi','vijayawada','visakhapatnam'
    ]
    hospitals_db = {
        'delhi': [
            {'name': 'AIIMS Neurology Department', 'url': 'https://www.aiims.edu/en/departments/clinical-departments/neurology.html'},
            {'name': 'Fortis Escorts Memory Clinic', 'url': 'https://www.fortishealthcare.com/india/clinics/memory-clinic'}
        ],
        'mumbai': [
            {'name': 'Jaslok Hospital Memory Clinic', 'url': 'https://www.jaslokhospital.net/speciality/memory-clinic'},
            {'name': 'Nanavati Max Super Speciality Hospital', 'url': 'https://www.nanavatimaxhospital.org/specialities/neurology'}
        ],
        'bangalore': [
            {'name': 'NIMHANS Hospital', 'url': 'https://www.nimhans.ac.in/'},
            {'name': 'Manipal Hospital Neurology', 'url': 'https://www.manipalhospitals.com/bangalore/specialities/neurology/'}
        ],
        'chennai': [
            {'name': 'Apollo Hospitals Memory Clinic', 'url': 'https://www.apollohospitals.com/locations/chennai/'},
            {'name': 'SIMS Hospital Neurology', 'url': 'https://simshospitals.com/neurology/'}
        ],
        'kolkata': [
            {'name': 'Apollo Gleneagles Neurology', 'url': 'https://www.apollogleneagles.in/neurology/'},
            {'name': 'AMRI Hospital Memory Clinic', 'url': 'https://www.amrihospitals.in/department/neurology'}
        ],
        'hyderabad': [
            {'name': 'Yashoda Hospitals Neurology', 'url': 'https://www.yashodahospitals.com/department/neurology/'},
            {'name': 'Care Hospitals Memory Clinic', 'url': 'https://www.carehospitals.com/specialities/neurology/'}
        ],
        'pune': [
            {'name': 'Ruby Hall Clinic Neurology', 'url': 'https://www.rubyhall.com/neurology.html'},
            {'name': 'Jehangir Hospital Memory Clinic', 'url': 'https://www.jehangirhospital.com/specialities/neurology/'}
        ]
    }
    # Add placeholder hospital for cities not in hospitals_db
    for city in cities:
        if city not in hospitals_db:
            hospitals_db[city] = [
                {'name': f'{city.title()} General Hospital', 'url': 'https://www.google.com/search?q=' + city + '+hospital+neurology'}
            ]
    hospitals = hospitals_db.get(location, [])
    # Pass cities for dropdown
    dementia_images = [
        url_for('static', filename='elderly-landing.png'),
        url_for('static', filename='brain-landing.svg'),
        url_for('static', filename='logo.svg')
    ]
    return render_template('hospital_suggestion.html', hospitals=hospitals, selected_city=location, cities=cities, dementia_images=dementia_images)

# Info pages routes
@app.route('/how_it_works')
def how_it_works():
    return render_template('how_it_works.html')

@app.route('/what_is_dementia')
def what_is_dementia():
    return render_template('what_is_dementia.html')

@app.route('/symptoms')
def symptoms():
    return render_template('symptoms.html')


# Simple AI-driven question generator for dementia detection
import random

def generate_ai_questions(num_questions=20):
    # Always include the memory introduction question (lost question) as the first
    intro_memory = {"question": "I will say three words: apple table penny. Please select the three words I just said.", "options": ["apple table penny" ,"apple chair coin", "banana table penny", "apple table book"], "answer": 0}
    # And the recall question will be placed near the end to test short-term recall
    recall_memory = {"question": "Which three words did I ask you to remember earlier?", "options": ["apple table book", "apple chair coin", "banana table Penny", "apple table penny"], "answer": 3}
    other_templates = [
        # Cognitive: Attention
        {"question": "Count backward by 3s from 15.", "options": ["15 12 9 6 3", "15 14 13 12 11", "15 10 5 0", "15 13 11, 9, 7"], "answer": 0},
        {"question": "Which of these is the next number in the sequence: 2 5 8 11 ?", "options": ["14","13", "12", "15"], "answer": 0},
        # Cognitive: Sequencing
        {"question": "Arrange these numbers in ascending order: 7 2 9 4.", "options": ["2 4 7 9", "9 7 4 2", "4 2 7 9", "7 2 4 9"], "answer": 0},
        {"question": "Which comes first in the week?", "options": ["Monday", "Friday", "Sunday", "Wednesday"], "answer": 2},
        # Cognitive: Problem-solving
        {"question": "If you have 3 apples and give away 1, how many are left?", "options": ["2", "3", "1", "4"], "answer": 0},
        {"question": "If you see smoke in your house, what should you do?", "options": ["Leave and call for help", "Go to sleep", "Watch TV", "Do nothing"], "answer": 0},
        # Orientation
        {"question": "Did you get lost in a familiar place,like your own neighborhood?", "options":["Yes","No","Maybe","I don't remember"],"answer":1},
        {"question": "What color is the sky on a clear day?", "options": ["Blue", "Green", "Red", "Yellow"], "answer": 0},
        {"question": "Which animal can fly?", "options": ["Dog", "Cat", "Bird", "Horse"], "answer": 2},
        # Daily functioning
        {"question": "Which of these do you do first in the morning?", "options": ["Eat Food", "Wake Up", "Go to bed", "Watch TV"], "answer": 1},
        {"question": "What do you use to brush your teeth?", "options": ["Toothbrush", "Fork", "Spoon", "Comb"], "answer": 0},
        {"question": "Which activity do you need help with most?", "options": ["Bathing", "Reading", "Watching TV", "Sleeping"], "answer": 1},
        {"question": "Which of these do you do independently?", "options": ["Dress yourself", "Fly a plane", "Build a house", "Write a book"], "answer": 0},
        {"question": "Who usually prepares your meals?", "options": ["I do", "Family member", "Restaurant", "Friend"], "answer": 0},
        {"question": "How do you manage your money?", "options": ["Independently", "With help", "Not at all", "I don't know"], "answer": 0},
        {"question": "Who helps you with shopping?", "options": ["I do it myself", "Family", "Shopkeeper", "Neighbor"], "answer": 0},
        {"question": "How do you use the phone?", "options": ["Independently", "With help", "Not at all", "I don't know"], "answer": 0},
        {"question": "Who helps you with medication?", "options": ["I do it myself", "Family", "Nurse", "Doctor"], "answer": 0},
        # Add more questions to reach 18 others (total 20)
        {"question": "Which is the capital of India?", "options": ["Delhi", "Mumbai", "Kolkata", "Chennai"], "answer": 0},
        {"question": "What is 5 + 7?", "options": ["12", "10", "13", "11"], "answer": 0},
        {"question": "Which is a fruit?", "options": ["Apple", "Carrot", "Potato", "Onion"], "answer": 0},
        {"question": "Which is a mode of transport?", "options": ["Car", "Tree", "Book", "Shoe"], "answer": 0},
        {"question": "Which is a color?", "options": ["Blue", "Dog", "Table", "Apple"], "answer": 0},
        {"question": "Which is a day of the week?", "options": ["Monday", "Car", "Apple", "Blue"], "answer": 0},
        {"question": "Which is a season?", "options": ["Summer", "Dog", "Table", "Apple"], "answer": 0},
        {"question": "Which is a body part?", "options": ["Hand", "Car", "Apple", "Blue"], "answer": 0},
        {"question": "Which is a household item?", "options": ["Chair", "Dog", "Apple", "Blue"], "answer": 0},
        {"question": "Which is a profession?", "options": ["Doctor", "Car", "Apple", "Blue"], "answer": 0},
        {"question": "Which is a shape?", "options": ["Circle", "Dog", "Apple", "Blue"], "answer": 0},
        {"question": "Which is a drink?", "options": ["Water", "Car", "Apple", "Blue"], "answer": 0},
        {"question": "Which is a vegetable?", "options": ["Carrot", "Apple", "Blue", "Dog"], "answer": 0},
        {"question": "Which is a flower?", "options": ["Rose", "Car", "Apple", "Blue"], "answer": 0},
        {"question": "Which is a country?", "options": ["India", "Car", "Apple", "Blue"], "answer": 0},
        {"question": "Which is a planet?", "options": ["Earth", "Car", "Apple", "Blue"], "answer": 0},
        {"question": "Which is a language?", "options": ["English", "Car", "Apple", "Blue"], "answer": 0},
    ]
    # We want total num_questions (default 21): 1 intro + (num_questions-2) others + 1 recall
    others_needed = max(0, num_questions - 2)
    # Ensure we don't request more samples than available
    available = len(other_templates)
    if others_needed > available:
        # if not enough templates, repeat some to reach the desired count
        selected_others = (other_templates * ((others_needed // available) + 1))[:others_needed]
    else:
        selected_others = random.sample(other_templates, others_needed)
    questions = [intro_memory] + selected_others + [recall_memory]
    # Shuffle options for each question
    for q in questions:
        options = q["options"][:]
        answer = q["answer"]
        zipped = list(zip(options, range(len(options))) )
        random.shuffle(zipped)
        shuffled_options, orig_indices = zip(*zipped)
        new_answer = orig_indices.index(answer)
        q["options"] = list(shuffled_options)
        q["answer"] = new_answer
    return questions


# Landing page
@app.route('/')
def landing():
    return render_template('landing.html')


# Direct route to the lost-question template for testing
@app.route('/lost_question')
def lost_question():
    # Keep the route for direct testing, but note the lost question is now embedded in the quiz
    return render_template('lost_question.html')


@app.route('/submit_lost', methods=['POST'])
def submit_lost():
    # Ensure session answers list exists
    if 'answers' not in session:
        session['answers'] = []
    answer = request.form.get('answer')
    try:
        session['answers'].append(int(answer))
        session.modified = True
    except Exception:
        # ignore invalid values
        pass
    # If there is a questions list, go to next question index; else go to quiz start
    questions = session.get('questions')
    if questions:
        next_idx = len(session['answers'])
        if next_idx < len(questions):
            return redirect(url_for('quiz_question', qnum=next_idx))
        else:
            return redirect(url_for('quiz_result'))
    return redirect(url_for('quiz_start'))


# Quiz page - one question per page
@app.route('/quiz', methods=['GET'])
def quiz_start():
    session['answers'] = []
    session['question_durations'] = []
    session['questions'] = generate_ai_questions(20)
    return redirect(url_for('quiz_question', qnum=0))


# AI-driven quiz flow: predict next question using model
@app.route('/quiz/<int:qnum>', methods=['GET', 'POST'])
def quiz_question(qnum):
    if 'answers' not in session:
        session['answers'] = []
    if 'questions' not in session:
        session['questions'] = generate_ai_questions(20)

    questions = session['questions']

    if request.method == 'POST':
        # Retrieve the start time from the session
        start_time_str = session.get('question_start_time')
        if start_time_str:
            start_time = datetime.fromisoformat(start_time_str)
            end_time = datetime.now()
            duration_in_seconds = (end_time - start_time).total_seconds()
            
            # Append the duration to the list in the session
            if 'question_durations' not in session:
                session['question_durations'] = []
            session['question_durations'].append(duration_in_seconds)
            session.modified = True

        answer = request.form.get('answer')
        if answer is not None:
            session['answers'].append(int(answer))
            session.modified = True

        # Move to next question sequentially
        if len(session['answers']) < len(questions):
            return redirect(url_for('quiz_question', qnum=len(session['answers'])))
        else:
            return redirect(url_for('quiz_result'))

    question = questions[qnum]
    # Store the start time for the current question
    session['question_start_time'] = datetime.now().isoformat()
    return render_template('quiz_single.html', question=question, qnum=qnum, total=len(questions))


# AI-driven result and prescription
@app.route('/quiz/result')
def quiz_result():
    answers = session.get('answers', [])
    questions = session.get('questions', [])
    durations = session.get('question_durations', []) # New: get durations

    # Calculate total and average duration
    total_duration = sum(durations) if durations else 0
    avg_duration = total_duration / len(durations) if durations else 0
    
    # Use score to determine risk directly
    score = sum([1 for idx, ans in enumerate(answers) if idx < len(questions) and 'answer' in questions[idx] and ans == questions[idx]['answer']])
    total = len(questions)
    percent = (score / total) * 100 if total > 0 else 0

    # New risk prediction logic
    if score == total and avg_duration > 10:
        risk_pred = 1 # Moderate risk, as per rule 1
    elif score >= 15 and score < 20 and avg_duration < 10:
        risk_pred = 0 # Low risk, as per rule 2
    elif score <= 13 and avg_duration > 10:
        risk_pred = 2 # High risk, as per rule 3
    else:
        # Default logic for other cases
        if percent >= 90:
            risk_pred = 0
        elif percent >= 70:
            risk_pred = 1
        else:
            risk_pred = 2

    if risk_pred == 0:
        result = "Low risk of dementia."
        recommendation = "Maintain healthy habits, stay mentally and physically active, and see your doctor for regular checkups."
        precautions = [
            "Eat a balanced diet and exercise regularly.",
            "Stay socially engaged and mentally active.",
            "Monitor your memory and attention over time.",
            "See your doctor for regular checkups."
        ]
        doctor = "No specialist needed. Continue with your general physician."
        hospital_links = []
        show_hospital_suggestion = False
    elif risk_pred == 1:
        result = "Moderate risk of dementia."
        recommendation = "Consult your doctor and consider a professional cognitive assessment."
        precautions = [
            "Stay engaged in social and mental activities.",
            "Manage any chronic health conditions.",
            "Ask family or friends to help monitor changes.",
            "Follow up regularly with your healthcare provider."
        ]
        doctor = "Consult a neurologist or geriatrician."
        hospital_links = []
        show_hospital_suggestion = True
    else:
        result = "High risk of dementia."
        recommendation = "Schedule a medical assessment soon. Early diagnosis and intervention can help manage symptoms and improve quality of life."
        precautions = [
            "Schedule an appointment with a neurologist or geriatrician.",
            "Prepare a list of your symptoms and concerns.",
            "Ask about possible treatments and support services.",
            "Stay physically and mentally active as much as possible.",
            "Reach out to local support groups for advice and encouragement."
        ]
        doctor = "See a neurologist or geriatrician as soon as possible."
        hospital_links = []
        show_hospital_suggestion = True
    # Store context for hospital suggestion
    session['last_result'] = result
    session['last_recommendation'] = recommendation
    session['last_precautions'] = precautions
    session['last_doctor'] = doctor
    session['last_score'] = score
    session['last_total'] = total
    session.pop('answers', None)
    session.pop('questions', None)
    session.pop('question_durations', None) # Clear durations on completion
    return render_template('result.html', result=result, recommendation=recommendation, precautions=precautions, doctor=doctor, hospital_links=hospital_links, score=score, total=total, show_hospital_suggestion=show_hospital_suggestion, total_duration=total_duration, avg_duration=avg_duration)

if __name__ == '__main__':
    app.run(debug=True)