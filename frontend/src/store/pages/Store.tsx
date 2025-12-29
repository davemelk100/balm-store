import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo, memo } from "react";
import { useStore } from "../context/StoreContext";
import { useCart } from "../context/CartContext";
import { storeProducts } from "../data/storeProducts";
import { Product } from "../types";
import { LegalModal } from "../components/LegalModal";
import { PrivacyPolicyContent } from "../../components/PrivacyPolicyContent";
import { TermsOfServiceContent } from "../../components/TermsOfServiceContent";
import StoreHeader from "../components/StoreHeader";
import { StoreFooter } from "../components/StoreFooter";
import { toast } from "@/hooks/use-toast";

// Product Image Row Component - Memoized
const ProductImageRow = memo(
  ({
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
  }
);

// Product Card Component - Memoized to prevent unnecessary re-renders
const ProductCard = memo(
  ({ product }: { product: Product }) => {
    const { addItem } = useCart();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleDotClick = (index: number) => {
      setCurrentImageIndex(index);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        description: product.description,
      });
      toast({
        title: "Added to cart",
        description: product.title,
        duration: 3000,
      });
    };

    const fadeInUp = {
      initial: { opacity: 0, y: 60 },
      animate: { opacity: 1, y: 0 },
    };

    return (
      <motion.div
        variants={fadeInUp}
        whileHover={{ y: -4, scale: 1.02 }}
        className="group relative overflow-visible rounded-lg flex flex-col w-full max-w-[500px]"
      >
        <Link
          to={`/product/${product.id}`}
          className="block w-full cursor-pointer"
          style={{ textDecoration: "none", pointerEvents: "auto" }}
        >
          {/* Simple Card - No background */}
          <div className="relative rounded-lg overflow-hidden flex flex-col">
            {/* Content */}
            <div className="relative z-10 flex flex-col">
              {/* Product Image Row - Clickable - Transparent background */}
              <div className="bg-transparent">
                <ProductImageRow
                  product={product}
                  currentImageIndex={currentImageIndex}
                  onDotClick={handleDotClick}
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
                <div className="mb-3">
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
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
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
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if the product ID changes
    return prevProps.product.id === nextProps.product.id;
  }
);

const Store = () => {
  const { activeCategory } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Products state
  const [products, setProducts] = useState<Product[]>(storeProducts);
  const [productsLoaded, setProductsLoaded] = useState(false);

  // Fetch products from Stripe via Netlify function
  useEffect(() => {
    if (productsLoaded) return; // Only fetch once

    const fetchProducts = async () => {
      try {
        console.log("Fetching products from Netlify function...");
        const response = await fetch("/.netlify/functions/get-products");
        const data = await response.json();

        console.log("Netlify function response:", response.status, data);

        if (response.ok && data.products && data.products.length > 0) {
          console.log("Setting products from Stripe:", data.products);
          setProducts(data.products);
        } else {
          // Fallback to local products if Stripe fetch fails
          console.warn(
            "Using local products as fallback. Response:",
            response.status
          );
          console.warn("Data received:", data);
          setProducts(storeProducts);
        }
      } catch (error) {
        console.error("Error fetching products from Stripe:", error);
        // Fallback to local products
        console.warn("Using local products as fallback due to error");
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
        hideUser={true}
      />
    </div>
  );
};

export default Store;
