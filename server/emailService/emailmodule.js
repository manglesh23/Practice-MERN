// emailService.js
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.qlc.co.in",
      port: 587,
      secure: false,
      auth: {
        user: "no-reply@meraqui.com",
        pass: "Meraqui@1234",
      },
    });

    const mailOptions = {
      from: "manglesh.y@meraqui.com",
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;

  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = {sendEmail};
