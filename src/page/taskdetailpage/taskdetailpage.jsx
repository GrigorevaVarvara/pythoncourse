import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';

const TaskDetailsPage = () => {
    const { courseId, topicId, lessonId, taskId } = useParams();
    const [task, setTask] = useState(null);

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

    if (!task) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-lg-8 offset-lg-2">
                    <h2>{task.name}</h2>
                    <p>{task.description}</p>
                    {/* Добавьте другие поля, которые вы хотите отобразить */}
                    <Link to={`/course-topics/${courseId}/${topicId}/${lessonId}`} className="btn btn-primary mt-3">Назад к уроку</Link>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsPage;
