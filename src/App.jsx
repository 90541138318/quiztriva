import React, { useEffect, useState } from "react";
import './App.css';


const API_URL = "https://opentdb.com/api.php?amount=5&type=multiple";

function App() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.results.map((q) => {
          const answers = [...q.incorrect_answers];
          const randomIndex = Math.floor(Math.random() * 4);
          answers.splice(randomIndex, 0, q.correct_answer);
          return {
            ...q,
            answers,
          };
        });
        setQuestions(formatted);
      });
  }, []);

  const handleChange = (e, qIndex) => {
    setUserAnswers({ ...userAnswers, [qIndex]: e.target.value });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleRestart = () => {
    window.location.reload(); // reloads page and re-fetches questions
  };

  return (
    <div className="quiz">
      <h1>Trivia Quiz</h1>
      {questions.length === 0 ? (
        <p>Loading questions...</p>
      ) : (
        <>
          {questions.map((q, i) => (
            <div key={i} className="question-block">
              <p dangerouslySetInnerHTML={{ __html: `${i + 1}. ${q.question}` }} />
              {q.answers.map((answer, j) => (
                <label key={j}>
                  <input
                    type="radio"
                    name={`question-${i}`}
                    value={answer}
                    onChange={(e) => handleChange(e, i)}
                    disabled={submitted}
                  />
                  <span dangerouslySetInnerHTML={{ __html: answer }} />
                </label>
              ))}
              {submitted && (
                <p>
                  Correct Answer:{" "}
                  <strong dangerouslySetInnerHTML={{ __html: q.correct_answer }} />
                </p>
              )}
            </div>
          ))}

          {!submitted ? (
            <button onClick={handleSubmit}>Submit Quiz</button>
          ) : (
            <>
              <p>
                You scored{" "}
                {
                  questions.filter(
                    (q, i) => userAnswers[i] === q.correct_answer
                  ).length
                }{" "}
                out of {questions.length}
              </p>
              <button onClick={handleRestart}>Take Another Quiz</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
