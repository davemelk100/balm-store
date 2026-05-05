import {
  useParams,
  useNavigate,
  Link,
  useSearchParams,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  CheckSquare,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { storeProducts } from "../data/storeProducts";
import { Product } from "../types";
import { toast } from "@/hooks/use-toast";
import { ImageModal } from "../components/ImageModal";
import { LegalModal } from "../components/LegalModal";
import { PrivacyPolicyContent } from "../../components/PrivacyPolicyContent";
import { TermsOfServiceContent } from "../../components/TermsOfServiceContent";
import StoreHeader from "../components/StoreHeader";
import { StoreFooter } from "../components/StoreFooter";
import { API_ENDPOINTS } from "../../config/api";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem, items } = useCart();
  const [modalImage, setModalImage] = useState<{
    images: string[];
    currentIndex: number;
  } | null>(null);
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  // Bumped on every Add to Cart click so the Go to Cart drift animation
  // can be replayed by remounting the spacer via the `key` prop.
  const [addClickCount, setAddClickCount] = useState(0);

  // Legal modal management
  const legalModal = searchParams.get("legal");
  const openLegalModal = (type: "privacy" | "terms") => {
    setSearchParams({ legal: type });
  };
  const closeLegalModal = () => {
    searchParams.delete("legal");
    setSearchParams(searchParams);
  };

  // Treat unknown stock (undefined inventory) as unavailable. Inventory
  // is sourced live from Stripe via /api/products; when that fetch fails
  // we'd rather block a sale than risk overselling.
  const canAddToCart =
    termsAgreed &&
    !!selectedSize &&
    (product?.inventory?.[selectedSize] ?? 0) > 0;

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.products);
        if (!isMounted) return;

        let found: Product | undefined;
        if (response.ok) {
          const data = await response.json();
          if (!isMounted) return;
          found = data.products?.find(
            (p: Product) => p.id === id || p.stripeProductId === id
          );
        }

        const resolved = found ?? storeProducts.find((p) => p.id === id);
        setProduct(resolved);
      } catch {
        if (!isMounted) return;
        const localProduct = storeProducts.find((p) => p.id === id);
        setProduct(localProduct);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Show loading state while fetching
  if (loading) {
    return (
      <div
        className="min-h-screen text-white store-page flex items-center justify-center"
        style={{
          backgroundColor: "#f0f0f0",
        }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-black">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="min-h-screen text-white store-page flex items-center justify-center"
        style={{
          backgroundColor: "#f0f0f0",
        }}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-black">
            Product Not Found
          </h1>
          <button
            onClick={() => navigate("/")}
            title="Back to Store"
            className="text-black hover:opacity-80"
          ></button>
        </div>

        {/* Bottom Header - Replica of Top Header without Cart and Avatar */}
        <section
          className="py-1 absolute bottom-0 left-0 right-0"
          style={{ backgroundColor: "#f0f0f0" }}
        >
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-between"
            >
              {/* BALM - Left Side */}
              <Link
                to="/"
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <span
                  className="font-bold tracking-tight balm-logo"
                  style={{
                    color: "#f0f0f0",
                    fontSize: "48px",
                    textShadow:
                      "rgba(255, 255, 255, 0.9) -1px -1px 1px, rgba(0, 0, 0, 0.2) 1px 1px 2px, rgba(255, 255, 255, 0.5) 0px 0px 1px",
                  }}
                >
                  BALM
                </span>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  // Rest of component (all hooks already declared above)
  // Carousel state and handlers
  const images =
    product && product.images && product.images.length > 0
      ? product.images
      : product
      ? [product.image]
      : [];

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      className="min-h-screen text-gray-900 dark:text-white store-page pb-16 relative overflow-hidden"
      style={{
        backgroundColor: "#f0f0f0",
      }}
    >
      {/* Top Header with DM, Nav, Cart, and Profile */}
      <StoreHeader />

      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="px-2 py-3 rounded-md transition-all hover:scale-105 mb-8 flex items-center gap-2"
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
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Product layout: two columns on tablet and desktop, single column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative w-full max-w-[350px] mx-auto"
          >
            <div
              className={`${
                product.streamUrl ? "aspect-square" : "h-[500px]"
              } overflow-hidden rounded-xl bg-transparent relative group cursor-pointer`}
              onClick={() =>
                setModalImage({
                  images,
                  currentIndex: currentImageIndex,
                })
              }
            >
              {/* Images */}
              <div className="relative w-full h-full">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-contain object-top transition-opacity duration-300 ${
                      index === currentImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevious();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 opacity-70 hover:opacity-100 transition-opacity shadow-lg z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-900 dark:text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 opacity-70 hover:opacity-100 transition-opacity shadow-lg z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-900 dark:text-white" />
                  </button>

                  {/* Dots Indicator */}
                  <div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-70 hover:opacity-100 transition-opacity z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex(index);
                        }}
                        className={`h-2 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "w-8 bg-white dark:bg-gray-200"
                            : "w-2 bg-white/50 dark:bg-gray-200/50"
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Track listing — rendered below the artwork for albums /
                singles that supply a `tracks` array. */}
            {product.tracks && product.tracks.length > 0 && (
              <ol
                className="mt-2 space-y-2"
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: "14px",
                  fontWeight: 300,
                  color: "rgb(60, 60, 60)",
                }}
              >
                {product.tracks.map((track, index) => (
                  <li
                    key={index}
                    className="flex items-baseline gap-3"
                  >
                    <span style={{ color: "rgb(140, 140, 140)" }}>
                      {index + 1}.
                    </span>
                    <span className="flex-1">{track.title}</span>
                    <span style={{ color: "rgb(140, 140, 140)" }}>
                      {track.duration}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 relative"
          >
            {/* Simple Card No background */}
            <div className="relative rounded-lg" style={{ padding: "10px" }}>
              <div className="relative z-10 space-y-6">
                <div>
                  <h1
                    className="mb-4 text-center md:text-left"
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: "16px",
                      color: "black",
                      fontWeight: 400,
                    }}
                  >
                    {product.title}
                  </h1>
                  {!product.streamUrl && (
                    <p
                      className="font-bold mb-6 text-center md:text-left"
                      style={{
                        fontFamily: '"Geist Mono", monospace',
                        fontSize: "18px",
                        color: "black",
                      }}
                    >
                      ${product.price}
                    </p>
                  )}
                </div>

                <div>
                  <p
                    className="leading-relaxed"
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: "16px",
                      fontWeight: 300,
                      color: "black",
                    }}
                  >
                    {product.fullDescription || product.description}
                  </p>
                </div>

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 1 && (
                  <div>
                    <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                      <label
                        className="block font-semibold"
                        style={{
                          fontFamily: '"Geist Mono", monospace',
                          fontSize: "16px",
                          fontWeight: 300,
                          color: "black",
                        }}
                      >
                        Size
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsDetailsOpen(true)}
                        className="underline hover:opacity-70"
                        style={{
                          fontFamily: '"Geist Mono", monospace',
                          fontSize: "14px",
                          fontWeight: 300,
                          color: "rgb(80, 80, 80)",
                        }}
                      >
                        Details &amp; Size Chart
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((size: string) => {
                        // Check inventory for this size — undefined = unavailable.
                        const stock = product.inventory?.[size];
                        const isOutOfStock = (stock ?? 0) <= 0;
                        const isSelected = selectedSize === size;

                        return (
                          <button
                            key={size}
                            onClick={() =>
                              !isOutOfStock && setSelectedSize(size)
                            }
                            disabled={isOutOfStock}
                            className={`px-6 py-3 relative bg-transparent border-b ${
                              isOutOfStock
                                ? "cursor-not-allowed opacity-50 line-through border-transparent"
                                : isSelected
                                ? "border-[rgb(80,80,80)]"
                                : "cursor-pointer border-transparent hover:border-[rgb(80,80,80)]"
                            }`}
                            style={{
                              fontFamily: '"Geist Mono", monospace',
                              fontSize: "22px",
                              fontWeight: isSelected ? 600 : 300,
                              color: isOutOfStock
                                ? "rgb(160, 160, 160)"
                                : isSelected
                                ? "rgb(20, 20, 20)"
                                : "rgb(100, 100, 100)",
                            }}
                          >
                            <span>{size}</span>
                            {isOutOfStock && (
                              <span
                                className="block text-xs mt-1"
                                style={{
                                  color: "#dc2626",
                                  fontSize: "10px",
                                  fontWeight: 500,
                                }}
                              >
                                OUT
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Stream-only products: render Spotify + Bandcamp
                    icon links directly (no modal). */}
                {product.streamUrl ? (
                  <div className="flex items-center gap-3">
                    {product.spotifyUrl && (
                      <a
                        href={product.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Stream on Spotify"
                        className="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors cursor-pointer"
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
                          className="h-5 w-5"
                        />
                      </a>
                    )}
                    {product.bandcampUrl && (
                      <a
                        href={product.bandcampUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Stream on Bandcamp"
                        className="relative flex items-center justify-center w-10 h-10 rounded-full transition-colors cursor-pointer"
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
                          className="h-5 w-5"
                        />
                      </a>
                    )}
                  </div>
                ) : (
                <>
                {/* Important Notice (between size selection and Add to Cart) */}
                <div
                  className="px-4 py-4 rounded-md mb-6"
                  style={{
                    backgroundColor: "#ffffff",
                    boxShadow:
                      "rgba(255, 255, 255, 1) -2px -2px 3px, rgba(0, 0, 0, 0.25) 2px 2px 4px, rgba(255, 255, 255, 0.8) 0px 0px 2px",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <p
                    className="font-semibold mb-2"
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: "14px",
                      color: "rgb(200, 60, 60)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    ⚠️ IMPORTANT
                  </p>
                  <p
                    className="leading-relaxed mb-4"
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "rgb(60, 60, 60)",
                      lineHeight: "1.6",
                    }}
                  >
                    These shirts are one-of-a-kind DIY pieces made in very
                    limited runs. Expect slight imperfections. All sales are
                    final – no returns or exchanges.
                  </p>

                  <label
                    className="flex items-center gap-2 cursor-pointer select-none"
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "rgb(60, 60, 60)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={termsAgreed}
                      onChange={(e) => setTermsAgreed(e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                      style={{ accentColor: "rgb(60, 60, 60)" }}
                    />
                    <span>I understand</span>
                  </label>
                </div>

                {/* Add to Cart Button */}
                <div className="w-full flex gap-3">
                  {/* Venmo and PayPal - Hidden for now
                  <a
                    href="https://venmo.com/u/Dave-Melkonian"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[140px] px-2 py-3 rounded-md transition-all hover:scale-105 flex items-center justify-center gap-2 no-underline"
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
                    <img
                      src="/img/logos/venmo.svg"
                      alt="Venmo"
                      className="h-5 w-5"
                    />
                    Venmo
                  </a>
                  <a
                    href="https://paypal.me/Balmsoothes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[140px] px-2 py-3 rounded-md transition-all hover:scale-105 flex items-center justify-center gap-2 no-underline"
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
                    <img
                      src="/img/logos/paypal.svg"
                      alt="PayPal"
                      className="h-5 w-5"
                    />
                    PayPal
                  </a>
                  */}
                  <button
                    onClick={() => {
                      // Check if size is selected and in stock.
                      // Undefined inventory is treated as unavailable.
                      const selectedSizeStock =
                        product.inventory?.[selectedSize || ""];
                      const isSelectedSizeOutOfStock =
                        (selectedSizeStock ?? 0) <= 0;

                      if (!termsAgreed) return;
                      if (!selectedSize) {
                        toast({
                          title: "Please select a size",
                          description: "Choose a size before adding to cart",
                          duration: 3000,
                          variant: "destructive",
                        });
                        return;
                      }
                      if (isSelectedSizeOutOfStock) {
                        toast({
                          title: "Out of stock",
                          description: `Size ${selectedSize} is currently out of stock`,
                          duration: 3000,
                          variant: "destructive",
                        });
                        return;
                      }

                      setIsLaunching(true);
                      // Bump click count so the Go to Cart drift spacer
                      // remounts (via key) and replays the CSS animation.
                      setAddClickCount((c) => c + 1);
                      // Reset isLaunching after the Go to Cart drift animation
                      // window so it can re-trigger on the next click.
                      setTimeout(() => {
                        setIsLaunching(false);
                      }, 6000);
                      setTimeout(() => {
                        addItem({
                          id: product.id,
                          title: product.title,
                          price: product.price,
                          image: product.image,
                          description: product.description,
                          ...(selectedSize ? { size: selectedSize } : {}),
                          ...(product.stripeProductId
                            ? ({
                                stripeProductId: product.stripeProductId,
                              } as any)
                            : {}),
                          ...(product.stripePriceId
                            ? ({
                                stripePriceId: product.stripePriceId,
                              } as any)
                            : {}),
                        });
                        toast({
                          title: "Added to cart",
                          description: product.title,
                          duration: 3000,
                        });
                      }, 250);
                    }}
                    disabled={!canAddToCart}
                    className={`flex-1 min-w-0 px-2 py-3 flex items-center justify-start gap-2 bg-transparent border-b border-transparent ${
                      canAddToCart
                        ? "cursor-pointer hover:border-[rgb(80,80,80)]"
                        : "cursor-not-allowed opacity-50"
                    }`}
                    style={{
                      fontFamily: '"Geist Mono", monospace',
                      fontSize: "16px",
                      fontWeight: 300,
                      color: "rgb(80, 80, 80)",
                    }}
                  >
                    <span>
                      {!selectedSize
                        ? "Select a Size"
                        : (product.inventory?.[selectedSize] ?? 0) <= 0
                        ? "Out of Stock"
                        : "Add to Cart"}
                    </span>
                    {/* Icon swaps from cart to green check during the
                        isLaunching window after a click. */}
                    <span className="relative h-5 w-5 flex-shrink-0">
                      <ShoppingCart
                        className="absolute inset-0 h-5 w-5"
                        style={{
                          opacity: isLaunching ? 0 : 1,
                          transition: "opacity 300ms ease-in-out",
                        }}
                      />
                      <CheckSquare
                        className="absolute inset-0 h-5 w-5"
                        style={{
                          color: "#22c55e",
                          opacity: isLaunching ? 1 : 0,
                          transition: "opacity 300ms ease-in-out",
                        }}
                      />
                    </span>
                  </button>
                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={() => navigate("/checkout")}
                      className="flex-1 min-w-0 px-2 py-3 flex items-center justify-start cursor-pointer bg-transparent border-b border-transparent hover:border-[rgb(80,80,80)]"
                      style={{
                        fontFamily: '"Geist Mono", monospace',
                        fontSize: "16px",
                        fontWeight: 300,
                        color: "rgb(80, 80, 80)",
                      }}
                    >
                      <span>Go to Cart</span>
                      {/* Animated spacer: rests at flex-grow:0 so the
                          icon sits immediately right of the text. On
                          each Add to Cart click, addClickCount bumps,
                          this span remounts (via key), and the keyframe
                          plays once — drifting the icon to the right
                          edge and back. The animation does NOT play on
                          page load (addClickCount is 0). */}
                      <span
                        key={addClickCount}
                        aria-hidden
                        style={{
                          flexShrink: 0,
                          width: "8px",
                          animation:
                            addClickCount > 0
                              ? "go-to-cart-drift 30s linear"
                              : "none",
                        }}
                      />
                      <ShoppingCart className="h-5 w-5 flex-shrink-0" />
                    </button>
                  )}
                </div>
                </>
                )}
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Image Modal */}
      {modalImage && (
        <ImageModal
          images={modalImage.images}
          currentIndex={modalImage.currentIndex}
          isOpen={!!modalImage}
          onClose={() => setModalImage(null)}
          productTitle={product?.title}
        />
      )}


      {/* Details + Size Chart Modal */}
      <LegalModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Details & Size Chart"
      >
        <div className="space-y-6">
          {product.details && (
            <div>
              <h3
                className="font-semibold mb-3"
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: "16px",
                  color: "black",
                }}
              >
                DETAILS
              </h3>
              <div
                className="space-y-2 whitespace-pre-line"
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: "16px",
                  color: "black",
                }}
              >
                {product.details.split("\n").map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            </div>
          )}

          {product.sizeChart && (
            <div>
              <h3
                className="font-semibold mb-3"
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: "16px",
                  color: "black",
                }}
              >
                SIZE CHART
              </h3>
              <div className="overflow-x-auto">
                <table
                  className="w-full border-collapse"
                  style={{
                    fontFamily: '"Geist Mono", monospace',
                    fontSize: "16px",
                    color: "black",
                  }}
                >
                  <thead>
                    <tr>
                      <th className="border border-gray-200 px-2 py-2 text-left font-semibold">
                        Size
                      </th>
                      <th className="border border-gray-200 px-2 py-2 text-left font-semibold">
                        Body Length
                      </th>
                      <th className="border border-gray-200 px-2 py-2 text-left font-semibold">
                        Chest Width (Laid Flat)
                      </th>
                      <th className="border border-gray-200 px-2 py-2 text-left font-semibold">
                        Sleeve Length
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.sizeChart.sizes.map((size) => {
                      const measurement =
                        product.sizeChart!.measurements[size];
                      return (
                        <tr key={size}>
                          <td className="border border-gray-200 px-2 py-2 font-semibold">
                            {size}
                          </td>
                          <td className="border border-gray-200 px-2 py-2">
                            {measurement.bodyLength}
                          </td>
                          <td className="border border-gray-200 px-2 py-2">
                            {measurement.chestWidth}
                          </td>
                          <td className="border border-gray-200 px-2 py-2">
                            {measurement.sleeveLength}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </LegalModal>

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

export default ProductDetail;
