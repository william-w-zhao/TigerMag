import { supabase } from "./supabaseClient";

export async function getHomeModules() {
  const { data, error } = await supabase
    .from("layout_modules")
    .select("*")
    .eq("layout_id", "home")
    .order("module_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function updateHomeModuleSlot(moduleKey, slot, articleID) {
  const { data: module, error: fetchError } = await supabase
    .from("layout_modules")
    .select("config")
    .eq("layout_id", "home")
    .eq("module_key", moduleKey)
    .single();

  if (fetchError) throw fetchError;

  const updatedConfig = {
    ...module.config,
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
    .eq("layout_id", "home")
    .eq("module_key", moduleKey)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeHomeModuleSlot(moduleKey, slot) {
  return updateHomeModuleSlot(moduleKey, slot, null);
}