"use client";
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
  const pageSize = 9;
  const [currentPage, setCurrentPage] = useState(0);

  let start = currentPage * pageSize;
  let end = start + pageSize;
  const pageList = data.length > pageSize ? data.slice(start, end) : data;

  return (
    <section className="container px-6 max-w-auto py-12 md:py-20">
      <div
        id="targetElement"
        className="grid gap-6 md:grid-cols-2 md:gap-y-32 lg:grid-cols-3 xl:gap-10 scroll-mt-32"
      >
        {pageList.map((post, i: number) => (
          <CardBlogBlock
            key={post.id}
            data={post as PostRecord}
            locale={lng}
            i={i}
          />
        ))}
      </div>
      <Pagination
        locale={lng}
        pageSize={pageSize}
        totals={data.length}
        currentPage={currentPage}
        handleChangePage={(p: any) => setCurrentPage(p)}
      />
    </section>
  );
};

export default PostGridRenderer;
