import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import { CartProvider, StoreProvider, AuthProvider } from "./store";
import { ProtectedRoute } from "./store/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";

// Route-level code splitting — each page ships as its own chunk so the
// initial bundle stays small. Without this we shipped ~515KB upfront
// with ~290KB never executed on the home page (Lighthouse audit).
const Store = lazy(() => import("./store/pages/Store"));
const ProductDetail = lazy(() => import("./store/pages/ProductDetail"));
const Artists = lazy(() => import("./store/pages/Artists"));
const ArtistDetail = lazy(() => import("./store/pages/ArtistDetail"));
const Art = lazy(() => import("./store/pages/Art"));
const Checkout = lazy(() => import("./store/pages/Checkout"));
const CheckoutSuccess = lazy(() => import("./store/pages/CheckoutSuccess"));
const Login = lazy(() => import("./store/pages/Login"));
const Signup = lazy(() => import("./store/pages/Signup"));
const AuthCallback = lazy(() => import("./store/pages/AuthCallback"));
const ComingSoon = lazy(() => import("./store/pages/ComingSoon"));

function App() {
  // Check for maintenance mode from env and bypass token
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === "true";
  const hasMaintenanceBypass =
    localStorage.getItem("maintenance_bypass_v3") === "true";

  // MAINTENANCE MODE (enabled):
  if (isMaintenanceMode && !hasMaintenanceBypass) {
    return (
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Suspense fallback={null}>
          <Routes>
            <Route path="*" element={<ComingSoon />} />
          </Routes>
        </Suspense>
      </Router>
    );
  }

  // Normal mode (when bypass active):
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <StoreProvider>
        <AuthProvider>
          <CartProvider>
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen">
                  Loading...
                </div>
              }
            >
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/auth-callback" element={<AuthCallback />} />
                <Route path="/auth/auth/callback" element={<AuthCallback />} />
                <Route path="/" element={<Store />} />
                <Route path="/clothing" element={<Store />} />
                <Route path="/music" element={<Store />} />
                <Route path="/art" element={<Art />} />
                {/* Legacy alias — old links to /shirts still work. */}
                <Route path="/shirts" element={<Store />} />
                <Route path="/artists" element={<Artists />} />
                <Route path="/artists/:slug" element={<ArtistDetail />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route
                  path="/checkout/success"
                  element={
                    <ProtectedRoute>
                      <CheckoutSuccess />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </StoreProvider>
    </Router>
  );
}

export default App;
