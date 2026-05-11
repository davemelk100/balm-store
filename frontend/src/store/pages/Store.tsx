import { motion } from "framer-motion";
import { useSearchParams, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { storeProducts } from "../data/storeProducts";
import { Product } from "../types";
import { LegalModal } from "../components/LegalModal";
import { PrivacyPolicyContent } from "../../components/PrivacyPolicyContent";
import { TermsOfServiceContent } from "../../components/TermsOfServiceContent";
import StoreHeader from "../components/StoreHeader";
import { StoreFooter } from "../components/StoreFooter";
import { StoreNav } from "../components/StoreNav";
import { ProductCard } from "../components/ProductCard";
import { API_ENDPOINTS } from "../../config/api";

const Store = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  // /  → bio block (no grid)
  // /clothing or /shirts → clothing-only grid
  // /music → music-only grid
  const isHome = location.pathname === "/";
  const routeCategory: "clothing" | "music" | null =
    location.pathname === "/clothing" || location.pathname === "/shirts"
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
    if (!routeCategory) return [];
    const matches = products.filter((p) => p.mainCategory === routeCategory);
    if (routeCategory !== "music") return matches;
    // /music groups by artist with Full Time Bionic first, then Balm.
    // Anything untagged falls to the end.
    const order = ["full-time-bionic", "balm"];
    const rank = (slug?: string) => {
      const i = slug ? order.indexOf(slug) : -1;
      return i === -1 ? order.length : i;
    };
    return [...matches].sort(
      (a, b) => rank(a.artistSlug) - rank(b.artistSlug)
    );
  }, [products, routeCategory]);

  // Note: Stripe button styling removed from home page as it's not needed here
  // It's only used on the ProductDetail page

  return (
    <div className="min-h-screen flex flex-col text-gray-900 dark:text-white store-page pb-16 relative bg-[#f0f0f0]">
      {/* Top Header with DM, Nav, Cart, and Profile */}
      <StoreHeader />

      <StoreNav />

      {/* Store Content */}
      <main className="pb-2 sm:pb-3 lg:pb-4 xl:pb-6 relative z-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-12"
          >
            {isHome ? (
              <motion.section
                variants={fadeInUp}
                className="text-center max-w-3xl mx-auto"
                style={{ fontFamily: '"Geist Mono", monospace' }}
              >
                {[
                  "Balm is a multidisciplinary creative house working across underground music, streetwear, and physical-media art. Part record label, part clothing imprint, part artist collective, it exists for work that resists category.",
                  "The clothing line draws on zine culture, hardcore flyers, and DIY print ephemera, translated into limited-run garments built around bold graphics and unconventional silhouettes. Every drop is treated like a release: intentional, and made to live with.",
                  "The record label catalogs sounds that sit outside the comfortable middle, from dense noise rock and desert groove to collage-driven ambient and deconstructed post-punk. Each signing is chosen for a distinct voice rather than scene fit.",
                  "Alongside the music, Balm publishes artists working in print, collage, photography, zines, and tape-based work. These releases run as equal output, not merch.",
                  "What ties it together is a commitment to texture, atmosphere, and objects made by people who care more about the work than the algorithm.",
                  "Contact us with demos or artist submissions.",
                ].map((para, i) => (
                  <p
                    key={i}
                    className={`text-black ${i === 0 ? "" : "mt-2"}`}
                    style={{ fontSize: "14px", fontWeight: 300 }}
                  >
                    {para}
                  </p>
                ))}
                <a
                  href="mailto:balmsoothes@gmail.com?subject=Demo%20%2F%20Artist%20Submission"
                  className="inline-block mt-4 border-b border-transparent hover:border-[rgb(80,80,80)]"
                  style={{
                    fontSize: "14px",
                    fontWeight: 300,
                    color: "rgb(80, 80, 80)",
                    textDecoration: "none",
                  }}
                >
                  balmsoothes@gmail.com
                </a>
              </motion.section>
            ) : (
              <motion.section variants={fadeInUp} className="space-y-6">
                <div
                  className={`flex flex-wrap gap-4 ${
                    routeCategory === "clothing"
                      ? "justify-center"
                      : routeCategory === "music"
                      ? "justify-center lg:justify-start"
                      : "justify-start"
                  }`}
                >
                  {filteredProducts.map((product) =>
                    routeCategory === "music" && product.bandcampEmbedUrl ? (
                      // On the Music page, render the Bandcamp player
                      // inline instead of a thumbnail card linking out.
                      // Falls back to ProductCard for any music product
                      // that doesn't carry an embed URL.
                      // Uniform 350x470 for every embed regardless of
                      // per-product overrides, so the grid stays even.
                      <iframe
                        key={product.id}
                        title={`${product.title} — embedded player`}
                        src={product.bandcampEmbedUrl}
                        seamless
                        allow="autoplay"
                        style={{
                          border: 0,
                          width: "350px",
                          height: "470px",
                        }}
                      >
                        <a href={product.bandcampUrl}>
                          {product.title} on Bandcamp
                        </a>
                      </iframe>
                    ) : (
                      <ProductCard key={product.id} product={product} />
                    )
                  )}
                </div>
              </motion.section>
            )}
          </motion.div>
        </div>
      </main>

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
