# Leben in Deutschland Test

This is a web application for preparing for the "Leben in Deutschland" test.

## How it works

The application is a single-page web app built with HTML, CSS, and JavaScript. It loads a set of questions from a `questions.json` file and presents them to the user in a test format.

The test consists of 33 randomly selected questions. For each question, the user can select one of the four possible answers and submit it. The application provides immediate feedback, highlighting the correct and incorrect answers.

At the end of the test, the application displays the user's score, whether they passed or failed, and a summary of the incorrect answers.

## How to run it locally

1.  Clone this repository or download the files to your local machine.
2.  Open the `index.html` file in your web browser.

## `questions.json`

The `questions.json` file contains the question pool for the test. It is an array of JSON objects, where each object represents a question. Each question object has the following structure:

```json
{
    "question": "The text of the question",
    "options": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
    ],
    "answer": "The correct answer"
}
```

You can easily extend the question set by adding more question objects to the `questions.json` file.
# LID
