"use client";

import { useMobileNav } from "@/shared/MobileNavContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Icon components (inline SVGs to avoid external dependencies)
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const BellIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export default function Header() {
  const [searchValue, setSearchValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { isMobileNavOpen, toggleMobileNav, closeMobileNav } = useMobileNav();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isMobileNavOpen) {
      return;
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        closeMobileNav();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [closeMobileNav, isMobileNavOpen]);

  const router = useRouter();

  const handleNotification = () => {
    router.push("/notification");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[72px] gap-4">
          {/* Logo */}
          <Link href={"/"}>
            <div className="flex-shrink-0">
              <span className="font-viktor-script text-primary text-[40px] leading-none select-none">
                Tomatoes With Lemon Club
              </span>
            </div>
          </Link>

          {/* Search Bar — hidden on mobile, visible on sm+ */}
          <div className="hidden sm:flex flex-1 max-w-md mx-auto">
            <div className="flex items-center w-full border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#1a237e]/30 transition-all">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for meal"
                className="flex-1 px-5 py-4 text-sm text-gray-600 placeholder-gray-400 outline-none bg-transparent"
              />
              <button
                className="bg-primary hover:bg-primary-dark transition-colors px-4 py-2.5 flex items-center justify-center text-white cursor-pointer rounded-xl mr-2"
                aria-label="Search"
              >
                <SearchIcon />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile search toggle */}
            <button
              className="sm:hidden p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileSearchOpen((v) => !v)}
              aria-label="Toggle search"
            >
              <SearchIcon />
            </button>

            {/* Bell icon with notification badge */}
            <button
              className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
              onClick={handleNotification}
            >
              <BellIcon />
              {/* Notification dot */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* User icon with dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={() => setDropdownOpen((v) => !v)}
                aria-label="User menu"
                aria-expanded={dropdownOpen}
              >
                <UserIcon />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-fade-in">
                  <Link href="/login">
                    {" "}
                    <button
                      className="w-full px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left font-medium"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Log in
                    </button>
                  </Link>
                  <div className="h-px bg-gray-100 mx-3" />
                  <Link href="/signup">
                    <button
                      className="w-full px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left font-medium"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={toggleMobileNav}
              aria-label={isMobileNavOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileNavOpen}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar — shown when toggled */}
      {mobileSearchOpen && (
        <div className="sm:hidden absolute left-0 right-0 top-full bg-white border-b border-gray-100 shadow-md">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center w-full border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-[#1a237e]/30 transition-all">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search for meal"
                autoFocus
                className="flex-1 px-4 py-2.5 text-sm text-gray-600 placeholder-gray-400 outline-none bg-transparent"
              />
              <button
                className="bg-primary hover:bg-primary-dark transition-colors px-4 py-2.5 flex items-center justify-center text-white"
                aria-label="Search"
              >
                <SearchIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
