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

// Keep the active tab visible in the scrolling tab strip on phones.
const cur = document.querySelector('.tabs a[aria-current="page"]');
if (cur) cur.scrollIntoView({ block: "nearest", inline: "center" });

// On pages with a big hero (home), hide the sticky join bar while the hero's own buttons are on screen.
const hero = document.querySelector(".hero");
const bar = document.querySelector(".join-bar");
if (hero && bar && "IntersectionObserver" in window) {
  new IntersectionObserver(([e]) => bar.classList.toggle("hide", e.isIntersecting), { threshold: 0.15 }).observe(hero);
}
