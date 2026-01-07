import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, loginWithGoogle } from "../auth"; 

const LoginButton = () => {
  const [loggingIn, setLoggingIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/editor", { replace: true });
    });
    return unsub;
  }, [navigate]);

  const handleLogin = async () => {
    if (loggingIn) return;
    setLoggingIn(true);

    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <button type="button" onClick={handleLogin} disabled={loggingIn} className="px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50">
      {loggingIn ? "Signing in..." : "Sign in with Google"}
    </button>
  );
};

export default LoginButton;