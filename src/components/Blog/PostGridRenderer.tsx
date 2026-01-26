"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  CollectionMetadata,
  PostRecord,
  SiteLocale,
} from "@/graphql/generated";
import CardBlogBlock from "../Blog/CardBlogBlock";
import Pagination from "../Layout/Pagination";
import { useState } from "react";

type Props = {
  data: PostRecord[];
  lng: SiteLocale;
  postMeta?: CollectionMetadata;
};

const PostGridRenderer = ({ data, lng }: Props) => {
  const pageSize = 80;
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedTag, setSelectedTag] = useState("All");

  // Extract unique tags
  const allTags = [
    "All",
    ...Array.from(
      new Set(data.flatMap((post) => post.tags.map((t: any) => t.tag))),
    ),
  ];

  // Filter posts
  const filteredPosts =
    selectedTag === "All"
      ? data
      : data.filter((post) =>
          post.tags.some((t: any) => t.tag === selectedTag),
        );

  let start = currentPage * pageSize;
  let end = start + pageSize;

  // Reset pagination when filter changes (optional but good UX)
  // We handle this by resetting currentPage in the click handler

  const pageList =
    filteredPosts.length > pageSize
      ? filteredPosts.slice(start, end)
      : filteredPosts;

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(0);
  };

  return (
    <section className="container px-6 max-w-auto py-12 md:py-20 xl:w-10/12">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-12 justify-center">
        {allTags.map((tag, i) => (
          <button
            key={i}
            onClick={() => handleTagClick(tag)}
            className={`px-4 py-2 rounded-full border transition-all duration-300 text-sm uppercase tracking-widest ${
              selectedTag === tag
                ? "bg-base-content text-white border-base-content"
                : "border-base-content/30 hover:border-base-content text-base-content"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <motion.div
        layout
        id="targetElement"
        className="grid gap-6 md:grid-cols-2 md:gap-y-32 xl:gap-10 scroll-mt-32"
      >
        <AnimatePresence mode="popLayout">
          {pageList.map((post, i: number) => (
            <motion.div
              layout
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <CardBlogBlock data={post as PostRecord} locale={lng} i={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {filteredPosts.length > pageSize && (
        <Pagination
          locale={lng}
          pageSize={pageSize}
          totals={filteredPosts.length}
          currentPage={currentPage}
          handleChangePage={(p: any) => setCurrentPage(p)}
        />
      )}
    </section>
  );
};

export default PostGridRenderer;
