// frontend/src/components/FacultyViewApplications.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FacultyHeader from './FacultyHeader';

const FacultyViewApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const facultyEmail = localStorage.getItem("userEmail");

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/applications/faculty/${facultyEmail}`);
                setApplications(res.data);
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

    return (
        <div style={{ padding: '2rem' }}>
            <FacultyHeader />
            <h2>All Submitted Applications</h2>

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
                        <th>Submitted</th>
                        <th>View</th>
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
                                >
                                    <option value="Submitted">Submitted</option>
                                    <option value="In Review">In Review</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Declined">Declined</option>
                                </select>
                            </td>
                            <td>{new Date(app.submissionDate).toLocaleString()}</td>
                            <td>
                                <button onClick={() => navigate(`/faculty/applications/${app.applicationId}`)}>
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default FacultyViewApplications;
