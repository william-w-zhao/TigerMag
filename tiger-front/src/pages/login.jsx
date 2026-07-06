import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { signIn } from "../services/auth";
import { posthog } from "../services/posthog";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loggingIn, setLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/editor";

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        navigate(from, { replace: true });
      }
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        navigate(from, { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, from]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loggingIn) return;

    setLoggingIn(true);
    setErrorMessage("");

    try {
      const data = await signIn(email, password);
      posthog.identify(data.user.id, { email: data.user.email });
      posthog.capture("user_logged_in");
      navigate(from, { replace: true });
    } catch (err) {
      posthog.captureException(err);
      console.error(err);
      setErrorMessage(err.message || "Failed to log in.");
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <form onSubmit={handleLogin} className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Login</h1>

        <input
          type="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 rounded border border-gray-300"
          required
        />

        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 rounded border border-gray-300"
          required
        />

        {errorMessage && (
          <p className="text-red-600 text-sm">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={loggingIn}
          className="px-4 py-2 rounded border border-gray-300 bg-white hover:bg-gray-50"
        >
          {loggingIn ? "Signing in..." : "Log in"}
        </button>
      </form>
    </div>
  );
};

export default Login;