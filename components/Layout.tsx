"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Linkedin, Facebook, Instagram, X, Home } from "lucide-react";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { Grid } from "./Grid";

function getCategoryTitle(pathname: string): string {
  const parts = pathname.split("/");
  if (parts.length > 2) {
    return parts[2]
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  } else if (parts.length > 1) {
    return parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
  }
  return "";
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isNewProjectPage = pathname === "/services/new-project";

  const isActive = (path: string) => pathname === path;
  const getFontWeight = (path: string) =>
    isActive(path) ? "font-semibold" : "font-normal";

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Removed handleClickOutside from dependencies

  const menuItems = [
    { title: "Home", path: "/" },
    {
      title: "Media",
      path: "",
      subItems: [
        { title: "News feed", path: "/media/newsfeed" },
        { title: "Projects", path: "/media/projects" },
        { title: "Publications", path: "/media/publications" },
      ],
    },
    {
      title: "Services",
      path: " ",
      subItems: [
        { title: "New Project", path: "/services/new-project" },
        { title: "Portfolio", path: "/services/portfolio" },
      ],
    },
    { title: "About", path: "/about" },
    { title: "Login", path: "/login" },
  ];

  const isMenuPage = menuItems.some(
    (item) =>
      item.path === pathname ||
      item.subItems?.some((subItem) => subItem.path === pathname)
  );
  const showHomeIcon = isMenuPage && pathname !== "/";

  return (
    <div className="relative min-h-screen bg-white">
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto px-12 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Logo />
            <span className="text-xl font-extralight tracking-wide pt-0.5">
              Architecture Simple<span className="text-yellow-400">.</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-14 ">
              {/* {(isHomePage || (!isMenuPage && pathname !== "/dashboard")) && pathname !== "/login" && (
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
              )} */}
             
              {isHomePage && (
                <div className="text-right">
                  <h2 className="text-lg">Golden Gate Bridge</h2>
                  <p className="text-sm font-light">
                    World Project . Press to Read More
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-2">
                {pathname !== "/login" && (
                  <h1 className="text-sm font-light">
                    {getCategoryTitle(pathname)}
                  </h1>
                )}
                {(showHomeIcon || pathname === "/login") && (
                  <Link href="/">
                    <Home className="w-4 h-4 text-gray-500" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main
        className={`${
          isHomePage ? "h-[calc(100vh-4rem)]" : "pb-32 overflow-y-auto"
        }`}
      >
        {children}
      </main>

      {/* Oval Thumbprint Menu Trigger */}
      {pathname !== "/login" && !isNewProjectPage && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-20 h-28 bg-white rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            aria-label="Open menu"
          >
            <svg
              viewBox="0 0 100 140"
              className="w-20 h-28 fill-none"
              strokeWidth="1.5"
            >
              <text
                x="50"
                y="70"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-gray-400 text-[12px] font-light tracking-[0.2em]"
              >
                MENU
              </text>
            </svg>
          </button>
        </div>
      )}

      {/* Slide-up Menu */}
      <AnimatePresence>
        {isMenuOpen && !isNewProjectPage && (
          <motion.div
            ref={menuRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-none shadow-lg z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="relative pt-12 pb-8 px-8">
              {/* Close button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 p-2"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>

              {/* Navigation Links */}
              <nav className="space-y-6">
                {menuItems.map((item) => (
                  <div key={item.title}>
                    <Link
                      href={item.path}
                      className={`block text-lg ${getFontWeight(
                        item.path
                      )} hover:text-gray-600 transition-colors`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                    {item.subItems && (
                      <div className="mt-2 ml-4 space-y-2">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.title}
                            href={subItem.path}
                            className={`block text-sm ${getFontWeight(
                              subItem.path
                            )} text-gray-500 hover:text-gray-700`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Contact Information */}
              <div className="text-center text-sm text-gray-600 space-y-2 mb-6">
                <p className="text-sm font-light text-gray-500">
                  Keep it Simple.
                </p>
              </div>

              {/* Social Media Icons */}
              <div className="flex justify-center space-x-6">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Linkedin className="w-6 h-6" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Facebook className="w-6 h-6" />
                </Link>
                <Link
                  href="https://www.instagram.com/architecturesimple"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Instagram className="w-6 h-6" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </Link>
              </div>

              {/* Keep it Simple tagline */}
              <div className="text-center mt-6">
                <p className="text-sm font-light text-gray-500">
                  Architecture Simple LLC
                </p>
              </div>
              <div className="text-center mt-4 space-x-4">
                
                <div className="block md:hidden">
                  <Link
                  href="/"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Mobile
                </Link>
                <Link
                  href="/"
                  className="text-sm ml-2 text-gray-500 hover:text-gray-700"
                >
                  Desktop
                </Link>
                </div>
                <Link
                  href="/terms"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Privacy Policy 
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Grid />
    </div>
  );
}
