import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useConfirmPaymentMutation } from "../api/paymentApi";
import { CheckCircle, AlertTriangle } from "lucide-react";

const StripePaymentForm = ({
  clientSecret,
  orderId,
  billingDetails,
  onSuccess,
  onError,
  darkMode,
  refetch,
  clearCartState,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [confirmPayment] = useConfirmPaymentMutation();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  

  useEffect(() => {
    if (stripe && clientSecret) {
      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        if (paymentIntent?.status === "succeeded") {
          setPaymentStatus("succeeded");
          handlePaymentSuccess(paymentIntent);
        }
      });
    }
  }, [stripe, clientSecret]);

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      await confirmPayment({
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        orderId: orderId,
        billingDetails: {
          name: billingDetails?.name || "Customer",
          address: billingDetails?.address || "Not provided",
          city: billingDetails?.city || "Not provided",
          postalCode: billingDetails?.postalCode || "Not provided",
          country: billingDetails?.country || "IN",
        },
      }).unwrap();
  
      // Clear the cart state
      clearCartState();
  
      // Call onSuccess with refetch
      onSuccess(paymentIntent);
  
      // Check if refetch exists and is a function before calling it
      if (refetch && typeof refetch === "function") {
        await refetch(); // Refetch cart data
      } else {
        // Fallback: Manually reload the page or fetch cart data
        window.location.reload(); // Reload the page to reflect changes
      }
    } catch (err) {
      console.error("Error recording payment:", err);
      onError(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || processing || paymentStatus === "succeeded") {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { paymentIntent: existingIntent } =
        await stripe.retrievePaymentIntent(clientSecret);
      if (existingIntent?.status === "succeeded") {
        setPaymentStatus("succeeded");
        await handlePaymentSuccess(existingIntent);
        return;
      }
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: billingDetails?.name || "Customer",
              email: billingDetails?.email,
              phone: billingDetails?.phone,
              address: {
                line1: billingDetails?.address,
                city: billingDetails?.city,
                postal_code: billingDetails?.postalCode,
                country: billingDetails?.country || "IN",
              },
            },
          },
        });

      if (stripeError) {
        if (
          stripeError.code === "payment_intent_unexpected_state" &&
          stripeError.payment_intent?.status === "succeeded"
        ) {
          setPaymentStatus("succeeded");
          await handlePaymentSuccess(stripeError.payment_intent);
          return;
        }

        setError(stripeError.message);
        onError(stripeError);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        setPaymentStatus("succeeded");
        await handlePaymentSuccess(paymentIntent);
      } else if (paymentIntent.status === "requires_action") {
        // Handle 3D Secure authentication if needed
        const { error, paymentIntent: updatedIntent } =
          await stripe.confirmCardPayment(clientSecret);
        if (error) {
          setError(error.message);
          onError(error);
          return;
        }

        if (updatedIntent.status === "succeeded") {
          setPaymentStatus("succeeded");
          await handlePaymentSuccess(updatedIntent);
        }
      }
    } catch (err) {
      console.error("Payment confirmation error:", err);
      setError(err.data?.error || "Payment processing failed");
      onError(err);
    } finally {
      setProcessing(false);
    }
  };

  // If payment already succeeded, show success state
  if (paymentStatus === "succeeded") {
    return (
      <div className={`rounded-lg text-center p-8 ${
        darkMode 
          ? "bg-green-900/20 text-green-400" 
          : "bg-green-50 text-green-700"
      }`}>
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-5">
          <CheckCircle className={`h-10 w-10 ${
            darkMode ? "text-green-400" : "text-green-600"
          }`} />
        </div>
        <h3 className="text-xl font-medium mb-2">Payment Successful!</h3>
        <p className={`mb-6 ${
          darkMode ? "text-green-300" : "text-green-600"
        }`}>
          Your order has been successfully processed.
        </p>
        <button
          onClick={() => onSuccess({ status: "succeeded" })}
          className={`py-3 px-6 font-medium rounded-md transition-colors ${
            darkMode 
              ? "bg-green-700 hover:bg-green-600 text-white" 
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          View Order Details
        </button>
      </div>
    );
  }

  // Card element styling consistent with dark/light mode
  const cardElementStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: darkMode ? "#E5E7EB" : "#424770",
        "::placeholder": {
          color: darkMode ? "#9CA3AF" : "#aab7c4",
        },
        iconColor: darkMode ? "#E5E7EB" : "#424770",
      },
      invalid: {
        color: darkMode ? "#FCA5A5" : "#9e2146",
        iconColor: darkMode ? "#FCA5A5" : "#fa755a",
      },
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className={`p-4 border rounded-md ${
            darkMode 
              ? "bg-gray-700 border-gray-600" 
              : "bg-white border-gray-300"
          }`}>
            <CardElement options={cardElementStyle} />
          </div>
          
          <div className={`p-4 rounded-md ${
            darkMode ? "bg-gray-700" : "bg-gray-100"
          }`}>
            <h4 className={`font-medium mb-3 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}>
              Payment Tips
            </h4>
            <ul className={`text-sm space-y-1 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              <li>• Use 4242 4242 4242 4242 for testing</li>
              <li>• Any future date for expiry</li>
              <li>• Any 3-digit CVC</li>
              <li>• Any 5-digit ZIP code</li>
            </ul>
          </div>
        </div>

        {error && (
          <div className={`p-4 rounded-md flex items-start gap-3 ${
            darkMode ? "bg-red-900/20 text-red-300" : "bg-red-50 text-red-700"
          }`}>
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || processing || paymentStatus === "succeeded"}
          className={`w-full py-3 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            darkMode
              ? "bg-blue-600 hover:bg-blue-500 text-white focus:ring-blue-500 disabled:bg-blue-800 disabled:text-blue-300"
              : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-gray-300 disabled:text-gray-500"
          } ${processing || !stripe ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {processing ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing...</span>
            </div>
          ) : (
            "Complete Payment"
          )}
        </button>
      </form>
    </div>
  );
};

export default StripePaymentForm;