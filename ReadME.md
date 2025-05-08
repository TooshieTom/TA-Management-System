# SMU TA Module Sprint 3

This document provides an overview of Team 5’s progress on the TA Module project in Sprint 3. The focus of Sprint 3 was cleaning up loose ends, like refining the user interface, introducing a communication channel between students and instructors, and adding the ability for instructors to provide feedback.

## Screenshots of Functionality
**Messaging**
- Successful Unread Message for Faculty.png
- Successful Unread Message for Student.png
- Successful Messaging for Faculty.png
- Successful Messaging for Student.png
- Successful Conversation between Student and Faculty.png

**UI**
- New Student Application Styling.png
- New Login Styling.png
- New Faculty Application Styling.png

## Faculty User Story

### Functionality
- **Enhanced Dashboard UI**  
  - Redesigned applications list with clear status indicators, sortable columns, and responsive layout.  
- **In-App Messaging**  
  - Send and receive messages to/from individual student applicants.  
  - Threaded message view tied to each application.  
- **Feedback**  
  - Faculty can converse with TA's about what to improve and do better

### Process
- Faculty logs in and lands on the **View Applications** screen, which features:
  - A **Messages** tab for threaded chat.
- Use the **Send Message** box to communicate with the student.
- The student can view responses in their application board.

## Student User Story

### Functionality
- **Refreshed UI/UX**  
  - Cleaner layouts for all key pages (job listings, applications, messages).  
- **In-App Communication**  
  - Message faculty directly from each application’s **Message** tab.  
  - View message history in a threaded conversation.  
  - Allow Faculty to give feedback to TA's

### Process
- Student logs in and uses the **Filter Courses** page to find TA postings.
- Under **My Applications**, each entry now shows:
  - A **Messages** icon.
- Clicking **Messages** opens the chat interface:
  - Type and send messages to faculty.

## Backend Details (Docker)

### New Domain Entities
- **Message.java**  
  - Represents a message between faculty and student tied to an application.  
  - Attributes:
    - `messageId` (PK), `application` (FK), `senderType` (`"student"`/`"faculty"`), `message`, `sentTime`.   

### Repositories
- **MessageRepository.java**  
  - `findByApplicationIdOrderBySentTimeAsc(int applicationId)`    

### REST Controllers
- **MessageController.java**  
  - `POST /api/messages` – Send a new message.  
  - `GET  /api/messages/{applicationId}` – Retrieve chat history.  

All communication and feedback endpoints enforce role-based access (students only send/read on their applications; faculty only on theirs).

## Frontend Details (Docker)

- **ApplicationMessages Component**  
  - **Purpose:**
    - Display messages for a specific application
  - **Functionality:**  
    - Fetches messages via `GET /api/messages/{applicationId}`.  
    - Displays threaded view.  
    - Sends new messages with `POST /api/messages`.  

- **Styling & UX Enhancements**  
  - Tailwind-based theming for consistent spacing, typography, and color palette.
 
## Testing
### Testing Overview

This project uses JUnit 5 and Spring's testing support to verify the behavior of our application's web controllers:

* **Controller Tests**
   * Slice tests for each web controller (`@WebMvcTest`)
   * Mocked repositories/services via `@MockBean`
   * Focus on controller request handling, status codes, JSON payloads

> **Why focus on controller testing?** Controller tests validate the entire request/response flow and integration points of the application. By thoroughly testing controllers, it indirectly validates the functionality of the repository classes and entity models, as controllers utilize these components to fulfill  operations. This provides excellent test coverage while keeping test complexity manageable.

### Project Structure
Test classes are located at TAModule/test/java/com/example/ta_ms

Each controller test class mirrors the production package and controller class under test:
* `CourseControllerTest.java` → tests `CourseController`
* `StudentControllerTest.java` → tests `StudentController`

### Controller Test Annotations

#### Controller Slice Tests
* **Annotation:** `@WebMvcTest(ControllerClass.class)`
* **Spring Context:** only the web layer; controllers
* **Mocks:** `@MockBean` for repositories or services injected into the controller
* **Tools:**
   * `MockMvc` to perform HTTP requests
   * `jsonPath(…)` to assert on JSON responses
   * Standard HTTP status / header assertions

```java
@WebMvcTest(CourseController.class)
class CourseControllerTest {
    @Autowired
    MockMvc mvc;
    
    @MockBean
    CourseRepository repo;
    // ...
}
```

### Running Tests

* **Gradle**

```bash
./gradlew clean test
```

* **Through IntelliJ**
   * IntelliJ: right-click on individual test classes → **Run**

## Conclusion

Sprint 3 cleans up the TA Module by:

- Polishing the overall look and feel with UI/UX refinements.  
- Enabling direct, real-time communication between students and instructors.  
- Allowing instructors to provide direct feedback.  

These improvements should finish the TA module user stories, and in turn the overall module   
