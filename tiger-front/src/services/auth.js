import { supabase } from "./supabaseClient";

const ALLOWED_EMAIL_ENDING = "@princeton.edu";

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function isAllowedEmail(email) {
  return normalizeEmail(email).endsWith(ALLOWED_EMAIL_ENDING);
}

export async function signUp(email, password) {
  const normalizedEmail = normalizeEmail(email);

  if (!isAllowedEmail(normalizedEmail)) {
    throw new Error(`Please sign up with a ${ALLOWED_EMAIL_ENDING} email address.`);
  }

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signIn(email, password) {
  const normalizedEmail = normalizeEmail(email);

  if (!isAllowedEmail(normalizedEmail)) {
    throw new Error(`Please log in with a ${ALLOWED_EMAIL_ENDING} email address.`);
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) return null;
  return user;
}