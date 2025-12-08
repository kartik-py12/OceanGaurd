import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === 'gmail' || process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || undefined,
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.EMAIL_USER || 'test@ethereal.email',
      pass: process.env.EMAIL_PASSWORD || 'test',
    },
  });
};

export interface EmailNotificationData {
  type: string;
  location: { lat: number; lng: number };
  severity: number;
  description?: string;
  reportedBy: string;
  reportId: string;
}

export const sendHazardNotificationEmail = async (data: EmailNotificationData): Promise<boolean> => {
  try {
    const oceanAuthorityEmail = process.env.OCEAN_AUTHORITY_EMAIL;

    if (!oceanAuthorityEmail) {
      console.warn('OCEAN_AUTHORITY_EMAIL not configured in .env file');
      return false;
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('   Please add EMAIL_USER and EMAIL_PASSWORD to your .env file');
      return false;
    }

    const transporter = createTransporter();

    const severityLabel = data.severity <= 3 ? 'Low' : data.severity <= 6 ? 'Medium' : data.severity <= 8 ? 'High' : 'Critical';
    const googleMapsLink = `https://www.google.com/maps?q=${data.location.lat},${data.location.lng}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@oceanguard.com',
      to: oceanAuthorityEmail,
      subject: ` New Ocean Hazard Report: ${data.type} - ${severityLabel} Severity`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .footer { background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
            .severity-high { color: #dc2626; font-weight: bold; }
            .severity-medium { color: #f59e0b; font-weight: bold; }
            .severity-low { color: #10b981; font-weight: bold; }
            .button { display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Ocean Hazard Report</h1>
            </div>
            <div class="content">
              <h2>Hazard Details</h2>
              <p><strong>Type:</strong> ${data.type}</p>
              <p><strong>Severity:</strong> <span class="severity-${data.severity <= 6 ? 'medium' : 'high'}">${severityLabel} (${data.severity}/10)</span></p>
              <p><strong>Location:</strong> ${data.location.lat.toFixed(4)}°N, ${data.location.lng.toFixed(4)}°E</p>
              <p><strong>Reported By:</strong> ${data.reportedBy}</p>
              ${data.description ? `<p><strong>Description:</strong> ${data.description}</p>` : ''}
              <p><strong>Report ID:</strong> ${data.reportId}</p>
              
              <a href="${googleMapsLink}" class="button">View on Google Maps</a>
              
              <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
              
              <p style="font-size: 12px; color: #6b7280;">
                This is an automated notification from OceanGuard. Please review this report and take appropriate action.
              </p>
            </div>
            <div class="footer">
              <p>OceanGuard Hazard Monitoring System</p>
              <p>This email was automatically generated. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
New Ocean Hazard Report

Type: ${data.type}
Severity: ${severityLabel} (${data.severity}/10)
Location: ${data.location.lat.toFixed(4)}°N, ${data.location.lng.toFixed(4)}°E
Reported By: ${data.reportedBy}
${data.description ? `Description: ${data.description}` : ''}
Report ID: ${data.reportId}

View on Google Maps: ${googleMapsLink}

This is an automated notification from OceanGuard.
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error: any) {
    console.error(' Error sending email:', error.message || error);
    return false;
  }
};

export const sendEmail = async (to: string, subject: string, html: string): Promise<boolean> => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return false;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"OceanGuard Alert System" <${process.env.EMAIL_USER || 'noreply@oceanguard.com'}>`,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    console.log(` Email sent successfully to ${to}`);
    return true;
  } catch (error: any) {
    console.error(`Error sending email to ${to}:`, error.message);
    return false;
  }
};
