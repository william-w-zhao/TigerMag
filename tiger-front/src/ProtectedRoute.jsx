import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./auth";

const ALLOWED_EMAILS = new Set([
  "williamzhao08@gmail.com",
  "fzhao03@gmail.com",
  "wz5069@princeton.edu",
]);

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If something in auth changes (such as a log-in), set the User to u and set Loading to false
    const userChange = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return userChange;
  }, []);

  // If it is currently loading, say loading
  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;

  //
  const email = (user) ? user.email : "";
  // Check if the email is allowed
  const allowed =
    ALLOWED_EMAILS.has(email)

  if (!user) return <Navigate to="/login" replace />;
  if (!allowed) return <Navigate to="/no-access" replace />;

  return children;
}

export default ProtectedRoute
