import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, loginWithGoogle } from "../firebase/auth"; 

const Login = () => {
  const [loggingIn, setLoggingIn] = useState(false);

  const navigate = useNavigate();

  // Track the path URL from the previous page (location)
  const from = location.state?.from?.pathname || "/editor"

  // Load the user
  useEffect(() => {
    const loadUser = onAuthStateChanged(auth, (user) => {
      // If the user exists, navigate to the previous URL
      if (user) navigate(from, { replace: true });
    });
    return loadUser;
  }, [navigate]);

  const handleLogin = async () => {
    if (loggingIn) return; // If already logging in, return
    setLoggingIn(true);

    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
    } finally {
      setLoggingIn(false);
    }
  }

  return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold">Login</h1>
          <button type="button" onClick={handleLogin} disabled={loggingIn} className="px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50">
            {loggingIn ? "Signing in..." : "Sign in with Google"}
          </button>
        </div>
    </div>
  );
};

export default Login;
