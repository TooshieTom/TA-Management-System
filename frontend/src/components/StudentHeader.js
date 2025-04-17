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
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div>
                <button onClick={() => navigate('/student')}>Filter Courses</button>
                <button
                    onClick={() => navigate('/student/applications')}
                    style={{ marginLeft: '0.5rem' }}
                >
                    My Applications
                </button>
            </div>
            <button
                onClick={handleLogout}
                style={{ backgroundColor: '#e74c3c', color: 'white' }}
            >
                Logout
            </button>
        </div>
    );
};

export default StudentHeader;
