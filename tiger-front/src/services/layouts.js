import { supabase } from "./supabaseClient";

export async function getLayoutModules(layoutID) {
  const { data, error } = await supabase
    .from("layout_modules")
    .select("*")
    .eq("layout_id", layoutID)
    .order("module_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function updateLayoutModuleSlot(layoutID, moduleKey, slot, articleID) {
  const { data: module, error: fetchError } = await supabase
    .from("layout_modules")
    .select("config")
    .eq("layout_id", layoutID)
    .eq("module_key", moduleKey)
    .single();

  if (fetchError) throw fetchError;

  const updatedConfig = {
    ...(module.config ?? {}),
    slots: {
      ...(module.config?.slots ?? {}),
      [slot]: articleID,
    },
  };

  const { data, error } = await supabase
    .from("layout_modules")
    .update({
      config: updatedConfig,
      updated_at: new Date().toISOString(),
    })
    .eq("layout_id", layoutID)
    .eq("module_key", moduleKey)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeLayoutModuleSlot(layoutID, moduleKey, slot) {
  return updateLayoutModuleSlot(layoutID, moduleKey, slot, null);
}

// Optional aliases so your existing Home.jsx does not break
export function getHomeModules() {
  return getLayoutModules("home");
}

export function updateHomeModuleSlot(moduleKey, slot, articleID) {
  return updateLayoutModuleSlot("home", moduleKey, slot, articleID);
}

export function removeHomeModuleSlot(moduleKey, slot) {
  return removeLayoutModuleSlot("home", moduleKey, slot);
}