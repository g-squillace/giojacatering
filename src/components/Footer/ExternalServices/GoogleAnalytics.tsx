import Script from "next/script";

const GOOGLE_ANALYTICS_ID = "G-Y1W8GVKBH9";

export default function GoogleAnalytics() {
  return (
    <Script
      id="google-analytics"
      type="text/plain"
      className="_iub_cs_activate"
      data-iub-purposes="4"
      dangerouslySetInnerHTML={{
        __html: `
          (function(d){var s=d.createElement('script');s.async=true;
          s.src='https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}';
          d.head.appendChild(s);})(document);
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ANALYTICS_ID}', {
            page_path: window.location.pathname,
          });
        `,
      }}
    />
  );
}
