import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Loading from "../components/Loading";
import { getArticleByID } from "../services/articles";
import { posthog } from "../services/posthog";

const Article = () => {
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setError("");
        const data = await getArticleByID(id);
        if (!cancelled) setArticle(data);
      } catch (e) {
        if (!cancelled) setError(e?.message ?? "Failed to load article");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!article?.id) return;

    posthog.capture("article_viewed", {
      article_id: article.id,
      title: article.title,
      section: article.section,
    });
  }, [article]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!article) return <Loading />;

  return (
    <div>
      <div className="max-w-[90%] mx-auto lg:max-w-[55%]">
        <h2 className="text-sm lg:text-lg text-orange-400">
          {article.section}
        </h2>

        <h1 className="italic text-3xl lg:text-4xl font-bold mb-1">
          {article.title}
        </h1>

        <h2 className="italic text-xl lg:text-2xl text-gray-500">
          {article.description}
        </h2>
      </div>

      {article.image_url && (
        <div className="max-w-[90%] mx-auto my-2 lg:max-w-[70%] lg:my-6">
          <img
            src={article.image_url}
            alt={article.title}
            className="block mx-auto max-w-full h-auto rounded"
          />
        </div>
      )}

      <div className="max-w-[90%] mx-auto lg:max-w-[55%] mb-4">
        <h2 className="text-lg lg:text-xl text-gray-500 mb-2">
          By{" "}
          {article.authors?.length > 0
            ? article.authors.map((author, index) => (
                <span key={author.id}>
                  <Link
                    to={`/authors/${author.slug}`}
                    className="hover:underline"
                  >
                    {author.name}
                  </Link>
                  {index < article.authors.length - 2
                    ? ", "
                    : index === article.authors.length - 2
                    ? " and "
                    : ""}
                </span>
              ))
            : article.author}
        </h2>

        <p className="text-xl lg:text-2xl whitespace-pre-wrap">
          {article.content}
        </p>
      </div>
    </div>
  );
};

export default Article;