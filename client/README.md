# Client - Next.js Frontend

The frontend application for the Levich Interview Task, built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone repository and navigate to client
cd client

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
client/
├── app/                    # Next.js 13+ App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── loading.tsx        # Loading UI
│   ├── page.tsx          # Home page
│   └── auth/             # Authentication pages
│       ├── login/
│       └── register/
├── components/           # React components
│   ├── header.tsx
│   ├── sidebar.tsx
│   ├── protected-route.tsx
│   ├── vendor-*.tsx     # Vendor-related components
│   └── ui/              # UI components (shadcn/ui)
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
│   ├── api.ts          # API client
│   ├── auth.tsx        # Authentication context
│   ├── axios.ts        # Axios configuration
│   └── utils.ts        # Utility functions
├── public/             # Static assets
└── styles/             # Additional styles
```

## 🛠 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Docker commands
npm run docker:build     # Build Docker image
npm run docker:build:dev # Build development Docker image
npm run docker:run       # Run Docker container
```

## 🔧 Environment Variables

Create a `.env.local` file in the client directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Optional: NextAuth.js (if using)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
```

## 🎨 Styling

This project uses:

- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for pre-built components
- **CSS Modules** for component-specific styles

### Adding New Components

```bash
# Add a new shadcn/ui component
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add form
```

## 🔒 Authentication

The client includes:

- Protected routes using HOC
- Authentication context (`lib/auth.tsx`)
- JWT token management
- Automatic token refresh

### Usage Example

```tsx
import { ProtectedRoute } from '@/components/protected-route'

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Dashboard content</div>
    </ProtectedRoute>
  )
}
```

## 📱 Features

- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching capability
- **Form Validation**: React Hook Form with Zod
- **API Integration**: Axios-based API client
- **Error Handling**: Toast notifications
- **Loading States**: Skeleton components

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🐳 Docker Development

```bash
# Build development image
docker build -f Dockerfile.dev -t levich-client-dev .

# Run development container
docker run -p 3000:3000 -v $(pwd):/app levich-client-dev

# Or use Docker Compose (from root directory)
docker-compose -f docker-compose.dev.yml up client
```

## 📊 Performance

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: `npm run analyze`

## 🔧 Configuration Files

- `next.config.mjs` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `components.json` - shadcn/ui configuration

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 3000
npx kill-port 3000
```

**Build errors:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**Type errors:**
```bash
# Regenerate types
npm run type-check
```

## 📚 Dependencies

### Main Dependencies
- **next**: React framework
- **react**: UI library
- **typescript**: Type safety
- **tailwindcss**: CSS framework
- **@hookform/resolvers**: Form validation
- **axios**: HTTP client
- **zod**: Schema validation

### Development Dependencies
- **eslint**: Code linting
- **prettier**: Code formatting
- **@types/node**: Node.js types
- **autoprefixer**: CSS prefixing
- **postcss**: CSS processing

## 🔗 API Integration

The client communicates with the backend API at `http://localhost:3001`. Main endpoints:

- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user
- Additional vendor management endpoints

## 📄 License

This project is created for interview purposes.