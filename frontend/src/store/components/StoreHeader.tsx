import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

interface StoreHeaderProps {
  /**
   * If true, hides the cart icon (useful for checkout pages)
   */
  hideCart?: boolean;
  /**
   * If true, hides the user/login icon (useful for login/signup pages)
   */
  hideUser?: boolean;
  /**
   * If true, shows a minimal header with just the logo
   */
  minimal?: boolean;
}

const StoreHeader: React.FC<StoreHeaderProps> = ({
  hideCart = false,
  hideUser = false,
  minimal = false,
}) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <section
      className="pt-[40px] pb-[0]"
      style={{ backgroundColor: "rgba(240, 240, 240, 0.75)" }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center"
        >
          {/* Left spacer for balance — desktop only so the logo can sit
              flush-left on mobile. */}
          <div className="hidden md:block flex-1"></div>

          {/* Header title. Centered on desktop (between spacers),
              left-aligned and smaller on mobile. */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="font-bold balm-logo hover:opacity-80 transition-opacity text-[18px] md:text-[56px]"
              style={{
                color: "#d0d0d0",
                textShadow:
                  "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
              }}
            >
              BALM PRODUCTS AND SERVICES
            </Link>
          </div>

          {/* User Avatar and Cart - Right Side */}
          <div className="flex-1 flex items-center justify-end gap-2">
            {!minimal && !hideUser && isAuthenticated && (
              <>
                {/* Cart Icon — smaller on mobile. */}
                {!hideCart && getTotalItems() > 0 && (
                  <button
                    onClick={() => navigate("/checkout")}
                    className="relative flex items-center justify-center w-7 h-7 md:w-10 md:h-10 rounded-full transition-colors cursor-pointer"
                    style={{
                      backgroundColor: "#f0f0f0",
                      boxShadow:
                        "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                    }}
                  >
                    <ShoppingCart
                      className="h-3.5 w-3.5 md:h-5 md:w-5"
                      style={{ color: "rgb(168, 168, 168)" }}
                    />
                    {getTotalItems() > 0 && (
                      <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[9px] md:text-xs font-bold rounded-full h-3.5 w-3.5 md:h-5 md:w-5 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    )}
                  </button>
                )}

                {/* User Avatar — smaller on mobile. */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative cursor-pointer">
                      <Avatar
                        className="h-7 w-7 md:h-10 md:w-10"
                        style={{
                          boxShadow:
                            "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                        }}
                      >
                        {user?.image ? (
                          <AvatarImage
                            src={user.image}
                            alt={user.name || user.email}
                            className="object-cover"
                          />
                        ) : null}
                        <AvatarFallback
                          className="text-[11px] md:text-[14px]"
                          style={{
                            backgroundColor: "#f0f0f0",
                            color: "rgb(168, 168, 168)",
                            fontWeight: 500,
                          }}
                        >
                          {user?.name
                            ? user.name.charAt(0).toUpperCase()
                            : user?.email
                            ? user.email.charAt(0).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56"
                    style={{ fontFamily: '"Geist Mono", monospace' }}
                  >
                    <DropdownMenuLabel
                      style={{ fontFamily: '"Geist Mono", monospace' }}
                    >
                      {isAuthenticated && user ? (
                        <div>
                          <p
                            className="font-medium text-sm"
                            style={{ fontFamily: '"Geist Mono", monospace' }}
                          >
                            {user.name || "User"}
                          </p>
                          <p
                            className="text-gray-500"
                            style={{
                              fontFamily: '"Geist Mono", monospace',
                              fontSize: "14px",
                              fontWeight: 300,
                            }}
                          >
                            {user.email}
                          </p>
                        </div>
                      ) : (
                        "My Account"
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      style={{ fontFamily: '"Geist Mono", monospace' }}
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* Cart Only - Right Side (When not authenticated) — smaller on mobile. */}
            {!minimal &&
              !hideCart &&
              getTotalItems() > 0 &&
              !isAuthenticated && (
                <button
                  onClick={() => navigate("/checkout")}
                  className="relative flex items-center justify-center w-7 h-7 md:w-10 md:h-10 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: "#f0f0f0",
                    boxShadow:
                      "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                  }}
                >
                  <ShoppingCart
                    className="h-3.5 w-3.5 md:h-5 md:w-5"
                    style={{ color: "rgb(168, 168, 168)" }}
                  />
                  {getTotalItems() > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[9px] md:text-xs font-bold rounded-full h-3.5 w-3.5 md:h-5 md:w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StoreHeader;
