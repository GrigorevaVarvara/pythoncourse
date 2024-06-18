import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore'; // Добавлен импорт функций Firestore
import { getAuth, onAuthStateChanged  } from 'firebase/auth';
import axios from 'axios';

const TaskDetailsPage = () => {
    const { courseId, topicId, lessonId, taskId } = useParams();
    const [task, setTask] = useState(null);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [user, setUser] = useState(null); // Добавлено состояние для текущего пользователя

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const database = getDatabase();
                const taskRef = ref(database, `cards/${courseId}/topics/${topicId}/lessons/${lessonId}/tasks/${taskId}`);
                const taskSnapshot = await get(taskRef);
                if (taskSnapshot.exists()) {
                    setTask(taskSnapshot.val());
                } else {
                    console.log("Task not found");
                }
            } catch (error) {
                console.error("Error fetching task:", error);
            }
        };

        fetchTask();

        // Получаем текущего пользователя
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, [courseId, topicId, lessonId, taskId]);

    const handleCodeChange = (e) => {
        setCode(e.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setResults(null); // Сбрасываем результаты перед запуском новых тестов
        try {
            const taskResults = await Promise.all(task.tests.map(async (test) => {
                try {
                    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
                        language: "python",
                        version: "3.10.0",
                        files: [{
                            name: "solution.py",
                            content: code
                        }],
                        stdin: test.input_data
                    });

                    const result = response.data.run.stdout.trim();
                    return {
                        input: test.input_data,
                        expected: test.output_data,
                        result: result,
                        passed: result === test.output_data
                    };
                } catch (error) {
                    console.error("Error executing code for test:", test, error);
                    return {
                        input: test.input_data,
                        expected: test.output_data,
                        result: null,
                        passed: false,
                        error: "Error executing code"
                    };
                }
            }));

            setResults(taskResults);

            // Если все тесты пройдены успешно, сохраняем информацию о выполненном задании для пользователя
            if (taskResults.every(result => result.passed)) {
                await addCompletedTaskToFirestore();
            }
        } catch (error) {
            console.error("Error executing code:", error);
            setResults([{ error: "Error executing code" }]);
        }
        setLoading(false);
    };

    // Функция для сохранения выполненного задания в Firestore
    const addCompletedTaskToFirestore = async () => {
        try {
            const db = getFirestore();
            const userId = user.uid; // Получаем UID текущего пользователя

            // Добавляем информацию о выполненном задании в коллекцию пользователя
            await setDoc(doc(db, `users/${userId}/completedTasks`, taskId), {
                courseId: courseId,
                topicId: topicId,
                lessonId: lessonId,
                taskId: taskId,
                timestamp: serverTimestamp()
            });

            console.log("Задание успешно сохранено для пользователя.");
        } catch (error) {
            console.error("Ошибка при сохранении задания для пользователя:", error);
        }
    };

    if (!task) {
        return <div>Загрузка...</div>;
    }

    const allPassed = results && results.every(result => result.passed);

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-lg-8 offset-lg-2">
                    <h2>{task.name}</h2>
                    <p>{task.description}</p>
                    <textarea
                        className="form-control"
                        rows="10"
                        placeholder="Напишите свой код здесь..."
                        value={code}
                        onChange={handleCodeChange}
                    ></textarea>
                    <a
                        className="btn btn-success mt-3 me-2"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Выполняется...' : 'Проверить код'}
                    </a>
                    {results && (
                        <div className="mt-3">
                            {allPassed ? (
                                <div className="alert alert-success">Все тесты пройдены успешно!</div>
                            ) : (
                                results.map((result, index) => (
                                    <div key={index} className={`alert ${result.passed ? 'alert-success' : 'alert-danger'}`}>
                                        {result.passed ? 'Верно!' : `Неверно. Входные данные: ${result.input}, ожидаемый результат: ${result.expected}, было получено: ${result.result}`}
                                        {result.error && <div>Error: {result.error}</div>}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    <Link to={`/course-topics/${courseId}/${topicId}/${lessonId}/tasks`} className="btn btn-primary mt-3">
                        Назад к заданиям
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsPage;
