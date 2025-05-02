import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student'); // default role
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isRegister) {
                // Register request
                await axios.post('http://localhost:8080/api/auth/register', {
                    email,
                    password,
                    role,
                    userId: parseInt(userId)
                });

                alert("Account created! Please log in.");
                setIsRegister(false);
            } else {
                // Login request
                const response = await axios.post('http://localhost:8080/api/auth/login', {
                    email,
                    password
                });

                const { role, userId } = response.data;
                localStorage.setItem('userRole', role);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userId', userId);

                if (role === 'student') {
                    navigate('/student');
                } else if (role === 'faculty') {
                    navigate('/faculty');
                } else {
                    setError("Invalid role.");
                }
            }
        } catch (err) {
            console.error("Auth error:", err.response);

            if (err.response?.data === "Email already in use.") {
                setError("This email is already registered. Please log in or use a different email.");
            } else {
                setError(err.response?.data || "Authentication failed.");
            }
        }
    };

    return (
        <div style={{
            padding: '5rem', display: 'flex', flexDirection: 'row', width: '100%', maxWidth: '600px', margin: '0 auto'
        }}>
            <div style={{
                padding: '4rem',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                backgroundColor: 'white',
                width: '100%',

            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '4rem', fontSize: '4.2rem', fontWeight: 'bold',
                }}
                >
                    {isRegister ? 'Create Account' : 'Login'}</h2>

                <form onSubmit={handleSubmit}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '2rem'}}
                >
                    <label>Email:</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    /><br />

                    <label>Password:</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    /><br />

                    {isRegister && (
                        <>
                            <label>Select Role:</label><br />
                            <select value={role} onChange={(e) => setRole(e.target.value)} required
                                    style={{ fontSize: '2rem', width: '40%', padding: '0.5rem', borderRadius: '24px' }}

                            >
                                <option value="student">Student</option>
                                <option value="faculty">Faculty</option>
                            </select><br/>

                            <label>{role === 'student' ? 'Student ID' : 'Faculty ID'}:</label><br />
                            <input
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                required
                            /><br/>
                        </>
                    )}

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <br/>
                    <button type="submit" style={{ fontSize: '1.5rem', width: '40%', borderRadius: '100px', padding: '2rem', marginBottom: '2rem' }}

                    >
                        {isRegister ? 'Create Account' : 'Login'}

                    </button>

                    <button onClick={() => setIsRegister(!isRegister)}
                            style={{ fontSize: '1.5rem', width: '40%', borderRadius: '100px', padding: '2rem', marginBottom: '2rem' }}
                    >
                        {isRegister ? 'Login Page' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;