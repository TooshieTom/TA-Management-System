// frontend/src/components/FacultyApplicationDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FacultyApplicationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/applications/${id}`);
                setApplication(res.data);
            } catch (err) {
                console.error("Failed to fetch application details", err);
                alert("Failed to load application details.");
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;
    if (!application) return <p style={{ padding: '2rem' }}>Application not found.</p>;

    // Remove "/app/uploads/" from the path to get just the filename
    const resumeFilename = application.resume?.replace("/app/uploads/", "");

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Application Details</h2>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>← Back to List</button>

            <p><strong>Student Name:</strong> {application.studentName}</p>
            <p><strong>Email:</strong> {application.studentEmail}</p>
            <p><strong>Interest Statement:</strong> {application.interestStatement}</p>
            <p><strong>Teaching Experience:</strong> {application.teachingExperience}</p>
            <p><strong>Skills & Coursework:</strong> {application.skillsAndCoursework}</p>
            <p><strong>Additional Notes:</strong> {application.additionalNotes}</p>

            <p>
                <strong>Resume:</strong>{' '}
                {resumeFilename ? (
                    <a
                        href={`http://localhost:8080/api/files/resume/${application.resume}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        View Resume
                    </a>
                ) : (
                    'N/A'
                )}
            </p>

            <p><strong>Submitted:</strong> {new Date(application.submissionDate).toLocaleString()}</p>
        </div>
    );
};

export default FacultyApplicationDetails;
