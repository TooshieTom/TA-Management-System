// frontend/src/App.js
import React from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';
import FacultyPostJob from './components/FacultyPostJob';
import FacultyViewApplications from './components/FacultyViewApplications';
import FacultyApplicationDetails from './components/FacultyApplicationDetails';
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
            <Route path="/faculty/applications" element={<FacultyViewApplications />} />
            <Route path="/faculty/applications/:id" element={<FacultyApplicationDetails />} />
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
