import { signInWithCustomToken, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./auth";
import { supabase } from "../services/supabaseClient";

// Set VITE_MINT_TOKEN_URL to the deployed mintFirebaseToken function, e.g.
//   https://us-central1-the-princeton-tiger.cloudfunctions.net/mintFirebaseToken
const MINT_TOKEN_URL = import.meta.env.VITE_MINT_TOKEN_URL;

let lastSyncedAccessToken = null;

// Given the current Supabase session, make sure the Firebase Auth session
// matches it. Called on load and on every Supabase auth state change, so
// Firebase Storage's request.auth stays in sync with whoever is actually
// logged in via Supabase.
async function syncFirebaseSession(session) {
  const accessToken = session?.access_token ?? null;

  // Nothing changed since the last sync — skip the round trip.
  if (accessToken === lastSyncedAccessToken) return;
  lastSyncedAccessToken = accessToken;

  if (!accessToken) {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Already signed out of Firebase — fine.
    }
    return;
  }

  if (!MINT_TOKEN_URL) {
    console.error(
      "VITE_MINT_TOKEN_URL is not set — Firebase Storage uploads will fail permission-denied."
    );
    return;
  }

  try {
    const res = await fetch(MINT_TOKEN_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      throw new Error(`mintFirebaseToken responded ${res.status}`);
    }

    const { token } = await res.json();
    await signInWithCustomToken(auth, token);
  } catch (err) {
    console.error("Failed to establish Firebase session from Supabase login:", err);
  }
}

// Call once near app startup (e.g. in App.jsx). Returns an unsubscribe
// function for cleanup.
export function initFirebaseAuthBridge() {
  supabase.auth.getSession().then(({ data: { session } }) => {
    syncFirebaseSession(session);
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    syncFirebaseSession(session);
  });

  return () => subscription.unsubscribe();
}
