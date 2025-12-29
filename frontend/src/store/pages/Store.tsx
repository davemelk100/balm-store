import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "../context/StoreContext";
import { storeProducts } from "../data/storeProducts";
import { Product } from "../types";
import { LegalModal } from "../components/LegalModal";
import { PrivacyPolicyContent } from "../../components/PrivacyPolicyContent";
import { TermsOfServiceContent } from "../../components/TermsOfServiceContent";
import StoreHeader from "../components/StoreHeader";
import { StoreFooter } from "../components/StoreFooter";

// Product Image Row Component
const ProductImageRow = ({
  product,
  onImageClick,
  currentImageIndex,
}: {
  product: Product;
  onImageClick: () => void;
  currentImageIndex: number;
}) => {
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  return (
    <div
      onClick={onImageClick}
      className="relative overflow-hidden bg-transparent cursor-pointer rounded-t-lg p-1.5 pb-0"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-transparent max-h-[500px] mx-auto">
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

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentImageIndex
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/50"
                }`}
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
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative overflow-visible rounded-lg flex flex-col cursor-pointer w-full max-w-[500px]"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Navigation Arrows - Outside Container */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-[-50px] top-[calc(250px-20px)] -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5 text-gray-900" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-[-50px] top-[calc(250px-20px)] -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5 text-gray-900" />
          </button>
        </>
      )}

      {/* Simple Card - No background */}
      <div className="relative rounded-lg overflow-hidden flex flex-col">
        {/* Content */}
        <div className="relative z-10 flex flex-col">
          {/* Product Image Row - Clickable - Transparent background */}
          <div className="bg-transparent">
            <ProductImageRow
              product={product}
              onImageClick={() => navigate(`/product/${product.id}`)}
              currentImageIndex={currentImageIndex}
            />
          </div>

          {/* Product Info - Transparent background */}
          <div className="store-card-content flex flex-col flex-grow font-['Geist_Mono',monospace] p-2 text-center">
            <h3
              className="mb-1 cursor-pointer hover:underline text-black md:line-clamp-1"
              style={{
                fontSize: "16px",
                fontWeight: 300,
              }}
            >
              {product.title}
            </h3>
            <p
              className="mb-2 line-clamp-2 store-card-text font-['Geist_Mono',monospace] text-black"
              style={{
                fontSize: "16px",
                fontWeight: 300,
              }}
            >
              {product.description}
            </p>
            <div className="mb-2">
              <span
                className="store-card-text font-['Geist_Mono',monospace] text-black"
                style={{
                  fontSize: "16px",
                  fontWeight: 300,
                }}
              >
                ${product.price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Store = () => {
  const { activeCategory } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Products state
  const [products, setProducts] = useState<Product[]>(storeProducts);

  // Load Stripe Buy Button script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/buy-button.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Fetch products from Stripe via Netlify function
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/.netlify/functions/get-products");
        const data = await response.json();

        if (response.ok && data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          // Fallback to local products if Stripe fetch fails
          console.warn("Using local products as fallback");
          setProducts(storeProducts);
        }
      } catch (error) {
        console.error("Error fetching products from Stripe:", error);
        // Fallback to local products
        setProducts(storeProducts);
      }
    };

    fetchProducts();
  }, []);

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

  const filteredProducts = activeCategory
    ? products.filter((product) => product.mainCategory === activeCategory)
    : products;

  // Style Stripe buy buttons to match Add to Cart button
  useEffect(() => {
    const styleStripeButtons = () => {
      const stripeButtons = document.querySelectorAll("stripe-buy-button");
      stripeButtons.forEach((button) => {
        const shadowRoot = button.shadowRoot;
        if (shadowRoot) {
          // Remove existing style if present
          const existingStyle = shadowRoot.querySelector(
            "style[data-custom-stripe-style]"
          );
          if (existingStyle) {
            existingStyle.remove();
          }

          // Add custom styles
          const style = document.createElement("style");
          style.setAttribute("data-custom-stripe-style", "true");
          style.textContent = `
            .BuyButton-Button,
            .is-buttonLayout,
            button {
              font-family: "Geist Mono", monospace !important;
              font-size: 16px !important;
              font-weight: 300 !important;
              background-color: #f0f0f0 !important;
              color: rgb(80, 80, 80) !important;
              box-shadow: rgba(255, 255, 255, 0.9) -1px -1px 1px, 
                          rgba(0, 0, 0, 0.2) 1px 1px 2px, 
                          rgba(255, 255, 255, 0.5) 0px 0px 1px !important;
              border-radius: 0.375rem !important;
              padding: 0.75rem 0.5rem !important;
              height: 45px !important;
              min-height: 45px !important;
              border: none !important;
              transition: all 0.2s !important;
              width: 100% !important;
            }
            
            .BuyButton-Button:hover,
            .is-buttonLayout:hover,
            button:hover {
              transform: scale(1.05) !important;
            }
          `;
          shadowRoot.appendChild(style);
        }
      });
    };

    // Try to style immediately
    styleStripeButtons();

    // Also try after delays in case buttons load asynchronously
    const timeoutId = setTimeout(styleStripeButtons, 500);
    const timeoutId2 = setTimeout(styleStripeButtons, 1000);
    const timeoutId3 = setTimeout(styleStripeButtons, 2000);

    // Use MutationObserver to watch for new buttons being added
    const observer = new MutationObserver(() => {
      styleStripeButtons();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      observer.disconnect();
    };
  }, [filteredProducts]);

  return (
    <div className="min-h-screen text-gray-900 dark:text-white store-page pb-16 relative bg-[#f0f0f0]">
      {/* Top Header with DM, Nav, Cart, and Profile */}
      <StoreHeader sticky={true} />

      {/* Store Content */}
      <section className="py-2 sm:py-3 lg:py-4 xl:py-6 relative z-10">
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
      />
    </div>
  );
};

export default Store;
