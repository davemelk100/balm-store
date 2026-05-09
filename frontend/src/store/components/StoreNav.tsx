import { Link, useLocation } from "react-router-dom";

const items = [
  { label: "Merch", to: "/shirts" },
  { label: "Artists", to: "/artists" },
];

export const StoreNav = () => {
  const location = useLocation();

  return (
    <nav
      className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 flex items-center justify-center gap-8"
      style={{ fontFamily: '"Geist Mono", monospace' }}
    >
      {items.map((item) => {
        // Highlight Artists for any /artists/* path so the section feels
        // sticky when drilling into an artist detail page.
        const isActive =
          item.to === "/artists"
            ? location.pathname.startsWith("/artists")
            : location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`px-2 py-1 bg-transparent border-b ${
              isActive
                ? "border-[rgb(80,80,80)]"
                : "border-transparent hover:border-[rgb(80,80,80)]"
            }`}
            style={{
              fontSize: "16px",
              fontWeight: isActive ? 600 : 300,
              color: isActive ? "rgb(20, 20, 20)" : "rgb(100, 100, 100)",
              textDecoration: "none",
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
