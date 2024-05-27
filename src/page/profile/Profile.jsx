import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { collection, getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'; // Импорт функций Firestore
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'; // Импорт функций Firebase Storage
import profilePhoto from "../../img/profilePhoto.png"; // Импорт стандартной фотографии профиля
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [editing, setEditing] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhotoURL, setNewPhotoURL] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const db = getFirestore();
                const userDocRef = doc(db, "users", "userId"); // Замените "userId" на идентификатор текущего пользователя
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    setUserData(userDocSnapshot.data());
                } else {
                    console.log("User document not found.");
                }
            } catch (error) {
                console.error("Error accessing Firestore:", error);
            }
        };
    
        fetchUserData();
    }, []);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        setUserData(currentUser);
    }, []);

    const handleEditProfile = () => {
        setEditing(!editing);
        if (!editing && userData) {
            setNewDisplayName(userData.displayName);
            setNewEmail(userData.email);
            setNewPhotoURL(userData.photoURL);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const db = getFirestore();
            const userDocRef = doc(db, "users", "userId"); // Замените "userId" на идентификатор текущего пользователя
            await setDoc(userDocRef, {
                displayName: newDisplayName,
                email: newEmail,
                photoURL: newPhotoURL
            }, { merge: true });

            if (selectedFile) {
                const storage = getStorage();
                const storageRef = storageRef(storage, `profilePhotos/userId/${selectedFile.name}`); // Путь, куда будет сохранен файл
                await uploadBytes(storageRef, selectedFile);
                const downloadURL = await getDownloadURL(storageRef);
                setNewPhotoURL(downloadURL);
            }

            setEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="container card mt-4 p-4">
            <section className="row">
                <div className="col-md-6 d-flex flex-column align-items-center">
                    <div className="d-flex flex-row align-items-center mb-3">
                        <img src={newPhotoURL || (userData && userData.photoURL) || profilePhoto} className="img-fluid rounded-circle me-3" alt="Profile" style={{ width: '100px', height: '100px' }} />
                        <div className="d-flex flex-column">
                            {editing ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="displayName" className="form-label">Имя</label>
                                        <input type="text" className="form-control" id="displayName" value={newDisplayName} onChange={(e) => setNewDisplayName(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Электронная почта</label>
                                        <input type="email" className="form-control" id="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="photoURL" className="form-label">URL фотографии профиля</label>
                                        <input type="text" className="form-control" id="photoURL" value={newPhotoURL} onChange={(e) => setNewPhotoURL(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="fileInput" className="form-label">Выберите файл фотографии профиля</label>
                                        <input type="file" className="form-control" id="fileInput" onChange={(e) => setSelectedFile(e.target.files[0])} />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Сохранить изменения</button>
                                </form>
                            ) : (
                                <>
                                    {userData && <h3 className='text-dark'>Привет, {userData.displayName}!</h3>}
                                    {userData && <p className='text-dark'>Почта: {userData.email}</p>}
                                    {userData && <p className='text-dark'>Пройдено занятий: {userData.completedLessons}</p>}
                                </>
                            )}
                        </div>
                    </div>
                    <h3>Прогресс:</h3>
                    <button className='btn btn-primary mt-2' onClick={handleEditProfile}>
                        {editing ? 'Отмена' : 'Редактировать профиль'}
                    </button>
                </div>
                <div className="col-md-6 d-flex flex-column">
                    <NavLink to="/quiz" className="btn btn-link">Квизы</NavLink>
                    <NavLink to="/course-ml-basics" className="btn btn-link">Курс основы машинного обучения</NavLink>
                    <NavLink to="/course-scrapy-beautifulsoup" className="btn btn-link">Библиотеки Scrapy и BeautifulSoup</NavLink>
                    <NavLink to="/support" className="btn btn-link">Поддержка</NavLink>
                </div>
            </section>
        </div>
    );
};

export default Profile;
