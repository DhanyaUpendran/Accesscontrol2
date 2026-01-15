import express from "express";
import cors from "cors";

const isDev = process.env.NODE_ENV === "development";

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
    credentials: true, // allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
