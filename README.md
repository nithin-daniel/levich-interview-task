# Levich Interview Task - Full Stack Application

A complete authentication system with Docker containerization, built with Next.js (frontend) and Node.js/Express (backend).

## 🚀 Quick Start with npm Scripts

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- Docker Compose (integrated with Docker v20.10+ or standalone v2.0+)
- Node.js 18+ (for running npm scripts)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd levich-interview-task
```

### 2. Choose Your Environment

#### For Development (Hot Reload + Debug Logs)
```bash
# From server directory
cd server
npm run docker:dev

# Or run detached (in background)
npm run docker:dev:detached
```

#### For Production
```bash
# From server directory
cd server
npm run docker:prod

# Or run detached (in background)
npm run docker:prod:detached
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: PostgreSQL on localhost:5432

## 📁 Project Structure

```
levich-interview-task/
├── client/                 # Next.js Frontend
│   ├── app/               # Next.js 13+ App Router
│   ├── components/        # React Components
│   ├── Dockerfile         # Production Docker config
│   ├── Dockerfile.dev     # Development Docker config
│   └── package.json
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── services/      # Business logic
│   │   ├── middlewares/   # Express middlewares
│   │   ├── utils/         # Utility functions
│   │   └── routes/        # Route definitions
│   ├── prisma/           # Database schema & migrations
│   ├── Dockerfile        # Production Docker config
│   ├── Dockerfile.dev    # Development Docker config
│   └── package.json
├── init-db/              # Database initialization scripts
├── docker-compose.yml    # Production Docker Compose
├── docker-compose.dev.yml # Development Docker Compose
└── README.md            # This file
```

## 🛠 Docker Services

### 1. Database (PostgreSQL)
- **Image**: `postgres:15`
- **Port**: `5432`
- **Database**: `levich_interview` (prod) / `levich_interview_dev` (dev)
- **User**: `levich_user`
- **Password**: `levich_password`
- **Volumes**: Persistent data storage

### 2. Backend Server
- **Port**: `3001`
- **Features**: 
  - Authentication APIs (register, login, profile)
  - JWT token validation
  - Winston logging
  - Prisma ORM
  - Hot reload in development

### 3. Frontend Client
- **Port**: `3000`
- **Features**:
  - Next.js 13+ with App Router
  - TypeScript
  - Tailwind CSS
  - Hot reload in development

## 🔧 Manual Development Setup (Without Docker)

If you prefer to run without Docker:

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm (for both client and server)

### Backend Setup
```bash
cd server

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database URL

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
  ```json
  {
    \"email\": \"user@example.com\",
    \"password\": \"password123\"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    \"email\": \"user@example.com\",
    \"password\": \"password123\"
  }
  ```

- `GET /api/auth/me` - Get current user profile (requires token)
  ```
  Authorization: Bearer <jwt-token>
  ```

### Health Check
- `GET /health` - Server health status

## 🔑 Environment Variables

### Backend (.env)
```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Logging
LOG_LEVEL=info
```

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL (set in Docker Compose)

## 🐳 Docker Commands with npm Scripts

### Development
```bash
# From server directory
cd server

# Start development environment
npm run docker:dev

# Start in background
npm run docker:dev:detached

# View logs
npm run docker:logs

# Stop development environment
npm run docker:stop
```

### Production
```bash
# From server directory
cd server

# Start production environment
npm run docker:prod

# Start in background
npm run docker:prod:detached

# View logs
npm run docker:logs:prod

# Stop production environment
npm run docker:stop:prod
```

### Database Operations
```bash
# From server directory (in running containers)
cd server

# Run migrations
npm run migrate

# Seed database with sample data
npm run db:seed

# Open Prisma Studio
npx prisma studio

# Access PostgreSQL shell
docker exec -it levich-postgres psql -U levich_user -d levich_interview_dev
```

### Client Operations
```bash
# From client directory
cd client

# Build for production
npm run docker:build

# View development logs
npm run docker:logs
```

### Health Checks
```bash
# Manual health checks
curl http://localhost:3001/health  # Server
curl http://localhost:3000         # Client
```

### Cleanup
```bash
# From server directory
cd server
npm run docker:clean

# Or manual cleanup
docker compose -f ../docker-compose.dev.yml down -v
docker compose -f ../docker-compose.yml down -v
```
```bash
# Start production environment
docker-compose up --build

# Stop and remove containers
docker-compose down

# View logs
docker-compose logs -f

# Scale services
docker-compose up --scale server=3
```

### Database Operations
```bash
# Access PostgreSQL
docker exec -it levich-postgres psql -U levich_user -d levich_interview

# Run migrations in container
docker exec -it levich-server npm run migrate

# View database logs
docker logs levich-postgres
```

### Cleanup
```bash
# Remove all containers and volumes
docker-compose down -v

# Remove all images
docker rmi $(docker images -q levich-*)

# Prune unused Docker resources
docker system prune -a
```

## 📊 Logging

### Development
- Console output with colors
- Debug level logging
- Request/response logging

### Production
- Structured JSON logs
- File-based logging (`logs/` directory)
- Error tracking
- Performance monitoring

## 🔒 Security Features

### Authentication
- JWT tokens with expiration
- Password hashing with bcrypt
- Email validation
- Request rate limiting ready

### Docker Security
- Non-root users in containers
- Multi-stage builds for minimal images
- Health checks for all services
- Network isolation

## 🚀 Deployment

### Production Checklist
1. Update JWT secret in production
2. Use environment-specific database URLs
3. Enable SSL/TLS
4. Set up reverse proxy (nginx)
5. Configure monitoring and alerting

### Scaling
- Horizontal scaling supported
- Load balancer ready
- Database connection pooling
- Redis for session management

## 📝 Development Workflow

1. **Start Development Environment**
   ```bash
   cd server
   npm run docker:dev
   ```

2. **Make Changes**
   - Edit code in `client/` or `server/`
   - Changes auto-reload in containers

3. **Database Changes**
   ```bash
   # From server directory
   cd server
   npm run migrate

   # Or access container directly
   docker exec -it levich-server-dev npx prisma migrate dev
   ```

4. **Testing**
   - Backend: http://localhost:3001/health
   - Frontend: http://localhost:3000
   - API: Use Postman/curl with endpoints

5. **Logs & Debugging**
   ```bash
   # From server directory
   cd server
   npm run docker:logs

   # Or view specific container logs
   docker logs levich-server-dev
   docker logs levich-client-dev
   docker logs levich-postgres

   # Access container shell
   docker exec -it levich-server-dev sh
   ```

## 🔧 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill processes on ports
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:3001 | xargs kill -9
sudo lsof -ti:5432 | xargs kill -9
```

**Database Connection Issues**
```bash
# Check database status
docker exec levich-postgres pg_isready -U levich_user

# View database logs
docker logs levich-postgres

# Access database shell
docker exec -it levich-postgres psql -U levich_user -d levich_interview_dev
```

**Build Failures**
```bash
# From server directory
cd server
npm run docker:clean
npm run docker:dev
```

**Permission Issues**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

## 📚 Learning Resources

### Docker
- [Docker Official Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Dockerfile Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### Technologies Used
- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL, Prisma ORM
- **Auth**: JWT, bcrypt
- **Logging**: Winston
- **Containerization**: Docker, Docker Compose
- **Package Manager**: npm

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and test with Docker
4. Submit a pull request

## 📄 License

This project is for interview purposes.

---

**Happy Coding! 🚀**

For questions or issues, please check the troubleshooting section or create an issue in the repository.