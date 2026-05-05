import { motion } from "framer-motion";
import { useSearchParams, Link, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={fadeInUp}
      className="group relative overflow-visible rounded-lg flex flex-col w-full max-w-[230px]"
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
                className="mb-1 hover:underline text-black"
                style={{ fontSize: "16px", fontWeight: 300 }}
              >
                {product.title}
              </h3>
              <p
                className="mb-2 font-['Geist_Mono',monospace] text-black"
                style={{ fontSize: "16px", fontWeight: 300 }}
              >
                {product.description}
              </p>
              {!product.streamUrl && (
                <div className="mb-1">
                  <span
                    className="font-['Geist_Mono',monospace] text-black"
                    style={{ fontSize: "16px", fontWeight: 300 }}
                  >
                    ${product.price}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* View Details — for purchasable products (shirts/etc), not stream-only. */}
      {!product.streamUrl && (
        <div className="flex items-center justify-center pb-2">
          <Link
            to={`/product/${product.id}`}
            className="font-['Geist_Mono',monospace] text-black border-b border-transparent hover:border-[rgb(80,80,80)] cursor-pointer"
            style={{ fontSize: "14px", fontWeight: 300, textDecoration: "none" }}
          >
            View Details
          </Link>
        </div>
      )}

      {/* Streaming-platform icon links — kept outside the <Link> so the
          nested anchors stay valid. */}
      {product.streamUrl && (
        <div className="flex items-center justify-center gap-3 pb-2">
          {product.spotifyUrl && (
            <a
              href={product.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Stream on Spotify"
              className="relative flex items-center justify-center w-9 h-9 rounded-full transition-colors cursor-pointer"
              style={{
                backgroundColor: "#f0f0f0",
                boxShadow:
                  "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                color: "rgb(168, 168, 168)",
              }}
            >
              <img
                src="/img/logos/spotify.svg"
                alt="Spotify"
                className="h-4 w-4"
              />
            </a>
          )}
          {product.bandcampUrl && (
            <a
              href={product.bandcampUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Stream on Bandcamp"
              className="relative flex items-center justify-center w-9 h-9 rounded-full transition-colors cursor-pointer"
              style={{
                backgroundColor: "#f0f0f0",
                boxShadow:
                  "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                color: "rgb(168, 168, 168)",
              }}
            >
              <img
                src="/img/logos/bandcamp.svg"
                alt="Bandcamp"
                className="h-4 w-4"
              />
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
};

const Store = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  // Category is driven by the URL path so refreshing /shirts or /music
  // keeps the user on that filter.
  const routeCategory: string | null =
    location.pathname === "/shirts"
      ? "clothing"
      : location.pathname === "/music"
      ? "music"
      : null;

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
          // Merge any static products whose IDs aren't already in the
          // Stripe response. This covers stream-only items (albums,
          // singles) and any static-only variants that don't live in
          // Stripe yet.
          const apiIds = new Set(
            (data.products as Product[]).map((p) => p.id)
          );
          const extras = storeProducts.filter((p) => !apiIds.has(p.id));
          setProducts([...data.products, ...extras]);
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
    return routeCategory
      ? products.filter((product) => product.mainCategory === routeCategory)
      : products;
  }, [products, routeCategory]);

  // Note: Stripe button styling removed from home page as it's not needed here
  // It's only used on the ProductDetail page

  return (
    <div className="min-h-screen text-gray-900 dark:text-white store-page pb-16 relative bg-[#f0f0f0]">
      {/* Top Header with DM, Nav, Cart, and Profile */}
      <StoreHeader />

      {/* Category Nav — uses route-based filtering so a refresh on
          /shirts or /music stays on the current filter. */}
      <nav
        className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 flex items-center justify-center gap-8"
        style={{ fontFamily: '"Geist Mono", monospace' }}
      >
        {[
          { label: "Shirts", to: "/shirts" },
          { label: "Music", to: "/music" },
        ].map((item) => {
          const isActive = location.pathname === item.to;
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
              <div className="flex flex-wrap justify-center gap-4">
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
