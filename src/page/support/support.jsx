import React, { useState } from 'react';
import { send } from 'emailjs-com';
import 'bootstrap/dist/css/bootstrap.min.css';

const Support = () => {
    const [toSend, setToSend] = useState({
        from_name: '',
        message: '',
        reply_to: '',
    });

    const onSubmit = (e) => {
        e.preventDefault();
        send(
            'service_edj784b', // Replace with your email service ID
            'template_tws5igu', // Replace with your email template ID
            toSend,
            'LmI_J5AblrWi3u8dW' // Replace with your user ID from emailjs-com
        )
        .then((response) => {
            console.log('SUCCESS!', response.status, response.text);
            alert('Ваше сообщение отправлено!');
        })
        .catch((err) => {
            console.log('FAILED...', err);
            alert('Ошибка при отправке сообщения.');
        });
    };

    const handleChange = (e) => {
        setToSend({ ...toSend, [e.target.name]: e.target.value });
    };

    return (
        <div className="container card mt-4 p-4">
            <h2 className="mb-4">Поддержка</h2>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label htmlFor="from_name" className="form-label">Ваше имя</label>
                    <input
                        type="text"
                        name="from_name"
                        className="form-control"
                        value={toSend.from_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="reply_to" className="form-label">Ваша почта</label>
                    <input
                        type="email"
                        name="reply_to"
                        className="form-control"
                        value={toSend.reply_to}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="message" className="form-label">Сообщение</label>
                    <textarea
                        name="message"
                        className="form-control"
                        rows="5"
                        value={toSend.message}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Отправить</button>
            </form>
        </div>
    );
};

export default Support;
