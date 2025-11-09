# 🏛️ Live Auction System

A full-stack real-time auction platform built with **Spring Boot** (Backend) and **React** (Frontend). Features include user authentication, real-time bidding, seller dashboards, and comprehensive auction management.

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (SELLER, BIDDER, ADMIN)
- Secure password encryption with BCrypt

### 🏪 Seller Features
- Create and manage auction items
- View auction statistics and analytics
- Track bids and revenue
- Item status management (PENDING, ACTIVE, CLOSED)

### 🎯 Bidder Features
- Browse active auctions
- Place real-time bids
- View bid history
- Search and filter auctions

### ⚡ Real-time Features
- Live bid updates
- Auction status changes
- Real-time notifications

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Glass morphism effects
- Smooth animations and transitions
- Mobile-friendly interface

## 🛠️ Tech Stack

### Backend
- **Java 17+**
- **Spring Boot 3.x**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA** (Database ORM)
- **MySQL** (Primary Database)
- **WebSocket** (Real-time communication)
- **Maven** (Dependency Management)

### Frontend
- **React 18**
- **Vite** (Build Tool)
- **React Router** (Navigation)
- **Axios** (HTTP Client)
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17 or higher**
- **Node.js 16 or higher**
- **MySQL 8.0 or higher**
- **Maven 3.6 or higher**
- **Git**

## 🗄️ Database Setup

### 1. Install MySQL
Download and install MySQL from [https://dev.mysql.com/downloads/](https://dev.mysql.com/downloads/)

### 2. Create Database
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create the database
CREATE DATABASE auctionDB;

-- Create a user (optional, you can use root)
CREATE USER 'auction_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON auctionDB.* TO 'auction_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 3. Verify Database Connection
```sql
-- Test connection
mysql -u auction_user -p auctionDB
-- or if using root
mysql -u root -p auctionDB
```

## ⚙️ Backend Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd auction-system
```

### 2. Configure Database Connection
Edit `backend/auction/src/main/resources/application.properties`:

```properties
# Application Configuration
spring.application.name=auction

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/auctionDB
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.defer-datasource-initialization=true
spring.sql.init.mode=always
spring.jpa.show-sql=true

# JWT Configuration
jwt.secret=5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437
jwt.access-token-expiration=86400000
jwt.refresh-token-expiration=604800000
```

**Important Notes:**
- Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL password
- `spring.jpa.hibernate.ddl-auto=create-drop` will recreate tables on each restart (good for development)
- For production, change it to `update` or `validate`

### 3. Install Dependencies and Run
```bash
cd backend/auction

# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Verify Backend is Running
Open your browser and visit:
- Health Check: `http://localhost:8080/api/test/health`
- Items Test: `http://localhost:8080/api/test/items`

You should see JSON responses confirming the backend is working.

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend/auction
```

### 2. Install Dependencies
```bash
# Install all required packages
npm install
```

### 3. Configure Environment (Optional)
Create `.env` file in `frontend/auction/`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 4. Start Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🚀 Running the Complete System

### 1. Start Backend
```bash
cd backend/auction
mvn spring-boot:run
```

### 2. Start Frontend (in a new terminal)
```bash
cd frontend/auction
npm run dev
```

### 3. Access the Application
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8080/api`

## 👥 User Accounts & Testing

### Default Test Users
The system includes a DataLoader that creates default users:

**Seller Account:**
- Username: `seller1`
- Password: `password123`
- Role: SELLER

**Bidder Account:**
- Username: `bidder1`
- Password: `password123`
- Role: BIDDER

### Testing the System

1. **Register/Login as Seller:**
   - Go to `http://localhost:5173/register`
   - Create a seller account or use the default seller account
   - Access the Seller Dashboard to create auction items

2. **Register/Login as Bidder:**
   - Create a bidder account or use the default bidder account
   - Browse auctions on the home page
   - Place bids on active auctions

3. **Test Real-time Features:**
   - Open multiple browser windows
   - Place bids and watch real-time updates

## 📁 Project Structure

```
auction-system/
├── backend/
│   └── auction/
│       ├── src/main/java/org/buddhi/auction/
│       │   ├── config/          # Configuration classes
│       │   ├── controller/      # REST controllers
│       │   ├── dto/            # Data Transfer Objects
│       │   ├── model/          # JPA entities
│       │   ├── repository/     # Data repositories
│       │   ├── service/        # Business logic
│       │   └── websocket/      # WebSocket handlers
│       └── src/main/resources/
│           ├── application.properties
│           └── data.sql        # Initial data
├── frontend/
│   └── auction/
│       ├── src/
│       │   ├── components/     # Reusable components
│       │   ├── context/        # React contexts
│       │   ├── pages/          # Page components
│       │   ├── services/       # API services
│       │   ├── utils/          # Utility functions
│       │   └── websocket/      # WebSocket client
│       ├── package.json
│       └── vite.config.js
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token

### Items
- `GET /api/items/all` - Get all items
- `GET /api/items/active` - Get active auctions
- `GET /api/items/{id}` - Get item by ID
- `POST /api/items` - Create new item (SELLER only)
- `GET /api/items/my-items` - Get seller's items

### Bids
- `POST /api/bids` - Place a bid (BIDDER only)
- `GET /api/bids/item/{itemId}` - Get bids for item
- `GET /api/bids/my-bids` - Get user's bids
- `GET /api/bids/highest/{itemId}` - Get highest bid

### Testing
- `GET /api/test/health` - Health check
- `GET /api/test/items` - Test items endpoint
- `GET /api/test/database` - Test database connection

## 🐛 Troubleshooting

### Common Issues

#### Backend Issues

**1. Database Connection Error**
```
Error: Could not create connection to database server
```
**Solution:**
- Verify MySQL is running: `sudo systemctl status mysql`
- Check database credentials in `application.properties`
- Ensure database `auctionDB` exists

**2. Port Already in Use**
```
Error: Port 8080 is already in use
```
**Solution:**
- Kill process using port 8080: `lsof -ti:8080 | xargs kill -9`
- Or change port in `application.properties`: `server.port=8081`

**3. JWT Secret Error**
```
Error: JWT secret key is too short
```
**Solution:**
- Ensure JWT secret in `application.properties` is at least 256 bits long

#### Frontend Issues

**1. API Connection Error**
```
Error: Network Error / CORS Error
```
**Solution:**
- Verify backend is running on `http://localhost:8080`
- Check CORS configuration in backend
- Ensure no firewall blocking the connection

**2. Module Not Found**
```
Error: Cannot resolve module 'sockjs-client'
```
**Solution:**
- Install missing dependencies: `npm install`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**3. Build Errors**
```
Error: Failed to resolve import
```
**Solution:**
- Clear Vite cache: `rm -rf node_modules/.vite`
- Restart development server: `npm run dev`

### Database Issues

**1. Reset Database**
If you need to reset the database:
```sql
DROP DATABASE auctionDB;
CREATE DATABASE auctionDB;
```
Then restart the backend application.

**2. View Database Contents**
```sql
USE auctionDB;
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM items;
SELECT * FROM bids;
```

## 🔒 Security Considerations

### For Development
- Default JWT secret is provided for development
- CORS is configured to allow all origins
- Database credentials are in plain text

### For Production
- Generate a secure JWT secret (256+ bits)
- Configure CORS for specific domains only
- Use environment variables for sensitive data
- Enable HTTPS
- Use a production database with proper security

## 📈 Performance Optimization

### Backend
- Database indexing on frequently queried fields
- Connection pooling for database connections
- Caching for frequently accessed data
- Pagination for large datasets

### Frontend
- Code splitting and lazy loading
- Image optimization
- Bundle size optimization
- Service worker for caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure database is properly configured
4. Check browser console for frontend errors
5. Check application logs for backend errors

For additional help, please create an issue in the repository with:
- Error messages
- Steps to reproduce
- System information (OS, Java version, Node version)
- Screenshots if applicable

---

## 🎉 Quick Start Summary

```bash
# 1. Setup Database
mysql -u root -p
CREATE DATABASE auctionDB;

# 2. Start Backend
cd backend/auction
mvn spring-boot:run

# 3. Start Frontend (new terminal)
cd frontend/auction
npm install
npm run dev

# 4. Access Application
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
```

**Happy Bidding! 🎯**