import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../firebase';
import { NavLink, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap'; // Импортируем компонент Alert из react-bootstrap
import './login.scss';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Состояние для хранения ошибки

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                navigate("/lk");
                console.log(user);
            })
            .catch((error) => {
                setError('Неверный адрес почты или пароль'); // Устанавливаем сообщение об ошибке
            });
    };
    
    const onGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            console.log(user);
            navigate("/lk");
        } catch (error) {
            setError('Неверный адрес почты или пароль'); // Устанавливаем сообщение об ошибке
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Авторизация</h2>
                            {error && <Alert variant="danger">{error}</Alert>} {/* Выводим сообщение об ошибке */}
                            <Form>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Control
                                        type="email"
                                        placeholder="Эл.почта"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Control
                                        type="password"
                                        placeholder="Пароль"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
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
