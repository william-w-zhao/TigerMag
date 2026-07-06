import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";

import Loading from "../components/Loading"
import { getArticleByID, saveArticle } from "../services/articles";
import { getStorage, ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage"

const TEXTAREA_STYLE =
  "outline outline-1 outline-gray-300 focus:outline-blue-300 focus:outline-2 w-full bg-transparent";

const ArticleEdit = () => {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [hasSaved, setHasSaved] = useState(true);
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState(null)
  const [previewURL, setPreviewURL] = useState(null)
  const [error, setError] = useState("");
  const [imageChange, setImageChange] = useState(false)

  const storage = getStorage()
  const fileRef = useRef(null)

  // Load the original text data from the article database
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setError("");
        const data = await getArticleByID(id);
        if (!cancelled) setArticle(data);
      } catch (e) {
        if (!cancelled) setError(e?.message ?? "Failed to load article");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Run to set a preview if the image has been cleared
  useEffect(() => {
    if (!image) {
      setPreviewURL(null)
      return
    }

    const url = URL.createObjectURL(image)
    setPreviewURL(url)

    return () => URL.revokeObjectURL(url)
  }, [image])

  const onChangeField = (field) => (e) => {
    const value = e.target.value;
    setArticle((prev) => ({ ...(prev ?? {}), [field]: value }));
    setHasSaved(false)
  };

  const clearImage = async () => {
    setImage(null);
    setPreviewURL(null);
    setImageChange(true);
    setHasSaved(false);

    setArticle((prev) => ({
      ...(prev ?? {}),
      image_url: null,
    }));
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSave = async () => {
    if (!id || !article) return;

    setSaving(true);
    setError("");

    try {
      let nextArticle = { ...article };

      if (imageChange) {
        // If user selected a new image, upload it and store the new URL.
        if (image) {
          const imageRef = ref(storage, `images/${id}`);

          await uploadBytes(imageRef, image, {
            contentType: image.type,
            cacheControl: "public, max-age=31536000",
          });

          const url = await getDownloadURL(imageRef);

          nextArticle = {
            ...nextArticle,
            image_url: url,
          };

          setArticle(nextArticle);
          setImage(null);
          setPreviewURL(null);
        }

        if (!image && !nextArticle.image_url) {
          try {
            await deleteObject(ref(storage, `images/${id}`));
          } catch (e) {
            if (e?.code !== "storage/object-not-found") {
              console.error("Failed to delete Firebase image:", e);
            }
          }
        }
      setImageChange(false);
      }

      await saveArticle({
        id,
        ...nextArticle,
      });

      setHasSaved(true);
    } catch (e) {
      setError(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (!article) return <Loading/>;

  return (
    <div className="max-w-[90%] mx-auto lg:max-w-[55%] flex flex-col gap-2">
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

      {/* The original image */}
      {article.image_url && !imageChange && (
        <div className="max-w-full mx-auto my-2 relative lg:my-2">
          <img
            src={article.image_url}
            alt={article.title}
            className="block mx-auto max-w-full h-auto rounded"
          />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 text-3xl z-20 text-red-500 hover:text-red-700 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Select a new image image */}
      {!image && (imageChange || !article.image_url) && (<div className={`${TEXTAREA_STYLE} relative`}>
        <input
          type="file"
          ref={fileRef}
          className="w-full file:mr-4 file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-l file:font hover:file:bg-gray-200"
          onChange={(e) => {setImage(e.target.files[0]); setImageChange(true); setHasSaved(false);}}
          />
        </div>)}

      {/* Display the new image */}      
      {image && imageChange && (<div className = "max-w-full mx-auto my-2 relative lg:my-2">
          <img src={previewURL} className="block mx-auto max-w-full h-auto rounded"/>
          <button onClick={clearImage} className="absolute top-2 right-2 text-3xl z-20 text-red-500 hover:text-red-700 font-bold">
              ×
          </button>
          </div>)}

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
