"use client";

import { cn } from "@/lib/utils";
import { useMobileNav } from "@/shared/MobileNavContext";
import {
  BookOpen,
  Calculator,
  Home,
  ShoppingCart,
  User,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const { isMobileNavOpen, closeMobileNav } = useMobileNav();

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
      <aside className="hidden md:flex md:w-64 md:flex-col">
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
          "fixed left-0 top-[104px] z-[60] h-[calc(100dvh-104px)] w-[280px] bg-white p-4 shadow-2xl transition-transform duration-300 ease-out md:hidden",
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Mobile navigation"
      >
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={`mobile-${item.href}`}
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
    </>
  );
}
