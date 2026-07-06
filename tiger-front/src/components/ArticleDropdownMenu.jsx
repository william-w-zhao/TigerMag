import { useEffect, useState } from "react";
import { getArticles } from "../services/articles";

const ArticleDropdownMenu = ({ value, onSelect }) => {
  const [articles, setArticles] = useState([]);

  // On first rendering, get all the articles
  useEffect(() => {
    const loadArticles = async () => {
      const data = await getArticles();
      setArticles(data);
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
