import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import ArticleDisplay from "../components/ArticleDisplay";
import CardLarge from "../components/CardLarge";
import CardMedium from "../components/CardMedium";
import Loading from "../components/Loading";
import { db } from "../firebase/db";

const NewsEdit = () => {
  const DEFAULT = {
    a1: null, a2: null, a3: null, a4: null,
    b1: null, b2: null, b3: null, b4: null, b5: null, b6: null, b7: null, b8: null, b9: null, b10: null
  }

  const editMode = true; 

  const [layout, setLayout] = useState(DEFAULT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLayout = async () => {
      try {
        const data = await getDoc(doc(db, "layouts", "news"))
        if (data.exists()) setLayout((existing) => ({ ...existing, ...data.data() }))
      }
      catch (e) {
        console.log('Failed to load layout', e)
      }
      finally {
        setLoading(false)
      }
    }
    loadLayout()
  }, [])

  const loadArticle = async (slot, id) => {
    setLayout((existing) => ({ ...existing, [slot]: id }))
    try {
        await updateDoc(doc(db, "layouts", "news"), {[slot]: id})
    }
    catch (e) {
        console.error("Firestore write failed:", e);
    }}

  const removeArticle = async (slot) => {
    setLayout((existing) => ({ ...existing, [slot]: null }))
    await updateDoc(doc(db, "layouts", "news"), {[slot]: null})
  }

  if (loading) return <div style={{ padding: 24 }}><Loading/></div>

  return (
        <div className="min-h-screen">
            <h1 className="text-4xl font-extrabold text-left mb-4">News</h1>
            <hr className="h-[1.5px] w-full border-0 bg-[#DEDEDE] mt-4 mb-2" />
            <hr className="h-[1.5px] w-full border-0 bg-[#DEDEDE] mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] items-stretch gap-3">
            <section className="order-1 h-full lg:border-r lg:border-gray-200 lg:pr-4 bg-white">
                <CardLarge articleID={layout.a1} setArticle={(id) => loadArticle("a1", id)} removeArticle={() => removeArticle("a1")} editMode={editMode}/>
            </section>
            <section className="order-2 h-full flex flex-col divide-y divide-gray-200">
                <CardMedium articleID={layout.b1} setArticle={(id) => loadArticle("b1", id)} removeArticle={() => removeArticle("b1")} editMode={editMode}/>
                <CardMedium articleID={layout.b2} setArticle={(id) => loadArticle("b2", id)} removeArticle={() => removeArticle("b2")} editMode={editMode}/>
                <CardMedium articleID={layout.b3} setArticle={(id) => loadArticle("b3", id)} removeArticle={() => removeArticle("b3")} editMode={editMode}/>
            </section>
            </div>
            <hr className="h-[1.5px] w-full border-0 bg-[#DEDEDE] mt-4 mb-2" />
            <hr className="h-[1.5px] w-full border-0 bg-[#DEDEDE] mb-8" />
            <div className="max-w-[90%] mx-auto lg:max-w-[70%]">
                <ArticleDisplay section={"NEWS"}/>
            </div>
        </div>
    )
}

export default NewsEdit