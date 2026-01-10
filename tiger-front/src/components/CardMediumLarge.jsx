import { useState, useEffect } from "react";
import { fetchArticle } from "../firebase/db";
import { Link } from "react-router-dom";
import ArticleDropdownMenu from "./ArticleDropdownMenu";

const CardMediumLarge = ({articleID, setArticle, removeArticle, className = ''}) => {
    const [article, getArticle] = useState(null)

    useEffect(() => {
      if (!articleID) {
        getArticle(null)
        return
      }
      const loadArticle = async () => {
        const data = await fetchArticle(articleID)
        getArticle(data)
      }

      loadArticle()
    }, [articleID])

    if (!article) return (
        <div className={`h-full bg-gray-50 border-2 border-gray-200 p-3 flex items-center justify-center ${className}`}>
            <ArticleDropdownMenu value={articleID ?? ""} onSelect={setArticle}/>
        </div>
    )

    else return (
        <div className={` relative h-full border-gray-200 p-3 ${className}`}>
            <Link to={`/articles/${articleID}`} className="absolute inset-0 z-0"/>
            <button onClick={removeArticle} className = "absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold">
                ×
            </button>
            <div className = "flex flex-col justify-end h-full gap-1 lg:gap-2">
                <h1 className="text-xl font-semibold justify-end">{article.title}</h1>
                <h2 className = "text-l text-gray-500">By {article.author}</h2>
            </div>
        </div>
    )
}
export default CardMediumLarge