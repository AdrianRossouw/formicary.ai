/* formicary.ai — theme: light by default, opt-in dark, persisted. */
(function () {
  var KEY = "formicary-theme";
  var root = document.documentElement;

  // Apply stored preference as early as possible (this file is loaded in <head>).
  try {
    var saved = localStorage.getItem(KEY);
    if (saved === "dark") root.setAttribute("data-theme", "dark");
    else if (saved === "light") root.removeAttribute("data-theme");
  } catch (e) {}

  function current() {
    return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }
  function apply(theme) {
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    sync();
  }
  function sync() {
    var t = current();
    var btns = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute("aria-pressed", t === "light" ? "true" : "false");
      btns[i].setAttribute("title", t === "light" ? "Switch to dark" : "Switch to light");
      btns[i].setAttribute("aria-label", t === "light" ? "Switch to dark theme" : "Switch to light theme");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var btns = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        apply(current() === "light" ? "dark" : "light");
      });
    }
    sync();
  });
})();
