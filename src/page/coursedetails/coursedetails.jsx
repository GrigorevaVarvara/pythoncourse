import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { db, storage } from '../../firebase';
import './coursedetails.scss'; 

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [imgUrl, setImgUrl] = useState('');
  const [user, setUser] = useState(null);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const db = getFirestore();
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData.courses && userData.courses.includes(id)) {
            setIsPurchased(true);
          }
        }
      }
    });
    return () => unsubscribe();
  }, [id]);

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

  const handlePurchase = async () => {
    try {
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        courses: arrayUnion(id)
      });
      setIsPurchased(true);
      alert(`Спасибо за покупку, ${user.displayName || 'пользователь'}! Курс "${course.name}" добавлен в ваш профиль.`);
    } catch (error) {
      console.error("Error purchasing course:", error);
    }
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
              {user ? (
                isPurchased ? (
                  <p className="text-success">Вы уже приобрели этот курс.</p>
                ) : (
                  <button onClick={handlePurchase} className="btn btn-primary">Купить курс</button>
                )
              ) : (
                <div>
                  <p>Для покупки курса необходимо <Link to="/login">авторизоваться</Link>.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
