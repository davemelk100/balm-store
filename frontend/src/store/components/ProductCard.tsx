import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Product } from "../types";

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

export const ProductCard = ({ product }: { product: Product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
                onDotClick={setCurrentImageIndex}
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

      {product.streamUrl && (
        <div className="flex items-center justify-center gap-3 pb-2">
          {/* Spotify icon hidden for now. */}
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
