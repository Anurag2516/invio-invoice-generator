import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import invoiceRoutes from "./routes/invoice.routes";
import userRoutes from "./routes/user.routes";
import clientRoutes from "./routes/client.routes";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/error.middleware";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/user", userRoutes);
app.use("/api/client", clientRoutes);
app.use(errorHandler);

export default app;