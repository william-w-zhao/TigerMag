import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchArticle } from "../firebase/db";
import Loading from "../components/Loading"

const Article = () => {
  const [article, setArticle] = useState(null);
  const params = useParams()
  const id = params.id;

    useEffect(() => {
      const loadArticle = async () => {
        const data = await fetchArticle(id)
        setArticle(data)
      }

      loadArticle()
    }, [id])

  if (!article) return <Loading/>;

  return (
    <div>
      <div className = "max-w-[55%] mx-auto space-y-2">
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
