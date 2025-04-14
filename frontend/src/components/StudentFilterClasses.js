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
        <div>
            <StudentHeader />
            <h2>Filter TA Job Postings</h2>
            <div>
                <label>Course Number:</label>
                <input
                    type="text"
                    value={courseNumber}
                    onChange={(e) => setCourseNumber(e.target.value)}
                />
            </div>
            <div>
                <label>Course Name:</label>
                <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                />
            </div>
            <div>
                <label>Skill:</label>
                <input
                    type="text"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                />
            </div>
            <div>
                <label>Instructor Name:</label>
                <input
                    type="text"
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                />
            </div>
            <div>
                <label>Standing (Freshman, Sophomore, Junior, Senior, Graduate):</label>
                <input
                    type="text"
                    value={standing}
                    onChange={(e) => setStanding(e.target.value)}
                />
            </div>
            <button onClick={handleFilter}>Filter</button>

            <div>
                <h3>Available TA Job Postings:</h3>
                <ul>
                    {jobPostings.map(posting => (
                        <li key={posting.jobid}>
                            <strong>{posting.course.courseNumber}</strong> - {posting.course.courseName}: {posting.jobDetails}<br />
                            Faculty: {posting.facultyName} (Email: {posting.facultyEmail})<br />
                            {posting.alreadyApplied ? (
                                <span style={{ color: 'gray' }}>Already Applied</span>
                            ) : (
                                <button onClick={() => navigate(`/apply/${posting.jobid}`)}>Apply</button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default StudentFilterClasses;
