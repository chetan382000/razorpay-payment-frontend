import { useState } from "react";
import axios from "axios";

const PaymentPage = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    const amt = Number(amount.trim());
    if (!amt || amt < 1) {
      setError("Please enter amount ≥ ₹1");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post("http://localhost:5000/api/payment/create-order", {
        amount: amt, // paise
      });

      const order = data.order;

      const options = {
        key: "rzp_test_xxxxxxxxx",
        amount: order.amount,
        currency: order.currency,
        name: "Your Shop Name",
        description: `Payment of ₹${amt}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verify = await axios.post("http://localhost:5000/api/payment/verify", response);
            if (verify.data.success) {
              alert("✅ Payment Successful!");
              setAmount("");
            } else {
              alert("Verification failed");
            }
          } catch (err) {
            alert("Verification error");
          }
        },
        theme: { color: "#4f46e5" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not start payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f3e8ff, #e0f2fe)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "system-ui, sans-serif",
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
        width: "100%",
        maxWidth: "420px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(to right, #6366f1, #8b5cf6)",
          color: "white",
          padding: "28px 24px",
          textAlign: "center",
        }}>
          <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 700 }}>
            Secure Payment
          </h1>
          <p style={{ margin: "8px 0 0", opacity: 0.9, fontSize: "0.95rem" }}>
            Powered by Razorpay
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "32px 24px" }}>
          <label style={{
            display: "block",
            marginBottom: "12px",
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "#374151",
          }}>
            Enter Amount (₹)
          </label>

          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: "#9ca3af",
            }}>₹</span>

            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="500"
              disabled={loading}
              style={{
                width: "100%",
                padding: "16px 16px 16px 52px",
                fontSize: "2rem",
                fontWeight: "bold",
                border: "2px solid #c7d2fe",
                borderRadius: "12px",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#6366f1"}
              onBlur={(e) => e.target.style.borderColor = "#c7d2fe"}
            />
          </div>

          {error && (
            <div style={{
              margin: "20px 0",
              padding: "12px",
              background: "#fee2e2",
              color: "#b91c1c",
              borderRadius: "8px",
              textAlign: "center",
              fontWeight: 500,
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading || !amount.trim()}
            style={{
              width: "100%",
              padding: "16px",
              marginTop: "24px",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "white",
              background: loading || !amount.trim() ? "#9ca3af" : "#6366f1",
              border: "none",
              borderRadius: "12px",
              cursor: loading || !amount.trim() ? "not-allowed" : "pointer",
              transition: "all 0.25s",
              boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
            }}
            onMouseOver={(e) => {
              if (!loading && amount.trim()) e.target.style.background = "#4f46e5";
            }}
            onMouseOut={(e) => {
              if (!loading && amount.trim()) e.target.style.background = "#6366f1";
            }}
          >
            {loading ? "Processing..." : `Pay ₹${amount || 0}`}
          </button>

          <p style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "0.9rem",
            color: "#6b7280",
          }}>
            🔒 Secured by Razorpay • SSL Encrypted • 100% Safe
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;