import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/db/connect";
import User from "@/models/User";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// ══════════════════════════════════════
// GET — GitHub OAuth
// ══════════════════════════════════════
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;

  if (action !== "github") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const code = new URL(req.url).searchParams.get("code");

  // Code নেই → GitHub এ পাঠাও
  if (!code) {
<<<<<<< HEAD
=======
    console.log("🔄 Redirecting to GitHub authorization...");
    console.log("📍 APP_URL:", APP_URL);
    console.log("🔑 CLIENT_ID:", process.env.GITHUB_CLIENT_ID?.substring(0, 10) + "...");
    
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email&redirect_uri=${APP_URL}/api/auth/github`;
    return NextResponse.redirect(url);
  }

  try {
<<<<<<< HEAD
    await connectDB();

    // Access token নাও
=======
    console.log("\n🔄 GitHub OAuth Flow Started");
    console.log("=" .repeat(50));
    console.log("📍 APP_URL:", APP_URL);
    console.log("🔑 CLIENT_ID:", process.env.GITHUB_CLIENT_ID?.substring(0, 10) + "...");
    console.log("🔐 Has CLIENT_SECRET:", !!process.env.GITHUB_CLIENT_SECRET);
    console.log("📝 Authorization Code:", code.substring(0, 10) + "...");

    // MongoDB Connect
    console.log("\n🔌 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    // Access token নাও
    console.log("\n🔄 Fetching GitHub access token...");
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
<<<<<<< HEAD
    const { access_token } = await tokenRes.json();
    
    if (!access_token) {
      return NextResponse.redirect(`${APP_URL}/login?error=github_failed`);
    }

    // User info নাও
=======

    const tokenData = await tokenRes.json();
    console.log("📦 Token Response:", {
      hasAccessToken: !!tokenData.access_token,
      tokenType: tokenData.token_type,
      scope: tokenData.scope,
    });

    const { access_token, error, error_description } = tokenData;
    
    if (error) {
      console.error("❌ GitHub Token Error:", error, error_description);
      return NextResponse.redirect(`${APP_URL}/login?error=${encodeURIComponent(error_description || error)}`);
    }
    
    if (!access_token) {
      console.error("❌ No access token received from GitHub");
      return NextResponse.redirect(`${APP_URL}/login?error=github_no_token`);
    }

    console.log("✅ Access token received:", access_token.substring(0, 10) + "...");

    // User info নাও
    console.log("\n🔄 Fetching GitHub user info...");
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
    const [userRes, emailRes] = await Promise.all([
      fetch("https://api.github.com/user", { 
        headers: { Authorization: `Bearer ${access_token}` } 
      }),
      fetch("https://api.github.com/user/emails", { 
        headers: { Authorization: `Bearer ${access_token}` } 
      }),
    ]);

    const githubUser = await userRes.json();
    const emails: any[] = await emailRes.json();
<<<<<<< HEAD
    const primaryEmail = emails.find((e) => e.primary)?.email || githubUser.email;

    if (!primaryEmail) {
      return NextResponse.redirect(`${APP_URL}/login?error=no_email`);
    }

    // User খুঁজো বা তৈরি করো
    let user = await User.findOne({ email: primaryEmail });
    
    if (!user) {
      user = await User.create({
=======

    console.log("👤 GitHub User Info:");
    console.log("  - Login:", githubUser.login);
    console.log("  - Name:", githubUser.name);
    console.log("  - ID:", githubUser.id);
    console.log("  - Avatar:", githubUser.avatar_url?.substring(0, 50) + "...");
    
    console.log("📧 GitHub Emails:", emails.map(e => ({
      email: e.email,
      primary: e.primary,
      verified: e.verified
    })));

    const primaryEmail = emails.find((e) => e.primary)?.email || githubUser.email;

    if (!primaryEmail) {
      console.error("❌ No email found in GitHub response");
      return NextResponse.redirect(`${APP_URL}/login?error=no_email`);
    }

    console.log("✅ Primary email identified:", primaryEmail);

    // Database operations
    console.log("\n🔍 Checking database for existing user...");
    let user = await User.findOne({ email: primaryEmail });
    
    if (!user) {
      console.log("👤 User not found. Creating new user...");
      
      const userData = {
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
        name: githubUser.name || githubUser.login,
        email: primaryEmail,
        photoURL: githubUser.avatar_url || "",
        provider: "github",
        role: "student",
<<<<<<< HEAD
      });
    } else {
      user.photoURL = githubUser.avatar_url || user.photoURL;
      await user.save();
    }

    // JWT token তৈরি করো
=======
      };
      
      console.log("📝 User data to create:", userData);
      
      user = await User.create(userData);
      
      console.log("✅ New user created successfully:");
      console.log("  - ID:", user._id);
      console.log("  - Name:", user.name);
      console.log("  - Email:", user.email);
      console.log("  - Provider:", user.provider);
      console.log("  - Role:", user.role);
    } else {
      console.log("✅ Existing user found:");
      console.log("  - ID:", user._id);
      console.log("  - Name:", user.name);
      console.log("  - Email:", user.email);
      console.log("  - Provider:", user.provider);
      
      // Update photo if changed
      if (githubUser.avatar_url && githubUser.avatar_url !== user.photoURL) {
        const oldPhoto = user.photoURL;
        user.photoURL = githubUser.avatar_url;
        await user.save();
        console.log("📸 Photo updated:");
        console.log("  - Old:", oldPhoto?.substring(0, 50) + "...");
        console.log("  - New:", user.photoURL?.substring(0, 50) + "...");
      } else {
        console.log("ℹ️  Photo unchanged");
      }
    }

    // JWT token তৈরি করো
    console.log("\n🔑 Generating JWT token...");
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
<<<<<<< HEAD

    // Redirect with user data
=======
    console.log("✅ JWT token generated:", token.substring(0, 20) + "...");

    // User data for redirect
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
    const userParam = encodeURIComponent(
      JSON.stringify({
        _id: user._id,
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        role: user.role,
      })
    );

<<<<<<< HEAD
    const response = NextResponse.redirect(
      `${APP_URL}/api/auth/callback?user=${userParam}&token=${token}`
    );

=======
    const callbackUrl = `${APP_URL}/api/auth/callback?user=${userParam}&token=${token}`;
    console.log("\n🔄 Redirecting to callback URL...");
    console.log("📍 Callback:", callbackUrl.substring(0, 100) + "...");

    const response = NextResponse.redirect(callbackUrl);

    // Set cookie
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
<<<<<<< HEAD
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("GitHub OAuth error:", err);
    return NextResponse.redirect(`${APP_URL}/login?error=${err.message}`);
=======
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    console.log("🍪 Cookie set successfully");
    console.log("=" .repeat(50));
    console.log("✅ GitHub OAuth Flow Completed Successfully!\n");

    return response;
    
  } catch (err: any) {
    console.error("\n❌ GitHub OAuth Error:");
    console.error("=" .repeat(50));
    console.error("Error Message:", err.message);
    console.error("Error Stack:", err.stack);
    console.error("=" .repeat(50) + "\n");
    
    return NextResponse.redirect(`${APP_URL}/login?error=${encodeURIComponent(err.message)}`);
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  try {
    await connectDB();
    const { action } = await params;
    const body = await req.json();

    // ══════════════════════════════════════
    // FORGOT PASSWORD — email link পাঠাও
    // ══════════════════════════════════════
    if (action === "forgot-password") {
<<<<<<< HEAD
      console.log("🔥 Forgot password called for:", body.email);
      
      // Debug: Show all users in database
      const allUsers = await User.find({}, 'email name').limit(5);
      console.log("📋 Users in database:", allUsers.map(u => u.email));
=======
      console.log("\n🔥 Forgot Password Request");
      console.log("=" .repeat(50));
      console.log("📧 Email:", body.email);
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
      
      const { email } = body;
      if (!email) {
        return NextResponse.json({ error: "Email required" }, { status: 400 });
      }

      const user = await User.findOne({ email });
      if (!user) {
<<<<<<< HEAD
        console.log("❌ User not found:", email);
=======
        console.log("❌ User not found in database");
        // Security: Don't reveal if email exists
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
        return NextResponse.json(
          { success: true, message: "If this email exists, a reset link has been sent." },
          { status: 200 }
        );
      }

<<<<<<< HEAD
=======
      console.log("✅ User found:", user._id);

>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetToken = resetToken;
      user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await user.save();
<<<<<<< HEAD
      console.log("✅ Reset token saved for:", email);

      // Send email with reset link
      const resetLink = `${APP_URL}/reset-password?token=${resetToken}`;
      
      try {
=======
      
      console.log("🔑 Reset token generated:", resetToken.substring(0, 10) + "...");
      console.log("⏰ Token expires at:", user.resetTokenExpiry);

      const resetLink = `${APP_URL}/reset-password?token=${resetToken}`;
      console.log("🔗 Reset link:", resetLink);

      try {
        console.log("📧 Sending email...");
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
        await transporter.sendMail({
          from: `"Smartlms Pro" <${process.env.GMAIL_USER}>`,
          to: email,
          subject: "🔑 Password Reset Request",
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
                      
                      <!-- Header -->
                      <tr>
                        <td style="background:linear-gradient(135deg,#832388 0%,#E3436B 50%,#F0772F 100%);padding:30px 20px;text-align:center">
                          <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px">
                            Smartlms Pro
                          </h1>
                          <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;font-weight:500">
                            Learning Management System
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding:40px 30px">
                          <div style="text-align:center;margin-bottom:25px">
                            <div style="display:inline-block;width:60px;height:60px;background:linear-gradient(135deg,#832388,#F0772F);border-radius:50%;line-height:60px;font-size:30px">
                              🔑
                            </div>
                          </div>
                          
                          <h2 style="margin:0 0 15px;color:#1f2937;font-size:24px;font-weight:700;text-align:center">
                            Password Reset Request
                          </h2>
                          
                          <p style="margin:0 0 25px;color:#6b7280;font-size:15px;line-height:1.6;text-align:center">
                            আপনার account এর জন্য password reset request পাওয়া গেছে। নিচের button এ click করে নতুন password set করুন।
                          </p>
                          
                          <!-- Button -->
                          <div style="text-align:center;margin:30px 0">
                            <a href="${resetLink}" style="display:inline-block;padding:14px 35px;background:linear-gradient(90deg,#832388,#E3436B,#F0772F);color:#ffffff;text-decoration:none;border-radius:8px;font-weight:700;font-size:16px;box-shadow:0 4px 6px rgba(131,35,136,0.3)">
                              Reset Password
                            </a>
                          </div>
                          
                          <p style="margin:25px 0 20px;color:#9ca3af;font-size:13px;text-align:center">
                            অথবা এই link টি copy করুন:
                          </p>
                          
                          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px;word-break:break-all">
                            <a href="${resetLink}" style="color:#6366f1;font-size:13px;text-decoration:none">
                              ${resetLink}
                            </a>
                          </div>
                          
                          <!-- Warning box -->
                          <div style="background:#fee2e2;border-left:4px solid #ef4444;padding:15px;border-radius:8px;margin-top:25px">
                            <p style="margin:0;color:#991b1b;font-size:13px;line-height:1.5">
                              ⚠️ <strong>Important:</strong><br/>
                              • এই link ১ ঘণ্টা পরে expire হবে<br/>
                              • আপনি যদি password reset request না করে থাকেন, তাহলে এই email ignore করুন
                            </p>
                          </div>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="background:#f9fafb;padding:25px 30px;text-align:center;border-top:1px solid #e5e7eb">
                          <p style="margin:0 0 8px;color:#6b7280;font-size:13px">
                            © 2025 Smartlms Pro. All rights reserved.
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
        });
<<<<<<< HEAD
        console.log("📧 Email sent successfully to:", email);
      } catch (emailError: any) {
        console.error("❌ Email send failed:", emailError.message);
=======
        console.log("✅ Email sent successfully");
        console.log("=" .repeat(50) + "\n");
      } catch (emailError: any) {
        console.error("❌ Email send failed:", emailError.message);
        console.error("=" .repeat(50) + "\n");
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
        return NextResponse.json(
          { error: "Failed to send email. Please try again." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, message: "Reset link sent to your email!" },
        { status: 200 }
      );
    }

    // ══════════════════════════════════════
    // RESET PASSWORD — নতুন password set করো
    // ══════════════════════════════════════
    if (action === "reset-password") {
<<<<<<< HEAD
      const { token, password } = body;
      if (!token || !password) {
=======
      console.log("\n🔐 Password Reset Request");
      console.log("=" .repeat(50));
      
      const { token, password } = body;
      if (!token || !password) {
        console.log("❌ Missing token or password");
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
        return NextResponse.json(
          { error: "Token and password required" },
          { status: 400 }
        );
      }

<<<<<<< HEAD
=======
      console.log("🔑 Token:", token.substring(0, 10) + "...");

>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() },
      });

      if (!user) {
<<<<<<< HEAD
=======
        console.log("❌ Invalid or expired token");
        console.log("=" .repeat(50) + "\n");
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
        return NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 400 }
        );
      }

<<<<<<< HEAD
=======
      console.log("✅ Valid token for user:", user.email);

>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
      user.password = await bcrypt.hash(password, 10);
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

<<<<<<< HEAD
=======
      console.log("✅ Password updated successfully");
      console.log("=" .repeat(50) + "\n");

>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
      return NextResponse.json(
        { success: true, message: "Password reset successful!" },
        { status: 200 }
      );
    }

    // ══════════════════════════════════════
    // SEND OTP
    // ══════════════════════════════════════
    if (action === "send-otp") {
<<<<<<< HEAD
=======
      console.log("\n📱 Send OTP Request");
      console.log("=" .repeat(50));
      
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
      const { email } = body;
      if (!email) {
        return NextResponse.json({ error: "Email required" }, { status: 400 });
      }

<<<<<<< HEAD
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ error: "Email not found" }, { status: 404 });
      }

=======
      console.log("📧 Email:", email);

      const user = await User.findOne({ email });
      if (!user) {
        console.log("❌ User not found");
        console.log("=" .repeat(50) + "\n");
        return NextResponse.json({ error: "Email not found" }, { status: 404 });
      }

      console.log("✅ User found:", user._id);

>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.resetToken = otp;
      user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
      await user.save();

<<<<<<< HEAD
=======
      console.log("🔢 OTP generated:", otp);
      console.log("⏰ Expires at:", user.resetTokenExpiry);

>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
      await transporter.sendMail({
        from: `"Smartlms Pro" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "✉️ Your Verification Code",
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
                  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:450px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background:linear-gradient(135deg,#832388 0%,#E3436B 50%,#F0772F 100%);padding:30px 20px;text-align:center">
                        <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px">
                          Smartlms Pro
                        </h1>
                        <p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:14px;font-weight:500">
                          Learning Management System
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding:40px 25px;text-align:center">
                        <div style="margin-bottom:20px">
                          <div style="display:inline-block;width:60px;height:60px;background:linear-gradient(135deg,#832388,#F0772F);border-radius:50%;line-height:60px;font-size:30px">
                            ✉️
                          </div>
                        </div>
                        
                        <h2 style="margin:0 0 10px;color:#1f2937;font-size:22px;font-weight:700">
                          Verification Code
                        </h2>
                        
                        <p style="margin:0 0 25px;color:#6b7280;font-size:14px;line-height:1.6">
                          আপনার verification code নিচে দেওয়া হলো
                        </p>
                        
                        <!-- OTP Box -->
                        <div style="background:linear-gradient(135deg,#832388 0%,#E3436B 50%,#F0772F 100%);border-radius:12px;padding:20px;margin:0 0 25px">
                          <div style="color:#ffffff;font-size:42px;font-weight:800;letter-spacing:12px;font-family:'Courier New',monospace">
                            ${otp}
                          </div>
                        </div>
                        
                        <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px;border-radius:8px;text-align:left">
                          <p style="margin:0;color:#92400e;font-size:12px;line-height:1.5">
                            ⏱️ এই code ১০ মিনিট পরে expire হবে
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background:#f9fafb;padding:20px;text-align:center;border-top:1px solid #e5e7eb">
                        <p style="margin:0;color:#9ca3af;font-size:12px">
                          © 2025 Smartlms Pro. All rights reserved.
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
      });

<<<<<<< HEAD
=======
      console.log("✅ OTP email sent");
      console.log("=" .repeat(50) + "\n");

>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
      return NextResponse.json({ success: true, message: "OTP sent!" });
    }

    // ══════════════════════════════════════
    // VERIFY OTP
    // ══════════════════════════════════════
    if (action === "verify-otp") {
<<<<<<< HEAD
=======
      console.log("\n✅ Verify OTP Request");
      console.log("=" .repeat(50));
      
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
      const { email, otp } = body;
      if (!email || !otp) {
        return NextResponse.json(
          { error: "Email and OTP required" },
          { status: 400 }
        );
      }

<<<<<<< HEAD
=======
      console.log("📧 Email:", email);
      console.log("🔢 OTP:", otp);

>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
      const user = await User.findOne({
        email,
        resetToken: otp,
        resetTokenExpiry: { $gt: new Date() },
      });

      if (!user) {
<<<<<<< HEAD
=======
        console.log("❌ Invalid or expired OTP");
        console.log("=" .repeat(50) + "\n");
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
        return NextResponse.json(
          { error: "Invalid or expired OTP!" },
          { status: 400 }
        );
      }

<<<<<<< HEAD
=======
      console.log("✅ OTP verified for user:", user._id);

>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

<<<<<<< HEAD
=======
      console.log("✅ OTP cleared from database");
      console.log("=" .repeat(50) + "\n");

>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
      return NextResponse.json({ success: true, message: "OTP verified!" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
<<<<<<< HEAD
    console.error("Action route error:", error);
=======
    console.error("\n❌ Action Route Error:");
    console.error("=" .repeat(50));
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    console.error("=" .repeat(50) + "\n");
    
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> e5ced0ed5788abe0c2211e1dc67a7c791796484f
