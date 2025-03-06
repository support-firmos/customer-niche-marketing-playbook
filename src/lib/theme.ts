// src/lib/theme.ts
export const theme = {
    colors: {
      background: "#08090a",
      titleColor: "#f7f8f8",
      subtitleColor: "#8a8f98",
      ctaBg: "#121212",
      ctaColor: "#f7f8f8",
      surface: {
        level1: "#141414",
        level2: "#1A1A1A",
        level3: "#202020",
      },
      gradient: {
        primary: "linear-gradient(165deg, #08090a, #141414)",
        card: "linear-gradient(165deg, #141414, #1A1A1A)",
        hover: "linear-gradient(165deg, #1A1A1A, #202020)"
      }
    },
    typography: {
      heading: "Inter",
      body: "Inter",
      weights: {
        bold: 700,
        medium: 500,
      }
    },
    shadows: {
      sm: "0 4px 6px rgba(0, 0, 0, 0.2)",
      md: "0 8px 12px rgba(0, 0, 0, 0.25)",
      lg: "0 12px 24px rgba(0, 0, 0, 0.3)",
    }
  };