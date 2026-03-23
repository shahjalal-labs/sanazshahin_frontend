/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserRegistrationMutation } from "@/redux/api/registerApi";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

// Define the validation schema
const signUpSchema = z
  .object({
    firstName: z.string().nonempty("First name is required"),
    lastName: z.string().nonempty("Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be less than 15 digits")
      .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const [userRegistrationFn] = useUserRegistrationMutation();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name as keyof SignUpFormData]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form data
    const validationResult = signUpSchema.safeParse(formData);

    if (!validationResult.success) {
      // Convert Zod errors to a simpler format
      const newErrors: Partial<Record<keyof SignUpFormData, string>> = {};
      validationResult.error.errors.forEach((error) => {
        const fieldName = error.path[0] as keyof SignUpFormData;
        newErrors[fieldName] = error.message;
      });
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Clear errors if validation passes
    setErrors({});

    try {
      // Prepare body data with required fields
      const bodyData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      console.log("Sign up data:", bodyData);

      // Call the registration API
      const response = await userRegistrationFn(bodyData).unwrap();

      // Check if registration was successful
      if (response.success) {
        console.log("Registration successful:", response);
        toast.success(
          "Registration successful! Please check your email for the OTP.",
        );

        // Redirect to OTP verification page with email as query parameter
        router.push(
          `/signup/verify-otp?email=${encodeURIComponent(formData.email)}`,
        );
      } else {
        // Handle API error response
        console.error("Registration failed:", response);
        setErrors({
          email: response.message || "Registration failed. Please try again.",
        });
      }
    } catch (error: any) {
      console.error("Registration error:", error);

      // Handle different types of errors
      if (error.data?.message) {
        setErrors({
          email: error.data.message,
        });
      } else if (error.status === 409) {
        setErrors({
          email: "User with this email already exists.",
        });
      } else {
        setErrors({
          email: "An error occurred during registration. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 border border-[#ADADAD40] rounded-2xl p-8 shadow-md bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Create Your Account
          </h1>
          <p>Create account and enjoy all services</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div>
              <Label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Full name"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-4 py-6 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
                required
                disabled={isLoading}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
          </div>

          {/* Email */}
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
              className={`w-full px-4 py-6 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              required
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-6 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              required
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
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
                className={`w-full px-4 py-6 pr-12 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-6 pr-12 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white font-medium py-6 px-4 rounded-[40px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                Signing up...
              </div>
            ) : (
              "Sign up"
            )}
          </Button>

          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              href="/login"
              className="text-primary hover:text-primary font-medium"
            >
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
