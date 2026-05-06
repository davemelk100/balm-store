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

          {/* Logo — "BALM" wordmark. Centered on desktop (between spacers),
              left-aligned and smaller on mobile. */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="font-bold tracking-tight balm-logo hover:opacity-80 transition-opacity text-[30px] md:text-[56px]"
              style={{
                color: "#d0d0d0",
                textShadow:
                  "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
              }}
            >
              BALM
            </Link>
          </div>

          {/* User Avatar and Cart - Right Side */}
          <div className="flex-1 flex items-center justify-end gap-2">
            {/* Bandcamp + Spotify links — far right (desktop only;
                mobile renders these below the logo on their own row). */}
            <a
              href="https://balmsoothes.bandcamp.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="BALM on Bandcamp"
              className="relative hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-colors cursor-pointer"
              style={{
                backgroundColor: "#f0f0f0",
                boxShadow:
                  "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                color: "rgb(168, 168, 168)",
              }}
            >
              <img
                src="/img/logos/bandcamp.svg"
                alt="Bandcamp"
                className="h-5 w-5"
              />
            </a>
            <a
              href="https://open.spotify.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="BALM on Spotify (placeholder)"
              className="relative hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-colors cursor-pointer"
              style={{
                backgroundColor: "#f0f0f0",
                boxShadow:
                  "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                color: "rgb(168, 168, 168)",
              }}
            >
              <img
                src="/img/logos/spotify.svg"
                alt="Spotify"
                className="h-5 w-5"
              />
            </a>
            {!minimal && !hideUser && isAuthenticated && (
              <>
                {/* Cart Icon — desktop only; mobile renders below the logo. */}
                {!hideCart && getTotalItems() > 0 && (
                  <button
                    onClick={() => navigate("/checkout")}
                    className="relative hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-colors cursor-pointer"
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

                {/* User Avatar — desktop only; mobile renders below the logo. */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative cursor-pointer hidden md:block">
                      <Avatar
                        className="h-10 w-10"
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
                          className="text-[14px]"
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

            {/* Cart Only - Right Side (When not authenticated) — desktop only. */}
            {!minimal &&
              !hideCart &&
              getTotalItems() > 0 &&
              !isAuthenticated && (
                <button
                  onClick={() => navigate("/checkout")}
                  className="relative hidden md:flex items-center justify-center w-10 h-10 rounded-full transition-colors cursor-pointer"
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
          </div>
        </motion.div>

        {/* Mobile-only: Bandcamp + Spotify + Cart + Avatar all on one row
            below the BALM logo, left-aligned to match the flush-left logo,
            all sized to match. */}
        <div className="flex md:hidden items-center justify-start gap-2 mt-2">
          <a
            href="https://balmsoothes.bandcamp.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="BALM on Bandcamp"
            className="relative flex items-center justify-center w-7 h-7 rounded-full transition-colors cursor-pointer"
            style={{
              backgroundColor: "#f0f0f0",
              boxShadow:
                "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
              color: "rgb(168, 168, 168)",
            }}
          >
            <img
              src="/img/logos/bandcamp.svg"
              alt="Bandcamp"
              className="h-3.5 w-3.5"
            />
          </a>
          <a
            href="https://open.spotify.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="BALM on Spotify (placeholder)"
            className="relative flex items-center justify-center w-7 h-7 rounded-full transition-colors cursor-pointer"
            style={{
              backgroundColor: "#f0f0f0",
              boxShadow:
                "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
              color: "rgb(168, 168, 168)",
            }}
          >
            <img
              src="/img/logos/spotify.svg"
              alt="Spotify"
              className="h-3.5 w-3.5"
            />
          </a>

          {/* Cart (mobile) — shown when there are items. */}
          {!minimal && !hideCart && getTotalItems() > 0 && (
            <button
              onClick={() => navigate("/checkout")}
              className="relative flex items-center justify-center w-7 h-7 rounded-full transition-colors cursor-pointer"
              style={{
                backgroundColor: "#f0f0f0",
                boxShadow:
                  "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
              }}
            >
              <ShoppingCart
                className="h-3.5 w-3.5"
                style={{ color: "rgb(168, 168, 168)" }}
              />
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[9px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            </button>
          )}

          {/* Avatar (mobile) — only when authenticated. */}
          {!minimal && !hideUser && isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative cursor-pointer">
                  <Avatar
                    className="h-7 w-7"
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
                      className="text-[11px]"
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
                  {user ? (
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
          )}
        </div>
      </div>
    </section>
  );
};

export default StoreHeader;
