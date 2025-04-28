// frontend/src/components/StudentApplications.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StudentHeader from './StudentHeader';

const StudentApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCounts, setUnreadCounts] = useState({});
    const studentId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/applications/student/${studentId}`);
                setApplications(res.data);

                const unreadData = {};
                for(const app of res.data) {
                    try {
                        const unreadRes = await axios.get(`http://localhost:8080/api/messages/unread/${app.applicationId}`);
                        unreadData[app.applicationId] = unreadRes.data.unreadFromFaculty;
                    } catch (err) {
                        console.error(`Failed to get unread count for application ${app.applicationId}`, err);
                    }
                }
                setUnreadCounts(unreadData);

            } catch (error) {
                console.error("Failed to fetch applications:", error);
            } finally {
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

    const handleMessages = (appId) => {
        navigate(`/student/messages/${appId}`);
    };

    if (loading) return <p style={{ padding: '2rem' }}>Loading your applications...</p>;

    return (
        <div style={{ padding: '2rem' }}>
            <StudentHeader />
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
                        <th>Messages</th>
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
                                <button
                                    onClick={() => handleMessages(app.applicationId)}
                                    style={{
                                        backgroundColor: '#77dd77',
                                        color: 'white'
                                    }}
                                >
                                    Messages
                                </button>
                                {unreadCounts[app.applicationId] > 0 && (
                                    <span style={{
                                        backgroundColor: '#f8d7da',
                                        color: '#721c24',
                                        padding: '6px 12px',
                                        borderRadius: '5px',
                                        fontSize: '14px'
                                    }}>
                                        {unreadCounts[app.applicationId]} unread message(s)!
                                    </span>
                                )}
                            </td>
                            <td>
                                {app.status === 'Submitted' ? (
                                    <>
                                        <button onClick={() => handleEdit(app.applicationId)}>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(app.applicationId)}
                                            style={{ backgroundColor: '#e74c3c' }}
                                        >
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    <span style={{ color: '#000000' }}>Locked</span>
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
