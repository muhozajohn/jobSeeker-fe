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
  User,
  LogOut,
  Users,
  Menu,
  X,
  ChevronDown,
  Bell,
  Settings,
  FileText,
  Building,
} from "lucide-react";

// Redux imports
import { useAppSelector, useAppDispatch } from "@/lib/hooks/hooks";
import { selectIsAuthenticated, selectUserRole, logoutUser } from "@/lib/redux/slices/auth/auth.slice";

// Navigation items configuration
const publicNavItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Browse Jobs", path: "/jobs", icon: Search },
  { name: "Categories", path: "/categories", icon: List },
  { name: "How It Works", path: "/how-it-works", icon: HelpCircle },
];

const workerNavItems = [
  ...publicNavItems,
  { name: "Dashboard", path: "/dashboard/worker", icon: LayoutDashboard },
];

const recruiterNavItems = [
  { name: "Dashboard", path: "/dashboard/recruiter", icon: LayoutDashboard },
  { name: "Workers", path: "/workers", icon: Users },
];

const adminNavItems = [
  { name: "Dashboard", path: "/dashboard/admin", icon: LayoutDashboard },

];

// NavLink Component
interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  iconStyle?: string;
}

const NavLink = ({
  href,
  icon: Icon,
  children,
  isActive,
  iconStyle = "",
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
        className={` ${iconStyle} transition-colors ${
          isActive ? "text-orange-400" : "text-black group-hover:text-slate-600"
        }`}
      />
      <span className="truncate">{children}</span>
    </Link>
  );
};

// User Menu Component
interface UserMenuProps {
  userRole: string;
  onLogout: () => void;
}

const UserMenu = ({ userRole, onLogout }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getUserInitials = () => {
    // You can extend this to get actual user name from Redux state
    return userRole.charAt(0).toUpperCase();
  };

  const getProfilePath = () => {
    switch (userRole) {
      case 'ADMIN':
        return '/profile';
      case 'RECRUITER':
        return '/profile';
      case 'WORKER':
        return '/profile';
      default:
        return '/profile';
    }
  };

  const getSettingsPath = () => {
    switch (userRole) {
      case 'ADMIN':
        return '/dashboard/admin';
      case 'RECRUITER':
        return '/dashboard/recruiter';
      case 'WORKER':
        return '/dashboard/worker';
      default:
        return '/';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-400 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">{getUserInitials()}</span>
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-900 capitalize">{userRole.toLowerCase()}</p>
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
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 capitalize">
                {userRole.toLowerCase()} Account
              </p>
            </div>
            
            <Link
              href={getProfilePath()}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} />
              Profile
            </Link>
            
            <Link
              href={getSettingsPath()}
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
                onLogout();
              }}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
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
  
  // Redux state
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const userRole = useAppSelector(selectUserRole);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine navigation items based on user role
  const getNavigationItems = () => {
    if (!isAuthenticated) return publicNavItems;
    
    switch (userRole) {
      case 'ADMIN':
        return adminNavItems;
      case 'RECRUITER':
        return recruiterNavItems;
      case 'WORKER':
        return workerNavItems;
      default:
        return publicNavItems;
    }
  };

  const navItems = getNavigationItems();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

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
              href={isAuthenticated ? `/dashboard/${userRole?.toLowerCase()}` : "/"}
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
                  isActive={pathname === item.path || pathname?.startsWith(item.path + '/')}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  {/* <button className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                    <Bell size={20} />
                    {getNotificationCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getNotificationCount()}
                      </span>
                    )}
                  </button> */}
                  
                  {/* User Menu */}
                  <UserMenu userRole={userRole!} onLogout={handleLogout} />
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <NavLink href="/auth/login" icon={LogIn} className="!px-3 !py-2">
                    Login
                  </NavLink>
                  <NavLink
                    iconStyle="!text-white"
                    href="/auth/register"
                    icon={UserPlus}
                    className="!px-4 !py-3 !bg-orange-400 !hover:bg-orange-500 !text-white !border-orange-400"
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
            {/* Mobile User Info */}
            {isAuthenticated && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {userRole?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {userRole?.toLowerCase()} Account
                    </p>
                    <p className="text-sm text-gray-500">Logged in</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Navigation Items */}
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                href={item.path}
                icon={item.icon}
                isActive={pathname === item.path || pathname?.startsWith(item.path + '/')}
                onClick={closeMobileMenu}
                className="!justify-start"
              >
                {item.name}
              </NavLink>
            ))}

            {/* Mobile Auth Section */}
            {!isAuthenticated && (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <NavLink href="/auth/login" icon={LogIn} onClick={closeMobileMenu}>
                  Login
                </NavLink>
                <NavLink
                  href="/auth/register"
                  icon={UserPlus}
                  onClick={closeMobileMenu}
                  className="!bg-orange-400 !text-white hover:!bg-orange-500"
                >
                  Sign Up
                </NavLink>
              </div>
            )}

            {/* Mobile User Section */}
            {isAuthenticated && (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <NavLink
                  href={`/profile`}
                  icon={User}
                  onClick={closeMobileMenu}
                >
                  Profile
                </NavLink>
                <NavLink
                  href={`/dashboard/${userRole?.toLowerCase()}`}
                  icon={Settings}
                  onClick={closeMobileMenu}
                >
                  Settings
                </NavLink>
                {/* <div className="flex items-center gap-3 px-4 py-2">
                  <Bell size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {getNotificationCount()} notifications
                  </span>
                </div> */}
                <button
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
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