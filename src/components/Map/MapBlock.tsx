import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";
import { motion, Variants } from "framer-motion";

const DynamicLazyMap = dynamic(() => import("@/components/Map/MyMap"), {
  loading: () => (
    <div className="w-full bg-white relative">
      <svg
        className="animate-spin h-5 w-5 mr-3 absolute -mt-2.5 -ml-2.5 inset-1/2"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-0"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className=""
          fill="fill-current text-accent"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  ),
  ssr: false,
});

const variants: Variants = {
  offscreen: {
    opacity: 0,
    y: 100,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
    },
  },
};

export default function MapBlock({ locale, content }) {
  const { ref, inView, entry } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  const { titleMap, textMap, map, tokenMap, urlStyleMapbox, zoom } = content;
  const titleClass = "title-small";

  return (
    <section ref={ref} className={`grid gap-6 container`}>
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.1 }}
        variants={variants}
        className="grid gap-6"
      >
        {titleMap && (
          <h2
            className={titleClass}
            dangerouslySetInnerHTML={{ __html: titleMap }}
          />
        )}
        {textMap && (
          <div className="" dangerouslySetInnerHTML={{ __html: textMap }} />
        )}
      </motion.div>
      <motion.div
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.1 }}
        variants={variants}
        className="grid gap-6"
      >
        <div className="relative aspect-square lg:aspect-[3/1]">
          <DynamicLazyMap
            latitude={map.latitude}
            longitude={map.longitude}
            token={tokenMap}
            style={urlStyleMapbox}
            zoom={zoom}
          />
        </div>
      </motion.div>
    </section>
  );
}
