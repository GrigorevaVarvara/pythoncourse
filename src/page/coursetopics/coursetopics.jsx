// CourseTopics.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

const CourseTopics = () => {
    const { courseId } = useParams();
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const database = getDatabase();
                const courseRef = ref(database, `cards/${courseId}/topics`);
                const topicsSnapshot = await get(courseRef);
                if (topicsSnapshot.exists()) {
                    const topicsData = topicsSnapshot.val();
                    const topicsArray = Object.keys(topicsData).map(topicId => ({
                        id: topicId,
                        name: topicsData[topicId].name,
                        lessons: topicsData[topicId].lessons
                    }));
                    setTopics(topicsArray);
                }
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };

        fetchTopics();
    }, [courseId]);

    return (
        <Container className="mt-4">
            <h2>Выберите тему курса</h2>
            <Row>
                {topics.map(topic => (
                    <Col md={6} key={topic.id}>
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title>{topic.name}</Card.Title>
                                <ListGroup variant="flush">
                                    {Object.entries(topic.lessons).map(([lessonId, lesson]) => (
                                        <ListGroup.Item key={lessonId}>
                                            <Link to={`/course-topics/${courseId}/${topic.id}/${lessonId}`}>
                                                {lesson.name}
                                            </Link>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default CourseTopics;
