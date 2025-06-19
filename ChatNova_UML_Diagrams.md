# ChatNova - UML Diagrams

## 1. Class Diagram

```mermaid
classDiagram
    class User {
        +String email
        +String password
        +Date createdAt
        +Date updatedAt
        +generateToken() String
        +isValidPassword(password) Boolean
        +hashedPassword(password) String
    }

    class Project {
        +String name
        +Array users
        +Object fileTree
        +Date createdAt
        +Date updatedAt
        +addUser(userId) void
        +removeUser(userId) void
        +updateFileTree(fileTree) void
    }

    class UserController {
        +createUserController(req, res) void
        +loginUserController(req, res) void
        +profileController(req, res) void
    }

    class ProjectController {
        +createProject(req, res) void
        +getAllProject(req, res) void
        +addUserToProject(req, res) void
        +getProjectById(req, res) void
        +updateFileTree(req, res) void
    }

    class UserService {
        +createUser(userData) User
        +findUserByEmail(email) User
        +validateUser(email, password) Boolean
    }

    class ProjectService {
        +createProject(projectData) Project
        +getAllProjectByUserId(userId) Array
        +addUsersToProject(projectData) Project
        +getProjectById(projectId) Project
        +updateFileTree(projectData) Project
    }

    class AIService {
        +GoogleGenerativeAI genAI
        +generateResult(prompt) String
        +parseAIResponse(response) Object
    }

    class WebContainerService {
        +WebContainer container
        +initialize() WebContainer
        +mountFileTree(fileTree) void
        +runCommand(command, args) Process
        +spawnProcess(command, args) Process
    }

    class SocketManager {
        +Server io
        +handleConnection(socket) void
        +handleMessage(socket, data) void
        +handleAIRequest(socket, prompt) void
        +broadcastToRoom(roomId, event, data) void
    }

    class AuthMiddleware {
        +authCheck(req, res, next) void
        +validateToken(token) Object
        +extractToken(req) String
    }

    class ValidationMiddleware {
        +validateUser(req, res, next) void
        +validateProject(req, res, next) void
        +handleValidationErrors(errors) void
    }

    class UserContext {
        +User user
        +setUser(user) void
        +logout() void
        +isAuthenticated() Boolean
    }

    class ProjectComponent {
        +Project project
        +Array messages
        +Object fileTree
        +String currentFile
        +Array openFiles
        +WebContainer webContainer
        +String iframeUrl
        +sendMessage(message) void
        +updateFileTree(fileTree) void
        +runCode() void
    }

    class ChatComponent {
        +Array messages
        +String message
        +sendMessage() void
        +receiveMessage(data) void
        +scrollToBottom() void
    }

    class CodeEditorComponent {
        +Object fileTree
        +String currentFile
        +Array openFiles
        +updateFile(fileName, content) void
        +saveFileTree() void
        +highlightSyntax(code, language) String
    }

    class WebContainerComponent {
        +WebContainer container
        +String iframeUrl
        +Process runProcess
        +initializeContainer() void
        +mountFileTree(fileTree) void
        +runCommand(command, args) void
        +handleServerReady(port, url) void
    }

    %% Relationships
    User ||--o{ Project : "collaborates on"
    UserController --> UserService : "uses"
    ProjectController --> ProjectService : "uses"
    UserService --> User : "manages"
    ProjectService --> Project : "manages"
    ProjectService --> User : "references"
    AIService --> WebContainerService : "generates for"
    SocketManager --> AIService : "triggers"
    SocketManager --> ProjectService : "updates"
    AuthMiddleware --> User : "validates"
    ValidationMiddleware --> UserController : "validates"
    ValidationMiddleware --> ProjectController : "validates"
    UserContext --> User : "manages"
    ProjectComponent --> ChatComponent : "contains"
    ProjectComponent --> CodeEditorComponent : "contains"
    ProjectComponent --> WebContainerComponent : "contains"
    ChatComponent --> SocketManager : "communicates with"
    CodeEditorComponent --> ProjectService : "saves to"
    WebContainerComponent --> WebContainerService : "uses"
```

## 2. Sequence Diagram - User Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database

    U->>F: Enter email/password
    F->>B: POST /users/login
    B->>B: Validate input
    B->>DB: Find user by email
    DB-->>B: User data
    B->>B: Verify password
    B->>B: Generate JWT token
    B-->>F: {user, token}
    F->>F: Store token in localStorage
    F->>F: Update UserContext
    F-->>U: Redirect to Home
```

## 3. Sequence Diagram - Project Creation and Collaboration

```mermaid
sequenceDiagram
    participant U1 as User1
    participant U2 as User2
    participant F1 as Frontend1
    participant F2 as Frontend2
    participant B as Backend
    participant S as Socket.io
    participant DB as Database

    U1->>F1: Create project
    F1->>B: POST /projects/create
    B->>DB: Save project
    DB-->>B: Project created
    B-->>F1: Project data
    F1->>S: Join project room
    S->>S: Add to room

    U1->>F1: Add collaborator
    F1->>B: PUT /projects/add-user
    B->>DB: Update project
    DB-->>B: Updated project
    B-->>F1: Success response
    S->>F2: Broadcast user added

    U2->>F2: Join project
    F2->>S: Join project room
    S->>S: Add to room
    S->>F1: Broadcast user joined
```

## 4. Sequence Diagram - AI Code Generation and Execution

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant S as Socket.io
    participant B as Backend
    participant AI as AI Service
    participant WC as WebContainer
    participant DB as Database

    U->>F: Type "@ai create Express server"
    F->>S: Emit project-message
    S->>B: Handle message
    B->>B: Detect @ai trigger
    B->>AI: Generate code
    AI-->>B: Code response
    B->>DB: Update file tree
    DB-->>B: Success
    B->>S: Broadcast AI response
    S->>F: Receive AI message
    F->>WC: Mount file tree
    WC->>WC: Install dependencies
    WC->>WC: Start server
    WC-->>F: Server ready
    F->>F: Update iframe URL
    F-->>U: Show live preview
```

## 5. Use Case Diagram

```mermaid
graph TB
    subgraph "ChatNova System"
        subgraph "Authentication"
            UC1[Register User]
            UC2[Login User]
            UC3[View Profile]
        end

        subgraph "Project Management"
            UC4[Create Project]
            UC5[View Projects]
            UC6[Add Collaborators]
            UC7[Join Project]
        end

        subgraph "Real-time Collaboration"
            UC8[Send Messages]
            UC9[Receive Messages]
            UC10[Edit Code]
            UC11[View File Tree]
        end

        subgraph "AI Integration"
            UC12[Request AI Help]
            UC13[Generate Code]
            UC14[Get Code Suggestions]
        end

        subgraph "Code Execution"
            UC15[Run Code]
            UC16[View Live Preview]
            UC17[Install Dependencies]
        end
    end

    subgraph "Actors"
        A1[Authenticated User]
        A2[Project Owner]
        A3[Collaborator]
        A4[AI Assistant]
    end

    A1 --> UC1
    A1 --> UC2
    A1 --> UC3
    A1 --> UC4
    A1 --> UC5
    A1 --> UC8
    A1 --> UC9
    A1 --> UC10
    A1 --> UC11
    A1 --> UC12
    A1 --> UC15
    A1 --> UC16

    A2 --> UC6
    A2 --> UC7

    A3 --> UC7
    A3 --> UC8
    A3 --> UC9
    A3 --> UC10
    A3 --> UC11
    A3 --> UC12
    A3 --> UC15
    A3 --> UC16

    A4 --> UC13
    A4 --> UC14
    A4 --> UC17
```

## 6. Component Diagram

```mermaid
graph TB
    subgraph "Frontend (React)"
        subgraph "Components"
            C1[App Component]
            C2[Home Component]
            C3[Project Component]
            C4[Login Component]
            C5[Register Component]
            C6[Chat Component]
            C7[CodeEditor Component]
            C8[WebContainer Component]
        end

        subgraph "Context"
            C9[User Context]
        end

        subgraph "Services"
            C10[Axios Service]
            C11[Socket Service]
            C12[WebContainer Service]
        end
    end

    subgraph "Backend (Node.js)"
        subgraph "Controllers"
            C13[User Controller]
            C14[Project Controller]
            C15[AI Controller]
        end

        subgraph "Services"
            C16[User Service]
            C17[Project Service]
            C18[AI Service]
            C19[Redis Service]
        end

        subgraph "Middleware"
            C20[Auth Middleware]
            C21[Validation Middleware]
            C22[CORS Middleware]
        end

        subgraph "Models"
            C23[User Model]
            C24[Project Model]
        end

        subgraph "Real-time"
            C25[Socket.io Server]
        end
    end

    subgraph "External Services"
        C26[MongoDB]
        C27[Google Gemini AI]
        C28[Redis]
        C29[WebContainer API]
    end

    %% Frontend connections
    C1 --> C2
    C1 --> C3
    C1 --> C4
    C1 --> C5
    C3 --> C6
    C3 --> C7
    C3 --> C8
    C1 --> C9
    C10 --> C13
    C10 --> C14
    C11 --> C25
    C12 --> C29

    %% Backend connections
    C13 --> C16
    C14 --> C17
    C15 --> C18
    C13 --> C20
    C14 --> C21
    C16 --> C23
    C17 --> C24
    C25 --> C18
    C25 --> C20

    %% Database connections
    C23 --> C26
    C24 --> C26
    C18 --> C27
    C19 --> C28
```

## 7. Activity Diagram - Project Collaboration Flow

```mermaid
flowchart TD
    A[User Login] --> B{Authenticated?}
    B -->|No| C[Redirect to Login]
    B -->|Yes| D[View Home Dashboard]
    
    D --> E[Create New Project]
    E --> F[Enter Project Name]
    F --> G[Project Created]
    
    G --> H[Add Collaborators]
    H --> I[Select Users]
    I --> J[Collaborators Added]
    
    J --> K[Join Project Room]
    K --> L[Socket.io Connection]
    L --> M[Real-time Chat Available]
    
    M --> N{User Types @ai?}
    N -->|No| O[Send Regular Message]
    N -->|Yes| P[AI Processing]
    
    O --> Q[Message Broadcast]
    P --> R[Generate Code]
    R --> S[Update File Tree]
    S --> T[Mount to WebContainer]
    T --> U[Install Dependencies]
    U --> V[Start Application]
    V --> W[Live Preview Available]
    
    Q --> X[Continue Collaboration]
    W --> X
    X --> Y{More Actions?}
    Y -->|Yes| N
    Y -->|No| Z[End Session]
```

## 8. State Diagram - Project Component States

```mermaid
stateDiagram-v2
    [*] --> Loading
    Loading --> Authenticated : Login Success
    Loading --> Unauthenticated : Login Failed
    
    Authenticated --> ProjectList : View Projects
    ProjectList --> ProjectView : Select Project
    ProjectView --> ChatActive : Send Message
    ProjectView --> CodeEditing : Edit Code
    ProjectView --> AIProcessing : Request AI Help
    
    ChatActive --> MessageSent : Message Sent
    MessageSent --> ChatActive : Continue Chat
    MessageSent --> AIProcessing : @ai Detected
    
    CodeEditing --> FileSaved : Save File
    FileSaved --> CodeEditing : Continue Editing
    FileSaved --> CodeRunning : Run Code
    
    AIProcessing --> CodeGenerated : AI Response
    CodeGenerated --> CodeRunning : Execute Code
    CodeGenerated --> ChatActive : Display Response
    
    CodeRunning --> LivePreview : Server Ready
    LivePreview --> CodeRunning : Code Changes
    LivePreview --> ProjectView : Stop Execution
    
    Unauthenticated --> Authenticated : Login
    ProjectView --> ProjectList : Back to Projects
    ProjectList --> Unauthenticated : Logout
```

## 9. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        String email UK
        String password
        Date createdAt
        Date updatedAt
    }
    
    PROJECT {
        ObjectId _id PK
        String name UK
        Object fileTree
        Date createdAt
        Date updatedAt
    }
    
    USER_PROJECT {
        ObjectId userId FK
        ObjectId projectId FK
        String role
        Date joinedAt
    }
    
    MESSAGE {
        ObjectId _id PK
        ObjectId projectId FK
        ObjectId senderId FK
        String message
        String type
        Date createdAt
    }
    
    USER ||--o{ USER_PROJECT : "participates in"
    PROJECT ||--o{ USER_PROJECT : "has participants"
    PROJECT ||--o{ MESSAGE : "contains"
    USER ||--o{ MESSAGE : "sends"
```

## 10. Deployment Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        C1[Web Browser]
        C2[Mobile Browser]
    end

    subgraph "Load Balancer"
        LB[Nginx Load Balancer]
    end

    subgraph "Frontend Layer"
        F1[React App Instance 1]
        F2[React App Instance 2]
        F3[React App Instance N]
    end

    subgraph "Backend Layer"
        B1[Node.js Instance 1]
        B2[Node.js Instance 2]
        B3[Node.js Instance N]
    end

    subgraph "Socket.io Layer"
        S1[Socket.io Instance 1]
        S2[Socket.io Instance 2]
        S3[Socket.io Instance N]
    end

    subgraph "Database Layer"
        DB1[MongoDB Primary]
        DB2[MongoDB Secondary 1]
        DB3[MongoDB Secondary 2]
    end

    subgraph "Cache Layer"
        R1[Redis Instance 1]
        R2[Redis Instance 2]
    end

    subgraph "External Services"
        ES1[Google Gemini AI]
        ES2[WebContainer API]
    end

    C1 --> LB
    C2 --> LB
    LB --> F1
    LB --> F2
    LB --> F3
    F1 --> B1
    F2 --> B2
    F3 --> B3
    B1 --> S1
    B2 --> S2
    B3 --> S3
    B1 --> DB1
    B2 --> DB1
    B3 --> DB1
    DB1 --> DB2
    DB1 --> DB3
    B1 --> R1
    B2 --> R2
    B1 --> ES1
    B1 --> ES2
```

These UML diagrams provide a comprehensive view of the ChatNova project's architecture, interactions, and data flow. They can be used for:

1. **Technical Documentation** - Understanding system architecture
2. **Development Planning** - Identifying components and relationships
3. **Interview Presentations** - Explaining system design
4. **Code Reviews** - Validating implementation against design
5. **Onboarding** - Helping new developers understand the system

The diagrams cover all major aspects including authentication, real-time communication, AI integration, code execution, and deployment architecture. 