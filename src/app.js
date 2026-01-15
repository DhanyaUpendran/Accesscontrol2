import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
dotenv.config();
connectDB();

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";




const isDev = process.env.NODE_ENV === "development";
const app = express();
const allowedOrigins = isDev
  ? ["http://localhost:5173"]
  : ["https://accesscontrol2-frontend.vercel.app"];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman or server-to-server requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      console.log("Blocked CORS request from:", origin);
      callback(new Error(`CORS not allowed for origin ${origin}`));
    },
    credentials: false, // allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;