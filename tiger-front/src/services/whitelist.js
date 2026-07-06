import { supabase } from "./supabaseClient";

export async function getEditorByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await supabase
    .from("editor_whitelist")
    .select("*")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    console.error("Error checking editor whitelist:", error);
    return null;
  }

  return data;
}

export async function getEditor() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user?.email) {
    console.error("No Supabase user found:", authError);
    return null;
  }

  return getEditorByEmail(user.email);
}