import { motion } from "framer-motion";
import { Link, useParams, useSearchParams, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { storeProducts } from "../data/storeProducts";
import { artists } from "../data/artists";
import { Product } from "../types";
import { LegalModal } from "../components/LegalModal";
import { PrivacyPolicyContent } from "../../components/PrivacyPolicyContent";
import { TermsOfServiceContent } from "../../components/TermsOfServiceContent";
import StoreHeader from "../components/StoreHeader";
import { StoreFooter } from "../components/StoreFooter";
import { StoreNav } from "../components/StoreNav";
import { ProductCard } from "../components/ProductCard";
import { API_ENDPOINTS } from "../../config/api";

const ArtistDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const artist = artists.find((a) => a.slug === slug);

  // Mirror Store.tsx's data flow: start empty, then merge live API
  // products with static ones. Artist-tagged products live in the static
  // file for now (no Stripe products yet), so the merge primarily picks
  // them up from `storeProducts`.
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);

  useEffect(() => {
    if (productsLoaded) return;

    const fetchProducts = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.products);
        if (!response.ok) {
          setProducts(storeProducts);
          return;
        }
        const data = await response.json();
        if (data.products && data.products.length > 0) {
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
    animate: { transition: { staggerChildren: 0.1 } },
  };

  const artistProducts = useMemo(
    () =>
      products.filter(
        (p) => p.artistSlug === slug && !p.hideFromArtistPage
      ),
    [products, slug]
  );

  // Embedded players for the artist — rendered as a separate section
  // below the product grid, mirroring the inline-embed treatment on
  // /music. Includes products that are hidden from the card grid via
  // `hideFromArtistPage` so they still get a player here.
  const artistEmbeds = useMemo(
    () =>
      products.filter(
        (p) => p.artistSlug === slug && p.bandcampEmbedUrl
      ),
    [products, slug]
  );

  // Filter to upcoming-only (date >= today, local time) and sort
  // ascending. ISO YYYY-MM-DD strings sort lexicographically, so no
  // Date parsing needed.
  const today = new Date().toISOString().slice(0, 10);
  const upcomingShows = (artist?.shows ?? [])
    .filter((s) => s.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const upcomingReleases = (artist?.releases ?? [])
    .filter((r) => r.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const hasUpcoming =
    upcomingShows.length > 0 || upcomingReleases.length > 0;

  const formatDate = (iso: string) => {
    // Render as "Jun 14, 2026". Build the Date with local-noon to avoid
    // off-by-one shifts from UTC parsing of bare YYYY-MM-DD strings.
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!artist) return <Navigate to="/artists" replace />;

  return (
    <div className="min-h-screen flex flex-col text-gray-900 dark:text-white store-page pb-16 relative bg-[#f0f0f0]">
      <StoreHeader />
      <StoreNav />

      <main className="pb-2 sm:pb-3 lg:pb-4 xl:pb-6 relative z-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.div
              variants={fadeInUp}
              className="text-left"
              style={{ fontFamily: '"Geist Mono", monospace' }}
            >
              <Link
                to="/artists"
                className="inline-flex items-center gap-1 mb-4 border-b border-transparent hover:border-[rgb(80,80,80)]"
                style={{
                  fontSize: "14px",
                  fontWeight: 300,
                  color: "rgb(80, 80, 80)",
                  textDecoration: "none",
                }}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Artists
              </Link>
              <img
                src={artist.image}
                alt={`${artist.name} logo`}
                className={`block h-auto mb-3 ${
                  slug === "full-time-bionic" ? "w-80" : "w-40"
                }`}
                loading="eager"
              />
              {slug !== "full-time-bionic" && (
                <h1
                  className="text-black"
                  style={{ fontSize: "24px", fontWeight: 400 }}
                >
                  {artist.name}
                </h1>
              )}

              {/* Streaming + website links — only the URLs the artist
                  has are rendered. Bandcamp uses an icon button
                  (matching the rest of the store); the website is a
                  small text link. Spotify is hidden for now. */}
              {(artist.bandcampUrl || artist.websiteUrl) && (
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  {artist.bandcampUrl && (
                    <a
                      href={artist.bandcampUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${artist.name} on Bandcamp`}
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
                  {artist.websiteUrl && (
                    <a
                      href={artist.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-b border-transparent hover:border-[rgb(80,80,80)]"
                      style={{
                        fontSize: "14px",
                        fontWeight: 300,
                        color: "rgb(80, 80, 80)",
                        textDecoration: "none",
                      }}
                    >
                      {artist.websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  )}
                </div>
              )}

              {artist.bio &&
                artist.bio.split(/\n\n+/).map((para, i) => (
                  <p
                    key={i}
                    className="mt-2 text-black"
                    style={{ fontSize: "14px", fontWeight: 300 }}
                  >
                    {para}
                  </p>
                ))}
            </motion.div>

            {artist.gallery && artist.gallery.length > 0 && (
              <motion.section variants={fadeInUp} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {artist.gallery.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt={`${artist.name} — image ${i + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                      loading="lazy"
                    />
                  ))}
                </div>
              </motion.section>
            )}

            {hasUpcoming && (
              <motion.section
                variants={fadeInUp}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
                style={{ fontFamily: '"Geist Mono", monospace' }}
              >
                {upcomingShows.length > 0 && (
                  <div>
                    <h2
                      className="text-black mb-3"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                      }}
                    >
                      UPCOMING SHOWS
                    </h2>
                    <ul className="space-y-3">
                      {upcomingShows.map((show, i) => (
                        <li
                          key={`${show.date}-${i}`}
                          className="flex flex-col"
                          style={{ fontSize: "14px", fontWeight: 300 }}
                        >
                          <span style={{ color: "rgb(80, 80, 80)" }}>
                            {show.dateLabel ?? formatDate(show.date)}
                          </span>
                          <span className="text-black">
                            {show.venue} — {show.city}
                          </span>
                          {show.ticketUrl && (
                            <a
                              href={show.ticketUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-1 self-start border-b border-transparent hover:border-[rgb(80,80,80)]"
                              style={{
                                color: "rgb(80, 80, 80)",
                                textDecoration: "none",
                              }}
                            >
                              Tickets
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {upcomingReleases.length > 0 && (
                  <div>
                    <h2
                      className="text-black mb-3"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                      }}
                    >
                      UPCOMING RELEASES
                    </h2>
                    <ul className="space-y-3">
                      {upcomingReleases.map((release, i) => (
                        <li
                          key={`${release.date}-${i}`}
                          className="flex flex-col"
                          style={{ fontSize: "14px", fontWeight: 300 }}
                        >
                          <span style={{ color: "rgb(80, 80, 80)" }}>
                            {release.dateLabel ?? formatDate(release.date)}
                          </span>
                          <span className="text-black">
                            {release.title}{" "}
                            <span style={{ color: "rgb(140, 140, 140)" }}>
                              ({release.type})
                            </span>
                          </span>
                          {release.url && (
                            <a
                              href={release.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-1 self-start border-b border-transparent hover:border-[rgb(80,80,80)]"
                              style={{
                                color: "rgb(80, 80, 80)",
                                textDecoration: "none",
                              }}
                            >
                              Listen
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.section>
            )}

            <motion.section variants={fadeInUp} className="space-y-6">
              <div className="flex flex-wrap justify-start gap-4">
                {artistProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </motion.section>

            {artistEmbeds.length > 0 && (
              <motion.section variants={fadeInUp} className="space-y-6">
                <div className="flex flex-wrap justify-start gap-4">
                  {artistEmbeds.map((product) => (
                    <iframe
                      key={product.id}
                      title={`${product.title} — embedded player`}
                      src={product.bandcampEmbedUrl}
                      seamless
                      allow="autoplay"
                      style={{
                        border: 0,
                        width: `${product.bandcampEmbedWidth ?? 350}px`,
                        height: `${product.bandcampEmbedHeight ?? 442}px`,
                      }}
                    >
                      <a href={product.bandcampUrl}>
                        {product.title} on Bandcamp
                      </a>
                    </iframe>
                  ))}
                </div>
              </motion.section>
            )}
          </motion.div>
        </div>
      </main>

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

      <StoreFooter
        onPrivacyClick={() => openLegalModal("privacy")}
        onTermsClick={() => openLegalModal("terms")}
        hideUser={true}
      />
    </div>
  );
};

export default ArtistDetail;
