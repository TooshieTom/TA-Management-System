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
        <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
            <h2>{isRegister ? 'Create Account' : 'Login'}</h2>

            <form onSubmit={handleSubmit}>
                <label>Email:</label><br />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                /><br /><br />

                <label>Password:</label><br />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br /><br />

                {isRegister && (
                    <>
                        <label>Select Role:</label><br />
                        <select value={role} onChange={(e) => setRole(e.target.value)} required>
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                        </select><br /><br />

                        <label>{role === 'student' ? 'Student ID' : 'Faculty ID'}:</label><br />
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                        /><br /><br />
                    </>
                )}

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type="submit">
                    {isRegister ? 'Register' : 'Login'}
                </button>
            </form>

            <br />
            <button onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Already have an account? Login' : 'New user? Register here'}
            </button>
        </div>
    );
};

export default AuthPage;
