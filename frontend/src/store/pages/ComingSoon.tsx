/**
 * Temporary Coming Soon / Maintenance Page
 * Shows only the BALM logo centered on the screen
 */

const ComingSoon = () => {
  const text = "PRODUCTS x SERVICES";
  const letters = text.split("");
  const radius = 120; // Radius of the arc
  const angleSpan = 80; // Total angle span in degrees (tight spacing ~2px)

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center gap-0">
        <img
          src="/img/logos/balm-varsity.svg"
          alt="BALM"
          className="w-[40px] h-auto"
        />

        {/* Curved Text */}
        <div
          style={{
            position: "relative",
            width: `${radius * 2}px`,
            height: `${radius}px`,
          }}
        >
          {letters.map((letter, index) => {
            const angle =
              (index / (letters.length - 1)) * angleSpan - angleSpan / 2;
            const x = Math.sin((angle * Math.PI) / 180) * radius;
            const y = -Math.cos((angle * Math.PI) / 180) * radius + radius;

            return (
              <span
                key={index}
                style={{
                  position: "absolute",
                  left: `${radius + x}px`,
                  top: `${y}px`,
                  transform: `rotate(${angle}deg) translateX(-50%)`,
                  transformOrigin: "center",
                  color: "#cfcfcf",
                  fontFamily: "'New Amsterdam', sans-serif",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
