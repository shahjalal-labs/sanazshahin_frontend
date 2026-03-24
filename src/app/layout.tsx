import type { Metadata } from "next";
import "./globals.css";
// import logo from "@/assets/logo.svg"
// import logo from "@/assets/Logo.png";

import ReduxProvider from "@/redux/ReduxProvider";
import { MobileNavProvider } from "@/shared/MobileNavContext";
import { Toaster } from "sonner";
// import logo from "@/assets/home/kkk-logo.png";

export const metadata: Metadata = {
  title: "sanazShahin frontend",
  description: "A modern frontend for AI Meal generation",
  icons: {
    // icon: logo.src,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReduxProvider>
          <MobileNavProvider>
            {/* <Header /> */}
            <div className="">{children}</div>
          </MobileNavProvider>
        </ReduxProvider>
        <Toaster />

        {/* <Footer /> */}
      </body>
    </html>
  );
}
