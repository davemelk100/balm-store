import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { LegalModal } from "../components/LegalModal";
import { PrivacyPolicyContent } from "../../components/PrivacyPolicyContent";
import { TermsOfServiceContent } from "../../components/TermsOfServiceContent";
import StoreHeader from "../components/StoreHeader";
import { StoreFooter } from "../components/StoreFooter";
import { StoreNav } from "../components/StoreNav";
import { artists } from "../data/artists";

const Art = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const brightwire = artists.find((a) => a.slug === "brightwire-designs");
  const artImages = brightwire?.gallery ?? [];

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

  return (
    <div className="min-h-screen flex flex-col text-gray-900 dark:text-white store-page pb-16 relative bg-[#f0f0f0]">
      <StoreHeader />
      <StoreNav />

      <section className="pb-2 sm:pb-3 lg:pb-4 xl:pb-6 relative z-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="space-y-8"
            style={{ fontFamily: '"Geist Mono", monospace' }}
          >
            {artImages.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {artImages.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={`Brightwire Designs — image ${i + 1}`}
                    className="w-full aspect-square object-cover rounded-lg"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
            <div className="text-center max-w-3xl mx-auto">
              <p
                className="text-black"
                style={{ fontSize: "14px", fontWeight: 300 }}
              >
                Contact us with demos or artist submissions.
              </p>
              <a
                href="mailto:balmsoothes@gmail.com?subject=Art%20Submission"
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
            </div>
          </motion.div>
        </div>
      </section>

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

export default Art;
