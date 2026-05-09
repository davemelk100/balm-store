import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
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
    // Merch grid: clothing products from every artist (Balm + featured
    // artists like Full Time Bionic). Music lives only under
    // /artists/:slug pages — there's no top-level music route.
    return products.filter((p) => p.mainCategory === "clothing");
  }, [products]);

  // Note: Stripe button styling removed from home page as it's not needed here
  // It's only used on the ProductDetail page

  return (
    <div className="min-h-screen flex flex-col text-gray-900 dark:text-white store-page pb-16 relative bg-[#f0f0f0]">
      {/* Top Header with DM, Nav, Cart, and Profile */}
      <StoreHeader />

      <StoreNav />

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
