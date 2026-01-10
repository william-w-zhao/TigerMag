import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { fetchAllArticles } from "../firebase/db"
import Loading from "../components/Loading"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const ArticleListEntry = ({ article }) => {

    const navigate = useNavigate()

    return (
        <div className="flex justify-between pt-1 pb-2 px-2 even:bg-gray-100">
            <div className="flex-col">
                <button onClick={() => {navigate(`/articles/${article.id}`)}}
                        className="italic text-2xl font-bold hover:underline hover:text-blue-600 active:text-blue-800">{article.title}
                </button>
                <h2 className="italic text-lg text-gray-500">{article.description}</h2>
                <p className="text-l text-gray-500">By {article.author}</p>
            </div>
            <div className="flex items-center gap-1">
                <button onClick={() => {navigate(`/articles/${article.id}/edit`)}}>
                    <FontAwesomeIcon className="text-gray-400 hover:text-black active:text-gray-400" icon={faPenToSquare} />
                </button>
                <button>
                    <FontAwesomeIcon className="text-gray-400 hover:text-red-400 active:text-gray-400" icon={faTrashCan} />
                </button>
            </div>
        </div>
    )
}

const ArticleList = () => {

  const [articles, setArticles] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setError("");
        const data = await fetchAllArticles();
        if (!cancelled) setArticles(data);
      } catch (e) {
        if (!cancelled) setError(e?.message ?? "Failed to load article");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!articles) return <Loading/>;

    return (
        <div className="outline-solid outline-gray-300">
        {
            articles.map((article) => (<ArticleListEntry key = {article.id} article={article}/>))
        }
        </div>
    )

}


export default ArticleList
