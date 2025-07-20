require('dotenv').config();
const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text }) => {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // App password
      },
      tls: {
        rejectUnauthorized: false, // Allow self-signed certificates
      },
  });

  await transporter.sendMail({
    from: `"Trainer Management" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
