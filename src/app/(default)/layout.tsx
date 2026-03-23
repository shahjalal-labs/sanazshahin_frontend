"use client";
import Footer from "@/shared/Footer";
import Header from "@/shared/Navbar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="">
      <Header />

      <main style={{ minHeight: "calc(100vh - 360px)" }}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
