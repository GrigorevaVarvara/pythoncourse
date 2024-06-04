import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { ref, get } from 'firebase/database';
import { getFirestore, doc, getDoc, updateDoc, setDoc, increment } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { NavLink } from 'react-router-dom';
import './quiz.scss';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [user, setUser] = useState(null);
  const [totalScore, setTotalScore] = useState(0); // Добавлено для хранения общего количества очков

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTotalScore(); // Загружаем общее количество очков при загрузке пользователя
    }
  }, [user]);

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

  const fetchTotalScore = async () => {
    try {
      const db = getFirestore();
      const quizResultRef = doc(db, 'quiz_results', user.uid);
      const quizResultSnapshot = await getDoc(quizResultRef);

      if (quizResultSnapshot.exists()) {
        const data = quizResultSnapshot.data();
        setTotalScore(data.score || 0); // Устанавливаем общее количество очков из Firestore
      } else {
        setTotalScore(0); // Если записи нет, устанавливаем общий счет равным 0
      }
    } catch (error) {
      console.error("Error fetching total score: ", error);
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
        saveQuizResult();
      }
    }, 1000); // Пауза перед переходом к следующему вопросу
  };

  const saveQuizResult = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const db = getFirestore();
      const quizResultRef = doc(db, 'quiz_results', user.uid);
      const quizResultSnapshot = await getDoc(quizResultRef);

      if (quizResultSnapshot.exists()) {
        // Обновляем существующий результат
        await updateDoc(quizResultRef, {
          score: increment(score),
          lastQuizDate: new Date() // Обновляем дату последнего прохождения квиза
        });
        // Обновляем общий счет в состоянии
        setTotalScore((prevTotalScore) => prevTotalScore + score);
      } else {
        // Создаем новый результат, если документ не существует
        await setDoc(quizResultRef, {
          score: score,
          userId: user.uid,
          firstQuizDate: new Date(), // Дата первого прохождения квиза
          lastQuizDate: new Date() // Дата последнего прохождения квиза
        });
        // Устанавливаем общий счет в состоянии
        setTotalScore(score);
      }

      console.log("Quiz result saved successfully");
    } catch (error) {
      console.error("Error saving quiz result: ", error);
    }
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
              <div className="alert alert-info" role="alert">
                Ваше общее количество очков: {totalScore}
              </div>
              <div className="d-flex flex-column align-items-center">
                <button className="btn btn-light btn-lg mb-2" onClick={handleRestartQuiz}>
                  Начать заново
                </button>
                <NavLink to="/lk" className="btn btn-light btn-lg mb-2">
                  Вернуться в личный кабинет
                </NavLink>
              </div>
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
