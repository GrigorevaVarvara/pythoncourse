import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import profilePhoto from "../../img/profilePhoto.png";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database'; // Updated import
import 'bootstrap/dist/css/bootstrap.min.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [editing, setEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPhotoURL, setNewPhotoURL] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [coursesData, setCoursesData] = useState({});

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;
        
            try {
                const db = getFirestore();
                const userDocRef = doc(db, "users", user.uid);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    setUserData(userDocSnapshot.data());
        
                    // Get a reference to the Realtime Database
                    const database = getDatabase();
                    const coursesRef = ref(database, 'cards'); // Create a reference to the 'cards' node
                    const coursesSnapshot = await get(coursesRef);
                    const coursesData = coursesSnapshot.val();
                    if (coursesData) {
                        setCoursesData(coursesData);
                    }
                } else {
                    console.log("User document not found.");
                }
            } catch (error) {
                console.error("Error accessing Firestore:", error);
            }
        };        

        fetchUserData();
    }, [user]);

    useEffect(() => {
        if (userData) {
            setNewName(userData.name || '');
            setNewEmail(userData.email || '');
            setNewPhotoURL(userData.photoURL || '');
        }
    }, [userData]);

    const handleEditProfile = () => {
        setEditing(!editing);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const db = getFirestore();
            const userDocRef = doc(db, "users", user.uid);

            if (selectedFile) {
                const storage = getStorage();
                const imageRef = storageRef(storage, `user_image/${selectedFile.name}`);
                await uploadBytes(imageRef, selectedFile);

                const downloadURL = await getDownloadURL(imageRef);
                setNewPhotoURL(downloadURL);

                await setDoc(userDocRef, {
                    photoURL: downloadURL
                }, { merge: true });
            }

            await setDoc(userDocRef, {
                name: newName,
                email: newEmail
            }, { merge: true });

            setEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
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
                                        <label htmlFor="name" className="form-label">Имя</label>
                                        <input type="text" className="form-control" id="name" value={newName} onChange={(e) => setNewName(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Электронная почта</label>
                                        <input type="email" className="form-control" id="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="fileInput" className="form-label">Выберите файл фотографии профиля</label>
                                        <input type="file" className="form-control" id="fileInput" onChange={handleFileChange} />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Сохранить изменения</button>
                                </form>
                            ) : (
                                <>
                                    {userData && <h3 className='text-dark'>Привет, {userData.name}!</h3>}
                                    {userData && <p className='text-dark'>Почта: {userData.email}</p>}
                                </>
                            )}
                        </div>
                    </div>
                    <button className='btn btn-primary mt-2' onClick={handleEditProfile}>
                        {editing ? 'Отмена' : 'Редактировать профиль'}
                    </button>
                </div>
                <div className="col-md-6 d-flex flex-column">
                    <NavLink to="/quiz" className="btn btn-link">Квизы</NavLink>
                    <NavLink to="/leaderboard" className="btn btn-link">Таблица лидеров</NavLink>
                    <NavLink to="/support" className="btn btn-link">Поддержка</NavLink>
                    {userData?.courses && userData.courses.length > 0 && (
                        <div>
                            <h4>Мои курсы:</h4>
                            <ul className="col-md-6 d-flex flex-column">
                                {userData.courses.map(courseId => (
                                    <Link key={courseId} to={`/course-topics/${courseId}`} className="btn btn-link">
                                        {coursesData[courseId] ? (
                                            coursesData[courseId].name
                                        ) : (
                                            `Курс с ID ${courseId} не найден`
                                        )}
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Profile;
