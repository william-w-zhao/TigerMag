import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Loading from "../components/Loading"
import { fetchArticle } from "../firebase/db";
import { getStorage, ref, getDownloadURL } from "firebase/storage"

const Article = () => {
  const [article, setArticle] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState("");
  const { id } = useParams();

  const storage = getStorage()

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setError("");
        const data = await fetchArticle(id);
        if (!cancelled) setArticle(data);
      } catch (e) {
        if (!cancelled) setError(e?.message ?? "Failed to load article");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    const options = [
      `images/${id}`,
      `images/${id}.jpg`,
      `images/${id}.png`,
      `images/${id}.jpeg`
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
  }, [id, storage])

  if (error) return <p className="text-red-500">{error}</p>;
  if (!article) return <Loading/>;

  return (
    <div>
      <div className = "max-w-[55%] mx-auto">
        <h2 className = "text-l text-orange-400">{article.section}</h2>
        <h1 className = "italic text-4xl font-bold mb-1">{article.title}</h1>
        <h2 className = "italic text-xl text-gray-500">{article.description}</h2>
      </div>
      {imageUrl && <div className = "max-w-[70%] mx-auto my-6">
        {console.log("imageUrl:", imageUrl)}
        <img src={imageUrl} className="block mx-auto max-w-full h-auto rounded"/>
      </div>}
      <div className="max-w-[55%] mx-auto mb-4">
        <h2 className = "text-l text-gray-500 mb-2">By {article.author}</h2>
        <p contentEditable="true" className = "text-xl whitespace-pre-wrap">{article.content}</p>
      </div>
    </div>
  );
};

export default Article;
