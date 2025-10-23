import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';

/**
 * Email Service Configuration
 * Gmail SMTP with connection pooling for better performance
 */

// Environment variables for SMTP configuration
const SMTP_USER = process.env.SMTP_EMAIL;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM;

/**
 * Email Options Interface
 */
export interface SendEmailOptions {
  to: string | string[]; // Recipient email(s)
  subject: string; // Email subject
  html?: string; // HTML content
  text?: string; // Plain text content (fallback)
  cc?: string | string[]; // Carbon copy (optional)
  bcc?: string | string[]; // Blind carbon copy (optional)
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: string | Buffer;
  }>; // File attachments (optional)
}

/**
 * Email Send Result
 */
export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Singleton Email Transporter
 * Reuse connection for all emails (connection pooling)
 */
let transporter: Transporter | null = null;

/**
 * Get or Create Email Transporter
 * Creates transporter once and reuses it (singleton pattern)
 */
function getTransporter(): Transporter {
  // Return existing transporter if available
  if (transporter) {
    return transporter;
  }

  // Validate environment variables
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error(
      'Email configuration missing: SMTP_EMAIL and SMTP_PASS must be set in .env'
    );
  }

  // Create new transporter with Gmail settings
  transporter = nodemailer.createTransport({
    service: 'gmail', // Automatically sets host, port, and secure for Gmail
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS, // Use App Password from Google Account settings
    },
    pool: true, // Enable connection pooling
    maxConnections: 5, // Max concurrent connections
    maxMessages: 100, // Max messages per connection
  });

  // Verify connection on first creation (optional)
  transporter.verify((error) => {
    if (error) {
      console.error('SMTP connection error:', error);
    } else if (process.env.NODE_ENV === 'development') {
      console.log('✓ Email transporter ready');
    }
  });

  return transporter;
}

/**
 * Validate Email Address Format
 * Simple regex validation
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Email Recipients
 * Supports single email or array of emails
 */
function validateRecipients(recipients: string | string[]): void {
  const emails = Array.isArray(recipients) ? recipients : [recipients];

  for (const email of emails) {
    if (!isValidEmail(email)) {
      throw new Error(`Invalid email address: ${email}`);
    }
  }
}

/**
 * Send Email
 * Main function to send emails via Gmail SMTP
 *
 * @example
 * ```typescript
 * await sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Welcome!',
 *   html: '<h1>Hello</h1>',
 *   text: 'Hello' // Fallback for plain text
 * });
 * ```
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<EmailResult> {
  try {
    // Validate required fields
    if (!options.to) {
      throw new Error('Recipient email (to) is required');
    }

    if (!options.subject) {
      throw new Error('Email subject is required');
    }

    if (!options.html && !options.text) {
      throw new Error('Email content (html or text) is required');
    }

    // Validate email addresses
    validateRecipients(options.to);
    if (options.cc) validateRecipients(options.cc);
    if (options.bcc) validateRecipients(options.bcc);

    // Get transporter (singleton)
    const emailTransporter = getTransporter();

    // Prepare mail options
    const mailOptions: SendMailOptions = {
      from: SMTP_FROM || SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments,
    };

    // Send email
    const info = await emailTransporter.sendMail(mailOptions);

    // Log success in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Email sent:', {
        messageId: info.messageId,
        to: options.to,
        subject: options.subject,
      });
    }

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    // Log error
    console.error('Email send error:', error);

    // Handle specific Gmail errors
    if (error instanceof Error) {
      const errorCode = (error as any).code;

      // Authentication error
      if (errorCode === 'EAUTH') {
        return {
          success: false,
          error:
            'Invalid Gmail credentials. Please check SMTP_EMAIL and SMTP_PASS.',
        };
      }

      // Connection error
      if (errorCode === 'ECONNECTION' || errorCode === 'ETIMEDOUT') {
        return {
          success: false,
          error:
            'Cannot connect to Gmail SMTP. Please check your internet connection.',
        };
      }

      // Rate limit error
      if (error.message.includes('rate limit')) {
        return {
          success: false,
          error: 'Email rate limit exceeded. Please try again later.',
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: 'Unknown error occurred while sending email',
    };
  }
}

/**
 * Close Email Transporter
 * Call this when shutting down the application
 */
export async function closeEmailTransporter(): Promise<void> {
  if (transporter) {
    transporter.close();
    transporter = null;
    console.log('✓ Email transporter closed');
  }
}

// Graceful shutdown - close email connections
process.on('beforeExit', async () => {
  await closeEmailTransporter();
});
