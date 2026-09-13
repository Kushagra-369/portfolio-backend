import { Request, Response } from "express";
import { Resend } from "resend";
import User from "../model/user_model";
import dotenv from "dotenv";

dotenv.config();

// ==========================================
// Resend
// ==========================================

const resend = new Resend(process.env.RESEND_API_KEY);


// ==========================================
// CREATE CONTACT MESSAGE
// ==========================================

export const createMessage = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("📩 Received body:", req.body);

    const {
      name,
      email,
      phoneNumber,
      message,
    } = req.body;


    // ----------------------------------------
    // Validation
    // ----------------------------------------

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required.",
      });
    }


    // ----------------------------------------
    // Save message in MongoDB
    // ----------------------------------------

    const newMessage = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumber?.trim() || "",
      message: message.trim(),
    });

    await newMessage.save();

    console.log("✅ Message saved to MongoDB");


    // ----------------------------------------
    // Send Email using Resend
    // ----------------------------------------

    const { data, error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",

      to: ["knowledge4040god@gmail.com"],

      replyTo: email.trim().toLowerCase(),

      subject: `📩 Portfolio Contact - ${name.trim()}`,

      text: `
New Portfolio Message

Name: ${name.trim()}
Email: ${email.trim().toLowerCase()}
Phone: ${phoneNumber?.trim() || "Not provided"}

Message:
${message.trim()}

--------------------------------
This message was sent through your portfolio contact form.
      `,
    });


    // ----------------------------------------
    // Resend Error
    // ----------------------------------------

    if (error) {
      console.error("❌ Resend email error:", error);

      return res.status(500).json({
        success: false,
        message: "Message saved, but email could not be sent.",
      });
    }


    console.log("✅ Email sent successfully:", data?.id);


    // ----------------------------------------
    // Success
    // ----------------------------------------

    return res.status(201).json({
      success: true,
      message: "Message sent successfully!",
    });

  } catch (error: any) {

    console.error(
      "❌ Error creating contact message:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to send message. Please try again later.",
    });
  }
};