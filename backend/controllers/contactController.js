import sendEmail from '../utils/sendEmail.js';

const contactUs = async (req, res) => {
    const { email, message } = req.body;
  
    if (!email || !message) {
      return res.status(400).json({
        success: false,
        message: "Email and message are required",
      });
    }
  
    try {
      console.log("Sending email to store owner...");
      const ownerEmailMessage = `
        New Customer Inquiry from ${process.env.STORE_NAME}
        --------------------------------------------------
        Email: ${email}
        Message: ${message}
      `;
  
      await sendEmail(
        process.env.STORE_OWNER_EMAIL,
        `New Customer Inquiry - ${process.env.STORE_NAME}`,
        ownerEmailMessage
      );
  
      console.log("Sending confirmation email to user...");
      const userMessage = `
        Hello,
        
        Thank you for reaching out to ${process.env.STORE_NAME}!
        We have received your message and our support team will get back to you as soon as possible.
        
        In the meantime, feel free to browse our latest products and offers on our website.
        
        If you have any urgent queries, you can contact us at ${process.env.STORE_SUPPORT_EMAIL}.
        
        Best regards,
        The ${process.env.STORE_NAME} Team 😊
      `;
  
      await sendEmail(
        email,
        `Thank You for Contacting ${process.env.STORE_NAME}`,
        userMessage
      );
  
      console.log("Emails sent successfully");
      res.status(200).json({
        success: true,
        message: "Thank you for reaching out! We have sent you a confirmation email and will respond shortly.",
      });
    } catch (error) {
      console.error("Error in contactUs function:", error);
      res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
    }
  };

export default contactUs;
