import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = () => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigationItems = [
    { label: "Search Hotels", path: "/", icon: "Search" },
    { label: "My Bookings", path: "/bookings", icon: "Calendar" },
    { label: "Saved Hotels", path: "/saved", icon: "Heart" },
    { label: "Profile", path: "/profile", icon: "User" }
  ];

  const handleSearchClick = () => {
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-soft border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Hotel" className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-display font-bold gradient-text">
                  StayFinder
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Find Your Perfect Stay</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationItems.slice(0, 3).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/10 transition-colors duration-200"
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Search Button - Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSearchClick}
              icon="Search"
            >
              Search
            </Button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <ApperIcon name="User" className="w-4 h-4 text-white" />
                </div>
                <ApperIcon name="ChevronDown" className="w-4 h-4 text-gray-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-strong border border-gray-100 py-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <ApperIcon name="User" className="w-4 h-4" />
                    Profile Settings
                  </Link>
                  <Link
                    to="/bookings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <ApperIcon name="Calendar" className="w-4 h-4" />
                    My Bookings
                  </Link>
                  <Link
                    to="/saved"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <ApperIcon name="Heart" className="w-4 h-4" />
                    Saved Hotels
                  </Link>
                  <hr className="my-2 border-gray-100" />
                  <button
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <ApperIcon name="Settings" className="w-4 h-4" />
                    Settings
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ApperIcon 
              name={isMobileMenuOpen ? "X" : "Menu"} 
              className="w-6 h-6 text-gray-700" 
            />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <ApperIcon name={item.icon} className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            <hr className="my-3 border-gray-200" />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full text-left"
            >
              <ApperIcon name="Settings" className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;