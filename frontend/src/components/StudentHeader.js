// frontend/src/components/StudentHeader.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentHeader = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear(); // Clear stored userId, userRole, etc.
        navigate('/auth');    // Redirect to login/register page
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <button onClick={() => navigate('/student')}>Filter Courses</button>
            <button onClick={() => navigate('/student/applications')}>My Applications</button>
            <button onClick={handleLogout} style={{ float: 'right', backgroundColor: '#e74c3c', color: 'white' }}>
                Logout
            </button>
        </div>
    );
};

export default StudentHeader;
