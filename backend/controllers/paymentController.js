import stripe from "../config/stripe.js";
import Payment from "../models/Payment.js";
import Order from "../models/Order.js"; 
import Cart from "../models/Cart.js";

export const createPaymentIntent = async (req, res) => {
  const { amount, currency, orderId, billingDetails } = req.body;

  try {
    // Validate required billing details for Indian exports
    if (!billingDetails?.name || !billingDetails?.address) {
      return res.status(400).json({
        error: "Billing name and address are required for Indian export transactions"
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description: `Order #${orderId} - Purchase of goods`,
      shipping: {
        name: billingDetails.name,
        address: {
          line1: billingDetails.address,
          city: billingDetails.city,
          postal_code: billingDetails.postalCode,
          country: billingDetails.country,
        },
      },
      // Add metadata for better tracking
      metadata: {
        orderId,
        customerName: billingDetails.name,
      },
    });

    res.status(200).json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    });
  } catch (error) {
    console.error('Payment Intent Creation Error:', error);
    res.status(500).json({ 
      error: error.message,
      code: error.code 
    });
  }
};

export const confirmPayment = async (req, res) => {
  const { paymentId, amount, currency, status, orderId, billingDetails = {} } = req.body;

  try {
    // Check if the payment is already recorded
    const existingPayment = await Payment.findOne({ paymentId });
    if (existingPayment) {
      return res.status(200).json({ 
        message: "Payment already recorded",
        payment: existingPayment._id 
      });
    }

    // Map Stripe payment status to your system's status
    const statusMap = {
      'succeeded': 'completed',
      'processing': 'pending',
      'requires_payment_method': 'pending',
      'requires_action': 'pending',
      'requires_capture': 'pending',
      'canceled': 'failed'
    };

    // Create and save the payment record
    const payment = new Payment({
      userId: req.user._id,
      orderId,
      amount,
      currency,
      status: statusMap[status] || 'pending',
      paymentId,
      billingDetails: {
        name: billingDetails?.name || 'Not provided',
        address: billingDetails?.address || 'Not provided',
        city: billingDetails?.city || 'Not provided',
        postalCode: billingDetails?.postalCode || 'Not provided',
        country: billingDetails?.country || 'IN',
      }
    });

    await payment.save();

    // If payment is successful, update the order and clear the user's cart
    if (status === "succeeded") {
      // Update the order status
      await Order.findByIdAndUpdate(orderId, {
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
          razorpay_payment_id: paymentId, 
          status: "completed",
        }
      });

      await Cart.deleteMany({ userId: req.user._id });
    }

    res.status(200).json({ 
      message: "Payment confirmed successfully",
      payment: payment._id 
    });

  } catch (error) {
    console.error('Payment Confirmation Error:', error);
    res.status(500).json({ error: error.message });
  }
};
