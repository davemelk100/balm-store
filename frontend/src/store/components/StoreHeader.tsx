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
   * If true, the header is sticky at the top
   */
  sticky?: boolean;
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
  sticky = true,
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
      className={`${sticky ? "sticky top-0 z-50" : ""} pt-[10px] pb-[0]`}
      style={{ backgroundColor: "rgba(240, 240, 240, 0.75)" }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center relative"
        >
          {/* Centered Logo - All Viewports */}
          <div className="mb-2">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img
                src="/img/logos/balm-varsity.svg"
                alt="BALM Varsity"
                className="w-[32px] h-auto"
              />
            </Link>
          </div>

          {/* User Avatar and Cart - Top Right (All Viewports) */}
          {!minimal && !hideUser && isAuthenticated && (
            <div className="absolute top-0 right-0 flex items-center gap-2">
              {/* Cart Icon */}
              {!hideCart && getTotalItems() > 0 && (
                <button
                  onClick={() => navigate("/checkout")}
                  className="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: "#f0f0f0",
                    boxShadow:
                      "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                  }}
                >
                  <ShoppingCart
                    className="h-5 w-5"
                    style={{ color: "rgb(168, 168, 168)" }}
                  />
                  {getTotalItems() > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              )}

              {/* User Avatar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors cursor-pointer"
                    style={{
                      backgroundColor: "#f0f0f0",
                      boxShadow:
                        "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                    }}
                  >
                    <Avatar className="h-10 w-10">
                      {user?.image ? (
                        <AvatarImage
                          src={user.image}
                          alt={user.name || user.email}
                          className="object-cover"
                        />
                      ) : null}
                      <AvatarFallback
                        style={{
                          backgroundColor: "#f0f0f0",
                          boxShadow:
                            "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                        }}
                      >
                        <img
                          src="/img/products/avatar.png"
                          alt="User avatar"
                          className="h-[75%] w-auto object-cover rounded-full"
                        />
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
            </div>
          )}

          {/* Cart Only - Top Right (When not authenticated) */}
          {!minimal && !hideCart && getTotalItems() > 0 && !isAuthenticated && (
            <div className="absolute top-0 right-0">
              <button
                onClick={() => navigate("/checkout")}
                className="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors cursor-pointer"
                style={{
                  backgroundColor: "#f0f0f0",
                  boxShadow:
                    "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                }}
              >
                <ShoppingCart
                  className="h-5 w-5"
                  style={{ color: "rgb(168, 168, 168)" }}
                />
                {getTotalItems() > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default StoreHeader;
