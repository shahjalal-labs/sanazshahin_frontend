"use client";

import { Button } from "@/components/ui/button";
import { useResetPasswordVerifyOtpMutation } from "@/redux/api/userApi";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const params = useSearchParams();
  const email = params.get("email");
  const router = useRouter();

  const [verifyOtpFn, { isLoading }] = useResetPasswordVerifyOtpMutation();

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (!email) {
      toast.error("Email is missing. Please try again.");
      return;
    }

    try {
      const response = await verifyOtpFn({ email, otp: otpCode }).unwrap();

      if (response?.success) {
        toast.success(
          "OTP verified successfully. You can now reset your password.",
        );
        if (response?.result?.forgetToken) {
          Cookies.set("forgetToken", response?.result?.forgetToken);
        }
        router.push(`/reset-password`);
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } catch {
      toast.error("Failed to verify OTP. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 border border-[#ADADAD40] rounded-2xl p-8 shadow-md bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Check your Email
          </h1>
          <p className="text-gray-600 mb-8">
            We sent a four digit code to your email address
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
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
                className="w-16 h-16 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            ))}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:opacity-90
             text-white font-medium py-6 px-4 rounded-[40px] transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin">⏳</span>
                Verifying...
              </>
            ) : (
              "Submit"
            )}
          </Button>

          <div className="text-center">
            <p className="text-gray-600">
              Can&apos;t find the email? Check your spam folder.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
