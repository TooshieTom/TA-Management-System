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
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <button onClick={() => navigate('/faculty')}>Post TA Job</button>
                <button onClick={() => navigate('/faculty/applications')} style={{ marginLeft: '10px' }}>
                    View Submitted Applications
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

export default FacultyHeader;
