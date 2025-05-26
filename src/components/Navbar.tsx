"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Briefcase,
  List,
  HelpCircle,
  LogIn,
  UserPlus,
  LayoutDashboard,
  ClipboardList,
  User,
  LogOut,
  Users,
  Menu,
  X,
  ChevronDown,
  Bell,
  Settings,
} from "lucide-react";

// Navigation items configuration
const mainNavItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Browse Jobs", path: "/jobs", icon: Search },
  { name: "Categories", path: "/categories", icon: List },
  { name: "How It Works", path: "/how-it-works", icon: HelpCircle },
];

const workerNavItems = [
  { name: "Dashboard", path: "/worker/dashboard", icon: LayoutDashboard },
  { name: "Find Jobs", path: "/worker/jobs", icon: Search },
  { name: "Applications", path: "/worker/applications", icon: ClipboardList },
];

const recruiterNavItems = [
  { name: "Dashboard", path: "/recruiter/dashboard", icon: LayoutDashboard },
  { name: "Manage Jobs", path: "/recruiter/jobs", icon: Briefcase },
  { name: "Candidates", path: "/recruiter/candidates", icon: Users },
];

// NavLink Component
interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const NavLink = ({
  href,
  icon: Icon,
  children,
  isActive,
  onClick,
  className = "",
}: NavLinkProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
        ${
          isActive
            ? "bg-blue-50 text-slate-600 border border-blue-200"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
        }
        ${className}
      `}
    >
      <Icon
        size={18}
        className={`transition-colors ${
          isActive ? "text-orange-400" : "text-black group-hover:text-slate-600"
        }`}
      />
      <span className="truncate">{children}</span>
    </Link>
  );
};

// User Menu Component
const UserMenu = ({ userType }: { userType: "worker" | "recruiter" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-400 rounded-full flex items-center justify-center">
          <User size={16} className="text-white" />
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
            <Link
              href={`/${userType}/profile`}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} />
              Profile
            </Link>
            <Link
              href={`/${userType}/settings`}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} />
              Settings
            </Link>
            <hr className="my-2" />
            <button
              onClick={() => {
                setIsOpen(false);
                // Handle logout
              }}
              className="flex items-center gap-3 px-4 py-2 text-sm text-orange-600 hover:bg-red-50 w-full text-left"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Main Navbar Component
export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine user type and navigation items
  const isWorker = pathname.startsWith("/worker");
  const isRecruiter = pathname.startsWith("/recruiter");
  const isAuthenticated = isWorker || isRecruiter;

  let navItems = mainNavItems;
  let userType: "worker" | "recruiter" | null = null;

  if (isWorker) {
    navItems = workerNavItems;
    userType = "worker";
  } else if (isRecruiter) {
    navItems = recruiterNavItems;
    userType = "recruiter";
  }

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav
        className={`
        fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b transition-all duration-300
        ${scrolled ? "border-gray-200 shadow-sm" : "border-transparent"}
      `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-orange-400 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-400 rounded-lg flex items-center justify-center">
                <Briefcase size={18} className="text-white" />
              </div>
              JobConnect
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  href={item.path}
                  icon={item.icon}
                  isActive={pathname === item.path}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                    <Bell size={20} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                  <UserMenu userType={userType!} />
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <NavLink href="/login" icon={LogIn} className="!px-3 !py-2">
                    Login
                  </NavLink>
                  <NavLink
                    href="/signup"
                    icon={UserPlus}
                    className="!px-4 !py-2 !bg-slate-400 !text-white hover:!bg-slate-700 !border-orange-400"
                  >
                    Sign Up
                  </NavLink>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
          lg:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg
          transition-all duration-300 overflow-hidden
          ${mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
        `}
        >
          <div className="p-4 space-y-2">
            {/* Mobile Navigation Items */}
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                href={item.path}
                icon={item.icon}
                isActive={pathname === item.path}
                onClick={closeMobileMenu}
                className="!justify-start"
              >
                {item.name}
              </NavLink>
            ))}

            {/* Mobile Auth Section */}
            {!isAuthenticated && (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <NavLink href="/login" icon={LogIn} onClick={closeMobileMenu}>
                  Login
                </NavLink>
                <NavLink
                  href="/signup"
                  icon={UserPlus}
                  onClick={closeMobileMenu}
                  className="!bg-orange-400 !text-white hover:!bg-blue-700"
                >
                  Sign Up
                </NavLink>
              </div>
            )}

            {/* Mobile User Section */}
            {isAuthenticated && (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <NavLink
                  href={`/${userType}/profile`}
                  icon={User}
                  onClick={closeMobileMenu}
                >
                  Profile
                </NavLink>
                <NavLink
                  href={`/${userType}/settings`}
                  icon={Settings}
                  onClick={closeMobileMenu}
                >
                  Settings
                </NavLink>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    // Handle logout
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16" />
    </>
  );
};
