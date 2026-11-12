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
    paint(card, earned.has(b.k));
    card.querySelector(".bach").addEventListener("click", function () { toggle(b); });
  });

  function paint(card, on) {
    card.classList.toggle("earned", on);
    var a = card.querySelector(".bach");
    a.textContent = on ? "✓ Achieved" : "I've achieved this";
    a.setAttribute("aria-pressed", on ? "true" : "false");
  }
  function toggle(b) {
    if (earned.has(b.k)) earned.delete(b.k); else { earned.add(b.k); celebrate(); }
    save(Array.from(earned));
    paint(document.querySelector('.badge[data-id="' + b.id + '"]'), earned.has(b.k));
    count();
  }

  // golden confetti and golden flowers falling down the screen (about 3 seconds)
  function celebrate() {
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var cv = document.createElement("canvas");
    cv.className = "bconfetti"; cv.setAttribute("aria-hidden", "true");
    var host = document.getElementById("bdlg");
    (host && host.open ? host : document.body).appendChild(cv);   // inside the open card, so it shows above it
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W = innerWidth, H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    var ctx = cv.getContext("2d"); ctx.scale(dpr, dpr);
    var golds = ["#f4d58d", "#e9bf62", "#fff3c4", "#d4a24a", "#f1d184", "#b9822f"];
    var n = reduce ? 30 : Math.min(160, Math.round(W / 3)), P = [];
    for (var i = 0; i < n; i++) {
      var flower = i % 4 === 0;
      P.push({ x: Math.random() * W, y: -20 - Math.random() * H * 0.6, vx: (Math.random() - 0.5) * 1.6,
               vy: 1.6 + Math.random() * 2.4, r: flower ? 7 + Math.random() * 6 : 4 + Math.random() * 5,
               a: Math.random() * Math.PI * 2, va: (Math.random() - 0.5) * 0.2, w: Math.random() * Math.PI * 2,
               c: golds[i % golds.length], f: flower });
    }
    function petalFlower(p) {
      ctx.fillStyle = p.c;
      for (var k = 0; k < 5; k++) {
        ctx.save(); ctx.rotate(k * Math.PI * 2 / 5);
        ctx.beginPath(); ctx.ellipse(0, -p.r * 0.55, p.r * 0.32, p.r * 0.55, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      ctx.fillStyle = "#8f5f1f"; ctx.beginPath(); ctx.arc(0, 0, p.r * 0.22, 0, Math.PI * 2); ctx.fill();
    }
    var t0 = performance.now(), dur = reduce ? 1200 : 3200;
    (function frame(now) {
      var t = now - t0; ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = t > dur - 600 ? Math.max(0, (dur - t) / 600) : 1;
      P.forEach(function (p) {
        p.w += 0.05; p.x += p.vx + Math.sin(p.w) * 0.6; p.y += p.vy; p.a += p.va;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
        if (p.f) petalFlower(p);
        else { ctx.fillStyle = p.c; ctx.scale(1, Math.abs(Math.cos(p.w * 2)) * 0.8 + 0.2); ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); }
        ctx.restore();
      });
      if (t < dur) requestAnimationFrame(frame); else cv.remove();
    })(t0);
  }

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
    dlg.querySelector(".bd-sub span").textContent = b.pos ? "Achievement" : "Avoids";
    dlg.querySelector(".bd-sub b").textContent = b.pos ? "“" + b.pos + "”" : b.sin;
    dlg.querySelector(".bd-t").textContent = b.t;
    var q = dlg.querySelector(".bd-e"); q.hidden = !b.e;
    q.querySelector("p").textContent = b.e; q.querySelector("cite").textContent = b.r;
    dlg.querySelector(".bd-print").href = b.p;
    var on = earned.has(b.k), eb = dlg.querySelector(".bd-earn");
    eb.textContent = on ? "✓ Achieved · tap to undo" : "I've achieved this badge";
    eb.classList.toggle("on", on);
  }
  cards.forEach(function (card) {
    card.querySelector(".bopen").addEventListener("click", function () {
      fill(B[+card.dataset.id]);
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    });
  });
  dlg.querySelector(".bd-earn").addEventListener("click", function () {
    toggle(cur); fill(cur);
  });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
})();
