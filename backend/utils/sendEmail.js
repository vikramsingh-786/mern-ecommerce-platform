import nodemailer from "nodemailer";


const sendEmail = async (recipientEmail, subject, message) => {
  if (!recipientEmail) {
    throw new Error("Recipient email is required");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    debug: true, // Enable debugging
    logger: true, // Log output to console
  });

  const mailOptions = {
    from: `${process.env.STORE_NAME} Support <${process.env.SMTP_FROM_EMAIL}>`,
    to: recipientEmail,
    subject: subject,
    text: message,
    html: `<p>${message.replace(/\n/g, "<br>")}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

export default sendEmail;
