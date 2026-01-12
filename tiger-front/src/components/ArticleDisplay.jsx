import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAllArticles } from "../firebase/db";
import Loading from "../components/Loading";

const ArticleListEntry = ({ article, className = ''}) => {
  const dateObject = article.createdAt.toDate()

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC' 
  };
  const formattedDate = dateObject.toLocaleDateString('en-US', options);

  return (
    <div className={` relative h-full pt-3 pb-3 grid grid-cols-1 lg:grid-cols-[1fr_3fr] ${className}`}>
            <Link to={`/articles/${article.id}`} className="absolute inset-0 z-0"/>
            <div>
                <h2 className = "text-l text-gray-500">{formattedDate}</h2>
            </div>
            <div className = "flex flex-col justify-end h-full">
                <h1 className="text-xl font-semibold justify-end">{article.title}</h1>
                <h2 className="italic text-lg text-gray-500 leading-tight">{article.description}</h2>
                <h2 className = "text-l text-gray-500">By {article.author}</h2>
            </div>
        </div>
  );
};

const ArticleDisplay = ( {section} ) => {
  const [articles, setArticles] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setError("");
        let data = await fetchAllArticles();

        data.sort((a, b) => {
        const aTime = a.createdAt.toMillis?.() ?? 0;
        const bTime = b.createdAt.toMillis?.() ?? 0;
        return bTime - aTime;
        });

        data
        if (section !== "ALL") {data = data.filter((article) => (article.section === section))}
        if (!cancelled) setArticles(data);
      } catch (e) {
        if (!cancelled) setError(e?.message ?? "Failed to load articles");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (articles === null) return <Loading />;

  return (
    <div className=" ">
      <div className="p-3 divide-y divide-gray-200">
      {articles.map((article) => (
        <ArticleListEntry key={article.id} article={article} />
      ))}
      </div>
    </div>
  );
};

export default ArticleDisplay;
