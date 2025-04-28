// frontend/src/components/StudentHeader.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentHeader = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear(); // Clear stored user info
        navigate('/auth');    // Redirect to login
    };

    return (
        <div style={{
            marginTop: '2rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <div>
                <button onClick={() => navigate('/student')}>
                    Filter Courses
                </button>

                <button onClick={() => navigate('/student/applications')}>
                    My Applications
                </button>
            </div>
            <button
                onClick={handleLogout}
                style={{
                    backgroundColor: '#e74c3c',
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default StudentHeader;
