import nodemailer from 'nodemailer';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

// Check if SMTP is properly configured
function isSMTPConfigured(): boolean {
  return !!(process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_HOST);
}

// Create transporter with fallback for missing env vars
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'test@example.com',
    pass: process.env.SMTP_PASS || 'test-password',
  },
});

// Email templates
const emailTemplates = {
  verification: (token: string, name: string) => ({
    subject: 'Verify your CodeNote account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to CodeNote!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for signing up for CodeNote. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify?token=${token}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">
          ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify?token=${token}
        </p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This email was sent from CodeNote. Please do not reply to this email.
        </p>
      </div>
    `,
  }),
  passwordReset: (token: string, name: string) => ({
    subject: 'Reset your CodeNote password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}" 
             style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">
          ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}
        </p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          This email was sent from CodeNote. Please do not reply to this email.
        </p>
      </div>
    `,
  }),
};

// Send verification email
export async function sendVerificationEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save verification token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Check if we have proper SMTP configuration
    if (!isSMTPConfigured()) {
      console.warn('SMTP credentials not configured, skipping email send');
      console.log(`📧 Verification token for ${email}: ${token}`);
      console.log(`🔗 Verification URL: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify?token=${token}`);
      return { success: true, token, skipped: true };
    }

    // Send email
    const template = emailTemplates.verification(token, user.name || 'User');
    
    await transporter.sendMail({
      from: `"CodeNote" <${process.env.SMTP_USER}>`,
      to: email,
      subject: template.subject,
      html: template.html,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending verification email:', error);
    
    // If it's an SMTP error and we have a token, return success with token
    if (error instanceof Error && error.message.includes('SMTP') && !isSMTPConfigured()) {
      console.warn('SMTP error, but user can still verify manually with token');
      return { success: true, error: 'SMTP not configured' };
    }
    
    throw new Error('Failed to send verification email');
  }
}

// Send password reset email
export async function sendPasswordResetEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Check if we have proper SMTP configuration
    if (!isSMTPConfigured()) {
      console.warn('SMTP credentials not configured, skipping email send');
      console.log(`📧 Password reset token for ${email}: ${token}`);
      console.log(`🔗 Reset URL: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`);
      return { success: true, token, skipped: true };
    }

    // Send email
    const template = emailTemplates.passwordReset(token, user.name || 'User');
    
    await transporter.sendMail({
      from: `"CodeNote" <${process.env.SMTP_USER}>`,
      to: email,
      subject: template.subject,
      html: template.html,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    
    // If it's an SMTP error and we have a token, return success with token
    if (error instanceof Error && error.message.includes('SMTP') && !isSMTPConfigured()) {
      console.warn('SMTP error, but user can still reset manually with token');
      return { success: true, error: 'SMTP not configured' };
    }
    
    throw new Error('Failed to send password reset email');
  }
}

// Verify email token
export async function verifyEmailToken(token: string) {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      throw new Error('Invalid verification token');
    }

    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { token },
      });
      throw new Error('Verification token has expired');
    }

    // Update user as verified
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { isVerified: true },
    });

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { token },
    });

    return { success: true };
  } catch (error) {
    console.error('Error verifying email token:', error);
    throw error;
  }
}

// Verify password reset token
export async function verifyPasswordResetToken(token: string) {
  try {
    const resetToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      throw new Error('Invalid reset token');
    }

    if (resetToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { token },
      });
      throw new Error('Reset token has expired');
    }

    return { success: true, email: resetToken.identifier };
  } catch (error) {
    console.error('Error verifying reset token:', error);
    throw error;
  }
}

// Clean up expired tokens
export async function cleanupExpiredTokens() {
  try {
    await prisma.verificationToken.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
} 