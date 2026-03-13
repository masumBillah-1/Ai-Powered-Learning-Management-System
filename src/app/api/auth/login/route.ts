import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/db/connect";
import User from "@/models/User";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });

    if (!user.password)
      return NextResponse.json({ error: "This account uses social login. Please login with Google or GitHub." }, { status: 400 });

    // ✅ Failed login lock check
    if (user.lockUntil && user.lockUntil > new Date()) {
      const minutes = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json({ error: `Account locked! ${minutes} মিনিট পরে try করুন।`, locked: true }, { status: 423 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // ✅ Failed attempt track
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
        user.loginAttempts = 0;
      }
      await user.save();
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 });
    }

    // ✅ Reset login attempts
    user.loginAttempts = 0;
    user.lockUntil = undefined;

    // ✅ OTP তৈরি করো এবং save করো
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("🔢 Generated OTP:", otp, "for", email);
    
    user.resetToken = otp;
    user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();
    console.log("✅ OTP saved to database");

    // ✅ OTP email পাঠাও (background এ, await করবো না)
    transporter.sendMail({
      from: `"CareerCanvas" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "🔐 Your Login Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px">
            <tr>
              <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
                  
                  <!-- Header with gradient -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#832388 0%,#E3436B 50%,#F0772F 100%);padding:30px 20px;text-align:center">
                      <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px">
                        CareerCanvas
                      </h1>
                      <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;font-weight:500">
                        Learning Management System
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding:40px 30px;text-align:center">
                      <div style="margin-bottom:20px">
                        <div style="display:inline-block;width:60px;height:60px;background:linear-gradient(135deg,#832388,#F0772F);border-radius:50%;line-height:60px;font-size:30px">
                          🔐
                        </div>
                      </div>
                      
                      <h2 style="margin:0 0 10px;color:#1f2937;font-size:24px;font-weight:700">
                        Login Verification
                      </h2>
                      
                      <p style="margin:0 0 30px;color:#6b7280;font-size:15px;line-height:1.6">
                        আপনার login verification code নিচে দেওয়া হলো। এই code ব্যবহার করে আপনার account verify করুন।
                      </p>
                      
                      <!-- OTP Box -->
                      <div style="background:linear-gradient(135deg,#832388 0%,#E3436B 50%,#F0772F 100%);border-radius:12px;padding:25px;margin:0 0 30px">
                        <div style="color:#ffffff;font-size:48px;font-weight:800;letter-spacing:14px;font-family:'Courier New',monospace">
                          ${otp}
                        </div>
                      </div>
                      
                      <!-- Info box -->
                      <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:15px;border-radius:8px;text-align:left;margin-bottom:20px">
                        <p style="margin:0;color:#92400e;font-size:13px;line-height:1.5">
                          ⚠️ <strong>Security Notice:</strong><br/>
                          • এই code ১০ মিনিট পরে expire হবে<br/>
                          • কাউকে এই code শেয়ার করবেন না<br/>
                          • আপনি যদি login করার চেষ্টা না করে থাকেন, তাহলে এই email ignore করুন
                        </p>
                      </div>
                      
                      <p style="margin:0;color:#9ca3af;font-size:13px">
                        সমস্যা হলে আমাদের সাথে যোগাযোগ করুন
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background:#f9fafb;padding:25px 30px;text-align:center;border-top:1px solid #e5e7eb">
                      <p style="margin:0 0 8px;color:#6b7280;font-size:13px">
                        © 2025 CareerCanvas. All rights reserved.
                      </p>
                      <p style="margin:0;color:#9ca3af;font-size:12px">
                        This is an automated message, please do not reply.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    }).then(() => {
      console.log("📧 OTP email sent successfully to:", email);
    }).catch((emailError) => {
      console.error("❌ Email send failed:", emailError.message);
    });

    // ✅ Token দেওয়া হবে না এখন — OTP verify হলে দেওয়া হবে
    return NextResponse.json({
      success: true,
      requireOtp: true,
      message: "OTP sent! Email চেক করুন।",
      email: email, // verify page এ pass করার জন্য
    });

  } catch (err: any) {
    console.error("❌ Login error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
