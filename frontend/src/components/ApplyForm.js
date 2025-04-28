// frontend/src/components/ApplyForm.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ApplyForm = () => {
    const { jobid } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const studentId = localStorage.getItem('userId'); // ✅ Automatically retrieved

    const [studentName, setStudentName] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [resumeFile, setResumeFile] = useState(null);

    const [interestStatement, setInterestStatement] = useState('');
    const [teachingExperience, setTeachingExperience] = useState('');
    const [skillsAndCoursework, setSkillsAndCoursework] = useState('');
    const [additionalNotes, setAdditionalNotes] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:8080/api/jobpostings/${jobid}`)
            .then(res => setJob(res.data))
            .catch(err => {
                console.error(err);
                alert('Error loading job info.');
            });
    }, [jobid]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('jobPostingId', jobid);
        formData.append('studentId', studentId);
        formData.append('studentName', studentName);
        formData.append('studentEmail', studentEmail);
        formData.append('resumeFile', resumeFile);

        formData.append('interestStatement', interestStatement);
        formData.append('teachingExperience', teachingExperience);
        formData.append('skillsAndCoursework', skillsAndCoursework);
        formData.append('additionalNotes', additionalNotes);

        try {
            const res = await axios.post('http://localhost:8080/api/applications/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert(res.data);
            navigate('/student/applications');
        } catch (error) {
            console.error(error);
            alert('Error submitting application.');
        }
    };

    if (!job) return <p>Loading job details...</p>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '2rem', width: '100%', maxWidth: '500px', margin: '0 auto', fontSize: '16px'}}>
            <h2 style={{ fontSize: '36px'}}>
                Apply for {job.course.courseNumber}
                {job.course.courseName && ` - ${job.course.courseName}`}
            </h2>
            <p><strong>Faculty:</strong> {job.facultyName} ({job.facultyEmail})</p>
            <p><strong>Details:</strong> {job.jobDetails}</p>

            <form onSubmit={handleSubmit}>
                <label>Student Name:</label><br/>
                <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                /><br /><br />

                <label>Student Email:</label><br />
                <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    required
                /><br /><br />

                <label>Why are you interested in this TA position?</label><br />
                <textarea
                    value={interestStatement}
                    onChange={(e) => setInterestStatement(e.target.value)}
                    required
                /><br /><br />

                <label>Describe any teaching or tutoring experience:</label><br />
                <textarea
                    value={teachingExperience}
                    onChange={(e) => setTeachingExperience(e.target.value)}
                    required
                /><br /><br />

                <label>What relevant coursework or skills make you a good fit?</label><br />
                <textarea
                    value={skillsAndCoursework}
                    onChange={(e) => setSkillsAndCoursework(e.target.value)}
                    required
                /><br /><br />

                <label>Anything else we should know?</label><br />
                <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                /><br /><br />

                <label>Upload Resume (PDF/DOC/DOCX):</label><br />
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                    required
                /><br /><br />

                <button type="submit">Submit Application</button>
                <button type="button" onClick={() => navigate('/student')} style={{ marginLeft: '1rem' }}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default ApplyForm;
