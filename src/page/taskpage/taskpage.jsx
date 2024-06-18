import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const TasksPage = () => {
    const { courseId, topicId, lessonId } = useParams();
    const [tasks, setTasks] = useState(null);
    const [lessonName, setLessonName] = useState("");
    const [completedTasks, setCompletedTasks] = useState([]);

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

        const fetchCompletedTasks = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (user) {
                    const db = getFirestore();
                    const userDocRef = doc(db, `users/${user.uid}/completedTasks`);
                    const userDocSnapshot = await getDoc(userDocRef);
                    if (userDocSnapshot.exists()) {
                        const userCompletedTasks = userDocSnapshot.data();
                        setCompletedTasks(Object.keys(userCompletedTasks));
                    }
                }
            } catch (error) {
                console.error("Error fetching completed tasks:", error);
            }
        };

        fetchCompletedTasks();
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
                            {Object.entries(tasks).map(([taskId, task]) => (
                                <Link key={taskId} to={`/course-topics/${courseId}/${topicId}/${lessonId}/tasks/${taskId}`} className={`list-group-item ${completedTasks.includes(taskId) ? 'list-group-item-success' : ''}`}>
                                    <h4>{task.name}</h4>
                                    {completedTasks.includes(taskId) && <span className="badge bg-success">Выполнено</span>}
                                </Link>
                            ))}
                        </ul>
                    </div>
                    <Link to={`/course-topics/${courseId}/${topicId}/${lessonId}`} className="btn btn-primary mt-3">
                        Назад к теории
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TasksPage;
