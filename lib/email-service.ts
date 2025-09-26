// lib/email-service.ts
// Mock email service for development
// In production, you'd use a service like SendGrid, Mailgun, etc.

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  static async sendPasswordResetEmail(email: string, resetLink: string): Promise<boolean> {
    const emailData: EmailData = {
      to: email,
      subject: 'Password Reset - SurveyPro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested a password reset for your SurveyPro account.</p>
          <p>Click the link below to reset your password:</p>
          <p style="margin: 20px 0;">
            <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            SurveyPro - Transforming feedback into action
          </p>
        </div>
      `,
      text: `
        Password Reset Request

        You requested a password reset for your SurveyPro account.

        Reset your password here: ${resetLink}

        This link will expire in 1 hour.

        If you didn't request this reset, please ignore this email.

        SurveyPro - Transforming feedback into action
      `
    };

    // In development, just log the email
    console.log('📧 MOCK EMAIL SERVICE');
    console.log('📧 To:', emailData.to);
    console.log('📧 Subject:', emailData.subject);
    console.log('📧 Reset Link:', resetLink);
    console.log('📧 HTML:', emailData.html);
    console.log('=' .repeat(50));

    // Simulate successful sending
    return true;
  }
}
