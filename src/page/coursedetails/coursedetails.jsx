import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import './coursedetails.scss'; 

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [imgUrl, setImgUrl] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const courseRef = ref(db, `cards/${id}`);
    onValue(courseRef, (snapshot) => {
      const courseData = snapshot.val();
      setCourse(courseData);

      if (courseData.img) {
        const imgRef = storageRef(storage, `course_img/${courseData.img}`);
        getDownloadURL(imgRef).then((url) => {
          setImgUrl(url);
        }).catch((error) => {
          console.error("Error fetching image URL: ", error);
        });
      }
    });
  }, [id]);

  const handlePurchase = (e) => {
    e.preventDefault();
    // Logic for handling course purchase
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
          <div className="row">
            {imgUrl && (
              <div className="col-md-4 mb-3">
                <img src={imgUrl} alt={course.name} className="img-fluid" />
              </div>
            )}
            <div className="col-md-8">
              <p className="card-text">{course.description}</p>
              <p className="card-text"><strong>Стоимость: {course.price} руб.</strong></p>
            </div>
          </div>

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
