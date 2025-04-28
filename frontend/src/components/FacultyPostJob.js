// FacultyPostJob.js

import React, { useState } from 'react';
import axios from 'axios';
import FacultyHeader from './FacultyHeader';

const FacultyPostJob = () => {
    // State for course submission
    const [courseNumberAdd, setCourseNumberAdd] = useState('');
    const [courseNameAdd, setCourseNameAdd] = useState('');
    const [courseDescriptionAdd, setCourseDescriptionAdd] = useState('');

// State for job posting submission
    const [facultyName, setFacultyName] = useState('');
    const [facultyEmail, setFacultyEmail] = useState('');
    const [courseNumber, setCourseNumber] = useState('');
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [requiredCourses, setRequiredCourses] = useState('');
    const [skills, setSkills] = useState('');
    const [selectedStandings, setSelectedStandings] = useState([]);
    const [jobDetails, setJobDetails] = useState('');

    const standingsOptions = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

    // Handler for submitting a new course
    const handleAddCourseSubmit = async (e) => {
        e.preventDefault();
        const courseData = {
            courseNumber: courseNumberAdd,
            courseName: courseNameAdd,
            description: courseDescriptionAdd
        };
        try {
            await axios.post('http://localhost:8080/api/courses', courseData, {
                headers: { "Content-Type": "application/json" }
            });
            alert('Course added successfully!');
// Optionally reset fields
            setCourseNumberAdd('');
            setCourseNameAdd('');
            setCourseDescriptionAdd('');
        } catch (error) {
            console.error(error);
            alert('Error adding course.');
        }
    };

    // Handler for submitting a TA job posting
    const handleJobSubmit = async (e) => {
        e.preventDefault();
        const requiredCoursesArray = requiredCourses.split(',').map(str => ({
            courseNumber: str.trim()
        }));
        const jobData = {
            facultyName,
            facultyEmail,
            course: {
                courseNumber,
                courseName,
                description: courseDescription
            },
            requiredCourses: requiredCoursesArray,
            skills,
            standings: selectedStandings,
            jobDetails,
            createdDate: new Date()
        };
        try {
            await axios.post('http://localhost:8080/api/jobpostings', jobData, {
                headers: { "Content-Type": "application/json" }
            });
            alert('Job posted successfully!');
// Optionally reset fields
            setFacultyName('');
            setFacultyEmail('');
            setCourseNumber('');
            setCourseName('');
            setCourseDescription('');
            setRequiredCourses('');
            setSkills('');
            setSelectedStandings([]);
            setJobDetails('');
        } catch (error) {
            console.error(error);
            alert('Error posting job.');
        }
    };

    const handleStandingChange = (e) => {
        const value = e.target.value;
        if (selectedStandings.includes(value)) {
            setSelectedStandings(selectedStandings.filter(s => s !== value));
        } else {
            setSelectedStandings([...selectedStandings, value]);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '2rem', width: '100%', maxWidth: '500px', margin: '0 auto', fontSize: '16px'}}>
            <FacultyHeader />

            <h1 style={{ fontSize: '36px', fontWeight: 'bold' }}>SMU TA Module</h1>

            <div>
                {/* Add Course Section */}
                <h2 style={{ fontSize: '24px'}}>Add course to system</h2>
                <form onSubmit={handleAddCourseSubmit}>
                    <div>
                        <label>Course Number:</label><br />
                        <input
                            type="text"
                            value={courseNumberAdd}
                            onChange={(e) => setCourseNumberAdd(e.target.value)}
                            required
                        />
                    </div><br/>
                    <div>
                        <label>Course Name:</label><br />
                        <input
                            type="text"
                            value={courseNameAdd}
                            onChange={(e) => setCourseNameAdd(e.target.value)}
                            required
                        />
                    </div><br/>
                    <div>
                        <label>Course Description:</label><br />
                        <textarea
                            value={courseDescriptionAdd}
                            onChange={(e) => setCourseDescriptionAdd(e.target.value)}
                            required
                        />
                    </div>
                    <br />
                    <button type="submit" style={{ width: '40%', borderRadius: '100px', padding: '1rem' }}>Submit Course</button>
                </form>
            </div>

            <hr style={{ margin: '2rem 0' }} />
            {/* Post TA Job Section */}
            <div>
                <h2 style={{ fontSize: '24px'}}>Post TA Job</h2>
                <form onSubmit={handleJobSubmit}>
                    <div>
                        <label>Faculty Name:</label><br />
                        <input
                            type="text"
                            value={facultyName}
                            onChange={(e) => setFacultyName(e.target.value)}
                            required
                        />
                    </div><br/>
                    <div>
                        <label>Faculty Email:</label><br />
                        <input
                            type="email"
                            value={facultyEmail}
                            onChange={(e) => setFacultyEmail(e.target.value)}
                            required
                        />
                    </div><br/>
                    <div>
                        <label>Course Number:</label><br />
                        <input
                            type="text"
                            value={courseNumber}
                            onChange={(e) => setCourseNumber(e.target.value)}
                            required
                        />
                    </div><br/>
                    <div>
                        <label>Required Courses (comma-separated):</label><br />
                        <input
                            type="text"
                            value={requiredCourses}
                            onChange={(e) => setRequiredCourses(e.target.value)}
                            placeholder="e.g. CS3341"
                        />
                    </div><br/>
                    <div>
                        <label>Skills (comma-separated or free text):</label><br />
                        <input
                            type="text"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                        />
                    </div><br/>
                    <div style={{ display: 'flex', flexDirection: 'column'}}>
                        <label>Standing (select all that apply):</label><br />
                        {standingsOptions.map(opt => (
                            <div key={opt}
                                 style={{ marginRight: '24rem' }}
                            >
                                <input
                                    type="checkbox"
                                    value={opt}
                                    checked={selectedStandings.includes(opt)}
                                    onChange={handleStandingChange}
                                />
                                {opt}
                            </div>
                        ))}
                    </div><br/>
                    <div>
                        <label>Job Details:</label><br />
                        <textarea
                            value={jobDetails}
                            onChange={(e) => setJobDetails(e.target.value)}
                            required
                        />
                    </div>
                    <br />
                    <button type="submit" style={{ width: '40%', borderRadius: '100px', padding: '1rem' }}>Submit Job Posting</button>
                </form>
            </div>
        </div>
    );
};

export default FacultyPostJob;
