import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Loading from "../components/Loading"
import { fetchArticle } from "../firebase/db";

const Article = () => {
  const [article, setArticle] = useState(null);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setError("");
        const data = await fetchArticle(id);
        if (!cancelled) setArticle(data);
      } catch (e) {
        if (!cancelled) setError(e?.message ?? "Failed to load article");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!article) return <Loading/>;

  return (
    <div>
      <div className = "max-w-[55%] mx-auto mb-8">
        <h2 className = "text-l text-orange-400">{article.section}</h2>
        <h1 className = "italic text-4xl font-bold">{article.title}</h1>
        <h2 className = "italic text-xl text-gray-500">{article.description}</h2>
      </div>
      <div className="max-w-[55%] mx-auto">
        <h2 className = "text-l text-gray-500">By {article.author}</h2>
        <p className = "text-xl whitespace-pre-wrap">{article.content}</p>
      </div>
    </div>
  );
};

export default Article;
