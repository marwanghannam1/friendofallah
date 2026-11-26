/* friendofallah.com/inspiration: "Be Inspired" picks one of the Names of Allah badges at random (never the same one twice
   in a row) and fills the card. The address ends in #name so a Name can be shared; opening that link shows the same Name. */
(function () {
  var B = window.INSP || [];
  if (!B.length) return;
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  function svg(b) {   // the same eight-point star enamel badge as /badges
    return '<svg viewBox="0 0 260 260" role="img" aria-label="' + esc(b.tr) + ' badge"><defs>' +
      '<linearGradient id="ig" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".35" stop-color="#e9bf62"/><stop offset=".6" stop-color="#b9822f"/><stop offset=".85" stop-color="#f1d184"/><stop offset="1" stop-color="#9b6a24"/></linearGradient>' +
      '<radialGradient id="ie" cx="45%" cy="35%"><stop offset="0" stop-color="' + b.c[0] + '"/><stop offset="1" stop-color="' + b.c[1] + '"/></radialGradient>' +
      '<pattern id="ip" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M10 0L13 7L20 10L13 13L10 20L7 13L0 10L7 7Z" fill="none" stroke="rgba(244,213,141,.12)" stroke-width="1"/></pattern></defs>' +
      '<polygon points="' + star(130, 130, 124, 104) + '" fill="url(#ig)"/>' +
      '<polygon points="' + star(130, 130, 114, 96) + '" fill="url(#ie)"/>' +
      '<polygon points="' + star(130, 130, 114, 96) + '" fill="url(#ip)"/>' +
      '<circle cx="130" cy="130" r="76" fill="none" stroke="url(#ig)" stroke-width="2.5"/>' +
      '<circle cx="130" cy="130" r="70" fill="rgba(0,0,0,.25)"/>' +
      '<text x="130" y="136" text-anchor="middle" font-family="Amiri, serif" font-size="' + arSize(b.ar) + '" font-weight="700" fill="url(#ig)">' + esc(b.ar) + "</text>" +
      '<text x="130" y="172" text-anchor="middle" font-family="Nunito Sans, sans-serif" font-size="' + trSize(b.tr) + '" font-weight="800" fill="#fbe9b8">' + esc(b.tr) + "</text></svg>";
  }

  var card = $("insp-card"), cur = -1;
  function text(id, s) { $(id).textContent = s || ""; }
  function show(i) {
    cur = i; var b = B[i];
    card.className = "insp-card st-" + b.sk;
    $("insp-badge").innerHTML = svg(b);
    text("insp-ar", b.ar); text("insp-tr", b.tr); text("insp-en", b.en);
    // one coloured label for every stage this Name appears in: body, mind, heart, nafs (user, 26 Nov 2026)
    var LBL = { body: "Body", mind: "Mind", heart: "Heart", nafs: "Nafs", steps: "3 simple steps", khalwa: "Khalwa" };
    var seen = [], chips = $("insp-chips"); chips.innerHTML = "";
    ((window.INSP_PL || [])[b.nk] || []).forEach(function (s) { if (seen.indexOf(s.s) < 0) seen.push(s.s); });
    if (seen.indexOf(b.sk) < 0) seen.push(b.sk);
    seen.sort(function (x, y) { var o = ["body", "mind", "heart", "nafs", "steps", "khalwa"]; return o.indexOf(x) - o.indexOf(y); });
    seen.forEach(function (k) { var sp = document.createElement("span"); sp.className = "insp-stage st-" + k; sp.textContent = LBL[k] || k; chips.appendChild(sp); });
    text("insp-group", b.sk === "steps" || !b.g ? "" : "This badge: " + b.g); $("insp-group").hidden = b.sk === "steps" || !b.g;
    text("insp-ln", b.ln ? "“" + b.ln + "”" : ""); $("insp-ln").hidden = !b.ln;
    var PL = (window.INSP_PL || [])[b.nk] || [];
    var ul = $("insp-sheets"); ul.innerHTML = "";   // every sheet that has this Name: body, mind, heart, nafs
    if (b.sk === "khalwa") { var kl = document.createElement("li"); kl.textContent = "Day 40 · The Khalwa retreat"; ul.appendChild(kl); }
    PL.forEach(function (s) {
      var li = document.createElement("li"), a = document.createElement("a");
      a.href = s.u; a.target = "_blank"; a.rel = "noopener"; a.textContent = s.l;
      li.appendChild(a); ul.appendChild(li);
    });
    var box = $("insp-tasks"); box.innerHTML = "";   // one box per sheet, worded exactly as on the sheet
    PL.forEach(function (s) {
      var d = document.createElement("section"); d.className = "insp-task st-" + s.s;
      var hd = document.createElement("header");
      hd.innerHTML = '<span class="it-stage"></span><span class="it-kick"></span><h4></h4>';
      hd.querySelector(".it-stage").textContent = s.st; hd.querySelector(".it-kick").textContent = s.k; hd.querySelector("h4").textContent = s.h;
      d.appendChild(hd);
      s.t.forEach(function (t) {
        var w = document.createElement("div"); w.className = "it-item";
        var lab = document.createElement("b"); lab.textContent = t[0]; w.appendChild(lab);
        t[1].forEach(function (line) { var p = document.createElement("p"); p.textContent = line; w.appendChild(p); });
        d.appendChild(w);
      });
      if (s.w) {   // how doing these actions reflects the Name
        var y = document.createElement("div"); y.className = "it-why";
        var yh = document.createElement("b"); yh.textContent = s.w[0]; y.appendChild(yh);
        var yp = document.createElement("p"); yp.textContent = s.w[1]; y.appendChild(yp);
        if (s.w[2]) { var yq = document.createElement("p"); yq.className = "it-q"; yq.textContent = "“" + s.w[2] + "”"; y.appendChild(yq); }
        d.appendChild(y);
      }
      var a = document.createElement("a"); a.className = "it-open"; a.href = s.u; a.target = "_blank"; a.rel = "noopener";
      a.textContent = "Open this sheet (page " + s.pg + ")"; d.appendChild(a);
      box.appendChild(d);
    });
    $("insp-tasks").previousElementSibling.hidden = !PL.length;
    text("insp-e", b.e); text("insp-r", b.r); $("insp-quote").hidden = !b.e;
    text("insp-ea", b.ea); $("insp-ea").hidden = !b.ea;   // the Arabic of the ayah or hadith
    paintTick(b);
    $("insp-print").href = b.p;
    $("insp-print").setAttribute("aria-label", "Print the " + b.tr + " certificate (PDF)");
    try { history.replaceState(null, "", "#" + b.id); } catch (e) {}
  }
  function pick() { var i; do { i = Math.floor(Math.random() * B.length); } while (B.length > 1 && i === cur); return i; }

  var go = $("insp-go"), busy = false;
  go.addEventListener("click", function () {
    if (busy) return;
    var target = pick();
    if (reduce) { show(target); card.scrollIntoView({ block: "start" }); return; }
    busy = true; go.disabled = true;
    card.classList.add("shuffling");
    var n = 0, steps = 9;
    (function tick() {   // a short shuffle through a few badges, then land on the chosen one
      if (n++ < steps) { show(pick()); card.className += " shuffling"; setTimeout(tick, 60 + n * 14); return; }
      show(target); card.classList.add("landed");
      busy = false; go.disabled = false;
      var top = card.getBoundingClientRect().top;
      if (top > innerHeight * 0.6 || top < 0) card.scrollIntoView({ behavior: "smooth", block: "start" });
    })();
  });

  $("insp-copy").addEventListener("click", function () {
    var url = location.href, btn = this;
    var done = function () { btn.textContent = "Link copied ✓"; setTimeout(function () { btn.textContent = "Copy a link to this Name"; }, 2000); };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { prompt("Copy this link:", url); });
    else prompt("Copy this link:", url);
  });

  // "Reflected for a day" tick box: remembered on this device, counted out of all the badges, with a celebration
  var KEY = "foa_reflected_v1";
  function loadR() { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; } }
  function saveR(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
  var ids = {}; B.forEach(function (b) { ids[b.id] = 1; });
  var done = new Set(loadR().filter(function (x) { return ids[x]; }));
  function paintTick(b) {
    var t = $("insp-tick"), on = done.has(b.id);
    t.classList.toggle("on", on); t.setAttribute("aria-checked", on ? "true" : "false");
    $("insp-count").textContent = done.size;
  }
  $("insp-tick").addEventListener("click", function () {
    var b = B[cur];
    if (done.has(b.id)) done.delete(b.id); else { done.add(b.id); celebrate(); }
    saveR(Array.from(done)); paintTick(b);
  });
  function celebrate() {
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var cv = document.createElement("canvas");
    cv.className = "bconfetti"; cv.setAttribute("aria-hidden", "true");
    document.body.appendChild(cv);
    var dpr = Math.min(window.devicePixelRatio || 1, 2), W = innerWidth, H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    var ctx = cv.getContext("2d"); ctx.scale(dpr, dpr);
    var golds = ["#f4d58d", "#e9bf62", "#fff3c4", "#d4a24a", "#f1d184", "#b9822f"];
    var n = reduce ? 30 : Math.min(160, Math.round(W / 3)), P = [];
    for (var i = 0; i < n; i++) {
      var kind = i % 3 === 0 ? "star" : "piece";   // a third stars, the rest thick confetti (no flowers, user 12 Nov 2026)
      P.push({ x: Math.random() * W, y: -20 - Math.random() * H * 0.6, vx: (Math.random() - 0.5) * 1.6,
               vy: 1.6 + Math.random() * 2.4, r: kind === "piece" ? 7 + Math.random() * 5 : 8 + Math.random() * 6,
               a: Math.random() * Math.PI * 2, va: (Math.random() - 0.5) * 0.2, w: Math.random() * Math.PI * 2,
               c: golds[i % golds.length], k: kind });
    }
    function drawStar(p) {   // five-point gold star with a darker gold edge
      ctx.beginPath();
      for (var k = 0; k < 10; k++) {
        var rr = k % 2 ? p.r * 0.45 : p.r, an = k * Math.PI / 5 - Math.PI / 2;
        ctx.lineTo(Math.cos(an) * rr, Math.sin(an) * rr);
      }
      ctx.closePath(); ctx.fillStyle = p.c; ctx.fill();
      ctx.lineWidth = 1; ctx.strokeStyle = "#a8742a"; ctx.stroke();
    }
    var t0 = performance.now(), dur = reduce ? 1200 : 3200;
    (function frame(now) {
      var t = now - t0; ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = t > dur - 600 ? Math.max(0, (dur - t) / 600) : 1;
      P.forEach(function (p) {
        p.w += 0.05; p.x += p.vx + Math.sin(p.w) * 0.6; p.y += p.vy; p.a += p.va;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a);
        if (p.k === "star") drawStar(p);
        else { ctx.fillStyle = p.c; ctx.scale(1, Math.abs(Math.cos(p.w * 2)) * 0.65 + 0.35); ctx.fillRect(-p.r / 2, -p.r * 0.35, p.r, p.r * 0.7); }   // thick confetti pieces
        ctx.restore();
      });
      if (t < dur) requestAnimationFrame(frame); else cv.remove();
    })(t0);
  }

  var h = decodeURIComponent(location.hash.slice(1)), start = -1;
  B.forEach(function (b, i) { if (b.id === h) start = i; });
  show(start >= 0 ? start : pick());
})();
