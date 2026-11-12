/* friendofallah.com/badges: draws the eight-point star enamel badges (each in its own colour),
   opens the detail card, and remembers earned badges on this device (localStorage, never required). */
(function () {
  var B = window.BADGES || [];
  var KEY = "foa_badges_v1";

  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
  var earned = new Set(load().filter(function (x) { return typeof x === "string" && x.indexOf("|") > 0; }));

  function star(cx, cy, R, r) {
    var p = [];
    for (var i = 0; i < 16; i++) {
      var a = Math.PI / 8 * i - Math.PI / 2, d = i % 2 ? r : R;
      p.push((cx + d * Math.cos(a)).toFixed(1) + "," + (cy + d * Math.sin(a)).toFixed(1));
    }
    return p.join(" ");
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function arSize(ar) { var n = ar.replace(/[ً-ٰٟۡ]/g, "").length; return n <= 7 ? 44 : n <= 9 ? 38 : n <= 12 ? 31 : n <= 16 ? 25 : 19; }
  function trSize(tr) { return tr.length <= 11 ? 17 : tr.length <= 15 ? 15 : tr.length <= 20 ? 12.5 : 10.5; }

  // shared gold + pattern, and one enamel gradient per badge
  var defs = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>' +
    '<linearGradient id="bgold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".35" stop-color="#e9bf62"/><stop offset=".6" stop-color="#b9822f"/><stop offset=".85" stop-color="#f1d184"/><stop offset="1" stop-color="#9b6a24"/></linearGradient>' +
    '<pattern id="bgirih" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M10 0L13 7L20 10L13 13L10 20L7 13L0 10L7 7Z" fill="none" stroke="rgba(244,213,141,.12)" stroke-width="1"/></pattern>' +
    B.map(function (b) { return '<radialGradient id="ben' + b.id + '" cx="45%" cy="35%"><stop offset="0" stop-color="' + b.c[0] + '"/><stop offset="1" stop-color="' + b.c[1] + '"/></radialGradient>'; }).join("") +
    "</defs></svg>";
  document.body.insertAdjacentHTML("afterbegin", defs);

  function svg(b) {
    return '<svg viewBox="0 0 260 260" aria-hidden="true">' +
      '<polygon points="' + star(130, 130, 124, 104) + '" fill="url(#bgold)"/>' +
      '<polygon points="' + star(130, 130, 114, 96) + '" fill="url(#ben' + b.id + ')"/>' +
      '<polygon points="' + star(130, 130, 114, 96) + '" fill="url(#bgirih)"/>' +
      '<circle cx="130" cy="130" r="76" fill="none" stroke="url(#bgold)" stroke-width="2.5"/>' +
      '<circle cx="130" cy="130" r="70" fill="rgba(0,0,0,.25)"/>' +
      '<text x="130" y="136" text-anchor="middle" font-family="Amiri, serif" font-size="' + arSize(b.ar) + '" font-weight="700" fill="url(#bgold)">' + esc(b.ar) + "</text>" +
      '<text x="130" y="172" text-anchor="middle" font-family="Nunito Sans, sans-serif" font-size="' + trSize(b.tr) + '" font-weight="800" fill="#fbe9b8">' + esc(b.tr) + "</text></svg>";
  }

  var cards = document.querySelectorAll(".badge");
  cards.forEach(function (card) {
    var b = B[+card.dataset.id];
    card.querySelector(".bsvg").innerHTML = svg(b);
    if (earned.has(b.k)) card.classList.add("earned");
  });

  function count() {
    var n = earned.size, c = document.getElementById("bcount"), bar = document.getElementById("bbar");
    if (c) c.textContent = n;
    if (bar) bar.style.width = (B.length ? n / B.length * 100 : 0) + "%";
  }
  count();

  var dlg = document.getElementById("bdlg"), cur = null;
  function fill(b) {
    cur = b;
    dlg.className = "bdlg st-" + b.s;
    dlg.querySelector(".bd-badge").innerHTML = svg(b);
    dlg.querySelector(".bd-ar").textContent = b.ar;
    dlg.querySelector("#bd-tr").textContent = b.tr;
    dlg.querySelector(".bd-en").textContent = b.en + " · " + b.g;
    dlg.querySelector(".bd-sub b").textContent = b.sin;
    dlg.querySelector(".bd-t").textContent = b.t;
    var q = dlg.querySelector(".bd-e"); q.hidden = !b.e;
    q.querySelector("p").textContent = b.e; q.querySelector("cite").textContent = b.r;
    dlg.querySelector(".bd-print").href = b.p;
    var on = earned.has(b.k), eb = dlg.querySelector(".bd-earn");
    eb.textContent = on ? "✓ Earned · tap to undo" : "I have earned this badge";
    eb.classList.toggle("on", on);
  }
  cards.forEach(function (card) {
    card.querySelector(".bopen").addEventListener("click", function () {
      fill(B[+card.dataset.id]);
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    });
  });
  dlg.querySelector(".bd-earn").addEventListener("click", function () {
    var k = cur.k;
    if (earned.has(k)) earned.delete(k); else earned.add(k);
    save(Array.from(earned));
    document.querySelector('.badge[data-id="' + cur.id + '"]').classList.toggle("earned", earned.has(k));
    count(); fill(cur);
  });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
})();
