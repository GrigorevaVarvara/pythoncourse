import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import { NavLink, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { RiEyeFill, RiEyeOffFill } from 'react-icons/ri';
import './login.scss';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                navigate("/lk"); // Перенаправляем на страницу профиля
            })
            .catch((error) => {
                setError('Неверный адрес почты или пароль');
            });
    };
    
    const onGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            navigate("/lk"); // Перенаправляем на страницу профиля
        } catch (error) {
            setError('Ошибка при входе через Google');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Авторизация</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Control
                                        type="email"
                                        placeholder="Эл.почта"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3 position-relative" controlId="password">
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Пароль"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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

                                <Button variant="primary" type="submit" className="w-100" onClick={onLogin}>
                                    Войти
                                </Button>
                            </Form>

                            <Button
                                variant="danger"
                                className="w-100 mt-3"
                                onClick={onGoogleSignIn}
                            >
                                Войти через Google
                            </Button>

                            <p className="mt-3 text-center">
                                Нет аккаунта?{' '}
                                <NavLink to="/signup" className="link">
                                    Зарегистрируйтесь, сейчас!
                                </NavLink>
                            </p>
                            <p className="mt-3 text-center">
                                <NavLink to="/password-reset" className="link">
                                    Забыли пароль?
                                </NavLink>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
