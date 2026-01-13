import { useState, useEffect } from "react";
import { fetchArticle } from "../firebase/db";
import { Link } from "react-router-dom";
import { getStorage, ref, getDownloadURL } from "firebase/storage"
import ArticleDropdownMenu from "./ArticleDropdownMenu";

const CardMediumSmall = ({articleID, setArticle, removeArticle, editMode, className = ''}) => {
    const [article, getArticle] = useState(null)
    const [imageUrl, setImageUrl] = useState(null);

    const storage = getStorage()

    // Run every time the articleID changes
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
        <div className={`h-full  p-3 flex items-center justify-center ${className}`}>
            {editMode && (<ArticleDropdownMenu value={articleID ?? ""} onSelect={setArticle}/>)}
        </div>
    )
    else return (
        <div className={`relative h-full border-gray-200 p-3 ${className}`}>
            {editMode && (
                <button onClick={(e) => {e.preventDefault(); e.stopPropagation(); removeArticle();}}
                className="absolute top-2 right-2 z-20 text-red-500 hover:text-red-700 font-bold">
                    ×
                </button>)}
            <Link to={`/articles/${articleID}`} className="block h-full">
                <div className="flex h-full items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <h1 className="text-xl font-semibold line-clamp-2">{article.title}</h1>
                        <h2 className="text-l text-gray-500">By {article.author}</h2>
                    </div>
                    {imageUrl && (
                        <div className="shrink-0 w-20 h-20 overflow-hidden rounded">
                            <img src={imageUrl} className="w-full h-full object-cover object-center"/>
                        </div>)}
                    </div>
            </Link>
        </div>
    )
}
export default CardMediumSmall