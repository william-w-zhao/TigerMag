import { useState, useEffect } from "react";
import { fetchArticle } from "../firebase/db";
import { Link } from "react-router-dom";
import ArticleDropdownMenu from "./ArticleDropdownMenu";

const CardMedium = ({articleID, setArticle, removeArticle, editMode, className = ''}) => {
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
        <div className={`h-full p-3 flex items-center justify-center ${className}`}>
            {editMode && (<ArticleDropdownMenu value={articleID ?? ""} onSelect={setArticle}/>)}
        </div>
    )

    else return (
        <div className={` relative h-full border-gray-200 p-3 ${className}`}>
            <Link to={`/articles/${articleID}`} className="absolute inset-0 z-0"/>
            {editMode && (
            <button onClick={removeArticle} className = "absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold">
                ×
            </button>
            )}
            <div className = "flex flex-col justify-end h-full">
                <h1 className="text-xl font-semibold justify-end">{article.title}</h1>
                <h2 className = "text-l text-gray-500">By {article.author}</h2>
            </div>
        </div>
    )
}
export default CardMedium