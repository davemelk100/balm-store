import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense } from "react";
import { CartProvider, StoreProvider, AuthProvider } from "./store";
import { ProtectedRoute } from "./store/components/ProtectedRoute";

// Store Pages
import Store from "./store/pages/Store";
import ProductDetail from "./store/pages/ProductDetail";
import Checkout from "./store/pages/Checkout";
import CheckoutSuccess from "./store/pages/CheckoutSuccess";
import Login from "./store/pages/Login";
import Signup from "./store/pages/Signup";
import AuthCallback from "./store/pages/AuthCallback";

function App() {
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
                {/* Store Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/" element={<Store />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout/success"
                  element={
                    <ProtectedRoute>
                      <CheckoutSuccess />
                    </ProtectedRoute>
                  }
                />

                {/* Redirect any unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </StoreProvider>
    </Router>
  );
}

export default App;
