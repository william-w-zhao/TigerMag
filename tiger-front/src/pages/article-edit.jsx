import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";

import Loading from "../components/Loading"
import { fetchArticle, updateArticle } from "../firebase/db";
import { getStorage, ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage"

const TEXTAREA_STYLE =
  "outline outline-1 outline-gray-300 focus:outline-blue-300 focus:outline-2 w-full bg-transparent";

const ArticleEdit = () => {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [hasSaved, setHasSaved] = useState(true);
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [previewURL, setPreviewURL] = useState(null)
  const [error, setError] = useState("");
  const [imageChange, setImageChange] = useState(false)
  const [imagePath, setImagePath] = useState(null)

  const storage = getStorage()
  const fileRef = useRef(null)

  // Load the original text data from the article database
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

  // Check if there is an image already associated with the article and set ImageUrl if there is
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
        if (!cancelled) {
          setImagePath(option);
          setImageUrl(url);
        }
        return
        }
        catch (e) {
          if (e?.code === "storage/object-not-found") continue
          else break
        }}
  
      if (!cancelled) {
        setImageUrl(null);
        setImagePath(null)
      }})();
      return () => {
        cancelled = true;
      };
    }, [id, storage])

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
      setImageUrl(null);
      setPreviewURL(null);
      setImageChange(true);
      setHasSaved(false);
      if (fileRef.current) fileRef.current.value = "";
  }

  const handleSave = async () => {
    if (!id || !article) return;

    setSaving(true);
    setError("");
    try {
      await updateArticle(id, article);
      if (imageChange) {
        if (imagePath && !image) {
          await deleteObject(ref(storage, imagePath));
          setImagePath(null);
          setImageUrl(null);
        }
        if (image) {
          const path = imagePath ?? `images/${id}`; // keep old path if it exists
          const imageRef = ref(storage, path);

          await uploadBytes(imageRef, image);
          const url = await getDownloadURL(imageRef);

          setImagePath(path);
          setImageUrl(url);
          setImage(null);
          setPreviewURL(null);
        }
        setImageChange(false)
      }
    } catch (e) {
      setError(e?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
    if (hasSaved == false){
          setHasSaved(true)
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
      {imageUrl && !imageChange && (<div className = "max-w-full mx-auto my-2 relative lg:my-2">
          <img src={imageUrl} className="block mx-auto max-w-full h-auto rounded"/>
          <button onClick={clearImage} className="absolute top-2 right-2 text-3xl z-20 text-red-500 hover:text-red-700 font-bold">
              ×
          </button>
          </div>)}

      {/* Select a new image image */}
      {!image && (imageChange || !imageUrl) && (<div className={`${TEXTAREA_STYLE} relative`}>
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
