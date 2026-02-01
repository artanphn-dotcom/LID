document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded. Script execution started.');

    // Elements
    const questionTextElement = document.getElementById('question-text');
    const answerOptionsElement = document.getElementById('answer-options');
    const submitBtn = document.getElementById('submit-btn');
    const restartBtn = document.getElementById('restart-btn');
    const progressTextElement = document.getElementById('progress-text');
    const progressBarInnerElement = document.getElementById('progress-bar-inner');
    const testContainer = document.getElementById('test-container');
    const resultContainer = document.getElementById('result-container');
    const scoreTextElement = document.getElementById('score-text');
    const passFailTextElement = document.getElementById('pass-fail-text');
    const incorrectAnswersListElement = document.getElementById('incorrect-answers-list');

    // State variables
    let allQuestions = [];
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedAnswerIndex = null; // Changed from selectedAnswer
    let incorrectAnswers = [];
    let translations = {};
    let currentLang = 'de'; // default language

    // --- Load JSON files ---
    async function loadQuestions() {
        try {
            console.log('Fetching translations.json...');
            const translationsResponse = await fetch('./translations.json');
            if (!translationsResponse.ok) throw new Error(`Failed to load translations.json. Status: ${translationsResponse.status}`);
            translations = await translationsResponse.json();
            console.log('translations loaded:', Object.keys(translations).length);

            updateContent(); // Update static content first

            console.log('Fetching questions.json...');
            const questionsResponse = await fetch('./questions.json');
            if (!questionsResponse.ok) throw new Error(`Failed to load questions.json. Status: ${questionsResponse.status}`);
            allQuestions = await questionsResponse.json();
            console.log('allQuestions loaded:', allQuestions.length);

            startTest();
        } catch (error) {
            questionTextElement.textContent =
                (translations?.error_loading_questions?.[currentLang]) 
                || "Error loading content. Make sure questions.json and translations.json are in the same folder.";
            console.error('Fetch error:', error);
        }
    }

    // --- Update all content based on currentLang ---
    function updateContent() {
        // Static elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[key]?.[currentLang]) el.textContent = translations[key][currentLang];
        });

        // Language buttons
        document.getElementById('lang-de').textContent = translations.language_de?.[currentLang] || 'Deutsch';
        document.getElementById('lang-al').textContent = translations.language_al?.[currentLang] || 'Shqip';

        // Dynamic content
        if (!testContainer.classList.contains('hidden') && currentQuestions.length > 0) {
            showQuestion(); // re-render current question in new language
            updateProgress();
        }

        if (!resultContainer.classList.contains('hidden')) {
            showResults(); // re-render results in new language
        }
    }

    // --- Start test ---
    function startTest() {
        const shuffledQuestions = shuffleArray([...allQuestions]);
        currentQuestions = shuffledQuestions.slice(0, 33);
        
        currentQuestions.forEach(q => {
            // Create a shuffled order of *indices* to maintain consistent answer order across language switches.
            const indices = Array.from({ length: q.options.length }, (_, i) => i);
            q.shuffledIndices = shuffleArray(indices);
        });

        currentQuestionIndex = 0;
        score = 0;
        selectedAnswerIndex = null;
        incorrectAnswers = [];
        testContainer.classList.remove('hidden');
        resultContainer.classList.add('hidden');

        showQuestion();
        updateProgress();
    }

    // --- Show current question ---
    function showQuestion() {
        const question = currentQuestions[currentQuestionIndex];
        submitBtn.disabled = selectedAnswerIndex === null;

        questionTextElement.textContent = question['question_' + currentLang] || question.question;
        answerOptionsElement.innerHTML = '';

        const optionsSource = question['options_' + currentLang] || question.options;

        // Use the shuffled indices to display options in a consistent, random order
        question.shuffledIndices.forEach(originalIndex => {
            const optionText = optionsSource[originalIndex];
            const button = document.createElement('button');
            button.textContent = optionText;
            button.classList.add('answer-option');
            
            if (originalIndex === selectedAnswerIndex) {
                button.classList.add('selected');
            }
            
            button.addEventListener('click', () => selectAnswer(button, originalIndex));
            answerOptionsElement.appendChild(button);
        });
    }

    // --- Handle answer selection ---
    function selectAnswer(button, originalIndex) {
        selectedAnswerIndex = originalIndex;
        document.querySelectorAll('.answer-option.selected').forEach(b => b.classList.remove('selected'));
        button.classList.add('selected');
        submitBtn.disabled = false;
    }

    // --- Submit answer ---
    function submitAnswer() {
        const question = currentQuestions[currentQuestionIndex];
        const optionsSource = question['options_' + currentLang] || question.options;
        const answerSource = question['answer_' + currentLang] || question.answer;

        const selectedAnswerText = optionsSource[selectedAnswerIndex];
        const isCorrect = selectedAnswerText === answerSource;

        if (isCorrect) {
            score++;
        } else {
            incorrectAnswers.push({
                question: question['question_' + currentLang] || question.question,
                yourAnswer: selectedAnswerText,
                correctAnswer: answerSource
            });
        }

        // Highlight correct/incorrect answers
        Array.from(answerOptionsElement.children).forEach(button => {
            if (button.textContent === answerSource) {
                button.classList.add('correct');
            } else if (button.textContent === selectedAnswerText) {
                button.classList.add('incorrect');
            }
            button.disabled = true;
        });

        submitBtn.disabled = true;

        setTimeout(() => {
            currentQuestionIndex++;
            selectedAnswerIndex = null; // Reset for the next question
            if (currentQuestionIndex < currentQuestions.length) {
                showQuestion();
            } else {
                showResults();
            }
            updateProgress();
        }, 1500);
    }

    // --- Show results ---
    function showResults() {
        testContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');

        scoreTextElement.textContent = `${translations.your_score?.[currentLang] || 'Your score'} ${score} / ${currentQuestions.length}`;
        const pass = score / currentQuestions.length >= 0.5;
        passFailTextElement.textContent = pass ? translations.you_passed?.[currentLang] || 'You passed' : translations.you_failed?.[currentLang] || 'You failed';
        passFailTextElement.classList.toggle('pass', pass);
        passFailTextElement.classList.toggle('fail', !pass);

        incorrectAnswersListElement.innerHTML = '';
        if (incorrectAnswers.length > 0) {
            incorrectAnswers.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${item.question}</strong><br>
                    <em>${translations.your_answer?.[currentLang] || 'Your answer'}: ${item.yourAnswer}</em><br>
                    <em>${translations.correct_answer?.[currentLang] || 'Correct answer'}: ${item.correctAnswer}</em>
                `;
                incorrectAnswersListElement.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = translations.no_incorrect_answers?.[currentLang] || 'No incorrect answers';
            incorrectAnswersListElement.appendChild(li);
        }
    }

    // --- Update progress ---
    function updateProgress() {
        if (!currentQuestions.length) return;
        const progress = Math.min(((currentQuestionIndex) / currentQuestions.length) * 100, 100);
        progressBarInnerElement.style.width = `${progress}%`;
        
        const questionNumber = currentQuestionIndex < currentQuestions.length ? currentQuestionIndex + 1 : currentQuestions.length;
        progressTextElement.textContent = `${translations.question_prefix?.[currentLang] || 'Question'} ${questionNumber} ${translations.of_separator?.[currentLang] || 'of'} ${currentQuestions.length}`;
        console.log(`Progress: Q${questionNumber}/${currentQuestions.length} (${progress}%)`);
    }

    // --- Shuffle array helper ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


    // --- Language switch ---
    document.getElementById('lang-de').addEventListener('click', () => {
        currentLang = 'de';
        updateContent();
    });
    document.getElementById('lang-al').addEventListener('click', () => {
        currentLang = 'al';
        updateContent();
    });

    // --- Buttons ---
    submitBtn.addEventListener('click', submitAnswer);
    restartBtn.addEventListener('click', startTest);

    // --- Initial load ---
    loadQuestions();
});
