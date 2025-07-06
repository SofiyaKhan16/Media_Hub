# Media Hub ( Multi Media Manager )

A modern full-stack web application for managing and sharing multimedia files including images, videos, audio, and PDF documents. Built with React.js frontend and Node.js/Express backend with MongoDB database and Cloudinary integration for efficient media storage and processing.

## 🚀 Features

- **User Authentication** - Secure login/signup with JWT tokens and Google OAuth integration
- **Media Upload** - Support for multiple file types (images, videos, audio, PDFs)
- **Cloud Storage** - Cloudinary integration for optimized media storage and delivery
- **Media Management** - Upload, view, edit, and delete multimedia files
- **Responsive Design** - Modern UI that works on desktop and mobile devices
- **File Preview** - Built-in preview for different media types
- **Infinite Scroll** - Efficient loading of large media collections
- **API Documentation** - Swagger/OpenAPI documentation for backend endpoints
- **Protected Routes** - Role-based access control for secure operations

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool and development server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Dropzone** - File upload component
- **Google OAuth** - Authentication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Cloudinary** - Media storage and optimization
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload middleware
- **Swagger** - API documentation

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (local installation or MongoDB Atlas account)
- [Cloudinary Account](https://cloudinary.com/) (for media storage)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/multi-media.git
cd multi-media
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd Backend
npm install
```

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../Frontend
npm install
```

### 4. Environment Variables

#### Backend Configuration
Create a `.env` file in the `Backend` directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/multimedia
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/multimedia

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Email Configuration (optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

#### Frontend Configuration
Create a `.env` file in the `Frontend` directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

**Note:** Make sure to add both `.env` files to your `.gitignore` to prevent committing sensitive information to version control.

### 5. Cloudinary Setup

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Go to your dashboard and copy your cloud name, API key, and API secret
3. Add these credentials to your `.env` file

### 6. MongoDB Setup

**Option A: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use `MONGODB_URI=mongodb://localhost:27017/multimedia`

**Option B: MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and replace the `.env` variable

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server:**
```bash
cd Backend
npm run dev
```
The backend server will start on `http://localhost:5000`

2. **Start the Frontend Development Server:**
```bash
cd Frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

## 📖 API Documentation

Once the backend is running, you can access the Swagger API documentation at:
```
http://localhost:5000/api-docs
```

## 🔗 API Endpoints

### Authentication
- `POST /api/account/register` - User registration
- `POST /api/account/login` - User login
- `GET /api/account/profile` - Get user profile

### Media Files
- `GET /api/media` - Get all media files
- `POST /api/media/upload` - Upload new media file
- `GET /api/media/:id` - Get specific media file
- `PUT /api/media/:id` - Update media file
- `DELETE /api/media/:id` - Delete media file

## 📱 Usage

1. **Register/Login:** Create an account or login with existing credentials
2. **Upload Media:** Use the upload page to add your media files
3. **Browse Media:** View all uploaded media in the home page
4. **File Management:** Edit, delete, or view details of your media files
5. **Profile:** Manage your account settings

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running locally or check your Atlas connection string
   - Verify the `MONGODB_URI` in your `.env` file

2. **Cloudinary Upload Issues:**
   - Check your Cloudinary credentials in the `.env` file
   - Ensure your Cloudinary account is active

3. **Frontend Not Loading:**
   - Make sure both backend and frontend servers are running
   - Check if the API base URL is correct in the frontend configuration

4. **Authentication Issues:**
   - Verify JWT_SECRET is set in your `.env` file
   - Check if tokens are being stored correctly in local storage


