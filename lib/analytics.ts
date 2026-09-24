/**
 * Google Analytics 4, deliberately cookieless.
 *
 * Consent Mode v2 is initialised with every storage type denied and nothing in
 * the app ever grants them, so gtag runs in its cookieless mode: it reports a
 * page view without setting a cookie and without assigning a persistent
 * identifier. That keeps the promise the privacy page makes about this product
 * while still filling the dashboard with traffic.
 *
 * Only send_page_view goes in the config. client_storage and anonymize_ip are
 * Universal Analytics fields that GA4 does not read, so passing them would not
 * make anything cookieless, it would only staple two meaningless parameters
 * onto every event. The consent default is what does the work.
 *
 * The measurement ID is not a secret. It ships in the client bundle of every
 * site that uses GA, so the default below is a convenience rather than a leak,
 * and NEXT_PUBLIC_GA_ID still overrides it per environment.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-SVRDR9NM4X";

/** Runs during head parse, before the gtag library loads, so the denial lands first. */
export const GA_BOOTSTRAP = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
gtag('js',new Date());
gtag('config','${GA_ID}',{send_page_view:false});
`;
