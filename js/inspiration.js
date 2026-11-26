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
    text("insp-stage", b.stage); text("insp-group", b.g === b.stage ? "" : b.g);
    $("insp-group").hidden = !b.g || b.sk === "steps";
    text("insp-ln", b.ln ? "“" + b.ln + "”" : ""); $("insp-ln").hidden = !b.ln;
    var ul = $("insp-sheets"); ul.innerHTML = "";
    if (b.sk === "khalwa" && b.sheets.length) { var kl = document.createElement("li"); kl.textContent = "Day 40 · The Khalwa retreat"; ul.appendChild(kl); }
    if (b.sheets.length) b.sheets.forEach(function (s) {
      var li = document.createElement("li"), a = document.createElement("a");
      a.href = s[1]; a.target = "_blank"; a.rel = "noopener"; a.textContent = s[0];
      li.appendChild(a); ul.appendChild(li);
    });
    else { var li = document.createElement("li"); li.textContent = "The Khalwa: the day 40 retreat of the 40 Day Immersion"; ul.appendChild(li); }
    text("insp-avoid", b.avoid); $("insp-avoid-box").hidden = !b.avoid;
    text("insp-practise", b.practise);
    text("insp-how-h", "How this reflects " + b.tr + " (" + b.en + ")");
    text("insp-how", b.how);
    text("insp-e", b.e); text("insp-r", b.r); $("insp-quote").hidden = !b.e;
    text("insp-ea", b.ea); $("insp-ea").hidden = !b.ea;   // the Arabic of the ayah or hadith
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

  var h = decodeURIComponent(location.hash.slice(1)), start = -1;
  B.forEach(function (b, i) { if (b.id === h) start = i; });
  show(start >= 0 ? start : pick());
})();
