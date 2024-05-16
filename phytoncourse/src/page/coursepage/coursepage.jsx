import React from 'react';

const CoursePage = ({ match }) => {
  // Здесь можно использовать match.params.id, чтобы получить id курса из URL
  const courseId = match.params.id;

  // Загрузка информации о курсе по courseId из вашего источника данных

  return (
    <div>
      <h1>Страница курса #{courseId}</h1>
      
      {/* Отображение информации о курсе */}
    </div>
  );
};

export default CoursePage;