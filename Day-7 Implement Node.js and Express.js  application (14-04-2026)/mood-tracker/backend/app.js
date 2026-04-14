import express from "express";
import cors from "cors";
import moodRoutes from "./routes/moodRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/moods", moodRoutes);

app.use(errorHandler);

export default app;