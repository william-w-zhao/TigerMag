# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into The Princeton Tiger newspaper frontend. The app already had `posthog-js` and `@posthog/react` installed with a `PHProvider` wrapping the app, pageview tracking via `PostHogPageView`, and an `article_viewed` event in place. This run extended that foundation with user identification on login, a logout reset, six new business-value events across reader and editor flows, error boundary coverage, and exception capture at key failure points.

**Files changed:**

| File | Change |
|------|--------|
| `src/main.jsx` | Added `PostHogErrorBoundary` wrapper for automatic unhandled React error capture |
| `src/pages/login.jsx` | Added `posthog.identify()` + `posthog.capture("user_logged_in")` on success; `posthog.captureException()` on login failure |
| `src/pages/editor-console.jsx` | Added `posthog.capture("user_logged_out")` before sign-out and `posthog.reset()` after sign-out |
| `src/pages/article-new.jsx` | Added `posthog.capture("article_published")` on successful publish; `posthog.captureException()` on error |
| `src/pages/issue.jsx` | Added `posthog.capture("issue_viewed")` when a print issue PDF loads |
| `src/pages/author.jsx` | Added `posthog.capture("author_profile_viewed")` when an author page loads |
| `src/components/ArticleDisplay.jsx` | Added `posthog.capture("article_clicked")` on article link click in section listings |
| `.env.local` | Added `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` |

**Event inventory:**

| Event name | Description | File |
|---|---|---|
| `article_viewed` | Fired when a reader opens a full article page (pre-existing) | `src/pages/article.jsx` |
| `user_logged_in` | Fired when an editor successfully signs in | `src/pages/login.jsx` |
| `user_logged_out` | Fired when an editor clicks Logout from the editor console | `src/pages/editor-console.jsx` |
| `article_published` | Fired when an editor successfully publishes a new article | `src/pages/article-new.jsx` |
| `issue_viewed` | Fired when a reader opens a print issue PDF | `src/pages/issue.jsx` |
| `author_profile_viewed` | Fired when a reader visits an author profile page | `src/pages/author.jsx` |
| `article_clicked` | Fired when a reader clicks an article from a section listing | `src/components/ArticleDisplay.jsx` |

## Next steps

We've built a dashboard and five insights for you to monitor reader behavior and editorial activity:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/499631/dashboard/1803669)
- [Article views over time](https://us.posthog.com/project/499631/insights/RkpaJjOr)
- [Article click-to-read funnel](https://us.posthog.com/project/499631/insights/eR4mIeH6)
- [Articles published over time](https://us.posthog.com/project/499631/insights/2PAhxXdP)
- [Editor logins over time](https://us.posthog.com/project/499631/insights/pCjN718g)
- [Reader engagement: issues and author pages](https://us.posthog.com/project/499631/insights/aICr0BuM)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is called on fresh login only; a user who returns with an active Supabase session navigates away from `Login` without re-identifying. Consider calling `posthog.identify()` in the auth state check inside `Login`'s `useEffect`, or in a top-level auth context, so returning sessions are also linked.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
