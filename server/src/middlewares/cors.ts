import cors from "cors";

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://levich-interview-task.vercel.app",
  process.env.FRONTEND_URL,
];

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // allow mobile apps / curl / no-origin requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-Forwarded-Proto",
  ],
});
