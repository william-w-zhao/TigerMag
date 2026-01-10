import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { newArticle } from "../firebase/db"
import TextareaAutosize from "react-textarea-autosize";

const TEXTAREA_STYLE =
  "outline outline-1 outline-gray-300 focus:outline-blue-300 focus:outline-2 w-full bg-transparent";

const ArticleNew = () => {

  const navigate = useNavigate()
  const [article, setArticle] = useState({
      section: "",
      title: "",
      description: "",
      author: "",
      content: ""
  });

  const onChangeField = (field) => (e) => {
    const value = e.target.value;
    setArticle((prev) => ({ ...(prev ?? {}), [field]: value }));
  };

  const canSubmit =
    article.section?.trim() &&
    article.title?.trim() &&
    article.description?.trim() &&
    article.author?.trim() &&
    article.content?.trim();

  const handleSubmit = async (article) => {
      if (!canSubmit) return;

      const id = await newArticle(article)
      navigate(`/articles/${id}`)
  }

  return (
    <div className="max-w-[55%] mx-auto flex flex-col gap-2">
      <h1 className="text-5xl font-bold">New Article</h1>
      <hr className="text-gray-300 mb-2"/>
      <div className="flex justify-end">
        <button
          onClick={() => handleSubmit(article)}
          disabled={!canSubmit}
          className="enabled:hover:underline enabled:hover:cursor-pointer disabled:opacity-50"
        >
        Publish
        </button>
      </div>

      <TextareaAutosize
        placeholder="Section"
        className={`${TEXTAREA_STYLE} text-lg text-orange-400`}
        value={article.section ?? ""}
        onChange={onChangeField("section")}
      />

      <TextareaAutosize
        placeholder="Title"
        className={`${TEXTAREA_STYLE} italic text-4xl font-bold`}
        value={article.title ?? ""}
        onChange={onChangeField("title")}
      />

      <TextareaAutosize
        placeholder="Description"
        className={`${TEXTAREA_STYLE} italic text-xl`}
        value={article.description ?? ""}
        onChange={onChangeField("description")}
      />

      <div className="w-full flex items-center gap-2">
        <h2 className="text-lg">By</h2>
        <TextareaAutosize
          rows={1}
          placeholder="Author"
          className={`${TEXTAREA_STYLE} text-lg`}
          value={article.author ?? ""}
          onChange={onChangeField("author")}
        />
      </div>

      <TextareaAutosize
        placeholder="Content"
        minRows={10}
        className={`${TEXTAREA_STYLE} text-xl whitespace-pre-wrap`}
        value={article.content ?? ""}
        onChange={onChangeField("content")}
      />
    </div>
  );
};

export default ArticleNew;
