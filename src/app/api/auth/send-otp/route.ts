import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import User from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Save OTP to user
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send email
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Your OTP for Password Reset",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset OTP</h2>
          <p>Your OTP is: <strong style="font-size: 24px; color: #007bff;">${otp}</strong></p>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Send OTP error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}