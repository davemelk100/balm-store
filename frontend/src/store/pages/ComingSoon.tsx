/**
 * Temporary Coming Soon / Maintenance Page
 * Shows only the BALM logo centered on the screen
 */

const ComingSoon = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center gap-2">
        <img
          src="/img/logos/balm-varsity.svg"
          alt="BALM"
          className="w-[40px] h-auto"
        />
        <p
          className="text-[18px] uppercase tracking-wider font-medium"
          style={{ color: "#cfcfcf" }}
        >
          PRODUCTS x SERVICES
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
