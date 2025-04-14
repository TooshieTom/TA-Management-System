// frontend/src/components/FacultyHeader.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const FacultyHeader = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();  // Clear stored user data
        navigate('/auth');     // Redirect to login
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <button onClick={() => navigate('/faculty')}>Post TA Job</button>
            {/* Add more faculty-specific buttons here if needed */}
            <button
                onClick={handleLogout}
                style={{ float: 'right', backgroundColor: '#e74c3c', color: 'white' }}
            >
                Logout
            </button>
        </div>
    );
};

export default FacultyHeader;
