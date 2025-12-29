/**
 * Temporary Coming Soon / Maintenance Page
 * Shows only the BALM logo centered on the screen
 */

import { useState } from "react";
import { Lock } from "lucide-react";

const ComingSoon = () => {
  const text = "PRODUCTS x SERVICES";
  const letters = text.split("");
  const radius = 120; // Radius of the arc
  const angleSpan = 80; // Total angle span in degrees (tight spacing ~2px)
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "heynow") {
      // Store the access token in localStorage
      localStorage.setItem("maintenance_bypass", "true");
      // Redirect to the store
      window.location.href = "/";
    } else {
      setError("Incorrect PIN");
      setPin("");
    }
  };

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

      {/* Floating PIN Entry Button */}
      <button
        onClick={() => setShowPinModal(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
        style={{
          backgroundColor: "#f0f0f0",
          color: "rgb(120, 120, 120)",
          boxShadow:
            "rgba(255, 255, 255, 0.9) -2px -2px 4px, rgba(0, 0, 0, 0.2) 2px 2px 4px, rgba(255, 255, 255, 0.5) 0px 0px 2px",
        }}
        title="Admin Access"
      >
        <Lock className="h-5 w-5" />
      </button>

      {/* PIN Modal */}
      {showPinModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setShowPinModal(false);
            setError("");
            setPin("");
          }}
        >
          <div
            className="bg-white rounded-lg p-8 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow:
                "rgba(255, 255, 255, 0.9) -4px -4px 8px, rgba(0, 0, 0, 0.3) 4px 4px 8px",
            }}
          >
            <h2
              className="text-center mb-6"
              style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: "20px",
                fontWeight: 500,
                color: "rgb(60, 60, 60)",
              }}
            >
              Enter PIN
            </h2>
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError("");
                }}
                placeholder="Enter PIN"
                autoFocus
                className="w-full px-4 py-3 rounded-md border text-center"
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: "16px",
                  backgroundColor: "#f0f0f0",
                  color: "rgb(80, 80, 80)",
                  borderColor: "rgba(0, 0, 0, 0.1)",
                  boxShadow:
                    "rgba(255, 255, 255, 0.9) -1px -1px 1px inset, rgba(0, 0, 0, 0.1) 1px 1px 2px inset",
                }}
              />
              {error && (
                <p
                  className="text-center text-sm"
                  style={{
                    color: "#dc2626",
                    fontFamily: '"Geist Mono", monospace',
                  }}
                >
                  {error}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPinModal(false);
                    setError("");
                    setPin("");
                  }}
                  className="flex-1 px-4 py-3 rounded-md transition-all hover:scale-105"
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: "14px",
                    fontWeight: 300,
                    backgroundColor: "#f0f0f0",
                    color: "rgb(80, 80, 80)",
                    boxShadow:
                      "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-md transition-all hover:scale-105"
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: "14px",
                    fontWeight: 400,
                    backgroundColor: "#f0f0f0",
                    color: "rgb(60, 60, 60)",
                    boxShadow:
                      "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px",
                  }}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComingSoon;
