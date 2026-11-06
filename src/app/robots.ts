import type { MetadataRoute } from "next";
import { isIndexableDeploy, siteUrl } from "@/lib/siteUrl";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexableDeploy) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
