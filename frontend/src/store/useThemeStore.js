import { create } from "zustand";

const applyTheme = (theme) => {
    if (theme === "light") {
        document.documentElement.classList.add("light");
    } else {
        document.documentElement.classList.remove("light");
    }
};

export const useThemeStore = create((set) => {
    const saved = localStorage.getItem("ripple-theme") || "dark";
    applyTheme(saved); // Apply on initial load

    return {
        theme: saved,
        setTheme: (theme) => {
            localStorage.setItem("ripple-theme", theme);
            applyTheme(theme);
            set({ theme });
        },
    };
});
