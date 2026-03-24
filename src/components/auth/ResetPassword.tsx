"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCheck, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // try {
    //   const response = await resetPasswordFn({
    //     newPassword: formData.newPassword,
    //     forgetToken: forgetToken,
    //   }).unwrap();

    //   if (response?.success) {
    //     toast.success("Password has been reset successfully.");
    //     router.push("/login");
    //   } else {
    //     toast.error("Failed to reset password. Please try again.");
    //   }
    // } catch {
    //   toast.error("An error occurred while resetting your password.");

    // }

    setShowSuccessModal(true);
  };

  const handleDone = () => {
    setShowSuccessModal(false);
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 border border-[#ADADAD40] rounded-2xl p-8 shadow-md bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Reset password
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <Label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-6 pr-12 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
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
                className="w-full px-4 py-6 pr-12 border border-gray-300 rounded-[12px] focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            // disabled={isLoading}
            className="w-full bg-primary hover:bg-orange-600 text-white font-medium py-6 px-4 rounded-[12px] transition-colors flex items-center justify-center gap-2"
          >
            {/* {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Resetting...
              </>
            ) : (
              "Reset password"
            )} */}
            Reset password
          </Button>
        </form>
      </div>

      {showSuccessModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-[2px]">
          <div className="w-full max-w-[560px] rounded-[28px] bg-[#F9F9F9] px-7 py-10 shadow-2xl sm:px-11 sm:py-12">
            <div className="mb-8 flex justify-center">
              <div className="flex h-[86px] w-[86px] items-center justify-center rounded-full bg-[#DEE4F3]">
                <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#C5D2F4]">
                  <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#11389D] text-white">
                    <CheckCheck className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>

            <h2 className="mb-8 text-center text-3xl font-semibold leading-tight text-[#202020] sm:text-[42px]">
              Password Changed
              <br />
              Successfully
            </h2>

            <button
              type="button"
              onClick={handleDone}
              className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[#11389D] text-lg font-semibold text-white transition-colors hover:bg-[#0E3188]"
            >
              Done
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
