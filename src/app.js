import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();
connectDB();

const app = express();
const allowedOrigins = [
  "http://localhost:5173", // dev
  "https://accesscontrol2-frontend.vercel.app" // if your Vercel URL changed
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser requests
      if (allowedOrigins.includes(origin)) return callback(null, true);

      console.log("Blocked CORS request from:", origin); // helpful debug
      callback(new Error(`CORS not allowed for origin ${origin}`));
    },
    credentials: true, // allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // explicitly allow methods
    allowedHeaders: ["Content-Type", "Authorization"], // allow common headers
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