import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { posthog } from "../services/posthog";

export default function PostHogPageView() {
  const location = useLocation();

  useEffect(() => {
    posthog.capture("$pageview", {
      $current_url: window.location.href,
      path: location.pathname,
      search: location.search,
    });
  }, [location.pathname, location.search]);

  return null;
}