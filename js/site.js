// Click-to-load YouTube: shows a thumbnail until tapped, so pages stay fast on phones.
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".yt button");
  if (!btn) return;
  const box = btn.closest(".yt");
  const id = box.dataset.id;
  const f = document.createElement("iframe");
  f.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
  f.title = box.dataset.title || "YouTube video";
  f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  f.allowFullscreen = true;
  box.replaceChildren(f);
});

// Phone menu: the three-line button opens and closes the list of sections.
const head = document.querySelector(".site-head");
const menuBtn = document.querySelector(".menu-btn");
function setMenu(open) {
  head.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
if (menuBtn) {
  menuBtn.addEventListener("click", () => setMenu(!head.classList.contains("open")));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && head.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });
  document.addEventListener("click", (e) => { if (head.classList.contains("open") && !head.contains(e.target)) setMenu(false); });
}

// On the home page, hide the sticky join bar while the buttons under the hero are on screen.
const hero = document.querySelector(".hero-cta") || document.querySelector(".hero");
const bar = document.querySelector(".join-bar");
if (hero && bar && "IntersectionObserver" in window) {
  new IntersectionObserver(([e]) => bar.classList.toggle("hide", e.isIntersecting), { threshold: 0.15 }).observe(hero);
}
