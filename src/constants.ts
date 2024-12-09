export const themes = {
  green: {
    empty: "#161b22",
    level1: "#0e4429",
    level2: "#006d32",
    level3: "#26a641",
    level4: "#39d353",
    glow: "#00ffa9",
    particlesColor: "#8effb4",
  },
  orange: {
    empty: "#161b22",
    level1: "#462c04",
    level2: "#804d00",
    level3: "#e66a00",
    level4: "#ff9933",
    glow: "#FFA500",
    particlesColor: "#ffe2aa",
  },
  purple: {
    empty: "#161b22",
    level1: "#2d1b4d",
    level2: "#5a2e98",
    level3: "#8a47e6",
    level4: "#b76eff",
    glow: "#A900FF",
    particlesColor: "#f8bfff",
  },
} as const;

export type ThemeKey = keyof typeof themes;

export const months = [
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
];
