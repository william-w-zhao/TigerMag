import { useState, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";

import { fetchAllArticles, deleteArticle } from "../firebase/db"
import Loading from "../components/Loading"

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const ArticleListEntry = ({ article, onDeleted }) => {
  let [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const navigate = useNavigate()

  const handleDelete = async (id) => {
        setIsDeleteOpen(false)
        await deleteArticle(id)
        onDeleted(id)
  }

  return (
    <div className="flex justify-between pt-1 pb-2 px-2 even:bg-gray-100">
      <div className="flex-col">
        <button onClick={() => {navigate(`/articles/${article.id}`)}}
          className="italic text-2xl font-bold hover:underline hover:cursor-pointer hover:text-blue-600 active:text-blue-800">{article.title}
        </button>
        <h2 className="italic text-lg text-gray-500">{article.description}</h2>
        <p className="text-l text-gray-500">By {article.author}</p>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => {navigate(`/articles/${article.id}/edit`)}}>
          <FontAwesomeIcon className="text-gray-400 hover:text-black hover:cursor-pointer active:text-gray-400" icon={faPenToSquare} />
        </button>
        <button onClick={() => setIsDeleteOpen(true)}>
          <FontAwesomeIcon className="text-gray-400 hover:text-red-400 hover:cursor-pointer active:text-gray-400" icon={faTrashCan} />
        </button>
      </div>
        <Transition appear show={isDeleteOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setIsDeleteOpen(false)}>
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
          <DialogTitle className="font-bold text-lg">Delete article?</DialogTitle>
            <p className="mt-2">
              <span className="font-semibold">"{article.title}"</span> will be deleted forever. This cannot be undone.
            </p>
          <div className="mt-4 flex justify-end gap-4">
            <button onClick={() => setIsDeleteOpen(false)} className="font-semibold hover:underline hover:cursor-pointer">
              Cancel
            </button>
            <button onClick={() => handleDelete(article.id)} className="font-semibold text-red-500 hover:underline hover:cursor-pointer">
              Delete Forever
            </button>
          </div>
          </DialogPanel>
          </TransitionChild>
        </div>
        </Dialog>
        </Transition>
      </div>
    )
}

const ArticleList = () => {

  const [articles, setArticles] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setError("");
        const data = await fetchAllArticles();
        if (!cancelled) setArticles(data);
      } catch (e) {
        if (!cancelled) setError(e?.message ?? "Failed to load article");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!articles) return <Loading/>;

  const handleDeleted = (id) => {
    setArticles((prev) => prev?.filter((a) => a.id !== id));
  };

    return (
        <div className="outline-solid outline-gray-300">
          {articles.map((article) => (<ArticleListEntry key = {article.id} article={article} onDeleted={handleDeleted}/>))}
        </div>
    )
}

export default ArticleList
