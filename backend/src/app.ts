// ============================================================
// Express App Setup
// ============================================================

import express from "express";
import cors from "cors";
import { ROUTES } from "./constants/routes";
import chatRoutes from "./routes/chat.routes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

const app = express();

// Middlewares
app.use(cors({ origin: "*", methods: ["GET", "POST", "DELETE"] }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get(ROUTES.HEALTH, (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Routes
app.use(`${ROUTES.BASE}${ROUTES.CHAT.ROOT}`, chatRoutes);

// 404 & Error Handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
