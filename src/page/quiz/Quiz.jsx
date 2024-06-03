// src/page/quiz/Quiz.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, get } from 'firebase/database';
import './quiz.scss';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const questionsRef = ref(db, 'Questions');
      const snapshot = await get(questionsRef);
      if (snapshot.exists()) {
        const questionsList = Object.values(snapshot.val());
        const shuffledQuestions = questionsList.sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffledQuestions.slice(0, 20).map(question => ({
          ...question,
          options: shuffleArray([question.option1, question.option2, question.option3, question.option4])
        }));
        console.log('Selected questions: ', selectedQuestions);
        setQuestions(selectedQuestions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowScore(false);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        console.log("No data available");
      }
    } catch (error) {
      console.error("Error fetching questions: ", error);
    }
  };

  const shuffleArray = (array) => {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const handleAnswerOptionClick = (selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];
    const correct = selectedOption === currentQuestion.answer;
    setSelectedOption(selectedOption);
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < questions.length) {
        setCurrentQuestionIndex(nextQuestionIndex);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setShowScore(true);
      }
    }, 1000); // Пауза перед переходом к следующему вопросу
  };

  const handleRestartQuiz = () => {
    fetchQuestions();
  };

  if (!questions.length) {
    return <div>Загрузка...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          {showScore ? (
            <div className="text-center">
              <div className="alert alert-success" role="alert">
                Вы набрали {score} из {questions.length}!
              </div>
              <button className="btn btn-primary btn-lg" onClick={handleRestartQuiz}>
                Начать заново
              </button>
            </div>
          ) : (
            <>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    Вопрос {currentQuestionIndex + 1}/{questions.length}
                  </h5>
                  <p className="card-text">{currentQuestion.question}</p>
                  <div className="list-group">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        className={`list-group-item list-group-item-action ${
                          selectedOption === option
                            ? isCorrect
                              ? 'list-group-item-success'
                              : 'list-group-item-danger'
                            : ''
                        }`}
                        onClick={() => handleAnswerOptionClick(option)}
                        disabled={selectedOption !== null}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
