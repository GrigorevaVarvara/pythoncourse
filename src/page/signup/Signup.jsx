import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri'; // Импорт иконок глаза из react-icons
import './signup.scss';

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        navigate("/lk");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/email-already-in-use') {
          setError('Данный адрес электронной почты уже используется.');
        } else {
          setError(errorMessage);
        }
      });
  };

  const onGoogleSignIn = async () => {
    await signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        navigate("/lk");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
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
                    {/* Иконка глаза, которая меняет состояние showPassword */}
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
