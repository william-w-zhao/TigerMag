import posthog from "posthog-js";
import { PostHogProvider } from "@posthog/react";

const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: "2025-05-24",

    capture_pageview: false,
  });
}

export function PHProvider({ children }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}

export { posthog };