import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/database.js";

// routes
import authRoutes from "./routes/Auth.js";
import userRoutes from "./routes/User.js";
import postRoutes from "./routes/Post.js";
import courseRoutes from "./routes/Course.js";
import sessionRoutes from "./routes/Session.js";
import messageRoutes from "./routes/Message.js";
import connectionRoutes from "./routes/Connection.js";
import earningRoutes from "./routes/Earning.js";
import adminRoutes from "./routes/Admin.js";
import skillGapRoutes from "./routes/SkillGap.js";
import p2pRoutes, { initP2PNetwork } from "./routes/P2P.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, ".env"),
  override: true,
});

const app = express();

// middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());


// DB
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/earnings", earningRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/skill-gap", skillGapRoutes);
app.use("/api/p2p", p2pRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  // Automatically initialize P2P architecture after DB is likely connected
  setTimeout(() => {
    initP2PNetwork().catch(err => console.error("Failed to auto-init P2P:", err));
  }, 2000);
});