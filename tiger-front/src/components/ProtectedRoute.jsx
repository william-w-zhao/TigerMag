import { useLocation, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase/db";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth } from "../firebase/auth";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dbLoading, setDbLoading] = useState(true);
  const [whitelist, setWhitelist] = useState(new Set())
  const location = useLocation()

  useEffect(() => {
    const loadWhitelist = async () => {
      try {
        const data = await getDocs(collection(db, "whitelist"))
        const emails = new Set()
        data.forEach((doc) => {
          emails.add(doc.data().email)})
        setWhitelist(emails)
        console.log({whitelist})
      }
      catch (e) {
        console.error("Firestore write failed:", e);
      }
      finally {
        setDbLoading(false)
      }
    }
    loadWhitelist()
  }, [])

  useEffect(() => {
    const userChange = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthLoading(false)
    });
    return userChange
  }, []);

  if (authLoading || dbLoading) return <div style={{ padding: 24 }}><Loading/></div>

  const email = (user) ? user.email : "";
  const allowed = whitelist.has(email)

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (!allowed) return <Navigate to="/no-access" replace />

  return children
}

export default ProtectedRoute
