import { Request, Response } from "express";
import crypto from "crypto";
import Visitor from "../model/visitor_model";

export const trackVisitor = async (
  req: Request,
  res: Response
) => {
  try {
    let visitorId = req.cookies?.visitorId;

    // ----------------------------------------
    // New visitor
    // ----------------------------------------

    if (!visitorId) {
      visitorId = crypto.randomUUID();

      res.cookie("visitorId", visitorId, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 365 * 5,
      });
    }

    // ----------------------------------------
    // Check visitor in MongoDB
    // ----------------------------------------

    const existingVisitor = await Visitor.findOne({
      visitorId,
    });

    // ----------------------------------------
    // New unique visitor
    // ----------------------------------------

    if (!existingVisitor) {
      await Visitor.create({
        visitorId,
      });

      console.log("👤 NEW VISITOR:", visitorId);
    } else {
      console.log("👀 EXISTING VISITOR:", visitorId);
    }

    // ----------------------------------------
    // Get GLOBAL visitor count
    // ----------------------------------------

    const totalVisitors = await Visitor.countDocuments();

    console.log("📊 TOTAL VISITORS:", totalVisitors);

    return res.status(200).json({
      success: true,
      totalVisitors,
    });

  } catch (error) {
    console.error("❌ Error tracking visitor:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to track visitor.",
    });
  }
};