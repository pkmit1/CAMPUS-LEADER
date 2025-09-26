"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router=useRouter()

  // 1️⃣ Send OTP
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      setMessage(res.data.message);
      setStep("otp");
      toast.success("Otp Send To EmailId Successful")
    } catch (err: any) {
        toast.error("Failed to send OTP")
      setMessage(err.response?.data?.error || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Verify OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/verify-otp", { email, code: otp });
      toast.success("otp match")
      setMessage(res.data.message);
      setStep("reset");
    } catch (err: any) {
        toast.error("Invalid OTP")
      setMessage(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Reset Password
  const handleResetPassword = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/reset-password", { email, newPassword });
      setMessage(res.data.message);
      setStep("email");
      setEmail("");
      setOtp("");
      setNewPassword("");
      toast.success("Password Reset Successful")
      router.push("/signin")
    } catch (err: any) {
        toast.error("Failed to reset password")
      setMessage(err.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}

      {step === "email" && (
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <button
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      )}

      {step === "otp" && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      )}

      {step === "reset" && (
        <div className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <button
            onClick={handleResetPassword}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      )}
    </div>
  );
}
