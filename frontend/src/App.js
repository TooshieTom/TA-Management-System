// frontend/src/App.js
import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import FacultyPostJob from './components/FacultyPostJob';
import StudentFilterClasses from './components/StudentFilterClasses';
import ApplyForm from './components/ApplyForm';
import AuthPage from './components/AuthPage';
import StudentApplications from './components/StudentApplications';
import EditApplicationForm from './components/EditApplicationForm';


function App() {
    return (
        <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/faculty" element={<FacultyPostJob />} />
            <Route path="/student" element={<StudentFilterClasses />} />
            <Route path="/apply/:jobid" element={<ApplyForm />} />
            <Route path="/student/applications" element={<StudentApplications />} />
            <Route path="/edit-application/:appId" element={<EditApplicationForm />} />
            {/* Optional: catch all unknown paths */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;
