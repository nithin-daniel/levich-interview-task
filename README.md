# Levich Interview Task

A full-stack web application with vendor monitoring and management capabilities, built with Next.js (frontend) and Express.js (backend).

## 📁 Project Structure

```
levich-interview-task/
├── client/          # Next.js frontend application
├── server/          # Express.js backend API
├── docker-compose.yml
├── docker-compose.dev.yml
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (if running locally)

### Option 1: Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd levich-interview-task
   ```

2. **Start with Docker Compose**
   ```bash
   # Development mode
   docker-compose -f docker-compose.dev.yml up --build

   # Production mode
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Database: localhost:5432

### Option 2: Local Development

1. **Set up environment variables**
   ```bash
   # Copy example environment files in both client and server directories
   cp client/.env.example client/.env.local
   cp server/.env.example server/.env
   ```

2. **Start PostgreSQL database**
   ```bash
   docker-compose up db -d
   ```

3. **Install dependencies and start services**
   ```bash
   # Terminal 1 - Server
   cd server
   npm install
   npm run db:setup
   npm run dev

   # Terminal 2 - Client
   cd client
   npm install
   npm run dev
   ```

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start in development mode
docker-compose -f docker-compose.dev.yml up

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Reset database
docker-compose down -v
docker-compose up db -d
```

## 📱 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health

## 🛠 Development

See individual README files for detailed setup instructions:

- [Client Setup](./client/README.md)
- [Server Setup](./server/README.md)

## 🔧 Environment Variables

### Client (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Server (.env)
```env
DATABASE_URL=postgresql://levich_user:levich_password@localhost:5432/levich_interview
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
PORT=3001
NODE_ENV=development
```

## 📚 API Documentation

The backend provides a RESTful API. Once running, you can explore the endpoints:

- GET `/health` - Health check
- POST `/auth/login` - User authentication
- POST `/auth/register` - User registration
- Additional endpoints documented in [Server README](./server/README.md)

## 🧪 Testing

```bash
# Run client tests
cd client && npm test

# Run server tests
cd server && npm test
```

## 🐛 Troubleshooting

1. **Port conflicts**: Ensure ports 3000, 3001, and 5432 are available
2. **Database connection issues**: Check if PostgreSQL is running
3. **Build failures**: Clear Docker cache with `docker system prune`

## 📄 License

This project is created for interview purposes.






**Happy Coding! 🚀**

For questions or issues, please check the troubleshooting section or create an issue in the repository.