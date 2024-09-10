import React, { useState } from 'react';
import './Home.css';

const Home = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const apiURL = "https://complaint-management-cmqf.vercel.app";

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token'); 

        try {
            const response = await fetch(`${apiURL}/addcomplaint`, {  
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                 credentials: 'include',
                body: JSON.stringify({ name, email, subject, message })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Complaint registered');
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
                setError('');
            } else {
                setError(data.error || 'Complaint registration failed');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <div className='container-fluid'>
            <div className='card'>
                <div className='card-title'>
                    <h1 style={{ color: 'white' }}>Submit a Complaint</h1>
                </div>
                <div className='card-body'>
                    <form onSubmit={handleSubmit}>
                        {error && <div className='error-message'>{error}</div>}
                        <div className='form-group'>
                            <input
                                type='text'
                                className='input-text'
                                value={name}
                                placeholder='Name'
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <input
                                type='email'
                                className='input-text'
                                value={email}
                                placeholder='Email'
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <input
                                type='text'
                                className='input-text'
                                value={subject}
                                placeholder='Subject'
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <textarea
                                className='input-text'
                                value={message}
                                placeholder='Message'
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <input
                                type='submit'
                                value='Submit'
                                className='btn btn-primary'
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Home;
