import { Link } from "react-router-dom";
import ArticleDropdownMenu from "./ArticleDropdownMenu";

const CardLarge = ({
  article,
  articleID,
  setArticle,
  removeArticle,
  editMode,
  className = "",
}) => {
  const imageUrl = article?.image_url;

  if (!article) {
    return (
      <div className={`h-full p-3 flex items-center justify-center ${className}`}>
        {editMode && (
          <ArticleDropdownMenu
            value={articleID ?? ""}
            onSelect={setArticle}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`relative h-full border-gray-200 p-3 ${className} group`}>
      <Link to={`/articles/${article.id}`} className="absolute inset-0 z-10 block" />

      {editMode && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            removeArticle();
          }}
          className="absolute top-2 right-2 z-20 text-red-500 hover:text-red-700 font-bold"
        >
          ×
        </button>
      )}

      <div className="relative z-0 flex flex-col h-full">
        {imageUrl && (
          <div className="flex-1 overflow-hidden rounded">
            <img
              src={imageUrl}
              alt={article.title}
              loading="eager"
              fetchPriority="high"
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        <div className="h-4" />

        <div className="shrink-0">
          <h1 className="relative inline-block text-3xl font-semibold">
            <span className="relative z-10">{article.title}</span>
            <span className="pointer-events-none absolute left-0 bottom-0 w-full h-2.5 bg-orange-300 origin-bottom scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100" />
          </h1>

          <h2 className="text-l text-gray-500">By {article.author}</h2>
        </div>
      </div>
    </div>
  );
};

export default CardLarge;