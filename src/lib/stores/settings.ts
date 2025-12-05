import { writable } from "svelte/store";
import type { ProjectSettings } from "$lib/types";
import { api } from "$lib/api";

// Default settings
const defaultSettings: ProjectSettings = {
  title: "Changelog",
  logo_url: "",
  dark_logo_url: "",
  favicon_url: "",
  website_url: "",
  primary_color: "#3b82f6",
  newsletter_enabled: false,
  created_at: "",
  updated_at: "",
};

// Create writable store
export const settings = writable<ProjectSettings>(defaultSettings);

// Load settings from API
export async function loadSettings() {
  try {
    const projectSettings = await api.getSettings();
    settings.set(projectSettings);

    // Apply primary color to CSS variables
    applyPrimaryColor(projectSettings.primary_color);

    return projectSettings;
  } catch (error) {
    console.error("Failed to load settings:", error);
    return defaultSettings;
  }
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

    // Calculate lighter/darker variants
    const lightHsl = { ...hsl, l: Math.min(hsl.l + 15, 95) };
    const darkHsl = { ...hsl, l: Math.max(hsl.l - 15, 5) };

    document.documentElement.style.setProperty(
      "--primary-light",
      `${lightHsl.h} ${lightHsl.s}% ${lightHsl.l}%`,
    );
    document.documentElement.style.setProperty(
      "--primary-dark",
      `${darkHsl.h} ${darkHsl.s}% ${darkHsl.l}%`,
    );
  } catch (error) {
    console.error("Error applying primary color:", error);
  }
}

// Convert hex color to HSL
function hexToHsl(hex: string) {
  // Remove the # if present
  hex = hex.replace(/^#/, "");

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}
