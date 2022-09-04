try {
eruda.init();
if (localStorage.getItem("eruda-auto-show") === "1") eruda.show();
window.addEventListener("keydown", e => {
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
} catch (e) {console.error(e)}