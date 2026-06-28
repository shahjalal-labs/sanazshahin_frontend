"use client";

import { cn } from "@/lib/utils";
import { useMobileNav } from "@/shared/MobileNavContext";
import Cookies from "js-cookie";
import {
  BookOpen,
  Calculator,
  Home,
  ShoppingCart,
  User,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

const navItems: NavItem[] = [
  {
    label: "Home",
    icon: <Home className="w-5 h-5" />,
    href: "/",
  },
  {
    label: "Meal Plans",
    icon: <BookOpen className="w-5 h-5" />,
    href: "/meal-plans",
  },
  {
    label: "My Recipe Box",
    icon: <UtensilsCrossed className="w-5 h-5" />,
    href: "/recipe-box",
  },
  {
    label: "Grocery list",
    icon: <ShoppingCart className="w-5 h-5" />,
    href: "/grocery-list",
  },
  {
    label: "Protein Calculator",
    icon: <Calculator className="w-5 h-5" />,
    href: "/protein-calculator",
  },
  {
    label: "Profile",
    icon: <User className="w-5 h-5" />,
    href: "/profile",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobileNavOpen, closeMobileNav } = useMobileNav();

  const token = Cookies.get("accessToken") ?? Cookies.get("token");

  const handleLogout = async () => {
    Cookies.remove("accessToken");
    Cookies.remove("token");
    Cookies.remove("forgetToken");
    await signOut();
    closeMobileNav();
    router.push("/login");
  };

  useEffect(() => {
    closeMobileNav();
  }, [pathname, closeMobileNav]);

  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = "hidden";
      return;
    }

    document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileNavOpen]);

  return (
    <>
      <aside className="hidden md:flex md:w-64 md:flex-col pt-[104px]">
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 font-medium transition-colors",
                  isActive
                    ? "bg-[#02248C1A] text-primary"
                    : "text-slate-700 hover:bg-slate-200",
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-[55] bg-black/30 transition-opacity duration-300 md:hidden",
          isMobileNavOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeMobileNav}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-0 z-[60] flex flex-col h-[100dvh] w-full bg-white p-5 transition-transform duration-300 ease-out md:hidden",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between mb-2 pb-4">
          <Link href="/" className="flex-shrink-0" onClick={closeMobileNav}>
            <span className="font-viktor-script text-primary text-[26px] sm:text-[32px] leading-none select-none">
              Tomatoes With Lemon Club
            </span>
          </Link>
          <button
            onClick={closeMobileNav}
            className="p-1 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={`mobile-${item.href}`}
                href={item.href}
                className={cn(
                  "flex items-center justify-between py-4 text-[17px] font-semibold transition-colors border-b border-gray-100",
                  isActive
                    ? "text-primary"
                    : "text-[#0B3558] hover:text-primary",
                )}
                onClick={closeMobileNav}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {token && (
          <div className="mt-auto pt-6 pb-2">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full rounded-md border border-[#0B3558] bg-white px-4 py-3.5 text-base font-semibold text-[#0B3558] hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
