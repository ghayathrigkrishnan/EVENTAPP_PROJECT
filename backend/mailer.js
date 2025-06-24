require('dotenv').config(); // Needed to load EMAIL_USER & EMAIL_PASS
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendDeletionEmail = async (recipientEmail, name, event) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: 'You have been removed from an event',
    html: `
      <p>Hi ${name},</p>
      <p>We regret to inform you that you have been removed from the event: <strong>${event}</strong>.</p>
      <p>If this was a mistake, please contact the admin.</p>
      <p>Regards,<br/>Team RITI 10.0</p>
    `,
  };

  try {
    console.log(" Sending email to:", recipientEmail);
    await transporter.sendMail(mailOptions);
    console.log(" Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


//  To Admin: Notify any update/delete/register
const sendAdminNotification = async (subject, htmlBody) => {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error(" ADMIN_EMAIL is not set in .env!");
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject,
    html: htmlBody,
  };

  try {
    console.log("Notifying admin at:", adminEmail);
    await transporter.sendMail(mailOptions);
    console.log(" Admin notified");
  } catch (error) {
    console.error(" Failed to notify admin:", error);
  }
};


module.exports = {
  sendDeletionEmail,
  sendAdminNotification,
};

