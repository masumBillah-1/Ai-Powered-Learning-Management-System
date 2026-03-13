# 🏗️ Separate MVC Backend Server Architecture

## 🎯 WHY SEPARATE SERVER?

### Current Issues:
- ❌ Next.js API routes getting too complex
- ❌ Mixed frontend/backend code in same project
- ❌ Difficult to scale backend independently
- ❌ Hard to maintain and debug
- ❌ Performance bottlenecks

### Benefits of Separate Server:
- ✅ **Clean Separation** - Frontend and Backend completely separate
- ✅ **Better Performance** - Dedicated server for API operations
- ✅ **Scalability** - Can scale backend independently
- ✅ **Team Efficiency** - Frontend and Backend teams can work separately
- ✅ **Technology Flexibility** - Can use different tech stacks
- ✅ **Easier Deployment** - Deploy frontend and backend separately

---

## 🏗️ PROPOSED ARCHITECTURE

### Project Structure:
```
smartlms-project/
├── frontend/                 # Next.js Frontend (existing)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── next.config.ts
│
├── backend/                  # Express.js MVC Server (new)
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Authentication, validation
│   │   ├── services/        # External services
│   │   ├── utils/           # Helper functions
│   │   ├── config/          # Configuration
│   │   └── app.js           # Express app setup
│   ├── package.json
│   └── server.js            # Server entry point
│
└── shared/                   # Shared types and utilities
    ├── types/               # TypeScript interfaces
    └── constants/           # Shared constants
```

---

## 🚀 MVC BACKEND SERVER STRUCTURE

### Complete Folder Structure:
```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── courseController.js
│   │   ├── enrollmentController.js
│   │   ├── activityController.js
│   │   ├── transactionController.js
│   │   └── communicationController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   ├── Activity.js
│   │   ├── Transaction.js
│   │   └── Communication.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── courses.js
│   │   ├── enrollments.js
│   │   ├── activities.js
│   │   ├── transactions.js
│   │   └── communications.js
│   │
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication
│   │   ├── validation.js    # Input validation
│   │   ├── errorHandler.js  # Error handling
│   │   ├── rateLimit.js     # Rate limiting
│   │   └── cors.js          # CORS configuration
│   │
│   ├── services/
│   │   ├── emailService.js  # Email sending
│   │   ├── paymentService.js # Payment processing
│   │   ├── cloudinaryService.js # File upload
│   │   ├── aiService.js     # AI integration
│   │   └── socketService.js # Real-time features
│   │
│   ├── utils/
│   │   ├── database.js      # Database connection
│   │   ├── logger.js        # Logging utility
│   │   ├── helpers.js       # Helper functions
│   │   └── constants.js     # Constants
│   │
│   ├── config/
│   │   ├── database.js      # DB configuration
│   │   ├── cloudinary.js    # Cloudinary config
│   │   ├── email.js         # Email config
│   │   └── environment.js   # Environment variables
│   │
│   └── app.js               # Express app setup
│
├── tests/                   # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docs/                    # API documentation
│   └── api.md
│
├── package.json
├── server.js                # Server entry point
├── .env                     # Environment variables
├── .gitignore
└── README.md
```

---

## 📝 SAMPLE MVC IMPLEMENTATION

### 1. Server Entry Point (server.js)
```javascript
const app = require('./src/app');
const { connectDB } = require('./src/utils/database');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
  logger.info(`🗄️ Database: Connected`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});
```

### 2. Express App Setup (src/app.js)
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const activityRoutes = require('./routes/activities');
const transactionRoutes = require('./routes/transactions');
const communicationRoutes = require('./routes/communications');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { corsOptions } = require('./middleware/cors');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/communications', communicationRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
```

### 3. Sample Controller (src/controllers/courseController.js)
```javascript
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const cloudinaryService = require('../services/cloudinaryService');
const logger = require('../utils/logger');

class CourseController {
  // Get all courses
  async getAllCourses(req, res, next) {
    try {
      const { page = 1, limit = 10, category, level, search } = req.query;
      
      // Build query
      const query = { status: 'published', visibility: 'public' };
      if (category) query.category = category;
      if (level) query.level = level;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Execute query with pagination
      const courses = await Course.find(query)
        .populate('instructorId', 'name photoURL profile.instructorData.rating')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Course.countDocuments(query);

      res.status(200).json({
        success: true,
        data: courses,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new course
  async createCourse(req, res, next) {
    try {
      const instructorId = req.user.id;
      const courseData = { ...req.body, instructorId };

      // Handle file uploads
      if (req.body.coverImage?.base64) {
        const coverUrl = await cloudinaryService.uploadImage(
          req.body.coverImage.base64,
          'courses/covers'
        );
        courseData.coverImage = { type: 'upload', url: coverUrl };
      }

      if (req.body.salesVideo?.base64) {
        const videoUrl = await cloudinaryService.uploadVideo(
          req.body.salesVideo.base64,
          'courses/videos'
        );
        courseData.salesVideo = { type: 'upload', url: videoUrl };
      }

      const course = await Course.create(courseData);
      
      logger.info(`Course created: ${course._id} by ${instructorId}`);

      res.status(201).json({
        success: true,
        data: course,
        message: 'Course created successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get course by ID
  async getCourseById(req, res, next) {
    try {
      const { id } = req.params;
      
      const course = await Course.findById(id)
        .populate('instructorId', 'name photoURL profile.instructorData');

      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found'
        });
      }

      // Check if user is enrolled (if authenticated)
      let isEnrolled = false;
      if (req.user) {
        const enrollment = await Enrollment.findOne({
          studentId: req.user.id,
          courseId: id
        });
        isEnrolled = !!enrollment;
      }

      res.status(200).json({
        success: true,
        data: { ...course.toObject(), isEnrolled }
      });
    } catch (error) {
      next(error);
    }
  }

  // Update course
  async updateCourse(req, res, next) {
    try {
      const { id } = req.params;
      const instructorId = req.user.id;

      // Check if course belongs to instructor
      const course = await Course.findOne({ _id: id, instructorId });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found or unauthorized'
        });
      }

      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        data: updatedCourse,
        message: 'Course updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete course
  async deleteCourse(req, res, next) {
    try {
      const { id } = req.params;
      const instructorId = req.user.id;

      const course = await Course.findOneAndDelete({ _id: id, instructorId });
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found or unauthorized'
        });
      }

      logger.info(`Course deleted: ${id} by ${instructorId}`);

      res.status(200).json({
        success: true,
        message: 'Course deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CourseController();
```
### 4. Sample Route (src/routes/courses.js)
```javascript
const express = require('express');
const courseController = require('../controllers/courseController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateCourse } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// Protected routes (instructor only)
router.post('/', 
  authenticate, 
  authorize(['instructor', 'admin']), 
  validateCourse, 
  courseController.createCourse
);

router.put('/:id', 
  authenticate, 
  authorize(['instructor', 'admin']), 
  courseController.updateCourse
);

router.delete('/:id', 
  authenticate, 
  authorize(['instructor', 'admin']), 
  courseController.deleteCourse
);

module.exports = router;
```

### 5. Authentication Middleware (src/middleware/auth.js)
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Authorize user roles
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
```

### 6. Error Handler Middleware (src/middleware/errorHandler.js)
```javascript
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
```

### 7. Database Connection (src/utils/database.js)
```javascript
const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`❌ Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB };
```

### 8. Package.json for Backend
```json
{
  "name": "smartlms-backend",
  "version": "1.0.0",
  "description": "CareerCanvas Backend API Server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "express-rate-limit": "^7.1.5",
    "joi": "^17.11.0",
    "nodemailer": "^6.9.7",
    "cloudinary": "^1.41.0",
    "socket.io": "^4.7.4",
    "winston": "^3.11.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.54.0"
  }
}
```

---

## 🔄 FRONTEND-BACKEND COMMUNICATION

### Frontend API Service (frontend/src/services/api.js)
```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem('token');
  }

  // Make authenticated request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Course methods
  async getCourses(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/courses?${queryString}`);
  }

  async createCourse(courseData) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async getCourse(id) {
    return this.request(`/courses/${id}`);
  }

  // Enrollment methods
  async enrollInCourse(courseId) {
    return this.request('/enrollments', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
  }

  async getMyEnrollments() {
    return this.request('/enrollments');
  }
}

export default new ApiService();
```

---

## 🚀 DEPLOYMENT STRATEGY

### Development Environment:
```bash
# Backend (Port 5000)
cd backend
npm run dev

# Frontend (Port 3000)
cd frontend
npm run dev

# Socket Server (Port 4000) - can be integrated into backend
cd backend
npm run socket
```

### Production Deployment:

#### Backend Options:
1. **Railway** - Easy deployment with MongoDB
2. **Heroku** - Classic PaaS platform
3. **DigitalOcean App Platform** - Modern deployment
4. **AWS EC2** - Full control
5. **Vercel** - Serverless functions (alternative)

#### Frontend Options:
1. **Vercel** - Best for Next.js
2. **Netlify** - Static site hosting
3. **AWS S3 + CloudFront** - CDN distribution

### Environment Variables:

#### Backend (.env):
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password

# Payment
STRIPE_SECRET_KEY=sk_live_...
SSLCOMMERZ_STORE_ID=your_store_id

# AI
GEMINI_API_KEY=your_gemini_key
```

#### Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend-api.com
NEXT_PUBLIC_FIREBASE_API_KEY=...
```

---

## 📊 BENEFITS COMPARISON

### Current Next.js API Routes vs Separate MVC Server:

| Feature | Next.js API | Separate MVC Server |
|---------|-------------|-------------------|
| **Complexity** | High (mixed code) | Low (clean separation) |
| **Scalability** | Limited | High |
| **Performance** | Moderate | High |
| **Team Collaboration** | Difficult | Easy |
| **Deployment** | Single deploy | Independent deploys |
| **Technology Choice** | Limited to Next.js | Any backend tech |
| **Testing** | Complex | Simple |
| **Maintenance** | Hard | Easy |

---

## 🎯 MIGRATION PLAN

### Phase 1: Setup Separate Server (Week 1)
1. Create new backend project structure
2. Move existing models to backend
3. Create basic Express server
4. Setup authentication middleware

### Phase 2: Migrate APIs (Week 2-3)
1. Move auth APIs to backend
2. Move course APIs to backend
3. Create new enrollment APIs
4. Create activity APIs

### Phase 3: Frontend Integration (Week 4)
1. Create API service layer in frontend
2. Update all frontend components to use new APIs
3. Remove Next.js API routes
4. Test integration

### Phase 4: Advanced Features (Week 5-6)
1. Add payment processing
2. Add real-time features
3. Add file upload handling
4. Performance optimization

---

## 🔧 DEVELOPMENT WORKFLOW

### Team Workflow:
1. **Backend Team** works on MVC server independently
2. **Frontend Team** uses API documentation for integration
3. **Both teams** can develop simultaneously
4. **API contracts** defined upfront for smooth collaboration

### API Documentation:
- Use **Swagger/OpenAPI** for API documentation
- **Postman Collections** for API testing
- **Mock APIs** for frontend development before backend completion

এই separate MVC server architecture দিয়ে আপনার project অনেক বেশি scalable, maintainable এবং professional হবে!