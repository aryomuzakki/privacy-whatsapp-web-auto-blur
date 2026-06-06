// theme detector and changer
const STORAGE_KEY = "pfwa-theme";

showEdgeElements = (show) => {
  const topEdge = document.querySelector("#mainContent > .wrapper > .top-edge");
  const bottomEdge = document.querySelector("#mainContent > .wrapper > .bottom-edge");
  if (!topEdge || !bottomEdge) {
    // console.warn("Edge elements not found");
    return;
  }
  if (show) {
    topEdge.style.height = "6px";
    bottomEdge.style.height = "6px";
  } else {
    topEdge.style.height = "0px";
    bottomEdge.style.height = "0px";
  }
}

// listener and first check
const setCurrentTheme = (ev) => {
  const theme = ev?.matches ? "dark" : "light";
  // extra set edge element class before set theme
  showEdgeElements(false);

  // set theme
  document.body.dataset.theme = theme;
  setTimeout(() => {

    // extra set edge element class after set them
    // setTimeout(() => {
      showEdgeElements(true);
    // }, 1000);
  }, 100);

  return theme;
}

const themeTogglerBtn = document.querySelector(".theme-toggle");

// theme toggle
const toggleCurrentTheme = (ev) => {
  ev.preventDefault();
  const curTheme = localStorage.getItem(STORAGE_KEY);
  if (curTheme === "light") {
    setCurrentTheme({ matches: true });
    themeTogglerBtn.dataset.theme = "dark";
    localStorage.setItem(STORAGE_KEY, "dark");
  } else if (curTheme === "dark") {
    setCurrentTheme(window.matchMedia("(prefers-color-scheme: dark)"));
    themeTogglerBtn.dataset.theme = "system-default";
    localStorage.setItem(STORAGE_KEY, "system-default");
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", setCurrentTheme);
  } else if (curTheme === "system-default") {
    window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", setCurrentTheme);
    setCurrentTheme({ matches: false });
    themeTogglerBtn.dataset.theme = "light";
    localStorage.setItem(STORAGE_KEY, "light");
  }
}

themeTogglerBtn.addEventListener("click", toggleCurrentTheme);

// first load check
const savedTheme = localStorage.getItem(STORAGE_KEY);
if (savedTheme) {
  themeTogglerBtn.dataset.theme = savedTheme;
  if (savedTheme === "system-default") {
    setCurrentTheme(window.matchMedia("(prefers-color-scheme: dark)"));
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", setCurrentTheme);
  } else {
    setCurrentTheme({ matches: savedTheme === "dark" });
  }
} else {
  const curTheme = setCurrentTheme(window.matchMedia("(prefers-color-scheme: dark)"));
  localStorage.setItem(STORAGE_KEY, curTheme);
  themeTogglerBtn.dataset.theme = curTheme;
}