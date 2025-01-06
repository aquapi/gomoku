const sheets = new CSSStyleSheet();

const setTheme = async (theme) => {
  sheets.replaceSync(
    await (await fetch(`/themes/${theme ?? "default"}.css`)).text(),
  );
};
/** @type {HTMLSelectElement} */
const themeSelect = document.getElementById("select-themes");

const saveTheme = () => {
  localStorage.setItem("theme", themeSelect.selectedIndex);
};
themeSelect.addEventListener("change", () => {
  setTheme(themeSelect.value).then(saveTheme);
});

// Load current theme
themeSelect.selectedIndex = +localStorage.getItem("theme") || 0;
setTheme(themeSelect.value)
  .catch(setTheme)
  .then(() => {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheets];
  });
