import { app } from "./firebaseconfig"
import { getFirestore } from "firebase/firestore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";


export const db = getFirestore(app);

const fetchArticle = async (id) => {
  const docRef = doc(db, "articles", id);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    return (snap.data());
  } else {
    return null;
  }
}

const fetchAllArticles = async () => {
  const snap = await getDocs(collection(db, "articles"));
  return snap.docs.map(doc=> ({
      id: doc.id,
      ...doc.data()
    }))
}

const updateArticle = async (id, data) => {
  const articleRef = doc(db, "articles", id);
  return updateDoc(articleRef, data);
};


const newArticle = async (article) => {

    const docRef = await addDoc(collection(db, "articles"), {
        ...article,
        'createdAt': serverTimestamp()})

    return docRef.id
}

export { fetchArticle, fetchAllArticles, updateArticle, newArticle }



