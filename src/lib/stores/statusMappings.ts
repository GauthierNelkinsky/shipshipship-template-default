import { writable } from "svelte/store";
import { api } from "$lib/api";

export interface StatusMapping {
  id: number;
  display_name: string;
  slug: string;
  order: number;
  is_reserved: boolean;
}

export interface StatusMappings {
  [categoryId: string]: StatusMapping[];
}

const defaultStatusMappings: StatusMappings = {};

function createStatusMappingsStore() {
  const { subscribe, set, update } = writable<StatusMappings>(defaultStatusMappings);

  let loaded = false;

  return {
    subscribe,
    load: async () => {
      if (loaded) return;

      try {
        const mappingsData = await api.getStatusMappings();

        if (
          mappingsData.categories &&
          typeof mappingsData.categories === "object"
        ) {
          set(mappingsData.categories);
        }
        loaded = true;
      } catch (err) {
        console.error("Error loading status mappings:", err);
        // Keep default values on error
      }
    },
    reset: () => {
      loaded = false;
      set(defaultStatusMappings);
    },
    getCategory: (categoryId: string): StatusMapping[] => {
      let mappings: StatusMapping[] = [];
      subscribe((statusMappings) => {
        mappings = statusMappings[categoryId] || [];
      })();
      return mappings;
    },
  };
}

export const statusMappings = createStatusMappingsStore();
