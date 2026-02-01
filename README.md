# Leben in Deutschland Test

This is a web application for preparing for the "Leben in Deutschland" test.

## How it works

The application is a single-page web app built with HTML, CSS, and JavaScript. It loads a set of questions from a `questions.json` file and presents them to the user in a test format.

The test consists of 33 randomly selected questions. For each question, the user can select one of the four possible answers and submit it. The application provides immediate feedback, highlighting the correct and incorrect answers.

At the end of the test, the application displays the user's score, whether they passed or failed, and a summary of the incorrect answers.

## How to run it locally

To run this application, you need to use a local web server. This is because modern web browsers have security restrictions (CORS policy) that prevent web pages from loading local files directly.

Here's how you can run a simple web server using Python (which is usually pre-installed on macOS and Linux):

1.  Open a terminal or command prompt in this directory.
2.  Run the following command: `python -m http.server`
3.  Open your web browser and go to the following address: [http://localhost:8000](http://localhost:8000)

If you don't have Python installed, you can use other local server solutions, like the "Live Server" extension for Visual Studio Code.

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

**Important Note:** Due to technical limitations (e.g., website security measures, direct access restrictions), I was unable to automatically fetch the official "Leben in Deutschland" test questions from online sources.

You will need to populate the `questions.json` file manually with the desired question set. You can find the official questions on the website of the Bundesamt für Migration und Flüchtlinge (BAMF) or other reputable sources. Please ensure your `questions.json` file is a valid JSON array of question objects.
# LID
# LID
# LID
