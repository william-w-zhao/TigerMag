import { supabase } from "./supabaseClient";

export async function getIssues() {
  const { data, error } = await supabase
    .from("issues")
    .select("*")
    .order("issue_date", { ascending: false });

  if (error) throw error;

  return data;
}

export async function getIssueByID(id) {
  const { data, error } = await supabase
    .from("issues")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}