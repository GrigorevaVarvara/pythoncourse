import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import axios from 'axios';

const TaskDetailsPage = () => {
    const { courseId, topicId, lessonId, taskId } = useParams();
    const [task, setTask] = useState(null);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

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
    }, [courseId, topicId, lessonId, taskId]);

    const handleCodeChange = (e) => {
        setCode(e.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setResults(null);
        try {
            const inputs = task.tests.map(test => ({
                input: test.input_data,
                expected: test.output_data
            }));

            const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
                language: "python",
                version: "3.10.0",
                files: [{
                    name: "solution.py",
                    content: code
                }],
                stdin: inputs.map(input => input.input).join('\n')
            });

            const outputLines = response.data.run.stdout.trim().split('\n');
            const results = inputs.map((input, index) => ({
                input: input.input,
                expected: input.expected,
                result: outputLines[index],
                passed: outputLines[index] === input.expected
            }));
            setResults(results);
        } catch (error) {
            console.error("Error executing code:", error);
            setResults([{ error: "Error executing code" }]);
        }
        setLoading(false);
    };

    if (!task) {
        return <div>Загрузка...</div>;
    }

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
                        className="btn btn-success mt-3" 
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Выполняется...' : 'Проверить код'}
                    </a>
                    {results && (
                        <div className="mt-3">
                            {results.map((result, index) => (
                                <div key={index} className={`alert ${result.passed ? 'alert-success' : 'alert-danger'}`}>
                                    {result.passed ? 'Верно!' : `Неверно. Входные данные: ${result.input}, ожидаемый результат: ${result.expected}, было получено: ${result.result}`}
                                </div>
                            ))}
                            {results.error && (
                                <div className="alert alert-danger">
                                    Error: {results.error}
                                </div>
                            )}
                        </div>
                    )}
                    <Link to={`/course-topics/${courseId}/${topicId}/${lessonId}`} className="btn btn-primary mt-3">
                        Назад к заданиям
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsPage;
