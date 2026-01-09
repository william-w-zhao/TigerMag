import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchArticle } from "../firebase/db";

const Article = () => {
  const [article, setArticle] = useState(null);
  const { id } = useParams();

    useEffect(() => {
      const loadArticle = async () => {
        const data = await fetchArticle(id)
        setArticle(data)
      }

      loadArticle()
    }, [id])

  if (!article) return <p>Loading...</p>;

  return (
    <div>
      <div className = "max-w-[55%] mx-auto space-y-2">
        <h2 className = "text-l text-orange-400">{article.section}</h2>
        <h1 className = "italic text-4xl font-bold">{article.title}</h1>
        <h2 className = "italic text-xl font">{article.description}</h2>
      </div>
      <div className="max-w-[55%] mx-auto">
        <h2 className = "text-l font">By {article.author}</h2>
        <p className = "text-xl whitespace-pre-wrap">{article.content}</p>
      </div>
    </div>
  );
};

export default Article;
