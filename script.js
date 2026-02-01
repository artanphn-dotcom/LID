document.addEventListener('DOMContentLoaded', () => {
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

    let allQuestions = [];
    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedAnswer = null;
    let incorrectAnswers = [];

    async function loadQuestions() {
        try {
            const response = await fetch('questions.json');
            if (!response.ok) {
                throw new Error('Failed to load questions.');
            }
            allQuestions = await response.json();
            startTest();
        } catch (error) {
            questionTextElement.textContent = 'Error loading questions. Please try again later.';
            console.error(error);
        }
    }

    function startTest() {
        currentQuestions = shuffleArray(allQuestions).slice(0, 33);
        currentQuestionIndex = 0;
        score = 0;
        incorrectAnswers = [];
        resultContainer.classList.add('hidden');
        testContainer.classList.remove('hidden');
        showQuestion();
    }

    function showQuestion() {
        selectedAnswer = null;
        submitBtn.disabled = true;
        const question = currentQuestions[currentQuestionIndex];
        questionTextElement.textContent = question.question;
        answerOptionsElement.innerHTML = '';

        const shuffledOptions = shuffleArray(question.options);
        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('answer-option');
            button.addEventListener('click', () => selectAnswer(button, option));
            answerOptionsElement.appendChild(button);
        });

        updateProgress();
    }

    function selectAnswer(button, option) {
        const currentlySelected = document.querySelector('.answer-option.selected');
        if (currentlySelected) {
            currentlySelected.classList.remove('selected');
        }
        button.classList.add('selected');
        selectedAnswer = option;
        submitBtn.disabled = false;
    }

    function submitAnswer() {
        const question = currentQuestions[currentQuestionIndex];
        const isCorrect = selectedAnswer === question.answer;

        if (isCorrect) {
            score++;
        } else {
            incorrectAnswers.push({
                question: question.question,
                yourAnswer: selectedAnswer,
                correctAnswer: question.answer
            });
        }

        Array.from(answerOptionsElement.children).forEach(button => {
            if (button.textContent === question.answer) {
                button.classList.add('correct');
            } else if (button.textContent === selectedAnswer) {
                button.classList.add('incorrect');
            }
            button.disabled = true;
        });

        submitBtn.disabled = true;
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < currentQuestions.length) {
                showQuestion();
                Array.from(answerOptionsElement.children).forEach(button => button.disabled = false);
            } else {
                showResults();
            }
        }, 1500);
    }

    function showResults() {
        testContainer.classList.add('hidden');
        resultContainer.classList.remove('hidden');

        scoreTextElement.textContent = `Your Score: ${score} / ${currentQuestions.length}`;
        const pass = score >= 17;
        passFailTextElement.textContent = pass ? 'You passed!' : 'You failed.';
        passFailTextElement.classList.toggle('pass', pass);
        passFailTextElement.classList.toggle('fail', !pass);

        incorrectAnswersListElement.innerHTML = '';
        if (incorrectAnswers.length > 0) {
            incorrectAnswers.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${item.question}</strong>
                    <br>
                    <em>Your Answer: ${item.yourAnswer}</em>
                    <br>
                    <em>Correct Answer: ${item.correctAnswer}</em>
                `;
                incorrectAnswersListElement.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'No incorrect answers. Well done!';
            incorrectAnswersListElement.appendChild(li);
        }
    }

    function updateProgress() {
        const progress = ((currentQuestionIndex) / currentQuestions.length) * 100;
        progressBarInnerElement.style.width = `${progress}%`;
        progressTextElement.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
    }

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    submitBtn.addEventListener('click', submitAnswer);
    restartBtn.addEventListener('click', startTest);

    loadQuestions();
});
