import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentHeader from './StudentHeader';

const StudentFilterClasses = () => {
    const navigate = useNavigate();
    const [courseNumber, setCourseNumber] = useState('');
    const [courseName, setCourseName] = useState('');
    const [skill, setSkill] = useState('');
    const [instructorName, setInstructorName] = useState('');
    const [standing, setStanding] = useState('');
    const [jobPostings, setJobPostings] = useState([]);

    const studentId = localStorage.getItem('userId');

    const fetchJobPostings = useCallback(async () => {
        try {
            let url = 'http://localhost:8080/api/jobpostings/filter?';
            if (courseNumber) url += `courseNumber=${courseNumber}&`;
            if (courseName) url += `courseName=${courseName}&`;
            if (skill) url += `skill=${skill}&`;
            if (instructorName) url += `instructorName=${instructorName}&`;
            if (standing) url += `standing=${standing}&`;

            const response = await axios.get(url);
            const postings = response.data;

            const updatedPostings = await Promise.all(postings.map(async posting => {
                const res = await axios.get('http://localhost:8080/api/applications/exists', {
                    params: {
                        studentId,
                        jobPostingId: posting.jobid
                    }
                });
                return { ...posting, alreadyApplied: res.data };
            }));

            setJobPostings(updatedPostings);
        } catch (error) {
            console.error(error);
            alert('Error fetching job postings.');
        }
    }, [courseNumber, courseName, skill, instructorName, standing, studentId]);

    useEffect(() => {
        fetchJobPostings();
    }, [fetchJobPostings]);

    const handleFilter = async () => {
        try {
            await fetchJobPostings();
        } catch (error) {
            console.error("Error filtering job postings:", error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column',  padding: '2rem', width: '100%', maxWidth: '500px', margin: '0 auto', fontSize: '16px'}}>
            <StudentHeader />

            <h2 style={{ fontSize: '36px', fontWeight: 'bold'}}>Filter TA Job Postings</h2>

            <br/>
            <label>Course Number:</label>
            <input
                type="text"
                value={courseNumber}
                onChange={(e) => setCourseNumber(e.target.value)}
            />

            <br/>
            <label>Course Name:</label>
            <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
            />

            <br/>
            <label>Skill:</label>
            <input
                type="text"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
            />

            <br/>
            <label>Instructor Name:</label>
            <input
                type="text"
                value={instructorName}
                onChange={(e) => setInstructorName(e.target.value)}
            />

            <br/>
            <label>Standing (Freshman, Sophomore, Junior, Senior, Graduate):</label>
            <input
                type="text"
                value={standing}
                onChange={(e) => setStanding(e.target.value)}
            />

            <br/>
            <button onClick={handleFilter}
                    style={{ fontSize: '16x', width: '40%', borderRadius: '100px', padding: '2rem'}}
            >Filter</button>

            <hr  style={{ margin: '2rem 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '500px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '36px', fontWeight: 'bold' }}>Available TA Job Postings</h2>
                <ul style={{ fontSize: '16px'}}>
                    {jobPostings.map(posting => (
                        <li key={posting.jobid}
                            style={{ marginTop: '16px'}}
                        >
                            <strong>{posting.course.courseNumber}</strong> - {posting.course.courseName}: {posting.jobDetails}<br />
                            Faculty: {posting.facultyName} (Email: {posting.facultyEmail})<br />
                            {posting.alreadyApplied ? (
                                <span style={{ color: 'gray' }}>Already Applied</span>
                            ) : (
                                <button onClick={() => navigate(`/apply/${posting.jobid}`)}
                                style={{ width: '100px', borderRadius: '100px', marginTop: '4px'}}
                                >Apply</button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default StudentFilterClasses;
