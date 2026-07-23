export const APP_BRAND = {
  name: "Conversational UI",
  /** Sidebar header + assistant avatar icon. Replace `public/logo.ico` with your own asset. */
  logoUrl: "/logo.png",
  accent: "#0070E0",
  accentHover: "#005BB8",
  accentPressed: "#004999",
  accentDisabled: "rgba(0, 112, 224, 0.4)",
  accentText: "#FFFFFF",
} as const;

export const brandTheme = {
  chatUserResponseBg: APP_BRAND.accent,
  chatUserResponseText: APP_BRAND.accentText,
  interactiveAccent: APP_BRAND.accent,
  interactiveAccentHover: APP_BRAND.accentHover,
  interactiveAccentPressed: APP_BRAND.accentPressed,
  interactiveAccentDisabled: APP_BRAND.accentDisabled,
  accentPrimaryText: APP_BRAND.accentText,
};
