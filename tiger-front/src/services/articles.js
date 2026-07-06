import { supabase } from "./supabaseClient";
import { parseAuthorNames, linkAuthorsToArticle } from "./authors";

const articleSelect = `
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
`;

function normalizeArticle(article) {
  return {
    ...article,
    authors:
      article.article_authors
        ?.sort((a, b) => a.author_order - b.author_order)
        .map((row) => row.author) ?? [],
  };
}

export async function getArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select(articleSelect)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(normalizeArticle);
}

export async function getArticleByID(id) {
  const { data, error } = await supabase
    .from("articles")
    .select(articleSelect)
    .eq("id", id)
    .single();

  if (error) throw error;
  return normalizeArticle(data);
}

export async function saveArticle(article) {
  const authorNames = parseAuthorNames(article.author ?? "");

  const articleRow = {
    id: article.id,
    section: article.section,
    title: article.title,
    description: article.description,
    author: article.author,
    content: article.content,
    image_url: article.image_url ?? null,
  };

  const { data, error } = await supabase
    .from("articles")
    .upsert([articleRow])
    .select()
    .single();

  if (error) throw error;

  await linkAuthorsToArticle(data.id, authorNames);

  return data;
}

export async function deleteArticle(id) {
  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) throw error;
}