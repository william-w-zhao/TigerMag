import { supabase } from "./supabaseClient";

function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseAuthorNames(authorText) {
  return authorText
    .split(/,| and /i)
    .map((name) => name.trim())
    .filter(Boolean);
}

export async function getAuthors() {
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getAuthorBySlug(slug) {
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}

export async function getOrCreateAuthorByName(name) {
  const cleanName = name.trim();
  const slug = slugify(cleanName);

  // try to find an existing author by slug
  const { data: existingAuthor, error: findError } = await supabase
    .from("authors")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (findError) throw findError;

  if (existingAuthor) return existingAuthor;

  // create a new author by slug
  const { data: newAuthor, error: insertError } = await supabase
    .from("authors")
    .insert({
      name: cleanName,
      slug,
    })
    .select()
    .single();

  if (insertError) throw insertError;

  return newAuthor;
}

export async function linkAuthorsToArticle(articleID, authorNames) {
  const authors = [];

  for (const name of authorNames) {
    const author = await getOrCreateAuthorByName(name);
    authors.push(author);
  }

  // remove old authors to prevent duplicates
  const { error: deleteError } = await supabase
    .from("article_authors")
    .delete()
    .eq("article_id", articleID);

  if (deleteError) throw deleteError;

  if (authors.length === 0) return authors;

  // store indices to maintain author order in display
  const rows = authors.map((author, index) => ({
    article_id: articleID,
    author_id: author.id,
    author_order: index,
  }));

  const { error: insertError } = await supabase
    .from("article_authors")
    .insert(rows);

  if (insertError) throw insertError;

  return authors;
}

export async function getArticlesByAuthorID(authorID) {
  const { data, error } = await supabase
    .from("article_authors")
    .select(`
      author_order,
      article:articles (
        *,
        article_authors (
          author_order,
          author:authors (
            id,
            name,
            slug,
            bio,
            image_id
          )
        )
      )
    `)
    .eq("author_id", authorID)
    .order("author_order", { ascending: true });

  if (error) throw error;

  return data.map((row) => row.article);
}

export async function saveAuthor(author) {
  const { data, error } = await supabase
    .from("authors")
    .upsert([author])
    .select();

  if (error) throw error;
  return data;
}

export async function deleteAuthor(id) {
  const { error } = await supabase.from("authors").delete().eq("id", id);

  if (error) throw error;
}