import { useState, useEffect } from "react";
import { fetchArticle } from "../firebase/db";
import { Link } from "react-router-dom";
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
            <Link to={`/articles/${articleID}`} className="absolute inset-0 z-0"/>
            <button onClick={removeArticle} className = "absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold">
                ×
            </button>
            <div className = "flex flex-col justify-end h-full gap-1 lg:gap-2">
                <h1 className="relative inline-block text-3xl font-semibold group">
                    <span className="relative z-10">{article.title}</span>
                    <span className="absolute left-0 bottom-0 w-full h-2.5 bg-orange-300 origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"   />
                </h1>
                <h2 className = "text-l text-gray-500">By {article.author}</h2>
            </div>
        </div>
    )
}
export default CardLarge