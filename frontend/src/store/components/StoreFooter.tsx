interface StoreFooterProps {
  onPrivacyClick: () => void;
  onTermsClick: () => void;
}

export const StoreFooter = ({
  onPrivacyClick,
  onTermsClick,
}: StoreFooterProps) => {
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
        <div className="flex flex-col items-center gap-1">
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
      </div>
    </footer>
  );
};
