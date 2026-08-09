import Script from "next/script";

interface GoogleAnalyticsProps {
  measurementId: string;
  nonce?: string;
}

/** Optional GA via NEXT_PUBLIC_GA_ID (validated before render). */
export function GoogleAnalytics({
  measurementId,
  nonce,
}: GoogleAnalyticsProps): React.JSX.Element {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="lazyOnload"
        nonce={nonce}
      />
      <Script id="ga-init" strategy="lazyOnload" nonce={nonce}>
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config','${measurementId}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
