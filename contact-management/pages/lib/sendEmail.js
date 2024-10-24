const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER || 'your-email@example.com',
    pass: process.env.SMTP_PASSWORD || 'your-email-password',
  },
});


const sendEmail = async (to, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your App Name" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
    console.log(`Email sent: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error('Error sending email:', err);
    return false;
  }
};


const sendVerificationEmail = async (email, verificationCode) => {
  const subject = 'Email Verification';
  const htmlContent = `<p>Your verification code is: <strong>${verificationCode}</strong></p>`;
  return await sendEmail(email, subject, htmlContent);
};

// Example usage for password reset
const sendPasswordResetEmail = async (email, resetCode) => {
  const subject = 'Password Reset';
  const htmlContent = `<p>Your password reset code is: <strong>${resetCode}</strong></p>`;
  return await sendEmail(email, subject, htmlContent);
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
};
