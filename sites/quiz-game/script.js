const quizData = {
    programming: [
        {
            question: "Какой язык программирования считается 'веб-языком'?",
            answers: ["Python", "JavaScript", "C++", "Java"],
            correct: 1
        },
        {
            question: "Что означает HTML?",
            answers: [
                "Hyper Text Markup Language",
                "High Tech Modern Language", 
                "Hyper Transfer Markup Language",
                "Home Tool Markup Language"
            ],
            correct: 0
        },
        {
            question: "Какой тег используется для создания ссылки в HTML?",
            answers: ["<link>", "<a>", "<href>", "<url>"],
            correct: 1
        },
        {
            question: "Что такое CSS?",
            answers: [
                "Computer Style Sheets",
                "Creative Style System",
                "Cascading Style Sheets",
                "Colorful Style Sheets"
            ],
            correct: 2
        },
        {
            question: "Какой оператор используется для присваивания в JavaScript?",
            answers: ["=", "==", "===", ":="],
            correct: 0
        }
    ],
    science: [
        {
            question: "Какая планета самая большая в Солнечной системе?",
            answers: ["Земля", "Марс", "Юпитер", "Сатурн"],
            correct: 2
        },
        {
            question: "Сколько костей в теле взрослого человека?",
            answers: ["106", "196", "206", "216"],
            correct: 2
        },
        {
            question: "Что измеряется в герцах?",
            answers: ["Скорость", "Частота", "Температура", "Давление"],
            correct: 1
        },
        {
            question: "Какой газ наиболее распространен в атмосфере Земли?",
            answers: ["Кислород", "Азот", "Углекислый газ", "Водород"],
            correct: 1
        },
        {
            question: "Кто открыл закон всемирного тяготения?",
            answers: ["Эйнштейн", "Ньютон", "Галилей", "Кеплер"],
            correct: 1
        }
    ],
    history: [
        {
            question: "В каком году началась Вторая мировая война?",
            answers: ["1937", "1939", "1941", "1945"],
            correct: 1
        },
        {
            question: "Кто был первым президентом США?",
            answers: [
                "Томас Джефферсон",
                "Джордж Вашингтон", 
                "Авраам Линкольн",
                "Джон Адамс"
            ],
            correct: 1
        },
        {
            question: "Какая древняя цивилизация построила пирамиды?",
            answers: ["Греки", "Римляне", "Египтяне", "Майя"],
            correct: 2
        },
        {
            question: "В каком году человек впервые полетел в космос?",
            answers: ["1957", "1961", "1969", "1975"],
            correct: 1
        },
        {
            question: "Кто написал 'Войну и мир'?",
            answers: [
                "Федор Достоевский",
                "Лев Толстой",
                "Антон Чехов", 
                "Иван Тургенев"
            ],
            correct: 1
        }
    ]
};

let currentCategory = '';
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;

function startQuiz(category) {
    currentCategory = category;
    currentQuestionIndex = 0;
    score = 0;
    showScreen('quizScreen');
    loadQuestion();
    startTimer();
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function loadQuestion() {
    const question = quizData[currentCategory][currentQuestionIndex];
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = quizData[currentCategory].length;
    document.getElementById('score').textContent = score;

    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';

    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.onclick = () => selectAnswer(index);
        answersContainer.appendChild(button);
    });

    document.getElementById('nextBtn').disabled = true;
    resetTimer();
}

function selectAnswer(selectedIndex) {
    const question = quizData[currentCategory][currentQuestionIndex];
    const answerButtons = document.querySelectorAll('.answer-btn');
    
    answerButtons.forEach((button, index) => {
        button.disabled = true;
        if (index === question.correct) {
            button.classList.add('correct');
        } else if (index === selectedIndex) {
            button.classList.add('incorrect');
        }
    });

    if (selectedIndex === question.correct) {
        score++;
        document.getElementById('score').textContent = score;
    }

    document.getElementById('nextBtn').disabled = false;
    clearInterval(timer);
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData[currentCategory].length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function startTimer() {
    resetTimer();
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 30;
    document.getElementById('timeLeft').textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timeLeft').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            autoSelectAnswer();
        }
    }, 1000);
}

function autoSelectAnswer() {
    const answerButtons = document.querySelectorAll('.answer-btn');
    if (!answerButtons[0].disabled) {
        selectAnswer(-1);
    }
}

function showResults() {
    const totalQuestions = quizData[currentCategory].length;
    const percentage = (score / totalQuestions) * 100;
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('maxScore').textContent = totalQuestions;
    
    let message = '';
    if (percentage >= 80) {
        message = 'Отлично! Вы настоящий эксперт! 🎉';
    } else if (percentage >= 60) {
        message = 'Хорошо! Отличные знания! ';
    } else if (percentage >= 40) {
        message = 'Неплохо, но есть куда расти! ';
    } else {
        message = 'Попробуйте еще раз! Вы сможете! ';
    }
    
    document.getElementById('resultMessage').textContent = message;
    showScreen('resultScreen');
}

function restartQuiz() {
    startQuiz(currentCategory);
}

function showStartScreen() {
    showScreen('startScreen');
              }
