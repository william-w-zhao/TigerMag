import { useState, useEffect } from "react";
import { fetchArticle } from "../firebase/db";
import { Link } from "react-router-dom";
import { getStorage, ref, getDownloadURL } from "firebase/storage"
import ArticleDropdownMenu from "./ArticleDropdownMenu";

const CardLarge = ({articleID, setArticle, removeArticle, editMode, className = ''}) => {
    const [article, getArticle] = useState(null)
    const [imageUrl, setImageUrl] = useState(null);

    const storage = getStorage()

    useEffect(() => {
    // If there is no articleID yet, return
      if (!articleID) {
        getArticle(null)
        return
      }
      // Fetch the article data from the given article ID
      const loadArticle = async () => {
        const data = await fetchArticle(articleID)
        getArticle(data)
      }

      loadArticle()
    }, [articleID])

    useEffect(() => {
        if (!articleID) return; 
        let cancelled = false;
    
        const options = [
          `images/${articleID}`,
          `images/${articleID}.jpg`,
          `images/${articleID}.png`,
          `images/${articleID}.jpeg`
        ];
    
        (async () => {
          for (const option of options) {
          try {
          const url = await getDownloadURL(ref(storage, option))
          console.log("Got download URL:", url);
          if (!cancelled) setImageUrl(url)
          return
          }
          catch (e) {
            if (e?.code === "storage/object-not-found") continue
            else break
          }}
    
        if (!cancelled) setImageUrl(null);
        })();
        return () => {
          cancelled = true;
        };
      }, [articleID, storage])

    // If there is no article and editMode is on, dropdown menu to select the article
    if (!article) return (
        <div className={`h-full p-3 flex items-center justify-center ${className}`}>
            {editMode && (<ArticleDropdownMenu value={articleID ?? ""} onSelect={setArticle}/>)}
        </div>
    )

    // Otherwise, display the article
    else return (
        <div className={`relative h-full border-gray-200 p-3 ${className} group`}>
            <Link to={`/articles/${articleID}`} className="absolute inset-0 z-10 block" />
            {editMode && (
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeArticle(); }} className="absolute top-2 right-2 z-20 text-red-500 hover:text-red-700 font-bold">
                ×
            </button>)}
            <div className="relative z-0 flex flex-col h-full">
            {imageUrl && (
                <div className="flex-1 overflow-hidden rounded">
                    <img src={imageUrl} alt={article.title} className="w-full h-full object-cover object-center"/>
                </div>)}
                <div className="h-4" />
                <div className="shrink-0">
                    <h1 className="relative inline-block text-3xl font-semibold">
                    <span className="relative z-10">{article.title}</span>
                    <span className="pointer-events-none absolute left-0 bottom-0 w-full h-2.5 bg-orange-300 origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"/>
                    </h1>
                    <h2 className="text-l text-gray-500">By {article.author}</h2>
                </div>
            </div>
        </div>
    )
}

export default CardLarge