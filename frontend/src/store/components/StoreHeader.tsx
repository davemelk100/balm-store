import React, { Suspense, lazy, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, ShoppingCart, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { storeNavItems, isStoreNavActive } from "./StoreNav";

// Lazy-loaded — radix dropdown + avatar are ~30KB gzipped and only
// matter once the user logs in. Anonymous visitors never download them.
const UserMenu = lazy(() => import("./UserMenu"));

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
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();

  // Mobile-only nav menu state — desktop uses inline links in StoreNav.
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <section
      className="pt-[40px] pb-6 md:pb-0"
      style={{ backgroundColor: "rgba(240, 240, 240, 0.75)" }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 md:gap-0"
        >
          {/* Left column — mobile menu button on small screens, empty
              spacer on desktop. Either way, flex-1 balances the
              right-side actions so the title stays centered. */}
          <div className="flex-1 flex items-center justify-start">
            {!minimal && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-full cursor-pointer"
                style={{
                  backgroundColor: "#f0f0f0",
                  boxShadow:
                    "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                  color: "rgb(100, 100, 100)",
                }}
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          {/* Header title — centered on all viewports. */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="font-bold balm-logo hover:opacity-80 transition-opacity flex flex-col items-center leading-none"
              style={{
                color: "#d0d0d0",
                fontWeight: 700,
                textShadow:
                  "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
              }}
            >
              <span className="balm-header-title text-[56px] md:text-[56px]">
                BALM
              </span>
              <span
                className="balm-header-title text-[24px] md:text-[22px] mt-1"
                style={{ letterSpacing: "2px" }}
              >
                products and services
              </span>
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

                {/* User Avatar — lazy radix bundle loads on first authed render. */}
                <Suspense fallback={null}>
                  <UserMenu user={user} onLogout={handleLogout} />
                </Suspense>
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

        {/* Mobile dropdown panel — anchored under the header bar. */}
        {!minimal && mobileMenuOpen && (
          <div
            className="md:hidden mt-3 flex flex-col items-start gap-2"
            style={{ fontFamily: '"Geist Mono", monospace' }}
          >
            {storeNavItems.map((item) => {
              const active = isStoreNavActive(location.pathname, item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-2 py-1 bg-transparent border-b ${
                    active
                      ? "border-[rgb(80,80,80)]"
                      : "border-transparent hover:border-[rgb(80,80,80)]"
                  }`}
                  style={{
                    fontSize: "16px",
                    fontWeight: active ? 600 : 300,
                    color: active
                      ? "rgb(20, 20, 20)"
                      : "rgb(100, 100, 100)",
                    textDecoration: "none",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default StoreHeader;
