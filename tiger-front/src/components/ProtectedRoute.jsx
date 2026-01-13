import { useLocation, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase/db";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth } from "../firebase/auth";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  // Set the user
  const [user, setUser] = useState(null);
  // Checks if there is a user logged-in
  const [authLoading, setAuthLoading] = useState(true);
  // Checks if the whitelist is currently loading
  const [checking, setChecking] = useState(false);
  // Checks if the whitelist has been fully loaded
  const [checked, setChecked] = useState(false);
  // Set the whitelist
  const [allowed, setAllowed] = useState(false)

  const location = useLocation()

  // On first rendering, set the user
  useEffect(() => {
    const userChange = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthLoading(false)
    });
    return userChange
  }, []);

  // Every time user changes, run this to check the whitelist
  useEffect(() => {
    const checkUser = async () => {
      // If there is no user, return
      if (!user) {
        setChecked(false)
        setAllowed(false)
        return;
      }
      
      setChecking(true)
      try {
        const email = (user.email ?? "").trim().toLowerCase();
        if (!email) {
          setAllowed(false);
          return;
        }
        const snap = await getDoc(doc(db, "whitelist", email));
        setAllowed(snap.exists());
        } catch (e) {
          console.error("Failed to load whitelist:", e?.code, e?.message, e);
        } finally {
          setChecking(false);
          setChecked(true);
        }
    }
    checkUser()
  }, [user])

  // If the user is loading, redirect to the loading screen
  if (authLoading) return <div style={{ padding: 24 }}><Loading/></div>

  // If there is no user, redirect to the login page
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  // If the whitelist is still loading, redirect to loading screen
  if (checking || !checked) return <div style={{ padding: 24 }}><Loading/></div>

  // If the user is not allowed, redirect to the no-access page
  if (!allowed) return <Navigate to="/no-access" replace />

  // Else, return to the given, previous page
  return children
}

export default ProtectedRoute
