import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import productRoute from "./Dashboard/Routes";
import appRoutes from "./KariyanaApp/Routes";
import authRoutes from "./AuthenticationModule/Routes";
import { sessionConfig } from "./Config/session";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://localhost:5173",
      "http://127.0.0.1:3000",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(sessionConfig);

app.use("/api/v1/dashboard", productRoute);
app.use("/api/v1/app", appRoutes);
app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.get("/health", (req, res) => {
  res.send({ version: "0.0.1", status: "ok", date: "25-12-2025" });
});

export default app;
