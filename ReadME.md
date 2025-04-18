# SMU TA Module Sprint 2

This  provides an overview of the current progress of Team 5’s TA Module project as part of Sprint 2. The focus of this sprint was to expand upon the faculty and student workflows by adding application submission, resume file management, and application status tracking.

## Faculty User Story

### Functionality:
- View all submitted applications for their job postings.
- View full details of each application (including resume) in a dedicated page.
- Update the application status between:
    - Submitted
    - In Review
    - Accepted
    - Declined

### Process:
- Faculty logs in and sees a header with navigation and logout.
- On the applications table:
    - They can click View to open full application details (resume link works).
    - They can change the status directly via a dropdown.
- The application status change reflects instantly on the student’s view.

## Student User Story

### Functionality:
- Submit TA job applications with resume upload.
- View a table of all their submitted applications.
- Edit or delete applications with status “Submitted”.
- See real-time status changes when faculty updates the application.

### Process:
- Students login and use the Filter Courses screen to explore jobs.
- On applying:
    - Resume is uploaded and saved in the uploads folder.
    - Filename is stored (not full path) in the DB.
- Students view application status in the My Applications tab.
- They can click Edit/Delete when allowed.

## Backend Details (Docker)

### Domain Entities

- **Application.java**
    - Represents a student's application for a TA job posting.
    - Attributes:
        - `applicationId`: Auto-generated primary key.
        - `studentId`: The ID of the student applying.
        - `studentName`, `studentEmail`: Student's personal information.
        - `jobPosting`: A **Many-to-One** relationship with the `JobPosting` entity representing the job posting the student is applying to.
        - `status`: Status of the application (default: `Submitted`). Options include `Submitted`, `In Review`, `Accepted`, and `Declined`.
        - `resume`: File name of the uploaded resume stored in the `uploads/` directory.
        - `interestStatement`, `teachingExperience`, `skillsAndCoursework`, `additionalNotes`: Long-form responses submitted by the student.
        - `submissionDate`: Timestamp of when the application was submitted.
    - Used to manage application submissions, file attachments, and faculty review workflows.

- **User.java**
    - Represents a system user, either a student or a faculty member.
    - Attributes:
        - `id`: Auto-generated database ID.
        - `email`: Unique email address used for login.
        - `password`: Encrypted user password.
        - `role`: Identifies the type of user, either `"student"` or `"faculty"`.
        - `userId`: ID specific to the user, typically mapped to a student or faculty profile.
    - Used for authentication, session tracking, and role-based access control across the system.

### Repositories

- **UserRepository.java**
    - Extends `JpaRepository` for the `User` entity.
    - Provides:
        - `findByEmail(String email)`: Used during login to authenticate users.
        - `existsByEmail(String email)`: Used during registration to prevent duplicate accounts.

- **ApplicationRepository.java**
    - Extends `JpaRepository` for the `Application` entity.
    - Provides:
        - `findByStudentIdOrderBySubmissionDateDesc(int studentId)`: Retrieves a student’s applications sorted by newest.
        - `existsByStudentIdAndJobPosting_Jobid(int studentId, int jobid)`: Checks if a student already applied to a specific job.
        - `findByJobPostingFacultyEmailOrderBySubmissionDateDesc(String facultyEmail)`: Retrieves all applications for a faculty member's job postings.

### REST Controllers

- **ApplicationController.java**
    - Provides an endpoint to update the status of a specific application.
    - Endpoint:
        - `PUT /api/applications/{id}/status?status=VALUE`: Updates the `status` field of an application (e.g., "Submitted", "In Review", "Accepted", "Declined").

- **AuthController.java**
    - Handles user authentication and registration.
    - Endpoints:
        - `POST /api/auth/register`: Registers a new user with email, password, role (student or faculty), and user ID.
          Ensures email uniqueness and encrypts passwords using `BCryptPasswordEncoder`.
        - `POST /api/auth/login`: Authenticates a user and returns the role and associated user ID if credentials are valid.

- **StudentApplicationController.java**
    - Manages all application-related actions initiated by students.
    - Endpoints:
        - `POST /api/applications/upload`: Submits a new application with a resume file. Saves the resume to a local `uploads` folder and stores only the filename.
        - `PUT /api/applications/{id}`: Updates an existing application (including optional resume file) if its status is still "Submitted".
        - `GET /api/applications/student/{studentId}`: Retrieves all applications submitted by a student, sorted by latest submission date.
        - `GET /api/applications/{id}`: Retrieves a specific application by ID.
        - `GET /api/applications/exists?studentId=&jobPostingId=`: Returns a boolean indicating if the student has already applied to the given job.
        - `DELETE /api/applications/{id}`: Deletes a student’s application if its status is still "Submitted".

    - **FacultyApplicationController.java**
        - Allows faculty members to view applications for job postings they created.
        - Endpoint:
            - `GET /api/applications/faculty/{facultyEmail}`: Retrieves all applications for the faculty’s job postings, sorted by submission date.

    - **FileController.java**
        - Handles file download requests, specifically resumes submitted by students.
        - Endpoint:
            - `GET /api/files/resume/{filename}`
              Serves the specified resume file from the `uploads/` directory.
            - Responds with the file in `application/octet-stream` format.
            - Sets the `Content-Disposition` header to inline for in-browser viewing.
            - Returns `404` if the file is not found or unreadable.

### Security Configuration

- **SecurityConfig.java**
    - Configures Spring Security settings for the backend.
    - Key Features:
        - Disables CSRF protection to allow stateless REST APIs.
        - Enables CORS using the default configuration (CORS headers are managed in `WebConfig`).
        - Defines public access to specific endpoints.
    - Endpoint Access Configuration:
        - `/api/auth/**`: Permit All – for login and registration functionality.
        - `/api/files/resume/**`: Permit All – allows access to student resumes by faculty without login.
        - `/api/courses/**`: Permit All – used by both faculty and student to fetch course data.
        - `All other endpoints`: Permitted (can later be changed to `authenticated()` for security).
    - Security Filter Chain:
        - Configured using a `@Bean` and `HttpSecurity` object.
        - `AntPathRequestMatcher` is used to match specific path patterns.

## Frontend Details (Docker)

- **ApplyForm Component**
    - **Purpose:**
        - Allows students to apply for a TA job by filling out an application form and uploading a resume.
    - **Functionality:**
        - Fetches job posting details using the job ID from the URL.
        - Uses `FormData` to package and send application information and file upload via a POST request to `/api/applications/upload`.
        - Validates resume type (`.pdf`, `.doc`, or `.docx`) before submission.
        - On successful application, redirects the student to the "My Applications" page.
        - Uses React hooks (`useState`, `useEffect`) for state and lifecycle management.

- **AuthPage Component**
    - **Purpose:**
        - Provides authentication functionality for both students and faculty.
    - **Functionality:**
        - Allows users to toggle between login and registration modes.
        - Handles registration by sending a POST request to `/api/auth/register` with email, password, role, and ID.
        - Handles login by validating credentials via a POST request to `/api/auth/login`.
        - Saves `userRole`, `userId`, and `userEmail` to `localStorage` upon successful login.
        - Redirects students to `/student` and faculty to `/faculty` after login.
        - Displays appropriate error messages for failed login or duplicate registration attempts.
        - Utilizes basic form validation and conditional form rendering based on selected role.

- **EditApplicationForm Component**
    - **Purpose:**
        - Allows students to edit their previously submitted TA applications, including optionally updating their resume.
    - **Functionality:**
        - Retrieves the application by ID and pre-fills the form with current data.
        - Allows updates to:
            - Student name and email
            - Interest statement
            - Teaching experience
            - Skills and coursework
            - Additional notes
            - Resume (optional file upload)
        - Sends an HTTP `PUT` request to `/api/applications/{id}` with multipart form data.
        - Handles validation and prevents editing if the application status is not `"Submitted"`.

- **FacultyApplicationDetails Component**
    - **Purpose:**
        - Allows faculty to view full details of a specific TA application in a read-only format.
    - **Functionality:**
        - Fetches the application details using the `applicationId` from the URL.
        - Displays:
            - Student name and email
            - Interest statement
            - Teaching experience
            - Skills and coursework
            - Additional notes
            - Submission timestamp
            - Resume file (downloadable/viewable)
        - Includes a back button to return to the application list.
        - Handles missing or unreadable resume files gracefully.

- **FacultyHeader Component**
    - **Purpose:**
        - Serves as a navigation bar for faculty users.
    - **Functionality:**
        - Displays navigation buttons to:
            - Post a new TA job (`/faculty`)
            - View submitted applications (`/faculty/applications`)
        - Includes a logout button that:
            - Clears local storage (user info)
            - Redirects the user to the login (`/auth`) page
        - Styled to visually separate navigation controls and logout functionality.

- **FacultyViewApplications Component**
    - **Purpose:**
        - Allows faculty to view and manage applications submitted by students for TA job postings they created.
    - **Functionality:**
        - Retrieves all applications related to the logged-in faculty member using their email from local storage.
        - Displays the application list in a table with the following details:
            - Application ID
            - Student name and email
            - Associated course
            - Status dropdown
            - Submission timestamp
            - View button to see full application
        - Faculty can change the status of each application using a `<select>` dropdown with the options:
            - Submitted
            - In Review
            - Accepted
            - Declined
        - Status changes are sent via a `PUT` request to `/api/applications/{id}/status`.
        - The component uses `FacultyHeader` at the top for consistent layout/navigation.

- **StudentApplications Component**
    - **Purpose:**
        - Displays all submitted applications by a student and allows them to manage their submissions.
    - **Functionality:**
        - Fetches all applications associated with the logged-in student's ID from local storage.
        - Displays a table with:
            - Application ID
            - Course number and name
            - Current status
            - Submission date
            - Edit/Delete buttons (only if the status is still "Submitted")
        - Students can:
            - Edit applications (`/edit-application/{id}`)
            - Delete applications (with confirmation)
        - Uses the `StudentHeader` component for navigation and logout.

- **StudentHeader Component**
    - **Purpose:**
        - Provides a navigation bar for student users to switch between features and log out.
    - **Functionality:**
        - Includes buttons for:
            - Navigating to the Filter Courses page (`/student`)
            - Viewing My Applications (`/student/applications`)
        - Displays a logout button that clears local storage and redirects to the login page.
        - Layout aligns buttons and logout neatly using flexbox styling.

### Screenshots of Sprint 2 Output Found in Repo
---

## Conclusion

Sprint 2 delivers a major upgrade by enabling real-time application status updates, robust file management, and a fully integrated faculty-student workflow. This sprint solidifies core functionality and paves the way for:
- Application review feedback (optional).
- Authentication/authorization improvements.
- UI/UX styling.

