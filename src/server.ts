import express from "express";
import { config } from "dotenv";

//import routes
import movieRoutes from "./routes/movie.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { prisma } from "./db.js";

config();

const app = express();
const PORT = process.env.PORT || 3333;

//bodyparsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//API routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);

//server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await prisma.$disconnect();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
