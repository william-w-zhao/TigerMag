import { useLocation, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { getEditor } from "../services/whitelist";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  const lastUserIDRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) return;

      setUser(user);
      lastUserIDRef.current = user?.id ?? null;
      setAuthLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      const nextUserID = nextUser?.id ?? null;

      setUser(nextUser);
      setAuthLoading(false);

      // Only reset the editor check if the actual user changed.
      if (nextUserID !== lastUserIDRef.current) {
        lastUserIDRef.current = nextUserID;
        setChecked(false);
        setAllowed(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function checkUser() {
      if (!user) {
        setChecked(true);
        setAllowed(false);
        return;
      }

      setChecking(true);

      try {
        const editor = await getEditor();

        if (!cancelled) {
          setAllowed(!!editor);
          setChecked(true);
        }
      } catch (e) {
        console.error("Failed to load editor whitelist:", e?.message, e);

        if (!cancelled) {
          setAllowed(false);
          setChecked(true);
        }
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    }

    if (!checked) {
      checkUser();
    }

    return () => {
      cancelled = true;
    };
  }, [user, checked]);

  if (authLoading) {
    return (
      <div style={{ padding: 24 }}>
        <Loading />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Only show full-page loading before the first completed editor check.
  // Do not replace children during later background checks.
  if (!checked) {
    return (
      <div style={{ padding: 24 }}>
        <Loading />
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/no-access" replace />;
  }

  return children;
};

export default ProtectedRoute;