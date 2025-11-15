// Quiz state management
const quizState = {
    answers: [],
    questions: [],
    currentQuestion: 0,
    durations: [],
    questionStartTime: null,
    currentPage: 'landing'
};

// Hospital data
const hospitalsDB = {
    'delhi': [
        { name: 'AIIMS Neurology Department', url: 'https://www.aiims.edu/en/departments/clinical-departments/neurology.html' },
        { name: 'Fortis Escorts Memory Clinic', url: 'https://www.fortishealthcare.com/india/clinics/memory-clinic' }
    ],
    'mumbai': [
        { name: 'Jaslok Hospital Memory Clinic', url: 'https://www.jaslokhospital.net/speciality/memory-clinic' },
        { name: 'Nanavati Max Super Speciality Hospital', url: 'https://www.nanavatimaxhospital.org/specialities/neurology' }
    ],
    'bangalore': [
        { name: 'NIMHANS Hospital', url: 'https://www.nimhans.ac.in/' },
        { name: 'Manipal Hospital Neurology', url: 'https://www.manipalhospitals.com/bangalore/specialities/neurology/' }
    ],
    'chennai': [
        { name: 'Apollo Hospitals Memory Clinic', url: 'https://www.apollohospitals.com/locations/chennai/' },
        { name: 'SIMS Hospital Neurology', url: 'https://simshospitals.com/neurology/' }
    ]
};

const CITIES = [
    'agra', 'ahmedabad', 'allahabad', 'amritsar', 'bangalore', 'bhopal', 'bhubaneswar', 'chandigarh',
    'chennai', 'coimbatore', 'dehradun', 'delhi', 'durgapur', 'faridabad', 'ghaziabad', 'goa',
    'gurgaon', 'guwahati', 'hyderabad', 'indore', 'jaipur', 'jalandhar', 'jammu', 'jamshedpur',
    'kanpur', 'kochi', 'kolkata', 'lucknow', 'ludhiana', 'madurai', 'mangalore', 'meerut',
    'mumbai', 'nagpur', 'nashik', 'noida', 'patna', 'pune', 'raipur', 'rajkot', 'ranchi',
    'siliguri', 'surat', 'thane', 'thiruvananthapuram', 'tiruchirappalli', 'udaipur', 'vadodara',
    'varanasi', 'vijayawada', 'visakhapatnam'
];

// Generate random questions for the quiz
function generateAIQuestions(numQuestions = 20) {
    const introMemory = {
        question: "I will say three words: apple table penny. Please select the three words I just said.",
        options: ["apple table penny", "apple chair coin", "banana table penny", "apple table book"],
        answer: 0
    };
    
    const recallMemory = {
        question: "Which three words did I ask you to remember earlier?",
        options: ["apple table book", "apple chair coin", "banana table penny", "apple table penny"],
        answer: 3
    };
    
    const otherTemplates = [
        { question: "Count backward by 3s from 15.", options: ["15 12 9 6 3", "15 14 13 12 11", "15 10 5 0", "15 13 11 9 7"], answer: 0 },
        { question: "Which of these is the next number in the sequence: 2 5 8 11 ?", options: ["14", "13", "12", "15"], answer: 0 },
        { question: "Arrange these numbers in ascending order: 7 2 9 4.", options: ["2 4 7 9", "9 7 4 2", "4 2 7 9", "7 2 4 9"], answer: 0 },
        { question: "Which comes first in the week?", options: ["Monday", "Friday", "Sunday", "Wednesday"], answer: 2 },
        { question: "If you have 3 apples and give away 1, how many are left?", options: ["2", "3", "1", "4"], answer: 0 },
        { question: "If you see smoke in your house, what should you do?", options: ["Leave and call for help", "Go to sleep", "Watch TV", "Do nothing"], answer: 0 },
        { question: "Did you get lost in a familiar place, like your own neighborhood?", options: ["Yes", "No", "Maybe", "I don't remember"], answer: 1 },
        { question: "What color is the sky on a clear day?", options: ["Blue", "Green", "Red", "Yellow"], answer: 0 },
        { question: "Which animal can fly?", options: ["Dog", "Cat", "Bird", "Horse"], answer: 2 },
        { question: "Which of these do you do first in the morning?", options: ["Eat Food", "Wake Up", "Go to bed", "Watch TV"], answer: 1 },
        { question: "What do you use to brush your teeth?", options: ["Toothbrush", "Fork", "Spoon", "Comb"], answer: 0 },
        { question: "Which is the capital of India?", options: ["Delhi", "Mumbai", "Kolkata", "Chennai"], answer: 0 },
        { question: "What is 5 + 7?", options: ["12", "10", "13", "11"], answer: 0 },
        { question: "Which is a fruit?", options: ["Apple", "Carrot", "Potato", "Onion"], answer: 0 },
        { question: "Which is a mode of transport?", options: ["Car", "Tree", "Book", "Shoe"], answer: 0 },
        { question: "Which is a color?", options: ["Blue", "Dog", "Table", "Apple"], answer: 0 },
        { question: "Which is a day of the week?", options: ["Monday", "Car", "Apple", "Blue"], answer: 0 },
        { question: "Which is a season?", options: ["Summer", "Dog", "Table", "Apple"], answer: 0 },
        { question: "Which is a body part?", options: ["Hand", "Car", "Apple", "Blue"], answer: 0 },
        { question: "Which is a profession?", options: ["Doctor", "Car", "Apple", "Blue"], answer: 0 },
    ];
    
    const othersNeeded = Math.max(0, numQuestions - 2);
    let selectedOthers = [];
    for (let i = 0; i < othersNeeded; i++) {
        selectedOthers.push(otherTemplates[i % otherTemplates.length]);
    }
    
    let questions = [introMemory, ...selectedOthers, recallMemory];
    
    // Shuffle options for each question
    questions.forEach(q => {
        const options = [...q.options];
        const answer = q.answer;
        const zipped = options.map((opt, idx) => ({ opt, idx }));
        zipped.sort(() => Math.random() - 0.5);
        const shuffledOptions = zipped.map(item => item.opt);
        const origIndices = zipped.map(item => item.idx);
        const newAnswer = origIndices.indexOf(answer);
        q.options = shuffledOptions;
        q.answer = newAnswer;
    });
    
    return questions;
}

// Shuffle array utility
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Render landing page
function renderLanding() {
    const html = `
        <div class="landing">
            <h2>Welcome to Dementia Timer</h2>
            <p style="font-size: 1.1em; color: #666; margin: 20px 0; line-height: 1.8;">
                Dementia Timer is an AI-powered tool designed to help with early detection and awareness of dementia.
                Take a quick cognitive assessment quiz to understand your cognitive health.
            </p>
            <div class="info-box">
                <h3>About This Quiz</h3>
                <p>
                    This quiz includes memory tests, cognitive challenges, and daily functioning assessments.
                    It takes approximately 10-15 minutes to complete. Your responses help provide insights
                    into your cognitive health.
                </p>
            </div>
            <button class="btn-primary" onclick="startQuiz()">Start Quiz</button>
            <button class="btn-primary" onclick="showPage('symptoms')" style="background: #764ba2;">View Symptoms</button>
        </div>
    `;
    document.getElementById('app').innerHTML = html;
    quizState.currentPage = 'landing';
}

// Render symptoms page
function renderSymptoms() {
    const html = `
        <div class="symptoms">
            <h2>Common Symptoms of Dementia</h2>
            <div class="info-box">
                <h3>Memory Issues</h3>
                <p>Difficulty remembering recent events, familiar faces, or repeated conversations.</p>
            </div>
            <div class="info-box">
                <h3>Confusion and Disorientation</h3>
                <p>Getting lost in familiar places, confusion about time, dates, or people.</p>
            </div>
            <div class="info-box">
                <h3>Communication Problems</h3>
                <p>Difficulty finding words, following conversations, or expressing thoughts.</p>
            </div>
            <div class="info-box">
                <h3>Daily Functioning Challenges</h3>
                <p>Difficulty with everyday tasks like cooking, taking medication, or managing finances.</p>
            </div>
            <div class="info-box">
                <h3>Behavioral Changes</h3>
                <p>Mood swings, withdrawal from social activities, or changes in personality.</p>
            </div>
            <button class="btn-primary" onclick="showPage('landing')">Back to Home</button>
        </div>
    `;
    document.getElementById('app').innerHTML = html;
    quizState.currentPage = 'symptoms';
}

// Render quiz question
function renderQuizQuestion() {
    const question = quizState.questions[quizState.currentQuestion];
    const progress = ((quizState.currentQuestion + 1) / quizState.questions.length) * 100;
    
    const optionsHTML = question.options.map((opt, idx) => `
        <button class="option-btn" onclick="answerQuestion(${idx})">
            <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
            <span>${opt}</span>
        </button>
    `).join('');
    
    const html = `
        <div class="quiz-container">
            <div class="progress-bar" style="width: ${progress}%"></div>
            <div class="quiz-header">
                <h2>Question ${quizState.currentQuestion + 1} of ${quizState.questions.length}</h2>
                <p class="progress-text">${Math.round(progress)}% Complete</p>
            </div>
            <div class="quiz-content">
                <h3>${question.question}</h3>
                <div class="options">
                    ${optionsHTML}
                </div>
            </div>
        </div>
        <style>
            .quiz-container { margin: 20px 0; }
            .progress-bar { height: 4px; background: linear-gradient(90deg, #667eea, #764ba2); transition: width 0.3s; margin-bottom: 20px; }
            .quiz-header h2 { color: #333; margin-bottom: 5px; }
            .progress-text { color: #999; font-size: 0.9em; }
            .quiz-content h3 { color: #333; margin: 30px 0; font-size: 1.2em; line-height: 1.5; }
            .options { display: flex; flex-direction: column; gap: 12px; margin-top: 20px; }
            .option-btn { 
                padding: 15px 20px; 
                border: 2px solid #ddd; 
                border-radius: 8px; 
                background: white; 
                cursor: pointer; 
                font-size: 1em;
                display: flex;
                align-items: center;
                gap: 15px;
                transition: all 0.3s;
                text-align: left;
            }
            .option-btn:hover { 
                border-color: #667eea; 
                background: #f5f5f5;
            }
            .option-letter { 
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                background: #667eea;
                color: white;
                font-weight: bold;
                flex-shrink: 0;
            }
        </style>
    `;
    document.getElementById('app').innerHTML = html;
}

// Answer a question
function answerQuestion(selectedOption) {
    if (quizState.questionStartTime) {
        const duration = (Date.now() - quizState.questionStartTime) / 1000;
        quizState.durations.push(duration);
    }
    
    quizState.answers.push(selectedOption);
    quizState.currentQuestion++;
    
    if (quizState.currentQuestion < quizState.questions.length) {
        quizState.questionStartTime = Date.now();
        renderQuizQuestion();
    } else {
        showResults();
    }
}

// Calculate quiz results
function calculateResults() {
    let score = 0;
    quizState.questions.forEach((q, idx) => {
        if (quizState.answers[idx] === q.answer) {
            score++;
        }
    });
    
    const totalDuration = quizState.durations.reduce((a, b) => a + b, 0);
    const avgDuration = totalDuration / quizState.durations.length || 0;
    const percent = (score / quizState.questions.length) * 100;
    
    let riskPred = 0;
    if (score === quizState.questions.length && avgDuration > 10) {
        riskPred = 1;
    } else if (score >= 15 && score < 20 && avgDuration < 10) {
        riskPred = 0;
    } else if (score <= 13 && avgDuration > 10) {
        riskPred = 2;
    } else {
        if (percent >= 90) riskPred = 0;
        else if (percent >= 70) riskPred = 1;
        else riskPred = 2;
    }
    
    return { score, riskPred, percent, totalDuration, avgDuration };
}

// Show results page
function showResults() {
    const results = calculateResults();
    const { score, riskPred, percent, totalDuration, avgDuration } = results;
    
    let resultData = {};
    if (riskPred === 0) {
        resultData = {
            result: "Low risk of dementia.",
            recommendation: "Maintain healthy habits, stay mentally and physically active, and see your doctor for regular checkups.",
            precautions: [
                "Eat a balanced diet and exercise regularly.",
                "Stay socially engaged and mentally active.",
                "Monitor your memory and attention over time.",
                "See your doctor for regular checkups."
            ],
            doctor: "No specialist needed. Continue with your general physician.",
            showHospital: false,
            color: "#4CAF50"
        };
    } else if (riskPred === 1) {
        resultData = {
            result: "Moderate risk of dementia.",
            recommendation: "Consult your doctor and consider a professional cognitive assessment.",
            precautions: [
                "Stay engaged in social and mental activities.",
                "Manage any chronic health conditions.",
                "Ask family or friends to help monitor changes.",
                "Follow up regularly with your healthcare provider."
            ],
            doctor: "Consult a neurologist or geriatrician.",
            showHospital: true,
            color: "#FF9800"
        };
    } else {
        resultData = {
            result: "High risk of dementia.",
            recommendation: "Schedule a medical assessment soon. Early diagnosis and intervention can help manage symptoms and improve quality of life.",
            precautions: [
                "Schedule an appointment with a neurologist or geriatrician.",
                "Prepare a list of your symptoms and concerns.",
                "Ask about possible treatments and support services.",
                "Stay physically and mentally active as much as possible.",
                "Reach out to local support groups for advice and encouragement."
            ],
            doctor: "See a neurologist or geriatrician as soon as possible.",
            showHospital: true,
            color: "#f44336"
        };
    }
    
    const precautionsHTML = resultData.precautions.map(p => `<li>${p}</li>`).join('');
    const hospitalBtn = resultData.showHospital ? '<button class="btn-primary" onclick="showPage(\'hospital\')">Find Hospitals</button>' : '';
    
    const html = `
        <div class="results">
            <div class="result-badge" style="background: ${resultData.color};">
                <h2 style="color: white; margin-bottom: 10px;">Your Result</h2>
                <p style="color: white; font-size: 1.3em;">${resultData.result}</p>
            </div>
            
            <div class="info-box">
                <h3>Score: ${score} / ${quizState.questions.length}</h3>
                <p>Accuracy: ${percent.toFixed(1)}%</p>
            </div>
            
            <div class="info-box">
                <h3>Recommendation</h3>
                <p>${resultData.recommendation}</p>
            </div>
            
            <div class="info-box">
                <h3>Suggested Actions</h3>
                <ul style="text-align: left; margin-left: 20px;">
                    ${precautionsHTML}
                </ul>
            </div>
            
            <div class="info-box">
                <h3>Next Steps</h3>
                <p>${resultData.doctor}</p>
            </div>
            
            <button class="btn-primary" onclick="showPage('landing')">Take Quiz Again</button>
            ${hospitalBtn}
        </div>
        <style>
            .result-badge { padding: 20px; border-radius: 10px; margin: 20px 0; }
            .results ul { list-style: none; }
            .results li { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
            .results li:before { content: "✓ "; color: #4CAF50; font-weight: bold; margin-right: 10px; }
        </style>
    `;
    document.getElementById('app').innerHTML = html;
    quizState.currentPage = 'results';
}

// Show hospital suggestions page
function renderHospitals() {
    const citiesOptions = CITIES.map(city => `<option value="${city}">${city.charAt(0).toUpperCase() + city.slice(1)}</option>`).join('');
    
    const html = `
        <div class="hospitals">
            <h2>Find Hospitals Near You</h2>
            <div class="info-box">
                <label for="city-select" style="display: block; margin-bottom: 10px; font-weight: bold;">Select Your City:</label>
                <select id="city-select" onchange="updateHospitals()" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 1em;">
                    <option value="">-- Choose a city --</option>
                    ${citiesOptions}
                </select>
            </div>
            <div id="hospital-list"></div>
            <button class="btn-primary" onclick="showPage('landing')">Back to Home</button>
        </div>
    `;
    document.getElementById('app').innerHTML = html;
    quizState.currentPage = 'hospital';
}

// Update hospital list based on selected city
function updateHospitals() {
    const city = document.getElementById('city-select').value.toLowerCase();
    const hospitalList = document.getElementById('hospital-list');
    
    if (!city) {
        hospitalList.innerHTML = '';
        return;
    }
    
    const hospitals = hospitalsDB[city] || [
        { name: `${city.charAt(0).toUpperCase() + city.slice(1)} General Hospital`, url: `https://www.google.com/search?q=${city}+hospital+neurology` }
    ];
    
    const hospitalsHTML = hospitals.map(h => `
        <div class="info-box">
            <h3>${h.name}</h3>
            <a href="${h.url}" target="_blank" style="color: #667eea; text-decoration: none;">Visit Website →</a>
        </div>
    `).join('');
    
    hospitalList.innerHTML = hospitalsHTML;
}

// Show specific page
function showPage(page) {
    switch(page) {
        case 'landing':
            renderLanding();
            break;
        case 'symptoms':
            renderSymptoms();
            break;
        case 'hospital':
            renderHospitals();
            break;
        default:
            renderLanding();
    }
}

// Start the quiz
function startQuiz() {
    quizState.answers = [];
    quizState.durations = [];
    quizState.currentQuestion = 0;
    quizState.questions = generateAIQuestions(20);
    quizState.questionStartTime = Date.now();
    renderQuizQuestion();
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    renderLanding();
});
