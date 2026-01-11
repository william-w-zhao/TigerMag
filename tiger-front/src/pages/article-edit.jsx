import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchArticle, updateArticle } from "../firebase/db";
import Loading from "../components/Loading"
import TextareaAutosize from "react-textarea-autosize";

const TEXTAREA_STYLE =
  "outline outline-1 outline-gray-300 focus:outline-blue-300 focus:outline-2 w-full bg-transparent";

const ArticleEdit = () => {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [hasSaved, setHasSaved] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  const onChangeField = (field) => (e) => {
    const value = e.target.value;
    setArticle((prev) => ({ ...(prev ?? {}), [field]: value }));
    setHasSaved(false)
  };

  const handleSave = async () => {
    if (!id || !article) return;

    setSaving(true);
    setError("");
    try {
      await updateArticle(id, article);
    } catch (e) {
      setError(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
      if (hasSaved == false){
          setHasSaved(true)
      }
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!article) return <Loading/>;

  return (
    <div className="max-w-[55%] mx-auto flex flex-col gap-2">
      <h1 className="text-5xl font-bold">Edit Article</h1>
      <hr className="text-gray-300 mb-2"/>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || hasSaved}
          className="enabled:hover:underline enabled:hover:cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving..." : hasSaved ? "Saved" : "Save"}
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

export default ArticleEdit;
