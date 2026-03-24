"use client";
import Header from "@/shared/Header";
import Sidebar from "@/shared/Sidebar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
   <>
     <Header />
    <div className="container mx-auto flex gap-6 px-4 pt-6 md:gap-10  md:pt-10">
      <Sidebar />

      <main
        className="flex-1 overflow-auto"
        style={{ minHeight: "calc(100vh - 360px)" }}
      >
        {children}
      </main>
      {/* <Footer /> */}
    </div>
   </>
  );
};

export default Layout;
