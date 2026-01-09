import { useState, useEffect } from "react";
import { fetchArticle } from "../firebase/db";
import ArticleDropdownMenu from "./ArticleDropdownMenu";

const CardLarge = ({articleID, setArticle, removeArticle, className = ''}) => {
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
            <button onClick={removeArticle} className = "absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold">
                ×
            </button>
            <div className = "flex items-end h-full">
                <h1 className="text-3xl font-semibold justify-end">{article.title}</h1>
            </div>
        </div>
    )
}
export default CardLarge