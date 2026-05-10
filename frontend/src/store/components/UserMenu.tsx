import { User } from "lucide-react";
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

// Authed-user avatar + dropdown. Lifted out of StoreHeader / StoreFooter
// so the heavy @radix-ui imports (~30KB gzipped) only ship to clients
// that actually log in. Both consumers lazy-import this file via
// React.lazy, so anonymous visitors never download radix at all.

export interface UserMenuUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface UserMenuProps {
  user: UserMenuUser | null;
  onLogout: () => void;
  // Layout knobs — Header anchors top-right, Footer (mobile) anchors bottom-right.
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
  contentClassName?: string;
  // Avatar size — Header uses 7 mobile / 10 desktop, Footer uses 10.
  avatarSizeClass?: string;
  fallbackTextSizeClass?: string;
  // Optional shadow override for the trigger button (Footer always uses
  // its embossed look; Header relies on the Avatar's own shadow).
  triggerButtonStyle?: React.CSSProperties;
  triggerButtonClassName?: string;
}

const monoFont = { fontFamily: '"Geist Mono", monospace' };

export const UserMenu = ({
  user,
  onLogout,
  align = "end",
  side,
  contentClassName = "w-56",
  avatarSizeClass = "h-7 w-7 md:h-10 md:w-10",
  fallbackTextSizeClass = "text-[11px] md:text-[14px]",
  triggerButtonStyle,
  triggerButtonClassName,
}: UserMenuProps) => {
  const initial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={
            triggerButtonClassName ?? "relative cursor-pointer"
          }
          style={triggerButtonStyle}
        >
          <Avatar
            className={avatarSizeClass}
            style={{
              boxShadow:
                "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
            }}
          >
            {user?.image ? (
              <AvatarImage
                src={user.image}
                alt={user.name || user.email || "User"}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback
              className={fallbackTextSizeClass}
              style={{
                backgroundColor: "#f0f0f0",
                color: "rgb(168, 168, 168)",
                fontWeight: 500,
              }}
            >
              {initial ?? (
                <User
                  className="h-5 w-5"
                  style={{ color: "rgb(168, 168, 168)" }}
                />
              )}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        className={contentClassName}
        style={monoFont}
      >
        <DropdownMenuLabel style={monoFont}>
          {user ? (
            <div>
              <p className="font-medium text-sm" style={monoFont}>
                {user.name || "User"}
              </p>
              <p
                className="text-gray-500"
                style={{ ...monoFont, fontSize: "14px", fontWeight: 300 }}
              >
                {user.email}
              </p>
            </div>
          ) : (
            "My Account"
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} style={monoFont}>
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
