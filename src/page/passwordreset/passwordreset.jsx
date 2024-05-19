import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import './passwordreset.scss';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const onResetPassword = (e) => {
    e.preventDefault();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setMessage('На вашу почту отправлены инструкции по восстановлению пароля! Проверьте папку входящие!');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setMessage(`Error: ${errorMessage}`);
        console.error(errorCode, errorMessage);
      });
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Container className="flex-grow-1 d-flex align-items-center justify-content-center">
        <Row className="justify-content-center w-100">
          <Col md={6}>
            <Card>
              <Card.Body>
                <h2 className="text-center mb-4">Восстановление пароля</h2>
                {message && <p className="text-center">{message}</p>}
                <Form onSubmit={onResetPassword}>
                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Control
                      type="email"
                      placeholder="Введите свою почту"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100">
                    Восстановить пароль
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PasswordReset;
