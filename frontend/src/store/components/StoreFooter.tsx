import { Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Same trick as StoreHeader — radix only loads after the user signs in.
const UserMenu = lazy(() => import("./UserMenu"));

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
      className="mt-auto"
      style={{
        backgroundColor: "rgba(240, 240, 240, 1)",
        paddingTop: "52px",
        paddingBottom: "2px",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between relative">
          {/* Left side spacer for balance */}
          <div className="w-10 h-10 md:hidden"></div>

          {/* Center - footer links */}
          <div className="flex-1 flex flex-col items-center gap-1">
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
                <Suspense fallback={null}>
                  <UserMenu
                    user={user}
                    onLogout={handleLogout}
                    align="end"
                    side="top"
                    contentClassName="w-56 mb-2"
                    avatarSizeClass="h-10 w-10"
                    fallbackTextSizeClass="text-base"
                    triggerButtonClassName="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors cursor-pointer"
                    triggerButtonStyle={{
                      backgroundColor: "#f0f0f0",
                      boxShadow:
                        "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                    }}
                  />
                </Suspense>
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
