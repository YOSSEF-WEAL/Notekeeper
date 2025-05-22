"use strict";

// Initialize the theme
const storedTheme = localStorage.getItem("theme");
// html Element for set || get > Attribute
const htmlElement = document.documentElement;

const systemThemeIsDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

const initialTheme = storedTheme ?? (sessionStorage ? "dark" : "light");

htmlElement.setAttribute("data-theme", initialTheme);

// Attach toggle Theme to Theme Button Click Event
const toggleTheme = function () {
  const currentTheme = htmlElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";
  htmlElement.setAttribute("data-theme", newTheme);
};

window.addEventListener("DOMContentLoaded", function () {
  const themeBtn = this.document.querySelector("[data-theme-btn]");

  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);
});
