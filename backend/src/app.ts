
import express from "express";
import cors from "cors";
import { ROUTES } from "./constants/routes";
import chatRoutes from "./routes/chat.routes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

const app = express();


app.use(cors({ origin: "*", methods: ["GET", "POST", "DELETE"] }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get(ROUTES.HEALTH, (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});


app.use(`${ROUTES.BASE}${ROUTES.CHAT.ROOT}`, chatRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
