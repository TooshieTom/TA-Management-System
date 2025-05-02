// frontend/src/components/FacultyApplicationDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApplicationMessages from './ApplicationMessages';

const FacultyApplicationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/applications/${id}`);
                setApplication(res.data);

                // Get unread messages count
                const unreadRes = await axios.get(`http://localhost:8080/api/messages/unread/${id}`);
                setUnreadCount(unreadRes.data.unreadFromStudents);
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

    const resumeFilename = application.resume?.replace("/app/uploads/", "");

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'stretch', maxWidth: '500px', margin: '0 auto' }}
        >
            <h2 style={{ fontSize: '36px', fontWeight: 'bold'}}>Application Details</h2>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>← Back to List</button>

            <div style={{
                border: '1px solid #ddd',
                borderRadius: '5px',
                padding: '1rem',
                marginBottom: '2rem',
                fontSize: '16px'
            }}>
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

            <hr style={{ margin: '2rem 0', marginBottom: '2rem' }} />

            <div style={{
                border: '1px solid #ddd',
                borderRadius: '5px',
                padding: '1rem',

            }}>
                <h3 style={{ fontSize: '16px' }}>Communication with {application.studentName}</h3>
                <ApplicationMessages applicationId={id} userType="FACULTY" />
            </div>
        </div>
    );
};

export default FacultyApplicationDetails;