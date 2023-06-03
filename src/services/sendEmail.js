import nodemailer from "nodemailer";

export const sendEmail = async ({
  to = "",
  subject = "",
  message = "",
  attachments = [],
}) => {
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 587,
    secure: false,
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `route <${process.env.SENDER_EMAIL}>`,
    to,
    html: message,
    subject,
    attachments,
  });
 
  if (info.accepted.length) {
    return true;
  }
  return false;
};
