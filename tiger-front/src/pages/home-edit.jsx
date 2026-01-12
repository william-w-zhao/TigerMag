import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import CardLarge from "../components/CardLarge";
import CardMedium from "../components/CardMedium";
import CardSmall from "../components/CardSmall";
import { db } from "../firebase/db";

const HomeEdit = () => {
  const DEFAULT = {
    a1: null, 
    b1: null, b2: null,
    c1: null, c2: null, c3: null, c4: null, c5: null,
    d1: null, d2: null, d3: null, d4: null,
    e1: null, e2: null
  }

  const editMode = true; 

  const [layout, setLayout] = useState(DEFAULT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLayout = async () => {
      try {
        const data = await getDoc(doc(db, "layouts", "home"))
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
        await updateDoc(doc(db, "layouts", "home"), {[slot]: id})
    }
    catch (e) {
        console.error("Firestore write failed:", e);
    }}

  const removeArticle = async (slot) => {
    setLayout((existing) => ({ ...existing, [slot]: null }))
    await updateDoc(doc(db, "layouts", "home"), {[slot]: null})
  }

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>

  return (
        <div className="min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] items-stretch gap-3">
            <section className="order-1 lg:order-2 h-full lg:border-l lg:border-r lg:border-gray-200 lg:px-4 bg-white">
                <CardLarge articleID={layout.a1} setArticle={(id) => loadArticle("a1", id)} removeArticle={() => removeArticle("a1")} editMode={editMode}/>
            </section>
            <section className="order-2 lg:order-1 h-full flex flex-col divide-y divide-gray-200">
                <CardMedium articleID={layout.b1} setArticle={(id) => loadArticle("b1", id)} removeArticle={() => removeArticle("b1")} editMode={editMode}/>
                <CardMedium articleID={layout.b2} setArticle={(id) => loadArticle("b2", id)} removeArticle={() => removeArticle("b2")} editMode={editMode}/>
            </section>
            <section className="order-3 lg:order-3 h-full flex flex-col divide-y divide-gray-200">
                <CardSmall articleID={layout.c1} setArticle={(id) => loadArticle("c1", id)} removeArticle={() => removeArticle("c1")} editMode={editMode}/>
                <CardSmall articleID={layout.c2} setArticle={(id) => loadArticle("c2", id)} removeArticle={() => removeArticle("c2")} editMode={editMode}/>
                <CardSmall articleID={layout.c3} setArticle={(id) => loadArticle("c3", id)} removeArticle={() => removeArticle("c3")} editMode={editMode}/>
                <CardSmall articleID={layout.c4} setArticle={(id) => loadArticle("c4", id)} removeArticle={() => removeArticle("c4")} editMode={editMode}/>
                <CardSmall articleID={layout.c5} setArticle={(id) => loadArticle("c5", id)} removeArticle={() => removeArticle("c5")} editMode={editMode}/>
            </section>
            </div>
            <hr className="h-[1.5px] w-full border-0 bg-[#DEDEDE] my-8" />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-6">
                <CardMedium articleID={layout.d1} setArticle={(id) => loadArticle("d1", id)} removeArticle={() => removeArticle("d1")} editMode={editMode}/>
                    <div className="hidden lg:block w-px bg-gray-200" />
                <CardMedium articleID={layout.d2} setArticle={(id) => loadArticle("d2", id)} removeArticle={() => removeArticle("d2")} editMode={editMode}/>
                    <div className="hidden lg:block w-px bg-gray-200" />
                <CardMedium articleID={layout.d3} setArticle={(id) => loadArticle("d3", id)} removeArticle={() => removeArticle("d3")} editMode={editMode}/>
                    <div className="hidden lg:block w-px bg-gray-200" />
                <CardMedium articleID={layout.d4} setArticle={(id) => loadArticle("d4", id)} removeArticle={() => removeArticle("d4")} editMode={editMode}/>
            </div>
            <hr className="h-[1.5px] w-full border-0 bg-[#DEDEDE] my-8" />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6">
                <CardMedium articleID={layout.e1} setArticle={(id) => loadArticle("e1", id)} removeArticle={() => removeArticle("e1")} editMode={editMode}/>
                    <div className="hidden lg:block w-px bg-gray-200" />
                <CardMedium articleID={layout.e2} setArticle={(id) => loadArticle("e2", id)} removeArticle={() => removeArticle("e2")} editMode={editMode}/>
            </div>
        </div>
    )
}

export default HomeEdit