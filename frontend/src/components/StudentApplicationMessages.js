import React from 'react';
import { useParams } from 'react-router-dom';
import StudentHeader from './StudentHeader';
import ApplicationMessages from './ApplicationMessages';

const StudentApplicationMessages = () => {
    const { id } = useParams();

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'stretch', maxWidth: '500px', margin: '0 auto' }}>
            <StudentHeader />
            <h2 style={{ textAlign: 'left', fontSize: '36px' }}>Messages Regarding Your Application</h2>
            <ApplicationMessages applicationId={id} userType="STUDENT" />
        </div>
    );
};

export default StudentApplicationMessages;
