// frontend/src/components/StudentApplications.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const studentId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/applications/student/${studentId}`);
                setApplications(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch applications:", error);
                setLoading(false);
            }
        };

        if (studentId) {
            fetchApplications();
        }
    }, [studentId]);

    const handleEdit = (appId) => {
        navigate(`/edit-application/${appId}`);
    };

    const handleDelete = async (appId) => {
        const confirm = window.confirm("Are you sure you want to delete this application?");
        if (!confirm) return;

        try {
            await axios.delete(`http://localhost:8080/api/applications/${appId}`);
            setApplications(prev => prev.filter(app => app.applicationId !== appId));
            alert("Application deleted.");
        } catch (err) {
            console.error("Failed to delete application:", err);
            alert("Error deleting application.");
        }
    };

    if (loading) return <p>Loading your applications...</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
                <button onClick={() => navigate('/student')}>← Back to Filter Courses</button>
            </div>

            <h2>Your Submitted Applications</h2>

            {applications.length === 0 ? (
                <p>You have not submitted any applications yet.</p>
            ) : (
                <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                    <tr>
                        <th>Application ID</th>
                        <th>Course</th>
                        <th>Status</th>
                        <th>Submitted</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {applications.map(app => (
                        <tr key={app.applicationId}>
                            <td>{app.applicationId}</td>
                            <td>
                                {app.jobPosting?.course?.courseNumber}
                                {app.jobPosting?.course?.courseName ? ` - ${app.jobPosting.course.courseName}` : ""}
                            </td>
                            <td>{app.status}</td>
                            <td>{new Date(app.submissionDate).toLocaleString()}</td>
                            <td>
                                {app.status === 'Submitted' ? (
                                    <>
                                        <button onClick={() => handleEdit(app.applicationId)}>Edit</button>
                                        <button
                                            onClick={() => handleDelete(app.applicationId)}
                                            style={{ marginLeft: '0.5rem', backgroundColor: '#f44336', color: 'white' }}
                                        >
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    <span style={{ color: 'gray' }}>Locked</span>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default StudentApplications;
