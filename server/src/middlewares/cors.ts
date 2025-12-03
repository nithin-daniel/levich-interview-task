import cors from 'cors';

const corsOptions = {
  origin: [
    'http://localhost:3000', // Next.js development server
    'http://127.0.0.1:3000',
    'https://localhost:3000',
    // Add your production domains here
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

export const corsMiddleware = cors(corsOptions);