const erudaScript = document.createElement("script");
erudaScript.addEventListener("load", () => {
  try {
    eruda.init({
      defaults: {
        displaySize: 30,
        theme: "Atom One Dark",
        transparency: 1,
      },
    });
    if (localStorage.getItem("eruda-auto-show") === "1") eruda.show();
    window.addEventListener("keydown", (e) => {
      const { key, ctrlKey } = e;
      if (key === "e" && ctrlKey) {
        e.preventDefault();
        if (localStorage.getItem("eruda-auto-show") === "1") {
          localStorage.setItem("eruda-auto-show", "0");
          eruda.hide();
        } else {
          localStorage.setItem("eruda-auto-show", "1");
          eruda.show();
        }
      }
    });
  } catch (e) {
    alert(e);
  }
});

erudaScript.addEventListener("error", (e) => alert(e.message));

erudaScript.src = "https://cdn.jsdelivr.net/npm/eruda@2.5.0/eruda.js";

document.body.appendChild(erudaScript);
