
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { db } from '../../firebase';
import './coursedetails.scss'; 

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const courseRef = ref(db, `cards/${id}`);
    onValue(courseRef, (snapshot) => {
      setCourse(snapshot.val());
    });
  }, [id]);

  const handlePurchase = (e) => {
    e.preventDefault();
    // Здесь вы можете добавить логику для обработки покупки курса
    alert(`Спасибо за покупку, ${name}! Курс "${course.name}" будет отправлен на ${email}.`);
    setName('');
    setEmail('');
  };

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">{course.name}</h1>
          <img src={`../../../img/${course.img}`} alt={course.name} className="img-fluid mb-3" />
          <p className="card-text">{course.description}</p>
          <p className="card-text"><strong>Стоимость: {course.price} руб.</strong></p>

          <h2>Форма для покупки</h2>
          <form onSubmit={handlePurchase}>
            <div className="form-group mb-3">
              <label htmlFor="name">Имя:</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Купить курс
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
