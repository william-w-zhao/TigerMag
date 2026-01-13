import { useEffect, useState } from "react";
import { db } from "../firebase/db";
import { collection, getDocs } from "firebase/firestore";

const ArticleDropdownMenu = ({ value, onSelect }) => {
  const [articles, setArticles] = useState([]);

  // On first rendering, get all the articles
  useEffect(() => {
    const loadArticles = async () => {
      const data = await getDocs(collection(db, "articles"));
      const docs = data.docs.map(doc => ({id: doc.id, ...doc.data()}))
      setArticles(docs);
    };

    loadArticles();
  }, []);

  // On selection, display the selected value
  const handleChange = (event) => {
    onSelect?.(event.target.value)
  };

  return (
    <label>
      <select value={value ?? ""} onChange={handleChange} className="w-full border-2 border-gray-200 p-2 overflow-y-auto truncate">
        <option value="">Select an article</option>
        {articles.map(article => (<option key={article.id} value={article.id} className="truncate">{article.title}</option>))}
      </select>
    </label>
  );
};

export default ArticleDropdownMenu;
