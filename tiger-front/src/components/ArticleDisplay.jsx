import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getArticles } from "../services/articles";
import Loading from "../components/Loading";
import { posthog } from "../services/posthog";

// Display one article entry
const ArticleListEntry = ({ article, className = "" }) => {
  const imageUrl = article?.image_url;

  const dateObject = article.created_at
    ? new Date(article.created_at)
    : null;

  const formattedDate = dateObject
    ? dateObject.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })
    : "";

  return (
    <div className={`relative h-full pt-3 pb-3 ${className}`}>
      <Link
        to={`/articles/${article.id}`}
        className="block h-full"
        onClick={() => posthog.capture("article_clicked", { article_id: article.id, title: article.title, section: article.section })}
      >
        <div className="lg:grid grid-cols-[7.5rem_1fr_auto] gap-4 items-start h-full">
          <div className="hidden lg:block text-l text-gray-500 leading-tight">
            {formattedDate}
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-semibold line-clamp-2">
              {article.title}
            </h1>

            <h2 className="italic text-lg text-gray-500 leading-tight line-clamp-2">
              {article.description}
            </h2>

            <h2 className="text-l text-gray-500">
              By {article.author}
            </h2>
          </div>

          {imageUrl && (
            <div className="hidden lg:flex justify-end">
              <div className="shrink-0 w-20 h-20 overflow-hidden rounded">
                <img
                  src={imageUrl}
                  alt={article.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

// Display the full article list
const ArticleDisplay = ({ section }) => {
  const [articles, setArticles] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadArticles = async () => {
      try {
        setError("");

        let data = await getArticles();

        if (section !== "ALL") {
          data = data.filter((article) => article.section === section);
        }

        if (!cancelled) setArticles(data);
      } catch (e) {
        if (!cancelled) {
          setError(e?.message ?? "Failed to load articles");
        }
      }
    };

    loadArticles();

    return () => {
      cancelled = true;
    };
  }, [section]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (articles === null) return <Loading />;

  return (
    <div>
      <div className="p-3 divide-y divide-gray-200">
        {articles.map((article) => (
          <ArticleListEntry key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default ArticleDisplay;