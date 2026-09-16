// Panel switching for every figure toggle. Bound once per figure, and again after a view
// transition swaps the document.
function bind() {
  document.querySelectorAll<HTMLElement>("[data-alc]").forEach((figure) => {
    if (figure.dataset.alcBound) return;
    figure.dataset.alcBound = "true";
    const buttons = [...figure.querySelectorAll<HTMLButtonElement>("[data-alc-option]")];
    if (buttons.length === 0) return;
    const show = (value: string) => {
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.alcOption === value)));
      figure.querySelectorAll<HTMLElement>("[data-alc-panel]").forEach((p) => {
        p.hidden = p.dataset.alcPanel !== value;
      });
    };
    buttons.forEach((b) => b.addEventListener("click", () => show(b.dataset.alcOption!)));
    show(figure.dataset.alcInitial ?? buttons[0].dataset.alcOption!);
  });
}

bind();
document.addEventListener("astro:page-load", bind);
