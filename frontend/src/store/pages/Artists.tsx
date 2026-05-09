import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { artists } from "../data/artists";
import { LegalModal } from "../components/LegalModal";
import { PrivacyPolicyContent } from "../../components/PrivacyPolicyContent";
import { TermsOfServiceContent } from "../../components/TermsOfServiceContent";
import StoreHeader from "../components/StoreHeader";
import { StoreFooter } from "../components/StoreFooter";
import { StoreNav } from "../components/StoreNav";

const Artists = () => {
  const [searchParams, setSearchParams] = useSearchParams();

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

  return (
    <div className="min-h-screen flex flex-col text-gray-900 dark:text-white store-page pb-16 relative bg-[#f0f0f0]">
      <StoreHeader />
      <StoreNav />

      <section className="pb-2 sm:pb-3 lg:pb-4 xl:pb-6 relative z-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.section variants={fadeInUp} className="space-y-6">
              <div className="flex flex-wrap justify-center gap-4">
                {artists.map((artist) => (
                  <motion.div
                    key={artist.slug}
                    variants={fadeInUp}
                    className="group relative overflow-visible rounded-lg flex flex-col w-full max-w-[230px]"
                  >
                    <Link
                      to={`/artists/${artist.slug}`}
                      className="block w-full cursor-pointer"
                      style={{ textDecoration: "none" }}
                    >
                      <div className="relative rounded-lg overflow-hidden flex flex-col">
                        <div className="relative z-10 flex flex-col">
                          <div className="bg-transparent">
                            <div className="relative overflow-hidden bg-transparent cursor-pointer rounded-t-lg p-1.5 pb-0">
                              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-transparent max-h-[480px] mx-auto">
                                <img
                                  src={artist.image}
                                  alt={artist.name}
                                  className="absolute inset-0 w-full h-full object-contain"
                                  loading="eager"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col flex-grow font-['Geist_Mono',monospace] p-2 text-center">
                            <h3
                              className="mb-1 hover:underline text-black"
                              style={{ fontSize: "16px", fontWeight: 300 }}
                            >
                              {artist.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
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

export default Artists;
