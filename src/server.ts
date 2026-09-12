import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/routes";
import cors from "cors";
import { apiLimiter } from "./middleware/rateLimiter";

dotenv.config();

const app = express();

// ✅ Render/proxy ke liye required
app.set("trust proxy", 1);

app.use(express.json());
app.use(cors());

// ✅ Rate limiter
app.use(apiLimiter);

const PORT = process.env.PORT || 1080;
const mongoURL = process.env.MongoDBURL;

if (!mongoURL) {
  throw new Error(
    "❌ MongoDB connection URL (MongoDBURL) not found in .env file"
  );
}

mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error(
      "❌ MongoDB connection failed:",
      error.message
    );
  });

app.use("/", router);

app.listen(PORT, () => {
  console.log(`🌐 Server is running on port ${PORT}`);
});