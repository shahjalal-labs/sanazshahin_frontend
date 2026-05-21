"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForgotPasswordMutation } from "@/redux/api/userApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [forgotPasswordFn, { isLoading }] = useForgotPasswordMutation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await forgotPasswordFn({ email: email }).unwrap();

      if (response?.success) {
        toast.success("A verification code has been sent to your email.");
        router.push(`/verify-otp?email=${email}`);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Failed to send verification code. Please check your email.");
    }

    router.push(`/verify-otp?email=${email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 border border-[#ADADAD40] rounded-2xl p-8 shadow-md bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Forgot password
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-6 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div className="text-left">
            <span className="text-gray-600">Remember the password? </span>
            <Link
              href="/login"
              className="text-primary hover:text-primary font-medium"
            >
              Sign in
            </Link>
          </div>

          <Button
            type="submit"
            // disabled={isLoading}
            className="w-full bg-primary text-white font-medium py-6 px-4 rounded-[40px] transition-colors flex items-center justify-center gap-2"
          >
            {/* {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Sending...
              </>
            ) : (
              "Send Code"
            )} */}
            Send Code
          </Button>

          <div className="text-center">
            <span className="text-gray-600">Don’t have an account? </span>
            <Link
              href="/signup"
              className="text-primary hover:text-primary font-medium"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
