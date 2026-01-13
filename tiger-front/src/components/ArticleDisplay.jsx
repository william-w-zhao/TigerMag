import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAllArticles } from "../firebase/db";
import { getStorage, ref, getDownloadURL } from "firebase/storage"
import Loading from "../components/Loading";

// Display one article entry
const ArticleListEntry = ({ article, className = ''}) => {
  const dateObject = article.createdAt.toDate()
  const [imageUrl, setImageUrl] = useState(null);

  const storage = getStorage()

  // Set the format of the date
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC' 
  };
  // Put the date in the correct format and in the American language/order
  const formattedDate = dateObject.toLocaleDateString('en-US', options);

  useEffect(() => {
        if (!article.id) return; 
        let cancelled = false;
    
        const options = [
          `images/${article.id}`,
          `images/${article.id}.jpg`,
          `images/${article.id}.png`,
          `images/${article.id}.jpeg`
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
      }, [article.id, storage])

  // Return the box for each individual article
  return (
    <div className={`relative h-full pt-3 pb-3 ${className}`}>
    <Link to={`/articles/${article.id}`} className="block h-full">
      <div className="lg:grid grid-cols-[7.5rem_1fr_auto] gap-4 items-start h-full">
      
        <div className="hidden lg:block text-l text-gray-500 leading-tight">
          {formattedDate}
        </div>

        <div className="min-w-0">
          <h1 className="text-xl font-semibold line-clamp-2">{article.title}</h1>
          <h2 className="italic text-lg text-gray-500 leading-tight line-clamp-2">
            {article.description}
          </h2>
          <h2 className="text-l text-gray-500">By {article.author}</h2>
        </div>

      {imageUrl && (
        <div className="hidden lg:flex justify-end">
          <div className="shrink-0 w-20 h-20 overflow-hidden rounded">
            <img src={imageUrl} alt={article.title} className="w-full h-full object-cover object-center"/>
          </div>
        </div> )}
      </div>
    </Link>
  </div>
  );
};

// Display the full article list
const ArticleDisplay = ( {section} ) => {
  const [articles, setArticles] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setError("");
        // Get all the articles
        let data = await fetchAllArticles();

        // Sort the articles by their creation date, latest to earliest
        data.sort((a, b) => {
        const aTime = a.createdAt.toMillis?.() ?? 0;
        const bTime = b.createdAt.toMillis?.() ?? 0;
        return bTime - aTime;
        });
        
        // If the section is not ALL, filter the data to only display that specific section
        if (section !== "ALL") {data = data.filter((article) => (article.section === section))}
        if (!cancelled) setArticles(data);
      } catch (e) {
        if (!cancelled) setError(e?.message ?? "Failed to load articles");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (articles === null) return <Loading />;

  return (
    <div className=" ">
      <div className="p-3 divide-y divide-gray-200">
      {articles.map((article) => (
        <ArticleListEntry key={article.id} article={article} />
      ))}
      </div>
    </div>
  );
};

export default ArticleDisplay;
