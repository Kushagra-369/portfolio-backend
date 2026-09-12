import { Request, Response } from "express";
import Visitor from "../model/visitor_model";

export const trackVisitor = async (
  req: Request,
  res: Response
) => {
  try {
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({
        success: false,
        message: "visitorId is required",
      });
    }

    // Current date — YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    // Check if this visitor has already visited today
    const existingVisitor = await Visitor.findOne({
      visitorId,
      date: today,
    });

    // If not visited today, create a new record
    if (!existingVisitor) {
      await Visitor.create({
        visitorId,
        date: today,
      });
    }

    // Total unique visitors for today
    const todayVisitors = await Visitor.countDocuments({
      date: today,
    });

    return res.status(200).json({
      success: true,
      message: existingVisitor
        ? "Visitor already counted today."
        : "New visitor counted.",
      todayVisitors,
    });

  } catch (error) {
    console.error("❌ Error tracking visitor:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to track visitor.",
    });
  }
};