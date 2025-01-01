/** @type {HTMLLinkElement} */
let themeEl = document.getElementById("theme");

try {
  document.adoptedStyleSheets = [
    ...document.adoptedStyleSheets,
    (
      await import(
        "/themes/" + (localStorage.getItem("theme") || "default") + ".css",
        { with: { type: "css" } }
      )
    ).default,
  ];
} catch {
  console.log("Failed to load the selected theme, using the default theme");

  document.adoptedStyleSheets = [
    ...document.adoptedStyleSheets,
    (await import("/themes/default.css", { with: { type: "css" } })).default,
  ];
}
