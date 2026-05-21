"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGoogleLoginMutation,
  useUserLoginMutation,
} from "@/redux/api/registerApi";
import Cookies from "js-cookie";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [userLoginFn] = useUserLoginMutation();
  const [googleLoginFn] = useGoogleLoginMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
        general: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: "", password: "", general: "" });

    // Basic validation
    if (!formData.email || !formData.password) {
      setErrors({
        ...errors,
        general: "Please fill in all fields",
      });
      setIsLoading(false);
      return;
    }

    try {
      const loginData = {
        email: formData.email,
        password: formData.password,
      };

      const response = await userLoginFn(loginData).unwrap();

      if (response?.success) {
        console.log("Login successful:", response);
        toast.success("Login successful!");

        // Store token in localStorage or context
        if (response?.result?.accessToken) {
          Cookies.set("accessToken", response.result.accessToken);
          // Redirect to dashboard or home page
          router.push("/");
        }
      } else {
        setErrors({
          ...errors,
          general: response.message || "Login failed. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.data?.message) {
        setErrors({
          ...errors,
          general: error.data.message,
        });
      } else if (error.status === 401) {
        setErrors({
          ...errors,
          general: "Invalid email or password. Please try again.",
        });
      } else if (error.status === 403) {
        setErrors({
          ...errors,
          general:
            "Account not verified. Please check your email for verification link.",
        });
      } else if (error.status === 404) {
        setErrors({
          ...errors,
          general: "User not found. Please check your email or sign up.",
        });
      } else {
        setErrors({
          ...errors,
          general: "An error occurred during login. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await signIn("google");
    } catch (err) {
      console.error(err);
      toast.error("Google login failed");
      setGoogleLoading(false);
    }
  };

  // SEND TO BACKEND VIA RTK
  // -------------------------
  useEffect(() => {
    const sendGoogleData = async () => {
      if (!session?.user) return;

      try {
        const payload = {
          email: session.user.email,
          fullName: session.user.name,
          profileImage: session.user.image || "",
          fcmToken: "asdf",
        };

        const res = await googleLoginFn(payload).unwrap();

        console.log("Google login response:", res);

        if (res?.result?.accessToken) {
          Cookies.set("accessToken", res.result.accessToken);
        }

        toast.success("Google login successful");
        router.push("/");
      } catch (error: any) {
        console.error(error);
        toast.error("Backend Google login failed");
      } finally {
        setGoogleLoading(false);
      }
    };

    sendGoogleData();
  }, [session, googleLoginFn, router]);

  useEffect(() => {
    const sendGoogleData = async () => {
      if (!session?.user) return;

      try {
        const payload = {
          email: session.user.email,
          fullName: session.user.name,
          profileImage: session.user.image || "",
          fcmToken: "asdf",
        };

        const res = await googleLoginFn(payload).unwrap();

        console.log("Google login response:", res);

        if (res?.result?.accessToken) {
          Cookies.set("accessToken", res.result.accessToken);
        }

        toast.success("Google login successful");
        router.push("/");
      } catch (error: any) {
        console.error(error);
        toast.error("Backend Google login failed");
      } finally {
        setGoogleLoading(false);
      }
    };

    sendGoogleData();
  }, [session, googleLoginFn, router]);

  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 border border-[#ADADAD40] rounded-2xl p-8 shadow-md bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Log In</h1>
        </div>

        {/* General Error Message */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

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
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full px-4 py-6 border rounded-full focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.email ? "border-red-500" : "border-gray-300"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-4 py-6 pr-12 border rounded-full focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="text-right mt-2">
              <Link
                href="/forgot-password"
                className="text-primary hover:text-primary text-sm disabled:opacity-50"
              >
                Forgot password?
              </Link>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white font-medium py-6 px-4 rounded-[40px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed "
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
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Or login with
              </span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            variant="outline"
            className="w-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-6 px-4 rounded-[40px] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="flex items-center gap-2">
              {googleLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Redirecting...
                </>
              ) : (
                "Continue with Google"
              )}
            </span>
          </Button>

          <div className="text-center">
            <span className="text-gray-600">Don&apos;t have an account? </span>
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
