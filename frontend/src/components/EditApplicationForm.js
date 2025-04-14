// frontend/src/components/EditApplicationForm.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditApplicationForm = () => {
    const { appId } = useParams();
    const navigate = useNavigate();

    const [application, setApplication] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:8080/api/applications/${appId}`)
            .then(res => setApplication(res.data))
            .catch(() => setError('Failed to load application.'));
    }, [appId]);

    const handleChange = (field, value) => {
        setApplication(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const formData = new FormData();
            formData.append("studentName", application.studentName);
            formData.append("studentEmail", application.studentEmail);
            formData.append("interestStatement", application.interestStatement);
            formData.append("teachingExperience", application.teachingExperience);
            formData.append("skillsAndCoursework", application.skillsAndCoursework);
            formData.append("additionalNotes", application.additionalNotes);
            if (resumeFile) {
                formData.append("resumeFile", resumeFile);
            }

            await axios.put(`http://localhost:8080/api/applications/${appId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert("Application updated successfully.");
            navigate('/student/applications');
        } catch (err) {
            console.error(err);
            setError("Failed to update application.");
        }
    };

    if (!application) return <p>Loading application...</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Edit Application #{appId}</h2>
            {application.jobPosting?.course?.courseNumber && (
                <p>
                    <strong>Course:</strong> {application.jobPosting.course.courseNumber}
                    {application.jobPosting.course.courseName ? ` - ${application.jobPosting.course.courseName}` : ''}
                </p>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>Student Name:</label><br />
                <input
                    type="text"
                    value={application.studentName || ''}
                    onChange={e => handleChange("studentName", e.target.value)}
                    required
                /><br /><br />

                <label>Student Email:</label><br />
                <input
                    type="email"
                    value={application.studentEmail || ''}
                    onChange={e => handleChange("studentEmail", e.target.value)}
                    required
                /><br /><br />

                <label>Why are you interested in this TA position?</label><br />
                <textarea
                    value={application.interestStatement || ''}
                    onChange={e => handleChange("interestStatement", e.target.value)}
                /><br /><br />

                <label>Describe any teaching or tutoring experience:</label><br />
                <textarea
                    value={application.teachingExperience || ''}
                    onChange={e => handleChange("teachingExperience", e.target.value)}
                /><br /><br />

                <label>What relevant coursework or skills make you a good fit?</label><br />
                <textarea
                    value={application.skillsAndCoursework || ''}
                    onChange={e => handleChange("skillsAndCoursework", e.target.value)}
                /><br /><br />

                <label>Anything else we should know?</label><br />
                <textarea
                    value={application.additionalNotes || ''}
                    onChange={e => handleChange("additionalNotes", e.target.value)}
                /><br /><br />

                <label>Replace Resume (PDF/DOCX):</label><br />
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                /><br /><br />

                <button type="submit">Update Application</button>
                <button type="button" onClick={() => navigate('/student/applications')} style={{ marginLeft: '1rem' }}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default EditApplicationForm;
