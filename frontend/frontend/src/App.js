import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/greet', { name });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>React & Node.js Integration</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ padding: '10px', width: '200px' }}
                />
                <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px' }}>
                    Submit
                </button>
            </form>
            {message && <p style={{ marginTop: '20px', fontSize: '18px' }}>{message}</p>}
        </div>
    );
};

export default App;
