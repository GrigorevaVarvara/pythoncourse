import React, { useState, useEffect } from 'react';
import { useParams, Link  } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';

const TasksPage = () => {
    const { courseId, topicId, lessonId } = useParams();
    const [tasks, setTasks] = useState(null);
    const [lessonName, setLessonName] = useState("");

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const database = getDatabase();
                const tasksRef = ref(database, `cards/${courseId}/topics/${topicId}/lessons/${lessonId}/tasks`);
                const tasksSnapshot = await get(tasksRef);
                if (tasksSnapshot.exists()) {
                    setTasks(tasksSnapshot.val());
                } else {
                    console.log("Tasks not found");
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();

        const fetchLessonName = async () => {
            try {
                const database = getDatabase();
                const lessonRef = ref(database, `cards/${courseId}/topics/${topicId}/lessons/${lessonId}`);
                const lessonSnapshot = await get(lessonRef);
                if (lessonSnapshot.exists()) {
                    setLessonName(lessonSnapshot.val().name);
                } else {
                    console.log("Lesson not found");
                }
            } catch (error) {
                console.error("Error fetching lesson:", error);
            }
        };

        fetchLessonName();
    }, [courseId, topicId, lessonId]);

    if (!tasks || !lessonName) {
        return <div>Loading...</div>;
    }
    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-lg-8 offset-lg-2">
                    <h2>Урок: {lessonName}</h2>
                    <div>
                        <ul className="list-group">
                            {Object.values(tasks).map(task => (
                                <Link to={`/course-topics/${courseId}/${topicId}/${lessonId}/tasks/${task.id}`} className="list-group-item">
                                    <h4>{task.name}</h4>
                                </Link>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TasksPage;
