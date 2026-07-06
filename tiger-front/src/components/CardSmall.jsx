import { Link } from "react-router-dom";
import ArticleDropdownMenu from "./ArticleDropdownMenu";

const CardSmall = ({
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
    <div className={`relative h-full border-gray-200 p-3 ${className}`}>
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

      <Link to={`/articles/${article.id}`} className="block h-full">
        <div className="flex h-full items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h1 className="text-l font-semibold line-clamp-2">
              {article.title}
            </h1>

            <h2 className="text-base text-gray-500">By {article.author}</h2>
          </div>

          {imageUrl && (
            <div className="shrink-0 w-20 h-20 overflow-hidden rounded">
              <img
                src={imageUrl}
                alt={article.title}
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default CardSmall;