const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { createClient } = require("@supabase/supabase-js");

admin.initializeApp();

// Set these once with:
//   firebase functions:secrets:set SUPABASE_URL
//   firebase functions:secrets:set SUPABASE_SERVICE_ROLE_KEY
// The service role key must NEVER be exposed to the client — it lives only here.
const SUPABASE_URL = defineSecret("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = defineSecret("SUPABASE_SERVICE_ROLE_KEY");

/**
 * Exchanges a valid Supabase session for a Firebase custom token.
 *
 * Client flow:
 *   1. User logs in with Supabase (services/auth.js) as today.
 *   2. Client POSTs here with `Authorization: Bearer <supabase access_token>`.
 *   3. This function verifies the token against Supabase itself (not just
 *      decoded locally), checks the editor_whitelist table server-side,
 *      and mints a Firebase custom token carrying an `allowed` claim.
 *   4. Client calls signInWithCustomToken(auth, token) to get a real
 *      Firebase Auth session, so storage.rules can see request.auth.
 *
 * This is the ONLY place "allowed" is decided for Storage access — the
 * whitelist check here can't be bypassed by calling the client SDK directly,
 * unlike a check that only lives in React.
 */
exports.mintFirebaseToken = onRequest(
  {
    secrets: [SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY],
    cors: true,
  },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const authHeader = req.get("Authorization") || "";
    const supabaseAccessToken = authHeader.replace(/^Bearer\s+/i, "").trim();

    if (!supabaseAccessToken) {
      res.status(401).json({ error: "Missing Supabase access token" });
      return;
    }

    const supabaseAdmin = createClient(
      SUPABASE_URL.value(),
      SUPABASE_SERVICE_ROLE_KEY.value(),
      { auth: { persistSession: false } }
    );

    // Ask Supabase who this token actually belongs to — do not trust a
    // locally-decoded JWT, let Supabase validate it.
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(supabaseAccessToken);

    if (userError || !user) {
      logger.warn("Rejected token mint: invalid Supabase session", { userError });
      res.status(401).json({ error: "Invalid Supabase session" });
      return;
    }

    const email = (user.email || "").trim().toLowerCase();

    if (!email) {
      res.status(401).json({ error: "Supabase user has no email" });
      return;
    }

    const { data: editor, error: editorError } = await supabaseAdmin
      .from("editor_whitelist")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (editorError) {
      logger.error("Editor whitelist check failed", editorError);
      res.status(500).json({ error: "Failed to check editor whitelist" });
      return;
    }

    const allowed = !!editor;

    const customToken = await admin.auth().createCustomToken(user.id, {
      email,
      allowed,
    });

    res.status(200).json({ token: customToken, allowed });
  }
);
