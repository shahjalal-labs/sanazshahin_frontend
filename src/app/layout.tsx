import type { Metadata } from "next";
import "./globals.css";
import logo from "@/assets/tomatowlogo.png";
// import logo from "@/assets/Logo.png";

import { AuthSessionProvider } from "@/components/providers/AuthSessionProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import { MobileNavProvider } from "@/shared/MobileNavContext";
import { Toaster } from "sonner";
// import logo from "@/assets/home/kkk-logo.png";

export const metadata: Metadata = {
  title: "Tomatoes with lemon club",
  description: "A delicious and healthy recipe for tomatoes with lemon",
  icons: {
    icon: logo.src,
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
          <AuthSessionProvider>
            <MobileNavProvider>
              {/* <Header /> */}
              <div className="">{children}</div>
            </MobileNavProvider>
          </AuthSessionProvider>
        </ReduxProvider>
        <Toaster />

        {/* <Footer /> */}
      </body>
    </html>
  );
}
