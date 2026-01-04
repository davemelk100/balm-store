import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense } from "react";
import { CartProvider, StoreProvider, AuthProvider } from "./store";
import { ProtectedRoute } from "./store/components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import Store from "./store/pages/Store";
import ProductDetail from "./store/pages/ProductDetail";
import Checkout from "./store/pages/Checkout";
import CheckoutSuccess from "./store/pages/CheckoutSuccess";
import Login from "./store/pages/Login";
import Signup from "./store/pages/Signup";
import AuthCallback from "./store/pages/AuthCallback";
import ComingSoon from "./store/pages/ComingSoon";

function App() {
  // Check for maintenance mode from env and bypass token
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === "true";
  const hasMaintenanceBypass =
    localStorage.getItem("maintenance_bypass_v3") === "true";

  // MAINTENANCE MODE (enabled):
  if (isMaintenanceMode && !hasMaintenanceBypass) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<ComingSoon />} />
        </Routes>
      </Router>
    );
  }

  // Normal mode (when bypass active):
  return (
    <Router>
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
