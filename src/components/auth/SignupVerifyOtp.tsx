/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  useUserResendOtpMutation,
  useUserVerifyOtpMutation,
} from "@/redux/api/registerApi";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function SignupVerifyOtp() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(""); // Clear error when user starts typing

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email");

  const [userVerifyOtp] = useUserVerifyOtpMutation();
  const [userResendOtp] = useUserResendOtpMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join("");

    // Validate OTP
    if (otpCode.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    if (!email) {
      setError("Email not found. Please try signing up again.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const verifyData = {
        email: email,
        otp: otpCode,
      };

      console.log("Verifying OTP:", verifyData);

      const response = await userVerifyOtp(verifyData).unwrap();

      if (response.success) {
        console.log("OTP verification successful:", response);

        Cookies.set("accessToken", response?.result?.accessToken);
        toast.success("OTP verified successfully!");
        console.log("response user", response);
        router.push("/profile-setup");
      } else {
        setError(response.message || "OTP verification failed");
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);

      if (error.data?.message) {
        setError(error.data.message);
      } else if (error.status === 400) {
        setError("Invalid OTP. Please check the code and try again.");
      } else if (error.status === 410) {
        setError("OTP has expired. Please request a new one.");
      } else {
        setError("An error occurred during verification. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Email not found. Please try signing up again.");
      return;
    }

    setIsResending(true);
    setError("");

    try {
      const resendData = {
        email: email,
      };

      console.log("Resending OTP to:", email);

      const response = await userResendOtp(resendData).unwrap();

      if (response.success) {
        console.log("OTP resent successfully:", response);
        // Clear current OTP inputs
        setOtp(["", "", "", ""]);
        // Focus on first input
        inputRefs.current[0]?.focus();
        // Show success message (you can replace the error state with a success state if needed)
        setError("New OTP sent successfully!");
      } else {
        setError(response.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error);

      if (error.data?.message) {
        setError(error.data.message);
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const isOtpComplete = otp.join("").length === 4;

  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 border border-[#ADADAD40] rounded-2xl p-8 shadow-md bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Check your Email
          </h1>
          <p className="text-gray-600 mb-2">
            We sent a four digit code to your email address
          </p>
          {/* {email && <p className="text-primary font-medium mb-8">{email}</p>} */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* OTP Inputs */}
          <div className="flex justify-center space-x-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={isLoading}
                className={`w-16 h-16 text-center text-xl font-semibold border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors ${
                  error ? "border-red-500" : "border-gray-300"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div
              className={`text-center text-sm ${
                error.includes("successfully")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isOtpComplete || isLoading}
            className="w-full bg-primary text-white font-medium py-6 px-4 rounded-[40px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </div>
            ) : (
              "Verify OTP"
            )}
          </Button>

          {/* Info */}
          <div className="text-center text-gray-600 text-sm">
            Can&apos;t find the email? Check your spam folder.
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Resend Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || isLoading}
              className="text-primary font-medium hover:underline transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Resend Code"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
