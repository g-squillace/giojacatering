"use client";

import { useState, useEffect, useCallback } from "react";
import { SRCImage } from "react-datocms";
import { motion, AnimatePresence } from "framer-motion";

type ImageItem = {
  id: string;
  imageAsset: {
    responsiveImage: any;
  };
  imageDescription?: string | null;
  tag?: {
    id: string;
    tag: string;
  } | null;
};

type Props = {
  data: {
    id: string;
    images: ImageItem[];
  };
  locale: string;
};

export default function MasonryBlock({ data, locale }: Props) {
  const { images } = data;

  const tags = Array.from(
    new Map(
      images
        .filter((img) => img.tag)
        .map((img) => [img.tag!.id, img.tag!])
    ).values()
  );

  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeTag
    ? images.filter((img) => img.tag?.id === activeTag)
    : images;

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % filtered.length : null
    );
  }, [filtered.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + filtered.length) % filtered.length : null
    );
  }, [filtered.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKey);
    };
  }, [lightboxIndex, closeLightbox, goNext, goPrev]);

  const activeImage = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <div className="container">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          <button
            onClick={() => setActiveTag(null)}
            className={`prefix cursor-pointer pb-1 border-b-2 transition-colors ${
              activeTag === null
                ? "border-primary-content text-primary-content"
                : "border-transparent text-base-100 hover:text-primary-content"
            }`}
          >
            Tutti
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setActiveTag(tag.id)}
              className={`prefix cursor-pointer pb-1 border-b-2 transition-colors ${
                activeTag === tag.id
                  ? "border-primary-content text-primary-content"
                  : "border-transparent text-base-100 hover:text-primary-content"
              }`}
            >
              {tag.tag}
            </button>
          ))}
        </div>
      )}
      <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-6">
        <AnimatePresence>
          {filtered.map((img, i) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 break-inside-avoid cursor-pointer group"
              onClick={() => setLightboxIndex(i)}
            >
              <div className="overflow-hidden relative aspect-video">
                <SRCImage
                  data={img.imageAsset.responsiveImage}
                  className="!absolute inset-0 !w-full !h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {img.tag && (
                  <span className="absolute bottom-3 left-3 bg-primary/80 text-primary-content text-[10px] uppercase tracking-widest font-semibold px-3 py-1">
                    {img.tag.tag}
                  </span>
                )}
              </div>
              {img.imageDescription && (
                <div
                  className="text-sm mt-2 opacity-80"
                  dangerouslySetInnerHTML={{ __html: img.imageDescription }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white text-3xl leading-none cursor-pointer z-10 hover:opacity-70 transition-opacity"
              aria-label="Chiudi"
            >
              ✕
            </button>

            {filtered.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goPrev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl cursor-pointer z-10 hover:opacity-70 transition-opacity"
                  aria-label="Precedente"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl cursor-pointer z-10 hover:opacity-70 transition-opacity"
                  aria-label="Successiva"
                >
                  ›
                </button>
              </>
            )}

            <div
              className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={activeImage.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={activeImage.imageAsset.responsiveImage.src}
                alt={activeImage.imageAsset.responsiveImage.alt || ""}
                className="max-w-full max-h-[80vh] object-contain"
              />
              <div className="mt-4 text-center">
                {activeImage.tag && (
                  <span className="prefix text-white/60 block mb-1">
                    {activeImage.tag.tag}
                  </span>
                )}
                {activeImage.imageDescription && (
                  <div
                    className="text-white/80 text-sm"
                    dangerouslySetInnerHTML={{
                      __html: activeImage.imageDescription,
                    }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
