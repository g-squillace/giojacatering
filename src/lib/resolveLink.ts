import config from "@/data/config";

type RouteProps = {
  _modelApiKey: string;
  locale: string;
  slugs?: [
    {
      locale: string;
      value: string;
    }
  ];
  modelRelated: string | null;
};

export function t(section: string, locale: string) {
  if (locale === config.defaultLocale) return section;
  const key = (config.translations as any)[section];
  return key?.[locale] ?? section;
}

function matchCustomRoute({ slugs, _modelApiKey, locale }: RouteProps) {
  const slug = slugs?.find((i) => i.locale === locale)?.value;
  if (!slug) return null;

  const matchingRoute = config.models.find(
    (i) =>
      !i.routeInfo.isDynamic &&
      !i.routeInfo.isHome &&
      i.routeInfo.model === _modelApiKey &&
      i.slugs?.[locale] === slug
  );

  if (!matchingRoute) return null;
  if (locale === config.defaultLocale) return matchingRoute.path;
  const defaultPathChunks = matchingRoute.path.replace(slug, "").split("/");
  let prefix = defaultPathChunks.map((i) => t(i, locale)).join("/");
  return `${prefix}`;
}

export default function resolveLink({
  slugs,
  _modelApiKey,
  locale,
  modelRelated = null,
}: RouteProps): string {
  const lang = locale === config.defaultLocale ? "" : `/${locale}`;
  const slug = slugs?.find((i) => i.locale === locale)?.value;

  if (slug) {
    const customRoute = matchCustomRoute({
      slugs,
      _modelApiKey,
      locale,
      modelRelated,
    });
    if (customRoute) {
      return `${lang}${customRoute}`;
    }
  }

  switch (_modelApiKey) {
    case "page":
      if (slug === "home") {
        return `${lang}/`;
      } else {
        return `${lang}/${slug}`;
      }
    case "event":
      return `${lang}/${t(`eventi`, locale)}/${slug}`;
    case "product":
      return `${lang}/${t(`prodotti`, locale)}/${slug}`;
    case "post":
      return `${lang}/${t(`articoli`, locale)}/${slug}`;
    case "tag":
      switch (modelRelated) {
        case "posts":
          return `${lang}/${t(`articoli`, locale)}/c/${slug.toLowerCase()}`;
        case "events":
          return `${lang}/${t(`eventi`, locale)}/c/${slug.toLowerCase()}`;
      }
    default:
      return `${lang}/${slug ? slug : ""}`;
  }
}
