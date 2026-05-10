import { Link, useLocation } from "react-router-dom";

// Shared by StoreNav (desktop inline) and StoreHeader (mobile menu).
export const storeNavItems = [
  { label: "Home", to: "/" },
  { label: "Clothing", to: "/clothing" },
  { label: "Music", to: "/music" },
  { label: "Art", to: "/art" },
  { label: "Artists", to: "/artists" },
];

export const isStoreNavActive = (pathname: string, to: string) =>
  to === "/artists" ? pathname.startsWith("/artists") : pathname === to;

export const StoreNav = () => {
  const location = useLocation();

  // Desktop only — the mobile menu lives in StoreHeader so its trigger
  // can sit to the left of the title.
  return (
    <nav
      className="hidden md:block max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6"
      style={{ fontFamily: '"Geist Mono", monospace' }}
    >
      <div className="flex items-center justify-center gap-8">
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
                color: active ? "rgb(20, 20, 20)" : "rgb(100, 100, 100)",
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
