import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import axios from 'axios';

const TaskDetailsPage = () => {
    const { courseId, topicId, lessonId, taskId } = useParams();
    const [task, setTask] = useState(null);
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false); // Добавлено
    const [result, setResult] = useState(null); // Добавлено

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
        try {
            const response = await axios.post('http://localhost:3000/execute', { 
                courseId,
                topicId,
                lessonId,
                taskId,
                code
            });
            setResult(response.data);
        } catch (error) {
            console.error("Error executing code:", error);
            setResult({ error: "Error executing code" });
        }
        setLoading(false);
    };

    if (!task) {
        return <div>Loading...</div>;
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
                        placeholder="Write your code here..."
                        value={code}
                        onChange={handleCodeChange}
                    ></textarea>
                    <button 
                        className="btn btn-success mt-3" 
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Executing...' : 'Submit Code'}
                    </button>
                    {result && (
                        <div className="mt-3">
                            {result.success !== undefined && (
                                <div className={`alert ${result.success ? 'alert-success' : 'alert-danger'}`}>
                                    {result.success ? 'Correct!' : `Incorrect. Expected: ${result.expected}, but got: ${result.received}`}
                                </div>
                            )}
                            {result.error && (
                                <div className="alert alert-danger">
                                    Error: {result.error}
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
