import { writable } from "svelte/store";
import { api } from "$lib/api";

// Helper function to convert hex color to HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  // Remove the # if present
  hex = hex.replace(/^#/, "");

  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Apply primary color to CSS custom properties
function applyPrimaryColor(color: string | undefined) {
  if (typeof window === "undefined" || !color) return;

  try {
    const hsl = hexToHsl(color);
    document.documentElement.style.setProperty(
      "--primary",
      `${hsl.h} ${hsl.s}% ${hsl.l}%`,
    );
  } catch (error) {
    console.error("Error applying primary color:", error);
  }
}

export interface ThemeSettings {
  // Header
  "display-title-in-header"?: boolean;
  "logo-light"?: string;
  "logo-dark"?: string;

  // Theme
  "primary-color"?: string;

  // Footer
  "footer-links-left"?: Array<{ displayName: string; url: string }>;
  "footer-links-middle"?: Array<{ displayName: string; url: string }>;
  "footer-links-right"?: Array<{ displayName: string; url: string }>;

  // Content settings
  "display-newsletter"?: boolean;
  "enable-translations": boolean;
  "default-language": "en" | "de" | "fr" | "es" | "zh";

  [key: string]: any;
}

const defaultThemeSettings: ThemeSettings = {
  "display-newsletter": true,
  "enable-translations": true,
  "default-language": "en",
};

function createThemeSettingsStore() {
  const { subscribe, set, update } =
    writable<ThemeSettings>(defaultThemeSettings);

  let loaded = false;

  return {
    subscribe,
    load: async () => {
      if (loaded) return;

      try {
        const settingsData = await api.getThemeSettings();

        if (
          settingsData.settings &&
          typeof settingsData.settings === "object"
        ) {
          const newSettings: ThemeSettings = {
            ...defaultThemeSettings,
            ...settingsData.settings,
          };
          set(newSettings);

          // Apply primary color if present
          applyPrimaryColor(newSettings["primary-color"]);
        }
        loaded = true;
      } catch (err) {
        console.error("Error loading theme settings:", err);
        // Keep default values on error
      }
    },
    reset: () => {
      loaded = false;
      set(defaultThemeSettings);
    },
    get: (key: keyof ThemeSettings) => {
      let value: any;
      subscribe((settings) => {
        value = settings[key];
      })();
      return value;
    },
  };
}

export const themeSettings = createThemeSettingsStore();
