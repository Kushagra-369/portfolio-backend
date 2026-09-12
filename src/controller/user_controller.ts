import { Request, Response } from "express";
import nodemailer from "nodemailer";
import User from "../model/user_model";
import dotenv from "dotenv";

dotenv.config();

// ==========================================
// Gmail Transporter
// ==========================================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});


// ==========================================
// CREATE CONTACT MESSAGE
// ==========================================

export const createMessage = async (
  req: Request,
  res: Response
) => {
  try {
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


    // ----------------------------------------
    // Send message to Gmail
    // ----------------------------------------

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,

      // Clicking Reply in Gmail will reply
      // directly to the visitor
      replyTo: email,

      subject: `📩 Portfolio Contact - ${name}`,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 650px;
          margin: 20px auto;
          padding: 25px;
          border: 1px solid #ddd;
          border-radius: 12px;
          background: #ffffff;
          color: #222222;
        ">

          <h2 style="
            margin-bottom: 20px;
            color: #2563eb;
          ">
            📩 New Portfolio Message
          </h2>


          <p>
            <strong>Name:</strong>
            ${name}
          </p>


          <p>
            <strong>Email:</strong>
            ${email}
          </p>


          <p>
            <strong>Phone:</strong>
            ${phoneNumber || "Not provided"}
          </p>


          <hr style="
            margin: 20px 0;
            border: none;
            border-top: 1px solid #ddd;
          " />


          <h3>Message</h3>


          <p style="
            white-space: pre-line;
            line-height: 1.6;
          ">
            ${message}
          </p>


          <hr style="
            margin: 20px 0;
            border: none;
            border-top: 1px solid #ddd;
          " />


          <p style="
            font-size: 12px;
            color: #777;
          ">
            This message was sent through your portfolio contact form.
          </p>

        </div>
      `,
    });


    // ----------------------------------------
    // Success
    // ----------------------------------------

    return res.status(201).json({
      success: true,
      message: "Message sent successfully!",
    });

  } catch (error) {

    console.error(
      "❌ Error creating contact message:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
};