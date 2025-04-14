import React from 'react';
import { useNavigate } from 'react-router-dom';

const StudentHeader = () => {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button onClick={() => navigate('/student')}>Filter Courses</button>
            <button onClick={() => navigate('/student/applications')}>My Applications</button>
        </div>
    );
};

export default StudentHeader;
