# ChatNova - Low Level Design (LLD)

## 1. System Overview

### 1.1 Project Description
ChatNova is a real-time collaborative development platform that enables teams to:
- Create project groups and manage collaborators
- Communicate through real-time chat
- Get AI assistance for code generation and development
- Execute Node.js code directly in the browser using WebContainer
- Collaborate on code in real-time

### 1.2 System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│                        │                        │
├─ Socket.io Client      ├─ Express Server        ├─ MongoDB
├─ WebContainer          ├─ Socket.io Server      ├─ Google Gemini AI
├─ Tailwind CSS          ├─ JWT Authentication    ├─ Redis (Optional)
└─ React Router          └─ Mongoose ODM          └─ WebContainer API
```

## 2. Database Design

### 2.1 User Model
```javascript
const userSchema = {
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 6,
    maxLength: 25
  },
  password: {
    type: String,
    required: true,
    select: false
  }
}
```

### 2.2 Project Model
```javascript
const projectSchema = {
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  fileTree: {
    type: Object,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### 2.3 Database Relationships
- **One-to-Many**: User can have multiple Projects
- **Many-to-Many**: Users can collaborate on multiple Projects
- **One-to-One**: Project has one FileTree structure

## 3. API Design

### 3.1 Authentication Endpoints
```
POST /users/register
POST /users/login
GET  /users/profile
GET  /users/all
```

### 3.2 Project Endpoints
```
POST   /projects/create
GET    /projects/all
GET    /projects/get-project/:projectId
PUT    /projects/add-user
PUT    /projects/update-file-tree
```

### 3.3 Request/Response Formats

#### User Registration
```javascript
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "user": {
    "_id": "user_id",
    "email": "user@example.com"
  },
  "token": "jwt_token"
}
```

#### Project Creation
```javascript
// Request
{
  "name": "project_name"
}

// Response
{
  "_id": "project_id",
  "name": "project_name",
  "users": ["user_id"],
  "fileTree": {},
  "createdAt": "timestamp"
}
```

## 4. Real-time Communication Design

### 4.1 Socket.io Events

#### Client to Server Events
```javascript
// Join project room
socket.emit('join-project', { projectId, token })

// Send message
socket.emit('project-message', {
  message: "Hello @ai create a server",
  sender: userObject
})
```

#### Server to Client Events
```javascript
// Receive message
socket.on('project-message', (data) => {
  // data: { message, sender }
})

// AI response
socket.on('project-message', (data) => {
  // data: { message: aiResponse, sender: { _id: 'ai', email: 'AI' } }
})
```

### 4.2 Room Management
```javascript
// Room Structure
{
  roomId: projectId,
  users: [userId1, userId2, ...],
  messages: [message1, message2, ...],
  fileTree: {...}
}
```

## 5. AI Integration Design

### 5.1 AI Service Architecture
```javascript
class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4
      }
    });
  }

  async generateResult(prompt) {
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
}
```

### 5.2 AI Response Format
```javascript
{
  "text": "Here's your Express server setup",
  "fileTree": {
    "app.js": {
      "file": {
        "contents": "const express = require('express');..."
      }
    },
    "package.json": {
      "file": {
        "contents": "{ \"name\": \"server\", ... }"
      }
    }
  },
  "buildCommand": {
    "mainItem": "npm",
    "commands": ["install"]
  },
  "startCommand": {
    "mainItem": "node",
    "commands": ["app.js"]
  }
}
```

## 6. WebContainer Integration

### 6.1 WebContainer Service
```javascript
class WebContainerService {
  constructor() {
    this.container = null;
  }

  async initialize() {
    if (!this.container) {
      this.container = await WebContainer.boot();
    }
    return this.container;
  }

  async mountFileTree(fileTree) {
    await this.container.mount(fileTree);
  }

  async runCommand(command, args) {
    const process = await this.container.spawn(command, args);
    return process;
  }
}
```

### 6.2 Code Execution Flow
```javascript
// 1. AI generates file tree
const aiResponse = await aiService.generateResult(prompt);
const fileTree = JSON.parse(aiResponse).fileTree;

// 2. Mount to WebContainer
await webContainer.mount(fileTree);

// 3. Install dependencies
const installProcess = await webContainer.spawn("npm", ["install"]);

// 4. Start application
const startProcess = await webContainer.spawn("npm", ["start"]);

// 5. Get server URL
webContainer.on('server-ready', (port, url) => {
  setIframeUrl(url);
});
```

## 7. Frontend Component Architecture

### 7.1 Component Hierarchy
```
App
├── UserProvider (Context)
└── AppRoutes
    ├── UserAuth (Protected Routes)
    │   ├── Home
    │   └── Project
    └── Public Routes
        ├── Login
        └── Register
```

### 7.2 State Management
```javascript
// User Context
const UserContext = {
  user: null,
  setUser: (user) => {},
  logout: () => {}
}

// Project State
const ProjectState = {
  project: null,
  messages: [],
  fileTree: {},
  currentFile: null,
  openFiles: [],
  webContainer: null,
  iframeUrl: null,
  users: [],
  selectedUserId: new Set()
}
```

### 7.3 Key Components

#### Project Component
```javascript
const Project = () => {
  // State management
  const [messages, setMessages] = useState([]);
  const [fileTree, setFileTree] = useState({});
  const [webContainer, setWebContainer] = useState(null);
  
  // Socket connection
  useEffect(() => {
    initializeSocket(project._id);
    receiveMessage('project-message', handleMessage);
  }, []);
  
  // WebContainer initialization
  useEffect(() => {
    if (!webContainer) {
      getWebContainer().then(setWebContainer);
    }
  }, []);
  
  return (
    <main className="h-screen w-screen flex">
      <ChatSection />
      <CodeEditorSection />
      <PreviewSection />
    </main>
  );
};
```

## 8. Security Design

### 8.1 Authentication Flow
```javascript
// JWT Token Structure
{
  "email": "user@example.com",
  "iat": timestamp,
  "exp": timestamp + 24h
}

// Middleware
const authCheck = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};
```

### 8.2 Input Validation
```javascript
// Express Validator
const validateProject = [
  body('name').isLength({ min: 1 }).withMessage('Project name is required'),
  body('users').isArray().withMessage('Users must be an array')
];

const validateUser = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be 6+ characters')
];
```

## 9. Error Handling

### 9.1 Error Types
```javascript
// Authentication Errors
class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

// Validation Errors
class ValidationError extends Error {
  constructor(errors) {
    super('Validation failed');
    this.statusCode = 400;
    this.errors = errors;
  }
}

// Project Access Errors
class ProjectAccessError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}
```

### 9.2 Error Handling Middleware
```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

## 10. Performance Considerations

### 10.1 Frontend Optimizations
```javascript
// React Optimizations
const MemoizedComponent = React.memo(Component);
const expensiveValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// Socket.io Optimizations
const debouncedEmit = debounce((event, data) => {
  socket.emit(event, data);
}, 300);
```

### 10.2 Backend Optimizations
```javascript
// Database Indexing
userSchema.index({ email: 1 });
projectSchema.index({ users: 1 });

// Caching Strategy
const cacheProject = async (projectId) => {
  const cached = await redis.get(`project:${projectId}`);
  if (cached) return JSON.parse(cached);
  
  const project = await Project.findById(projectId);
  await redis.setex(`project:${projectId}`, 3600, JSON.stringify(project));
  return project;
};
```

## 11. Scalability Design

### 11.1 Horizontal Scaling
```javascript
// Load Balancer Configuration
const loadBalancer = {
  algorithm: 'round-robin',
  healthCheck: '/health',
  stickySessions: true
};

// Socket.io Clustering
const io = new Server(server, {
  adapter: createAdapter(createClient(redisUrl))
});
```

### 11.2 Database Scaling
```javascript
// MongoDB Sharding
const shardKey = { projectId: 1 };
const shardConfig = {
  shards: [
    { _id: 'shard0', host: 'shard0:27017' },
    { _id: 'shard1', host: 'shard1:27017' }
  ]
};
```

## 12. Monitoring and Logging

### 12.1 Logging Strategy
```javascript
// Winston Logger Configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 12.2 Metrics Collection
```javascript
// Performance Metrics
const metrics = {
  activeConnections: 0,
  messageCount: 0,
  aiRequests: 0,
  responseTime: []
};

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});
```

## 13. Deployment Architecture

### 13.1 Environment Configuration
```javascript
// Environment Variables
const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_AI_KEY: process.env.GOOGLE_AI_KEY,
  REDIS_URL: process.env.REDIS_URL
};
```

### 13.2 Docker Configuration
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 14. Testing Strategy

### 14.1 Test Types
```javascript
// Unit Tests
describe('UserService', () => {
  test('should create user with valid data', async () => {
    const userData = { email: 'test@example.com', password: 'password123' };
    const user = await userService.createUser(userData);
    expect(user.email).toBe(userData.email);
  });
});

// Integration Tests
describe('Project API', () => {
  test('should create project for authenticated user', async () => {
    const response = await request(app)
      .post('/projects/create')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Project' });
    expect(response.status).toBe(201);
  });
});
```

## 15. Future Enhancements

### 15.1 Planned Features
- Real-time code collaboration with cursor tracking
- Version control integration (Git)
- Advanced AI features (code review, testing)
- Mobile application
- Plugin system for extensions
- Advanced project templates

### 15.2 Technical Improvements
- Microservices architecture
- GraphQL API
- WebRTC for peer-to-peer communication
- Advanced caching strategies
- Machine learning for code suggestions
- Advanced security features (2FA, SSO)

This LLD provides a comprehensive technical foundation for the ChatNova project, covering all major aspects from database design to deployment strategies. 