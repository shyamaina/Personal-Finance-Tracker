# Personal Finance Tracker - Full Stack Application

A complete full-stack personal finance management application with role-based access control, interactive analytics, and modern UI/UX.

## 🚀 Features

### Core Functionality
- **User Authentication** with JWT tokens
- **Role-Based Access Control** (Admin, User, Read-only)
- **Transaction Management** (CRUD operations)
- **Category Management**
- **Financial Analytics** with interactive charts
- **Search & Filter** transactions
- **Pagination** for large datasets

### Technical Features
- **Lazy Loading** for better performance
- **Rate Limiting** for API protection
- **Input Validation** and security hardening
- **Responsive Design** with modern UI
- **API Documentation** with Swagger UI

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** authentication
- **bcryptjs** for password hashing
- **express-rate-limit** for API protection
- **express-validator** for input validation
- **Swagger/OpenAPI** for documentation

### Frontend
- **React 18+** with hooks (useContext, useCallback, useMemo)
- **React Router** for navigation
- **Axios** for API communication
- **Recharts** for data visualization
- **Styled Components** for styling
- **Lazy Loading** with React.lazy and Suspense

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd personal-finance-tracker
```

### 2. Database Setup

#### Create MySQL Database
```sql
CREATE DATABASE finance_tracker;
USE finance_tracker;
```

#### Run Migration Script
Copy and paste the following SQL into your MySQL client:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user', 'read-only') NOT NULL DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Insert default categories
INSERT IGNORE INTO categories (name) VALUES
  ('Food'),
  ('Transport'),
  ('Entertainment'),
  ('Utilities'),
  ('Shopping'),
  ('Healthcare'),
  ('Salary'),
  ('Other');

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  category_id INT NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description VARCHAR(255),
  date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

### 3. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Configuration
Create a `.env` file in the `backend` folder:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=finance_tracker
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

#### Create Demo Users
```bash
npm run setup-demo
```

#### Start Backend Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### 4. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Start Frontend Development Server
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 👥 Demo Credentials

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | admin@demo.com | admin123 | Full access to all features |
| **User** | user@demo.com | user123 | Manage own transactions |
| **Read-only** | readonly@demo.com | readonly123 | View only |

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT

### Transactions
- `GET /api/transactions` - Get user's transactions
- `POST /api/transactions` - Create transaction (admin/user)
- `PUT /api/transactions/:id` - Update transaction (admin/user)
- `DELETE /api/transactions/:id` - Delete transaction (admin/user)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Add category (admin only)

### Analytics
- `GET /api/analytics/overview?year=2024&month=1` - Financial overview
- `GET /api/analytics/category-breakdown?year=2024` - Category breakdown
- `GET /api/analytics/income-vs-expense?year=2024` - Monthly trends

## 🔐 Security Features

### Backend Security
- **JWT Authentication** for all protected routes
- **Role-Based Access Control** (RBAC)
- **Input Validation** and sanitization
- **SQL Injection Prevention** (parameterized queries)
- **Rate Limiting**:
  - Auth: 5 requests per 15 minutes
  - Transactions: 100 requests per hour
  - Analytics: 50 requests per hour
- **Helmet** for HTTP header security

### Frontend Security
- **Protected Routes** with authentication checks
- **Role-Based UI** rendering
- **Secure API Communication** with JWT tokens
- **Input Validation** on forms

## 📊 Analytics & Charts

The application includes three types of interactive charts:

1. **Pie Chart** - Expense breakdown by category
2. **Line Chart** - Monthly income vs expense trends
3. **Bar Chart** - Income vs expense comparison

All charts are responsive and include:
- Interactive tooltips
- Color-coded data
- Legend information
- Smooth animations

## 🔧 Performance Features

### React Hooks Implementation
- **useContext**: Global authentication state management
- **useCallback**: Optimized event handlers to prevent unnecessary re-renders
- **useMemo**: Expensive calculations (totals, filtered data) memoization

### Lazy Loading
- **Route-based code splitting** with React.lazy
- **Component-level lazy loading** for better performance
- **Suspense fallbacks** for improved user experience

### Backend Optimization
- **Connection pooling** for database efficiency
- **Rate limiting** to prevent abuse
- **Input validation** to reduce server load

## 📁 Project Structure

```
personal-finance-tracker/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Auth, validation, RBAC
│   │   ├── routes/          # API routes
│   │   └── utils/           # Database, rate limiters, etc.
│   ├── app.js              # Express app setup
│   ├── server.js           # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React contexts
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   └── package.json
└── README.md
```

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Role-Based UI**: Different interfaces for different user types
- **Interactive Charts**: Hover effects, tooltips, and legends
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

## 📖 API Documentation

Visit `http://localhost:5000/api-docs` when the backend is running to view interactive API documentation with Swagger UI.

## 🧪 Testing the Application

### 1. Start Both Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### 2. Test User Flows
1. **Register** a new account at `http://localhost:3000/register`
2. **Login** with demo credentials or your new account
3. **Add transactions** (if you have user/admin role)
4. **View analytics** and charts
5. **Test different roles** with demo accounts

### 3. Test API Endpoints
```bash
# Login to get JWT
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@demo.com", "password": "admin123"}'

# Use JWT for authenticated requests
curl -X GET http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚀 Development Commands

### Backend
```bash
cd backend
npm run dev          # Start development server
npm run setup-demo   # Create demo users
npm start           # Start production server
```

### Frontend
```bash
cd frontend
npm start           # Start development server
npm run build       # Build for production
npm test           # Run tests
```

## 📝 Notes

- All timestamps are in UTC
- Amounts are stored as DECIMAL(10,2)
- JWT tokens expire after 24 hours
- Read-only users can view but not modify data
- The frontend uses a proxy configuration to avoid CORS issues
- Charts update automatically when new data is added

## 🔄 Deployment

### Backend Deployment
1. Set up production environment variables
2. Build and deploy to your preferred hosting service
3. Configure database connection for production

### Frontend Deployment
1. Run `npm run build` to create production build
2. Deploy the `build` folder to your hosting service
3. Update API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for educational purposes as part of a full-stack development assignment.

---

**Happy Coding! 🎉**
