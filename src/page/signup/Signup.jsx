import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import './signup.scss';

const Signup = () => {
  const navigate = useNavigate();
  const storage = getStorage();
  const db = getFirestore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Upload photo to Firebase Storage
      const storageRef = ref(storage, `user_image/${photo.name}`);
      await uploadBytes(storageRef, photo);
      const photoURL = await getDownloadURL(storageRef);
  
      // Update user's profile with name and photoURL
      await updateProfile(user, { displayName: name, photoURL });
  
      // Add user data to Firestore database
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        photoURL: photoURL
      });
  
      // Redirect user to the dashboard or wherever you want after successful registration
      navigate("/lk");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/email-already-in-use') {
        setError('Данный адрес электронной почты уже используется.');
      } else {
        setError(errorMessage);
      }
    }
  };
  

  const onGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Extract user information
      const { displayName, email, photoURL } = user;
      
      // Add user data to Firestore database
      await setDoc(doc(db, 'users', user.uid), {
        name: displayName,
        email: email,
        photoURL: photoURL
      });
  
      // Redirect user to the dashboard or wherever you want after successful registration
      navigate("/lk");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Container className="flex-grow-1 d-flex align-items-center justify-content-center">
        <Row className="justify-content-center w-100">
          <Col md={6}>
            <Card>
              <Card.Body>
                <h2 className="text-center mb-4">Регистрация</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={onSubmit}>
                  <Form.Group controlId="formName" className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Ваше имя"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Эл.почта"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formPassword" className="mb-3 position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div className="position-absolute end-0 top-50 translate-middle-y" style={{ paddingRight: '10px' }}>
                      {showPassword ? (
                        <RiEyeOffFill
                          onClick={() => setShowPassword(false)}
                          style={{ cursor: 'pointer' }}
                        />
                      ) : (
                        <RiEyeFill
                          onClick={() => setShowPassword(true)}
                          style={{ cursor: 'pointer' }}
                        />
                      )}
                    </div>
                  </Form.Group>

                  <Form.Group controlId="formConfirmPassword" className="mb-3 position-relative">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Подтвердите пароль"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <div className="position-absolute end-0 top-50 translate-middle-y" style={{ paddingRight: '10px' }}>
                      {showConfirmPassword ? (
                        <RiEyeOffFill
                          onClick={() => setShowConfirmPassword(false)}
                          style={{ cursor: 'pointer' }}
                        />
                      ) : (
                        <RiEyeFill
                          onClick={() => setShowConfirmPassword(true)}
                          style={{ cursor: 'pointer' }}
                        />
                      )}
                    </div>
                  </Form.Group>

                  <Form.Group controlId="formPhoto" className="mb-3">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      required
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100">
                    Зарегистрироваться
                  </Button>
                </Form>

                <Button 
                  variant="danger" 
                  className="w-100 mt-3" 
                  onClick={onGoogleSignIn}
                >
                  Зарегистрироваться через Google
                </Button>

                <p className="mt-3 text-center">
                  Уже есть аккаунт?{' '}
                  <NavLink to="/login">
                    Войти
                  </NavLink>
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Signup;
