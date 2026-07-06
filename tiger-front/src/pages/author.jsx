import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Loading from "../components/Loading";
import { getAuthorBySlug, getArticlesByAuthorID } from "../services/authors";
import { posthog } from "../services/posthog";

const Author = () => {
  const { slug } = useParams();

  const [author, setAuthor] = useState(null);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAuthorPage() {
      try {
        setError("");

        const authorData = await getAuthorBySlug(slug);
        const articleData = await getArticlesByAuthorID(authorData.id);

        if (!cancelled) {
          setAuthor(authorData);
          setArticles(articleData);
          posthog.capture("author_profile_viewed", { author_id: authorData.id, slug: authorData.slug });
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message ?? "Failed to load author");
        }
      }
    }

    loadAuthorPage();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!author) return <Loading />;

  const classYearMatch = author.name.match(/\s*('\d{2})$/);
  const displayName = classYearMatch
  ? author.name.replace(/\s*'\d{2}$/, "")
  : author.name;
  const classYear = classYearMatch?.[1];

  return (
    <div className="max-w-[90%] mx-auto lg:max-w-[55%]">
        <h1 className="text-5xl font-bold mb-2">
            {displayName}
            {classYear && (
                <sup className="relative -top-3 ml-1 text-2xl">
                    {classYear}
                </sup>
            )}
        </h1>

      <hr className="text-gray-300 mb-4" />

      {author.bio && (
        <p className="text-xl text-gray-600 mb-6 whitespace-pre-wrap">
          {author.bio}
        </p>
      )}

      <hr className="text-gray-300 mb-4" />

      {articles.length === 0 ? (
        <p className="text-gray-500">No articles yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/articles/${article.id}`}
              className="block hover:opacity-80"
            >
              <h3 className="text-orange-400">{article.section}</h3>
              <h2 className="text-2xl font-bold italic">{article.title}</h2>
              <p className="text-gray-500 italic">{article.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Author;