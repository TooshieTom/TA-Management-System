// frontend/src/components/FacultyViewApplications.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FacultyHeader from './FacultyHeader';

const FacultyViewApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCounts, setUnreadCounts] = useState({});
    const navigate = useNavigate();

    const facultyEmail = localStorage.getItem("userEmail");

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/applications/faculty/${facultyEmail}`);
                setApplications(res.data);

                const unreadData = {};
                for (const app of res.data) {
                    try {
                        const unreadRes = await axios.get(`http://localhost:8080/api/messages/unread/${app.applicationId}`);
                        unreadData[app.applicationId] = unreadRes.data.unreadFromStudents;
                    } catch (err) {
                        console.error(`Failed to get unread count for application ${app.applicationId}`, err);
                    }
                }
                setUnreadCounts(unreadData);

            } catch (err) {
                console.error("Error fetching applications:", err);
                alert("Failed to fetch applications.");
            } finally {
                setLoading(false);
            }
        })();
    }, [facultyEmail]);

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            console.log(`Updating status for application ${applicationId} to ${newStatus}`);
            await axios.put(`http://localhost:8080/api/applications/${applicationId}/status`, null, {
                params: { status: newStatus }
            });
            setApplications(prev =>
                prev.map(app =>
                    app.applicationId === applicationId ? { ...app, status: newStatus } : app
                )
            );
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Error updating application status.");
        }
    };

    if (loading) return <p style={{ padding: '2rem' }}>Loading applications...</p>;

    const getStatusStyle = (status) => {
        switch(status) {
            case 'Accepted':
                return { backgroundColor: '#77dd77', color: '#155724' };
            case 'Declined':
                return { backgroundColor: '#e74c3c', color: '#721c24' };
            case 'In Review':
                return { backgroundColor: '#fff9c4', color: '#856404' };
            default:
                return { backgroundColor: '#e2e3e5', color: '#383d41' };
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <FacultyHeader />
            <h2 style={{ fontSize: '36px', fontWeight: 'bold'}}>All Submitted Applications</h2>

            {applications.length === 0 ? (
                <p>No applications found.</p>
            ) : (
                <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                    <tr>
                        <th>Application ID</th>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Status</th>
                        <th>Messages</th>
                        <th>Submitted</th>
                    </tr>
                    </thead>
                    <tbody>
                    {applications.map(app => (
                        <tr key={app.applicationId}>
                            <td>{app.applicationId}</td>
                            <td>{app.studentName}</td>
                            <td>{app.studentEmail}</td>
                            <td>
                                {app.jobPosting?.course
                                    ? `${app.jobPosting.course.courseNumber} - ${app.jobPosting.course.courseName}`
                                    : 'N/A'}
                            </td>
                            <td>
                                <select
                                    value={app.status}
                                    onChange={(e) => handleStatusChange(app.applicationId, e.target.value)}
                                    style={{
                                        ...getStatusStyle(app.status),
                                        padding: '6px 12px',
                                        borderRadius: '5px',
                                        fontSize: '14px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        width: '100%',
                                        textAlign: 'center',
                                        outline: 'none',

                                    }}
                                >
                                    <option value="Submitted">Submitted</option>
                                    <option value="In Review">In Review</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Declined">Declined</option>
                                </select>
                            </td>
                            <td>
                                <button onClick={() => navigate(`/faculty/applications/${app.applicationId}`)}>
                                    View
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
                            <td>{new Date(app.submissionDate).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default FacultyViewApplications;