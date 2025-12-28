import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";

interface StoreFooterProps {
  onPrivacyClick: () => void;
  onTermsClick: () => void;
  hideUser?: boolean; // Optional prop to hide user avatar
}

export const StoreFooter = ({
  onPrivacyClick,
  onTermsClick,
  hideUser = false,
}: StoreFooterProps) => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        backgroundColor: "rgba(240, 240, 240, 1)",
        paddingTop: "2px",
        paddingBottom: "2px",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between relative">
          {/* Left side spacer for balance */}
          <div className="w-10 h-10 md:hidden"></div>

          {/* Center - BALM logo and links */}
          <div className="flex-1 flex flex-col items-center gap-1">
            <span
              className="font-bold tracking-tight balm-logo"
              style={{
                color: "#d0d0d0",
                fontSize: "24px",
                textShadow:
                  "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
              }}
            >
              BALM
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={onPrivacyClick}
                className="text-xs text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Privacy
              </button>
              <span className="text-xs text-gray-400 px-2">|</span>
              <button
                onClick={onTermsClick}
                className="text-xs text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                TOS
              </button>
            </div>
          </div>

          {/* Right side - User Avatar (Mobile only) */}
          {!hideUser && (
            <div className="md:hidden">
              {isAuthenticated ? (
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
                          <img
                            src={user.image}
                            alt={user.name || user.email}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <AvatarFallback
                            style={{
                              backgroundColor: "#f0f0f0",
                              boxShadow:
                                "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                            }}
                          >
                            {user?.name ? (
                              user.name.charAt(0).toUpperCase()
                            ) : (
                              <User
                                className="h-5 w-5"
                                style={{ color: "rgb(168, 168, 168)" }}
                              />
                            )}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    side="top"
                    className="w-56 mb-2"
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
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: "#f0f0f0",
                    boxShadow:
                      "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                  }}
                >
                  <User
                    className="h-5 w-5"
                    style={{ color: "rgb(168, 168, 168)" }}
                  />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};
