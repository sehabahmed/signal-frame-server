import { Server } from "http";
import mongoose from "mongoose";
import config from "./app/config";
import app from "./app";

let server: Server;

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  if (server) {
    server.close(() => {
      console.error("Server closed due to unhandled rejection");
      process.exit(1);
    });
  }
});

// Initialize database connection and start server
async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    console.log("🛢 Database connected successfully");
    
    server = app.listen(config.port, () => {
      console.log(`🚀 Application is running on port ${config.port}`);
    });
  } catch (error) {
    console.log("Failed to connect to database:", error);
    process.exit(1);
  }
}

main();

// Graceful shutdown handlers
process.on("SIGTERM", () => {
  console.log("SIGTERM received - shutting down gracefully");
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT received - shutting down gracefully");
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});