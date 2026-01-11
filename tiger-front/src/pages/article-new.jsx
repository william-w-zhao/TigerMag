import { useState, Fragment } from "react";
import { useNavigate } from "react-router-dom"
import { newArticle } from "../firebase/db"

import TextareaAutosize from "react-textarea-autosize";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'

const TEXTAREA_STYLE =
  "outline outline-1 outline-gray-300 focus:outline-blue-300 focus:outline-2 w-full bg-transparent";

const ArticleNew = () => {

  let [isPublishOpen, setIsPublishOpen] = useState(false)

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
      setIsPublishOpen(false)
      navigate(`/articles/${id}`)
  }

  return (
    <div className="max-w-[55%] mx-auto flex flex-col gap-2">
      <h1 className="text-5xl font-bold">New Article</h1>
      <hr className="text-gray-300 mb-2"/>
      <div className="flex justify-end">
        <button
          onClick={() => setIsPublishOpen(true)}
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
        <Transition appear show={isPublishOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50"
              onClose={() => setIsPublishOpen(false)}
            >
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/50" />
              </TransitionChild>

              <div className="fixed inset-0 flex items-center justify-center p-4">
                <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <DialogPanel className="w-full max-w-lg rounded-lg bg-white p-4 shadow-lg">
                    <DialogTitle className="font-bold text-lg">
                      Publish article?
                    </DialogTitle>

                    <p className="mt-2">
                      <span className="font-semibold">"{article.title}"</span> will
                      be released for all to see. Are you suuuuuuure ur not gonna get canceled?
                    </p>

                    <div className="mt-4 flex justify-end gap-4">
                      <button
                        onClick={() => setIsPublishOpen(false)}
                        className="font-semibold hover:underline hover:cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSubmit(article)}
                        className="font-semibold text-green-400 hover:underline hover:cursor-pointer"
                      >
                        Publish!
                      </button>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </Dialog>
          </Transition>
    </div>
  );
};

export default ArticleNew;
