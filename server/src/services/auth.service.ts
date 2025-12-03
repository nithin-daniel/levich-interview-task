import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Get JWT configuration from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export interface RegisterData {
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
  };
  token: string;
}

// Helper function to generate JWT token
function generateToken(userId: number): string {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );
}

// Register a new user
export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const { email, password } = data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword
    }
  });

  // Generate token
  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email
    },
    token
  };
}

// Login user
export async function loginUser(data: LoginData): Promise<AuthResponse> {
  const { email, password } = data;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate token
  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email
    },
    token
  };
}

// Verify JWT token and get user
export async function verifyToken(token: string): Promise<{ id: number; email: string }> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email
    };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}