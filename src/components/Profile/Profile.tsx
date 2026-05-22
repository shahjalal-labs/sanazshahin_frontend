"use client";

import {
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useGetMyProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/api/userApi";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

export default function Profile() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [changePasswordFn] = useChangePasswordMutation();
  const [deleteAccountFn] = useDeleteAccountMutation();

  const [updateProfileFn, { isLoading }] = useUpdateProfileMutation();
  const [updateDataForm, setUpdateDataForm] = useState({
    fullName: "",
    email: "",
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const [changePasswordForm, setChangePasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const hasAuthToken = Boolean(
    Cookies.get("accessToken") || Cookies.get("token"),
  );

  const router = useRouter();

  const { data: profileData } = useGetMyProfileQuery(undefined, {
    skip: !hasAuthToken,
  });
  const profile = profileData?.result;

  useEffect(() => {
    if (!profile) return;
    setUpdateDataForm((prev) => ({
      ...prev,
      fullName: prev.fullName || profile.fullName || "",
      email:
        prev.email && prev.email !== "info@example.com"
          ? prev.email
          : profile.email || "",
    }));
  }, [profile]);

  useEffect(() => {
    return () => {
      if (previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const openDeleteConfirm = () => {
    Swal.fire({
      icon: "question",
      iconColor: "#0B2E9C",
      title: "Are You Sure?",
      text: "Do you want to Delete Account?",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        popup: "sanaz-swal-popup",
        title: "sanaz-swal-title",
        htmlContainer: "sanaz-swal-html",
        actions: "sanaz-swal-actions",
        confirmButton: "sanaz-swal-confirm",
        cancelButton: "sanaz-swal-cancel",
        icon: "sanaz-swal-icon",
      },
      preConfirm: async () => {
        try {
          await deleteAccountFn(undefined).unwrap();
          Cookies.remove("accessToken");
          Cookies.remove("token");
          Cookies.remove("forgetToken");
          toast.success("Account deleted successfully");
          router.push("/login");
        } catch (err) {
          console.error(err);
          toast.error("Failed to delete account");
          throw err;
        }
      },
    });
  };

  const openLogoutConfirm = () => {
    Swal.fire({
      icon: "question",
      iconColor: "#0B2E9C",
      title: "Are You Sure?",
      text: "Do you want to log out ?",
      showCancelButton: true,
      confirmButtonText: "Log Out",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        popup: "sanaz-swal-popup",
        title: "sanaz-swal-title",
        htmlContainer: "sanaz-swal-html",
        actions: "sanaz-swal-actions",
        confirmButton: "sanaz-swal-confirm",
        cancelButton: "sanaz-swal-cancel",
        icon: "sanaz-swal-icon",
      },
    });
  };

  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("fullName", updateDataForm.fullName);
      formData.append("email", updateDataForm.email);

      if (selectedImageFile) {
        formData.append("profileImage", selectedImageFile);
      }

      await updateProfileFn(formData).unwrap();

      if (selectedImageFile) {
        toast.success("Profile and image updated successfully");
      } else {
        toast.success("Profile updated successfully");
      }

      setSelectedImageFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (!changePasswordForm.oldPassword || !changePasswordForm.newPassword) {
      toast.error("Please enter current and new password");
      return;
    }
    try {
      await changePasswordFn({
        oldPassword: changePasswordForm.oldPassword,
        newPassword: changePasswordForm.newPassword,
      }).unwrap();
      toast.success("Password changed successfully");

      // Clear password fields after successful change
      setChangePasswordForm({
        oldPassword: "",
        newPassword: "",
      });
    } catch (error: any) {
      toast.error("Failed to change password", error);
    }
  };

  return (
    <div className=" p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            {/* General Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">
                General Information
              </h2>

              <div className="flex flex-col gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Robert Rossi"
                    value={updateDataForm.fullName}
                    onChange={(e) =>
                      setUpdateDataForm({
                        ...updateDataForm,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-full border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    readOnly
                    type="email"
                    value={updateDataForm.email}
                    onChange={(e) =>
                      setUpdateDataForm({
                        ...updateDataForm,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-full border border-transparent bg-[#416FFA66] text-sm text-black placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>

                {/* Professional Bio */}
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Professional Bio
                  </label>
                  <textarea
                    placeholder="Write a brief description of your professional background and expertise..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                  />
                </div> */}

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleProfileUpdate}
                    disabled={isLoading}
                    className={`px-8 py-2.5 text-white text-sm font-semibold rounded-full transition-colors ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">
                Change Password
              </h2>

              <div className="flex flex-col gap-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={changePasswordForm.oldPassword}
                      placeholder="••••••"
                      onChange={(e) =>
                        setChangePasswordForm({
                          ...changePasswordForm,
                          oldPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 pr-12 rounded-full border border-gray-200 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showCurrentPassword ? <EyeOffIcon /> : <EyeOffIcon />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={changePasswordForm.newPassword}
                      placeholder="••••••"
                      onChange={(e) =>
                        setChangePasswordForm({
                          ...changePasswordForm,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 pr-12 rounded-full border border-gray-200 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      <EyeOffIcon />
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleChangePassword}
                    className="px-8 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-full transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 ring-2 ring-blue-100">
                    {previewImage || profile?.profileImage ? (
                      <Image
                        src={previewImage || profile?.profileImage}
                        alt={profile?.fullName || "User Avatar"}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-500">
                        NA
                      </div>
                    )}
                  </div>
                  {/* Edit icon badge */}
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-sm hover:bg-gray-50 transition"
                  >
                    <PencilIcon />
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (!file.type.startsWith("image/")) {
                        toast.error("Please select a valid image file");
                        return;
                      }

                      if (previewImage.startsWith("blob:")) {
                        URL.revokeObjectURL(previewImage);
                      }

                      const objectUrl = URL.createObjectURL(file);
                      setSelectedImageFile(file);
                      setPreviewImage(objectUrl);
                    }}
                  />
                </div>

                {/* Name & Email */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-900 truncate">
                    {updateDataForm.fullName || profileData?.fullName || "User"}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {updateDataForm.email || profileData?.email || ""}
                  </p>
                  {/* <span
                    className="mt-2 inline-flex items-center rounded-full px-6 py-1.5 text-[18px] font-semibold text-[#7A5B00]"
                    style={{
                      background:
                        "linear-gradient(180deg, #FFED72 0%, #F1CB08 50%)",
                      boxShadow:
                        "inset 0 2px 4px rgba(0,0,0,0.25), inset 0 -2px 4px rgba(0,0,0,0.25)",
                    }}
                  >
                    Premium Member
                  </span> */}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl px-5 py-4 shadow-sm border border-gray-100">
              <div className="grid grid-cols-3 divide-x divide-gray-100">
                <div className="flex flex-col items-center py-1">
                  <span className="text-xs text-gray-500 mb-1">Meals</span>
                  <span className="text-xl font-bold text-gray-900">12</span>
                </div>
                <div className="flex flex-col items-center py-1">
                  <span className="text-xs text-gray-500 mb-1">Grocery</span>
                  <span className="text-xl font-bold text-gray-900">9</span>
                </div>
                <div className="flex flex-col items-center py-1">
                  <span className="text-xs text-gray-500 mb-1">Favorites</span>
                  <span className="text-xl font-bold text-gray-900">21</span>
                </div>
              </div>
            </div>

            {/* Upgrade to Premium */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <SparkleIcon />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Upgrade to Premium
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Unlock AI-powered health insights
                  </p>
                </div>
              </div>

              <ul className="flex flex-col gap-2 mb-4">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircleIcon />
                  AI-driven personalized meal plan
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircleIcon />
                  Unlimited PDF recipe exports
                </li>
              </ul>

              <button className="w-full py-3 bg-primary text-white text-sm font-semibold rounded-full transition-colors">
                Upgrade Now
              </button>
            </div>

            {/* Account & Support */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Account &amp; Support
              </h3>

              <div className="flex flex-col">
                <SupportLink
                  icon={<BookmarkIcon />}
                  label="Save List"
                  path="/save-list"
                />
                <SupportLink
                  icon={<ShieldIcon />}
                  label="Privacy Policy"
                  path="/privacy-policy"
                />
                <SupportLink
                  icon={<BellIcon />}
                  label="Notifications"
                  path="/notifications"
                />

                <button
                  type="button"
                  onClick={openDeleteConfirm}
                  className="flex items-center gap-3 py-3.5 border-t border-gray-100 text-red-500 hover:text-red-600 transition-colors group"
                >
                  <TrashIcon />
                  <span className="text-sm font-medium flex-1 text-left">
                    Delete Account
                  </span>
                </button>

                <button
                  type="button"
                  onClick={openLogoutConfirm}
                  className="flex items-center gap-3 py-3.5 border-t border-gray-100 text-red-500 hover:text-red-600 transition-colors group"
                >
                  <LogoutIcon />
                  <span className="text-sm font-medium flex-1 text-left">
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Small reusable sub-components ── */

function SupportLink({
  icon,
  label,
  path,
}: {
  icon: React.ReactNode;
  label: string;
  path: string;
}) {
  return (
    <Link
      href={path}
      className="flex items-center gap-3 py-3.5 border-b border-gray-100 hover:bg-gray-50 rounded-lg px-1 transition-colors group"
    >
      <span className="text-gray-500">{icon}</span>
      <span className="text-sm text-gray-700 font-medium flex-1 text-left">
        {label}
      </span>
      <ChevronRightIcon />
    </Link>
  );
}

/* ── SVG Icon Components ── */

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6b7280"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#22c55e"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="#3b82f6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9ca3af"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
