"use client";

import { Button } from "@/components/ui/button";
import { useUpdateProfileMutation } from "@/redux/api/userApi";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

const professions = [
  "Student",
  "Teacher",
  "Retired",
  "Office worker",
  "Factory",
  "Business Owner",
  "Freelancer",
  "Lawyer",
  "Driver",
  "Farmer",
];

export default function ProfileSetupPage() {
  const [selectedProfession, setSelectedProfession] = useState("Student");

  // RTK Query mutation hook
  const [updateProfileSetupFn, { isLoading }] = useUpdateProfileMutation();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // ✅ correct way to append FormData
      const formData = new FormData();
      formData.append("proffesion", selectedProfession);

      // call API
      const response = await updateProfileSetupFn(formData).unwrap();

      if (response?.success) {
        toast.success("Proile setup successfully");
        router.push("/");
      }

      // optional: toast / success message
      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Profile setup faild")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 ">
      <div className="max-w-[950px] w-full space-y-8 border border-[#ADADAD40] rounded-2xl p-8 shadow-sm ">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-12">
            Profile set up
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {professions.map((profession) => (
              <button
                key={profession}
                type="button"
                onClick={() => setSelectedProfession(profession)}
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center min-h-[60px] ${
                  selectedProfession === profession
                    ? "bg-primary border-primary text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                <span className="font-medium text-center">{profession}</span>
                {selectedProfession === profession && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <Check size={16} className="text-primary" />
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-white font-medium py-6 px-8 transition-colors rounded-[40px] flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Saving...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
