import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

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
  try {
    const token = jwt.sign(
      { userId },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
    );
    logger.debug('JWT token generated successfully', { userId });
    return token;
  } catch (error) {
    logger.error('Failed to generate JWT token', { userId, error });
    throw new Error('Token generation failed');
  }
}

// Register a new user
export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  const { email, password } = data;
  
  logger.info('Starting user registration process', { email });

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      logger.warn('Registration failed: User already exists', { email });
      throw new Error('User with this email already exists');
    }

    // Hash password
    logger.debug('Hashing password for new user');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    logger.info('User created successfully in database', { userId: user.id, email });

    // Generate token
    const token = generateToken(user.id);

    logger.info('User registration completed successfully', { userId: user.id });

    return {
      user: {
        id: user.id,
        email: user.email
      },
      token
    };
  } catch (error) {
    logger.error('User registration failed', { email, error });
    throw error;
  }
}

// Login user
export async function loginUser(data: LoginData): Promise<AuthResponse> {
  const { email, password } = data;
  
  logger.info('Starting user login process', { email });

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      logger.warn('Login failed: User not found', { email });
      throw new Error('Invalid email or password');
    }

    logger.debug('User found, verifying password', { userId: user.id });

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn('Login failed: Invalid password', { userId: user.id, email });
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = generateToken(user.id);

    logger.info('User login completed successfully', { userId: user.id, email });

    return {
      user: {
        id: user.id,
        email: user.email
      },
      token
    };
  } catch (error) {
    logger.error('User login failed', { email, error });
    throw error;
  }
}

// Verify JWT token and get user
export async function verifyToken(token: string): Promise<{ id: number; email: string }> {
  try {
    logger.debug('Starting token verification');
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      logger.warn('Token verification failed: User not found', { userId: decoded.userId });
      throw new Error('User not found');
    }

    logger.debug('Token verification successful', { userId: user.id });

    return {
      id: user.id,
      email: user.email
    };
  } catch (error) {
    logger.warn('Token verification failed', { 
      error: error instanceof Error ? error.message : error 
    });
    throw new Error('Invalid or expired token');
  }
}