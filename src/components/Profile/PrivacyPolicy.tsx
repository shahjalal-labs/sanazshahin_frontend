"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function PrivacyPolicy() {
  const router = useRouter();

  return (
    <section className="w-full pt-[104px]">
      <div className="mx-auto w-full max-w-[1180px] px-4 sm:px-6">
        <div className="relative mb-8 flex items-center justify-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="absolute left-0 inline-flex h-9 w-9 items-center justify-center rounded-full text-[#5C6270] transition-colors hover:bg-[#F3F5F7]"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <h1 className="text-[22px] font-semibold text-[#1B1B1B] sm:text-[24px]">
            Privacy Policy
          </h1>
        </div>

        <div className="max-w-[920px]">
          <h2 className="text-[22px] font-semibold text-[#1B1B1B] sm:text-[26px]">
            Privacy Policy
          </h2>
          <p className="mt-3 text-[15px] leading-[1.7] text-[#6B7280] sm:text-[16px]">
            Your privacy is important to us. This policy outlines how we
            collect, use, and protect your information when using yogawithjules
            app.
          </p>

          <h3 className="mt-8 text-[18px] font-semibold text-[#1B1B1B] sm:text-[20px]">
            How We Use Your Information
          </h3>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-[15px] leading-[1.7] text-[#6B7280] sm:text-[16px]">
            <li>
              We collect your details information to give you better service
              from our end. We believe, customer satisfaction our top priority.
            </li>
            <li>
              When you make a payment, we collect payment details such as Stripe
              information securely.
            </li>
            <li>
              We may collect your name, email, and phone number for account
              creation and communication.
            </li>
          </ol>

          <h3 className="mt-8 text-[18px] font-semibold text-[#1B1B1B] sm:text-[20px]">
            Contact Us
          </h3>
          <p className="mt-3 text-[15px] leading-[1.7] text-[#6B7280] sm:text-[16px]">
            If you have any questions about this Privacy Policy, please contact
            us at:
          </p>
          <p className="mt-1 text-[15px] leading-[1.7] text-[#6B7280] sm:text-[16px]">
            Email: support@sanazshahin.com
          </p>
        </div>
      </div>
    </section>
  );
}

export default PrivacyPolicy;
