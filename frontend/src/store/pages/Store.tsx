import { motion } from "framer-motion";
import { ShoppingCart, CheckSquare } from "lucide-react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import { storeProducts } from "../data/storeProducts";
import { Product } from "../types";
import { LegalModal } from "../components/LegalModal";
import { PrivacyPolicyContent } from "../../components/PrivacyPolicyContent";
import { TermsOfServiceContent } from "../../components/TermsOfServiceContent";
import StoreHeader from "../components/StoreHeader";
import { StoreFooter } from "../components/StoreFooter";
import { API_ENDPOINTS } from "../../config/api";

// Product Image Row Component
const ProductImageRow = ({
  product,
  currentImageIndex,
  onDotClick,
}: {
  product: Product;
  currentImageIndex: number;
  onDotClick?: (index: number) => void;
}) => {
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  return (
    <div className="relative overflow-hidden bg-transparent cursor-pointer rounded-t-lg p-1.5 pb-0">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-transparent max-h-[480px] mx-auto">
        {/* Images */}
        <div className="relative w-full h-full flex items-center justify-center">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.title} - Image ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 max-h-full ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>

        {/* Dots Indicator - Clickable */}
        {images.length > 1 && onDotClick && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDotClick(index);
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  index === currentImageIndex
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }: { product: Product }) => {
  const { addItem, items, updateQuantity } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [cartPhase, setCartPhase] = useState<0 | 1>(0);
  const [isLaunching, setIsLaunching] = useState(false);
  const hasStartedRef = useRef(false);
  const navigate = useNavigate();

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;
  const hasSizes = (product.sizes?.length ?? 0) > 0;
  const canAddToCart = !hasSizes || selectedSize !== null;

  useEffect(() => {
    if (!canAddToCart || isLaunching) {
      hasStartedRef.current = false;
      return;
    }
    const delay = hasStartedRef.current ? 60000 : 50;
    hasStartedRef.current = true;
    const t = setTimeout(
      () => setCartPhase((p) => (p === 0 ? 1 : 0)),
      delay
    );
    return () => clearTimeout(t);
  }, [canAddToCart, cartPhase, isLaunching]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canAddToCart) return;
    setIsLaunching(true);
    setTimeout(() => {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        description: product.description,
        ...(selectedSize ? { size: selectedSize } : {}),
        ...(product.stripeProductId
          ? ({ stripeProductId: product.stripeProductId } as any)
          : {}),
        ...(product.stripePriceId
          ? ({ stripePriceId: product.stripePriceId } as any)
          : {}),
      });
    }, 250);
    setTimeout(() => {
      setIsLaunching(false);
      setCartPhase(0);
    }, 6000);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity - 1);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={fadeInUp}
      className="group relative overflow-visible rounded-lg flex flex-col w-full max-w-[400px]"
    >
      <Link
        to={`/product/${product.id}`}
        className="block w-full cursor-pointer"
        style={{ textDecoration: "none" }}
      >
        <div className="relative rounded-lg overflow-hidden flex flex-col">
          <div className="relative z-10 flex flex-col">
            <div className="bg-transparent">
              <ProductImageRow
                product={product}
                currentImageIndex={currentImageIndex}
                onDotClick={handleDotClick}
              />
            </div>
            <div className="flex flex-col flex-grow font-['Geist_Mono',monospace] p-2 text-center">
              <h3
                className="mb-1 hover:underline text-black md:line-clamp-1"
                style={{ fontSize: "16px", fontWeight: 300 }}
              >
                {product.title}
              </h3>
              <p
                className="mb-2 line-clamp-2 font-['Geist_Mono',monospace] text-black"
                style={{ fontSize: "16px", fontWeight: 300 }}
              >
                {product.description}
              </p>
              <div className="mb-1">
                <span
                  className="font-['Geist_Mono',monospace] text-black"
                  style={{ fontSize: "16px", fontWeight: 300 }}
                >
                  ${product.price}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Interactive controls live OUTSIDE the Link to avoid nesting
          interactive elements inside <a>, which breaks click and
          back/forward behavior. */}
      <div className="font-['Geist_Mono',monospace] p-2 text-center">
        {hasSizes && (
          <div className="mb-3 flex flex-wrap gap-1.5 justify-center">
            {product.sizes!.map((size) => {
              const stock = product.inventory?.[size];
              const outOfStock = (stock ?? 0) <= 0;
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  type="button"
                  disabled={outOfStock}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[36px] px-2 py-1 rounded-md text-xs font-['Geist_Mono',monospace] transition-all ${
                    outOfStock
                      ? "opacity-40 cursor-not-allowed line-through"
                      : isSelected
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-gray-200"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}

        {quantity === 0 ? (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className="w-full px-2 py-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            style={{
              fontFamily: '"Geist Mono", monospace',
              fontSize: "14px",
              fontWeight: 300,
              backgroundColor: "#f0f0f0",
              color: "rgb(80, 80, 80)",
              boxShadow:
                "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
            }}
          >
            <span>
              {hasSizes && !selectedSize ? "Select a size" : "Add to Cart"}
            </span>
            <span
              aria-hidden
              style={{
                flexShrink: 0,
                width: "6px",
                flexGrow: isLaunching ? 0 : canAddToCart ? cartPhase : 0,
                transition: isLaunching
                  ? "flex-grow 250ms ease-out"
                  : !canAddToCart
                  ? "none"
                  : "flex-grow 60s linear",
              }}
            />
            <span className="relative h-4 w-4 flex-shrink-0">
              <ShoppingCart
                className="absolute inset-0 h-4 w-4"
                style={{
                  opacity: isLaunching ? 0 : 1,
                  transition: "opacity 800ms ease-in-out",
                }}
              />
              <CheckSquare
                className="absolute inset-0 h-4 w-4"
                style={{
                  color: "#22c55e",
                  opacity: isLaunching ? 1 : 0,
                  transition: "opacity 800ms ease-in-out",
                }}
              />
            </span>
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleDecrement}
                className="w-8 h-8 rounded-md transition-all hover:scale-105 flex items-center justify-center"
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: "16px",
                  fontWeight: 300,
                  backgroundColor: "#f0f0f0",
                  color: "rgb(80, 80, 80)",
                  boxShadow:
                    "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                }}
              >
                −
              </button>
              <span
                className="min-w-[40px] text-center"
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "rgb(80, 80, 80)",
                }}
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-8 h-8 rounded-md transition-all hover:scale-105 flex items-center justify-center"
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: "16px",
                  fontWeight: 300,
                  backgroundColor: "#f0f0f0",
                  color: "rgb(80, 80, 80)",
                  boxShadow:
                    "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                }}
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="w-full px-2 py-1.5 rounded-md transition-all hover:scale-105 flex items-center justify-center gap-1.5"
              style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: "14px",
                fontWeight: 300,
                backgroundColor: "#f0f0f0",
                color: "rgb(80, 80, 80)",
                boxShadow:
                  "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              View Cart
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Store = () => {
  const { activeCategory } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Products state — start empty so we never flash stale stock from the
  // static fallback. Live data comes from Stripe via /api/products.
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  useEffect(() => {
    if (productsLoaded) return; // Only fetch once

    const fetchProducts = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.products);
        if (!response.ok) {
          // API down — fall back to static metadata (no inventory),
          // so sizes will render as unavailable rather than risking
          // a sale on stale numbers.
          setProducts(storeProducts);
          return;
        }
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts(storeProducts);
        }
      } catch {
        setProducts(storeProducts);
      } finally {
        setProductsLoaded(true);
      }
    };

    fetchProducts();
  }, [productsLoaded]);

  // Legal modal management
  const legalModal = searchParams.get("legal");
  const openLegalModal = (type: "privacy" | "terms") => {
    setSearchParams({ legal: type });
  };
  const closeLegalModal = () => {
    searchParams.delete("legal");
    setSearchParams(searchParams);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // const mainCategories = [
  //   {
  //     id: "art",
  //     title: "Art",
  //     icon: Palette,
  //     color: "orange",
  //   },
  //   {
  //     id: "music",
  //     title: "Music",
  //     icon: Music,
  //     color: "purple",
  //   },
  //   {
  //     id: "sports",
  //     title: "Sports",
  //     icon: Activity,
  //     color: "emerald",
  //   },
  // ];

  const filteredProducts = useMemo(() => {
    return activeCategory
      ? products.filter((product) => product.mainCategory === activeCategory)
      : products;
  }, [products, activeCategory]);

  // Note: Stripe button styling removed from home page as it's not needed here
  // It's only used on the ProductDetail page

  return (
    <div className="min-h-screen text-gray-900 dark:text-white store-page pb-16 relative bg-[#f0f0f0]">
      {/* Top Header with DM, Nav, Cart, and Profile */}
      <StoreHeader />

      {/* Store Content */}
      <section className="pb-2 sm:pb-3 lg:pb-4 xl:pb-6 relative z-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-12"
          >
            {/* Products Grid */}
            <motion.section variants={fadeInUp} className="space-y-6">
              <div className="flex justify-center">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </motion.section>
          </motion.div>
        </div>
      </section>

      {/* Legal Modals */}
      <LegalModal
        isOpen={legalModal === "privacy"}
        onClose={closeLegalModal}
        title="Privacy"
      >
        <PrivacyPolicyContent />
      </LegalModal>

      <LegalModal
        isOpen={legalModal === "terms"}
        onClose={closeLegalModal}
        title="TOS"
      >
        <TermsOfServiceContent />
      </LegalModal>

      {/* Sticky Footer with BALM */}
      <StoreFooter
        onPrivacyClick={() => openLegalModal("privacy")}
        onTermsClick={() => openLegalModal("terms")}
        hideUser={true}
      />
    </div>
  );
};

export default Store;
