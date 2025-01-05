const sheets = new CSSStyleSheet();

const setTheme = async (theme) => {
  sheets.replaceSync(
    await (await fetch(`/themes/${theme || "default"}.css`)).text(),
  );
};
setTheme(localStorage.getItem("theme"))
  .catch(setTheme)
  .then(() => {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheets];
  });
