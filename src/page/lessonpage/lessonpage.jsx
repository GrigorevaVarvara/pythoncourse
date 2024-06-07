import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Импортируем Link
import { getDatabase, ref, get } from 'firebase/database';
import YouTube from 'react-youtube'; // Импортируем компонент YouTube

const LessonPage = () => {
    const { courseId, topicId, lessonId } = useParams();
    const [lesson, setLesson] = useState(null);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const database = getDatabase();
                const lessonRef = ref(database, `cards/${courseId}/topics/${topicId}/lessons/${lessonId}`);
                const lessonSnapshot = await get(lessonRef);
                if (lessonSnapshot.exists()) {
                    setLesson(lessonSnapshot.val());
                } else {
                    console.log("Lesson not found");
                }
            } catch (error) {
                console.error("Error fetching lesson:", error);
            }
        };

        fetchLesson();
    }, [courseId, topicId, lessonId]);

    if (!lesson) {
        return <div>Загрузка...</div>;
    }

    // Функция для извлечения videoId из URL-адреса YouTube
    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-lg-8 offset-lg-2">
                    <h2>{lesson.name}</h2>
                    <div style={{ marginBottom: '1rem' }}>
                        <div className="video-container">
                            <YouTube videoId={getYouTubeId(lesson.video)} opts={{ autoplay: 1 }} className="embed-responsive-item" />
                        </div>
                    </div>
                    <div className="mb-4">
                        <p>{lesson.text}</p>
                        <Link to={`/course-topics/${courseId}/${topicId}/${lessonId}/tasks`} className="btn btn-primary">Перейти к заданиям</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonPage;
