const setTheme = async (theme) => {
  document.adoptedStyleSheets = [
    ...document.adoptedStyleSheets,
    (
      await import(`/themes/${theme || "default"}.css`, {
        with: { type: "css" },
      })
    ).default,
  ];
};
setTheme(localStorage.getItem("theme")).catch(setTheme);
