# Server - Express.js Backend

The backend API server for the Levich Interview Task, built with Express.js, TypeScript, and Prisma ORM.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm

### Installation

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database configuration

# Set up database
npm run db:setup

# Start development server
npm run dev
```

The server will run on [http://localhost:3001](http://localhost:3001).

## 📁 Project Structure

```
server/
├── src/
│   ├── index.ts              # Application entry point
│   ├── config/               # Configuration files
│   ├── controllers/          # Route handlers
│   │   ├── auth.controller.ts
│   │   ├── health.controller.ts
│   │   ├── search.controller.ts
│   │   └── vendorMovement.controller.ts
│   ├── middlewares/          # Express middlewares
│   │   ├── auth.ts          # JWT authentication
│   │   ├── cors.ts          # CORS configuration
│   │   └── errorHandler.ts  # Error handling
│   ├── routes/              # Route definitions
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   └── health.routes.ts
│   ├── services/            # Business logic
│   └── utils/               # Utility functions
├── prisma/                  # Database configuration
│   ├── schema.prisma        # Database schema
│   ├── seed.ts             # Database seeding
│   └── migrations/         # Database migrations
├── logs/                   # Application logs
└── scripts/               # Utility scripts
```

## 🛠 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run clean        # Remove build files

# Database operations
npm run db:setup     # Generate Prisma client, run migrations, and seed
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database with initial data
npm run db:reset     # Reset database and reseed

# Migrations
npm run migrate         # Deploy migrations (production)
npm run migrate:dev     # Create and apply migrations (development)
npm run migrate:reset   # Reset migrations
npm run migrate:status  # Check migration status

# Docker commands
npm run docker:build     # Build Docker image
npm run docker:build:dev # Build development Docker image
npm run docker:run       # Run Docker container
```

## 🔧 Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://levich_user:levich_password@localhost:5432/levich_interview

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Logging
LOG_LEVEL=info
```

## 🗄 Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Database Operations

```bash
# Create a new migration
npx prisma migrate dev --name description-of-changes

# Reset database
npm run db:reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Generate Prisma client after schema changes
npm run db:generate
```

## 📡 API Endpoints

### Health Check
```http
GET /health
```

### Authentication
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com", 
  "password": "password123"
}
```

```http
GET /auth/me
Authorization: Bearer <jwt-token>
```

### Vendor Management
```http
GET /vendors
Authorization: Bearer <jwt-token>

POST /vendors
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Vendor Name",
  "type": "supplier"
}
```

## 🔒 Authentication & Security

- **JWT Tokens**: Stateless authentication
- **Password Hashing**: bcrypt with salt rounds
- **CORS**: Configured for frontend domain
- **Rate Limiting**: Ready for implementation
- **Input Validation**: Zod schemas

### Middleware Stack

1. **CORS**: Cross-origin resource sharing
2. **Body Parser**: JSON request parsing
3. **Authentication**: JWT token validation
4. **Error Handler**: Centralized error handling
5. **Logging**: Request/response logging

## 📊 Logging

The application uses Winston for structured logging:

- **Development**: Console output with colors
- **Production**: File-based JSON logs
- **Levels**: error, warn, info, debug

Log files are stored in the `logs/` directory:
- `error.log` - Error level logs
- `combined.log` - All logs

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run integration tests
npm run test:integration
```

## 🐳 Docker Development

```bash
# Build development image
docker build -f Dockerfile.dev -t levich-server-dev .

# Run development container
docker run -p 3001:3001 --env-file .env levich-server-dev

# Or use Docker Compose (from root directory)
docker-compose -f docker-compose.dev.yml up server
```

## 🔧 Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Make Database Changes**
   ```bash
   # Edit prisma/schema.prisma
   npm run migrate:dev
   ```

3. **Test API Endpoints**
   - Use Postman, curl, or REST client
   - Check logs in console or `logs/` directory

4. **Seed Development Data**
   ```bash
   npm run db:seed
   ```

## 📚 Dependencies

### Main Dependencies
- **express**: Web framework
- **prisma**: Database ORM
- **jsonwebtoken**: JWT handling
- **bcryptjs**: Password hashing
- **winston**: Logging
- **cors**: CORS middleware
- **dotenv**: Environment variables

### Development Dependencies
- **tsx**: TypeScript execution
- **typescript**: Type checking
- **@types/express**: Express types
- **@types/node**: Node.js types
- **nodemon**: Development server

## 🔧 Configuration

### TypeScript Configuration
The project uses strict TypeScript configuration with:
- Strict mode enabled
- ES2022 target
- Node.js module resolution
- Source maps for debugging

### Prisma Configuration
- PostgreSQL provider
- Automatic migrations
- Type-safe client generation
- Connection pooling ready

## 🐛 Troubleshooting

### Common Issues

**Database connection errors:**
```bash
# Check PostgreSQL status
pg_isready -h localhost -p 5432

# Reset database connection
npm run db:reset
```

**Migration issues:**
```bash
# Reset migration state
npm run migrate:reset
npm run migrate:dev
```

**Port already in use:**
```bash
# Kill process on port 3001
npx kill-port 3001
```

**JWT token errors:**
```bash
# Verify JWT_SECRET is set
echo $JWT_SECRET

# Generate a new secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📈 Performance Monitoring

- **Request logging**: All HTTP requests logged
- **Database queries**: Prisma query logging
- **Error tracking**: Centralized error handling
- **Health checks**: Built-in health endpoint

## 📄 License

This project is created for interview purposes.