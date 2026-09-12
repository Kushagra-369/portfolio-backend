import express from "express";
import { createMessage } from "../controller/user_controller";
import { trackVisitor } from "../controller/visitor_controller";
import { contactLimiter } from "../middleware/rateLimiter";

const router = express.Router();

router.post(
  "/create_message",
  contactLimiter,
  createMessage
);

router.post(
  "/track_visitor",
  trackVisitor
);

export default router;