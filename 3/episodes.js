/* 융합과학 탐구 Ⅲ 융합과학 탐구의 전망 — 소단원별 이야기 네 편
   01 2035년의 등굣길 / 02 사막의 딸기, 물만 내뿜는 차 / 03 스무 번 해 보면 한 번은 된다 / 04 반딧불이를 세는 사람들
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("cvg-3");

var FONT = "'Gothic A1','Segoe UI',sans-serif";
function $(id) { return document.getElementById(id); }
function v(name) { return window.cssVar(name); }
function done(id) { var e = $(id); if (e) e.classList.add("done"); }
function paper(ctx, W, H) { ctx.clearRect(0, 0, W, H); ctx.fillStyle = v("--panel"); ctx.fillRect(0, 0, W, H); }
function text(ctx, s, x, y, o) {
  o = o || {};
  ctx.font = (o.w || "500") + " " + (o.s || 12) + "px " + FONT;
  ctx.fillStyle = o.c || v("--ink"); ctx.textAlign = o.a || "left";
  ctx.fillText(s, x, y);
}
function axes(ctx, x0, y0, x1, y1) { ctx.strokeStyle = v("--line"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x1, y1); ctx.stroke(); }
function segWire(id, onPick) {
  var btns = Array.prototype.slice.call($(id).querySelectorAll("button"));
  btns.forEach(function (b) {
    b.type = "button";
    b.addEventListener("click", function () { btns.forEach(function (x) { x.classList.toggle("on", x === b); }); onPick(b.getAttribute("data-v")); });
  });
}
function filledOrder(mount, steps) { $(mount).innerHTML = "<div class='order sort'><div class='slots'>" + steps.map(function (s) { return "<div class='slot filled'>" + s + "</div>"; }).join("") + "</div></div>"; }
function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

/* ---- 무대 그림 공용 (../assets/kit.js) ---- */
var K = window.sthKit, KC = K.C, REDUCE = K.REDUCE;
function glass(ctx, x, y, w, h, r, edge, a) {
  var g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, "rgba(255,255,255," + (a == null ? 0.09 : a) + ")"); g.addColorStop(1, "rgba(255,255,255,.02)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
  ctx.strokeStyle = edge || "rgba(200,210,255,.22)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.stroke();
}
function kv(ctx, k, val, x, y, col, size, a) {
  K.t(ctx, k, x, y, { s: 11.5, c: KC.mute, w: "700", a: a });
  K.t(ctx, val, x, y + (size || 18) + 6, { s: size || 18, c: col || KC.ink, w: "900", a: a });
}
function pauser(id, st, label) {
  var b = $(id); if (!b) return;
  label = label || ["움직임 멈추기", "움직임 보기"];
  function paint() { b.textContent = st.on ? "⏸ " + label[0] : "▶ " + label[1]; }
  b.addEventListener("click", function () { st.on = !st.on; paint(); });
  paint();
}
function put(id, html) { var e = $(id); if (e) e.innerHTML = html; }
/* 빛나는 막대 */
function glowBar(ctx, x, y, w, h, rgb, a) {
  var g = ctx.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, "rgba(" + rgb + ",.95)"); g.addColorStop(.55, "rgba(" + rgb + ",.6)"); g.addColorStop(1, "rgba(" + rgb + ",.35)");
  ctx.save(); ctx.globalAlpha = a == null ? 1 : a; ctx.shadowColor = "rgb(" + rgb + ")"; ctx.shadowBlur = 10; ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, y, w, h, [Math.min(4, w / 2), Math.min(4, w / 2), 0, 0]); ctx.fill(); ctx.restore();
}

/* =========================================================================
   이야기 ① 2035년의 등굣길
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "사건 파일 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "p1", title: "해설사의 첫 대답",
    question: "“이런 기술이 언제 우리 동네에 오느냐”는 물음에 가장 과학적인 대답은?",
    options: ["㉠ 절대 오지 않는다", "㉡ 관련 기술이 발전하는 추세를 보면 대략의 시기를 예측할 수 있다", "㉢ 내일 당장 온다"],
    onPick: function () { ep.clear(0); }
  });

  window.sthSort({
    mount: "s1-sort",
    buckets: [{ id: "ai", label: "🤖 인공지능" }, { id: "p3", label: "🚀 우주 3D 프린팅" }, { id: "tw", label: "🩺 메디컬 트윈" }, { id: "uam", label: "🚁 도심 항공 교통" }, { id: "wr", label: "🦾 웨어러블 로봇" }],
    items: [
      { t: "인간의 학습·추론·지각 능력을 인공적으로 구현한다", a: "ai", why: "인공지능의 정의입니다." },
      { t: "사물 인터넷·로봇·자율 주행차의 두뇌 역할을 한다", a: "ai", why: "인공지능이 여러 기술의 중심이 됩니다." },
      { t: "지구에서 부품을 실어 보내는 비용 문제를 풀기 위해 우주에서 직접 구조물을 만든다", a: "p3", why: "천문학·항공 우주 공학과 3D 프린팅의 융합입니다." },
      { t: "우주 정거장의 부품을 우주 공간에서 찍어 낸다", a: "p3", why: "우주 3D 프린팅입니다." },
      { t: "현실의 신체를 가상 공간에 똑같이 구현해 질병을 진단한다", a: "tw", why: "디지털 쌍둥이의 의료 활용입니다." },
      { t: "신약 임상 시험의 비용과 시간을 줄여 준다", a: "tw", why: "가상의 몸으로 미리 시험합니다." },
      { t: "지상과 상공을 잇는 차세대 교통 체계로 도심 상공에서 사람과 화물을 나른다", a: "uam", why: "도심 항공 교통입니다." },
      { t: "충돌 회피·자율 비행과 전지·모터 기술이 합쳐져 있다", a: "uam", why: "UAM에 필요한 기술들입니다.", hint: "하늘을 나는 교통수단의 기술입니다." },
      { t: "척수 손상 환자의 재활을 돕는다", a: "wr", why: "의료·로봇 공학의 융합입니다." },
      { t: "산업 현장에서 무거운 물건을 드는 작업자의 몸을 받쳐 준다", a: "wr", why: "입는 로봇입니다." }
    ],
    onDone: function () { window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>다섯 전시관 모두 서로 다른 분야가 만나 생긴 융합과학기술입니다."); ep.clear(1); }
  });
  if (ep.cleared(1)) window.sthMission("m1-2", true);

  /* 장면 3 — 배터리 추세 */
  (function () {
    var canvas = $("c-bat"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, g = 5, yr = 2030;
    var got = window.sthState("batGot") || { a: false, b: false };
    function E(y, r) { return 270 * Math.pow(1 + r / 100, y - 2025); }
    function first(r) { for (var y = 2025; y <= 2060; y++) if (E(y, r) >= 400) return y; return null; }
    function taxi(x, y, up) {
      ctx.save(); ctx.translate(x, y);
      var bg = ctx.createLinearGradient(0, -14, 0, 14); bg.addColorStop(0, "#eef3ff"); bg.addColorStop(1, "#7d8bb8");
      ctx.fillStyle = bg; ctx.beginPath(); ctx.ellipse(0, 0, 34, 13, 0, 0, 6.2832); ctx.fill();
      ctx.fillStyle = "rgba(60,120,200,.85)"; ctx.beginPath(); ctx.ellipse(12, -3, 13, 7, 0, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = "#aab6dd"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-46, -12); ctx.lineTo(46, -12); ctx.stroke();
      [-46, 46].forEach(function (rx) {
        ctx.fillStyle = up ? "rgba(127,211,255,.35)" : "rgba(170,180,220,.4)"; ctx.beginPath(); ctx.ellipse(rx, -15, 20, 3.5, 0, 0, 6.2832); ctx.fill();
      });
      ctx.strokeStyle = "#aab6dd"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-14, 12); ctx.lineTo(-18, 20); ctx.moveTo(14, 12); ctx.lineTo(18, 20); ctx.stroke();
      ctx.restore();
      if (up) K.glow(ctx, x + 30, y + 2, 2, "rgba(255,211,107,.95)", 4);
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var LW = 610, e = E(yr, g), ok = e >= 400;
      K.stage(ctx, 0, 0, LW, H, "lab", { seed: 111, title: "배터리 에너지 밀도 — 연 " + g + "% 추세" });
      var gr = K.chart(ctx, { x: 6, y: 40, w: LW - 16, h: H - 44, x0: 2025, x1: 2045, y0: 200, y1: 700, xt: 4, yt: 5, xf: function (y) { return String(Math.round(y)); }, yl: "Wh/kg" });
      K.line(ctx, { x: gr.L, y: gr.Y(400) }, { x: gr.R, y: gr.Y(400) }, KC.red, 1.5, [5, 4]);
      K.pill(ctx, "하늘 택시 기준 400 Wh/kg", gr.R - 4, gr.Y(400) + 22, { s: 11, a: "right", c: KC.red, box: [0, LW] });
      var pts = []; for (var y = 2025; y <= 2045 + 1e-9; y += 0.25) pts.push([y, E(y, g)]);
      ctx.save(); ctx.beginPath(); ctx.rect(gr.L, gr.T, gr.R - gr.L, gr.B - gr.T); ctx.clip();
      K.plot(ctx, gr, pts, KC.blue); ctx.restore();
      var px = gr.X(yr), py = gr.Y(Math.min(e, 700));
      K.line(ctx, { x: px, y: gr.B }, { x: px, y: py }, "rgba(255,179,92,.6)", 1.2, [3, 4]);
      K.glow(ctx, px, py, 6, ok ? "rgba(63,211,163,.98)" : "rgba(255,179,92,.98)", 3);
      K.pill(ctx, yr + "년 · " + e.toFixed(0) + " Wh/kg", px + (yr > 2038 ? -12 : 12), py - 12, { s: 12, a: yr > 2038 ? "right" : "left", c: ok ? KC.green : KC.orange, box: [0, LW] });

      /* ── 오른쪽: 배터리와 하늘 택시 ── */
      var RX = LW + 8, RW = W - RX;
      K.stage(ctx, RX, 0, RW, H, "night", { seed: 13, title: yr + "년의 배터리" });
      var bx = RX + 30, by = 196, bw = RW - 72, bh = 40, cells = 10, lit = clamp((e - 200) / 50, 0, cells);
      ctx.fillStyle = "#2a3158"; ctx.beginPath(); ctx.roundRect(bx - 4, by - 4, bw + 8, bh + 8, 8); ctx.fill();
      ctx.fillStyle = "#2a3158"; ctx.fillRect(bx + bw + 4, by + 12, 7, 16);
      for (var c = 0; c < cells; c++) {
        var cw = bw / cells, cx = bx + c * cw, f = clamp(lit - c, 0, 1);
        ctx.fillStyle = "rgba(255,255,255,.06)"; ctx.fillRect(cx + 2, by + 2, cw - 4, bh - 4);
        if (f > 0) { var cg = ctx.createLinearGradient(0, by, 0, by + bh); var rgb = ok ? "63,211,163" : "255,179,92"; cg.addColorStop(0, "rgba(" + rgb + ",1)"); cg.addColorStop(1, "rgba(" + rgb + ",.45)"); ctx.save(); ctx.shadowColor = "rgb(" + rgb + ")"; ctx.shadowBlur = 8; ctx.fillStyle = cg; ctx.fillRect(cx + 2, by + 2, (cw - 4) * f, bh - 4); ctx.restore(); }
      }
      var tx = bx + (400 - 200) / 50 * (bw / cells);
      ctx.strokeStyle = KC.red; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx, by - 10); ctx.lineTo(tx, by + bh + 10); ctx.stroke();
      K.t(ctx, "400", tx, by + bh + 24, { s: 10.5, a: "center", c: KC.red });
      K.t(ctx, "200", bx, by + bh + 24, { s: 10, a: "center", c: KC.mute });
      K.t(ctx, "700", bx + bw, by + bh + 24, { s: 10, a: "center", c: KC.mute });
      taxi(RX + RW / 2, ok ? 84 : 150, ok);
      if (ok) for (var k2 = 0; k2 < 3; k2++) K.line(ctx, { x: RX + RW / 2 - 20 + k2 * 20, y: 112 }, { x: RX + RW / 2 - 26 + k2 * 20, y: 136 }, "rgba(127,211,255,.35)", 2);
      K.pill(ctx, ok ? "하늘 택시가 뜨는 배터리" : "아직 뜨지 못함", RX + RW / 2, H - 14, { s: 12, a: "center", c: ok ? KC.green : KC.orange, box: [RX, W] });
    }
    function update() {
      draw();
      var f = first(g), ch = false;
      $("bt-info").innerHTML = "연 " + g + "%씩 좋아지면 " + yr + "년에 약 <b>" + E(yr, g).toFixed(0) + " Wh/kg</b>. 복리처럼 불어나므로 몇 %p 차이가 여러 해의 차이를 만듭니다.";
      if (g === 5 && yr === f && !got.a) { got.a = ch = true; }
      if (g === 3 && yr === f && !got.b) { got.b = ch = true; }
      if (ch) { window.sthState("batGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m1-3a"); if (got.b) done("m1-3b");
      if (got.a && got.b) {
        window.sthState("batBest", "연 5% → " + first(5) + "년, 연 3% → " + first(3) + "년");
        window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("batBest") + ". 발전 속도가 2%p 느려지면 도착이 5년 늦어집니다. 예측은 가정에 따라 달라지므로 범위로 말해야 합니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    segWire("bt-g", function (x) { g = +x; update(); });
    $("bt-y").addEventListener("input", function (e) { yr = +e.target.value; $("bt-y-val").textContent = yr + "년"; update(); });
    update(); mission();
  })();

  /* 장면 4 — 메디컬 트윈 */
  (function () {
    var canvas = $("c-twin"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, pt = "A", R = 50;
    var CL = { A: 2, B: 4 }, got = window.sthState("twGot") || { A: false, B: false };
    var st = { on: !REDUCE }, drops = [], acc = 0, tPh = 0;
    function body(cx, top, col, glowA) {
      ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 10; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.arc(cx, top + 18, 16, 0, 6.2832); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - 30, top + 44); ctx.quadraticCurveTo(cx, top + 36, cx + 30, top + 44);
      ctx.lineTo(cx + 46, top + 120); ctx.lineTo(cx + 36, top + 122); ctx.lineTo(cx + 24, top + 70); ctx.lineTo(cx + 22, top + 128);
      ctx.lineTo(cx + 24, top + 210); ctx.lineTo(cx + 8, top + 210); ctx.lineTo(cx, top + 136); ctx.lineTo(cx - 8, top + 210); ctx.lineTo(cx - 24, top + 210);
      ctx.lineTo(cx - 22, top + 128); ctx.lineTo(cx - 24, top + 70); ctx.lineTo(cx - 36, top + 122); ctx.lineTo(cx - 46, top + 120); ctx.closePath(); ctx.stroke();
      ctx.restore();
      /* 혈관(농도만큼 밝게) */
      ctx.save(); ctx.globalAlpha = glowA; ctx.strokeStyle = "rgba(255,107,129,1)"; ctx.shadowColor = KC.red; ctx.shadowBlur = 12; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(cx, top + 52); ctx.lineTo(cx, top + 128); ctx.moveTo(cx, top + 60); ctx.lineTo(cx + 30, top + 110); ctx.moveTo(cx, top + 60); ctx.lineTo(cx - 30, top + 110);
      ctx.moveTo(cx, top + 128); ctx.lineTo(cx + 14, top + 204); ctx.moveTo(cx, top + 128); ctx.lineTo(cx - 14, top + 204); ctx.stroke();
      ctx.restore();
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var css = R / CL[pt], ok = css >= 10 && css <= 20, LW = 270;
      /* ── 왼쪽: 디지털 쌍둥이와 링거 ── */
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 121, grid: true, gridStep: 24 });
      var cx = 168, top = 40, conc = css * (1 - Math.exp(-CL[pt] / 20 * Math.min(tPh, 24)));
      body(cx, top, "rgba(127,211,255,.95)", clamp(conc / 20, 0.08, 1));
      for (var sl = 0; sl < 5; sl++) { var sy = top + 10 + ((tPh * 9 + sl * 46) % 220); K.line(ctx, { x: cx - 50, y: sy }, { x: cx + 50, y: sy }, "rgba(127,211,255,.10)", 1); }
      /* 수액 주머니 */
      var bx = 54, by = 52;
      ctx.strokeStyle = "#9aa6cc"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx, 22); ctx.lineTo(bx, by - 4); ctx.stroke();
      var bg = ctx.createLinearGradient(bx - 18, 0, bx + 18, 0); bg.addColorStop(0, "rgba(220,235,255,.55)"); bg.addColorStop(.5, "rgba(255,255,255,.85)"); bg.addColorStop(1, "rgba(200,220,250,.5)");
      ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(bx - 18, by, 36, 56, 8); ctx.fill();
      ctx.fillStyle = "rgba(255,179,92,.55)"; ctx.beginPath(); ctx.roundRect(bx - 15, by + 20, 30, 33, 6); ctx.fill();
      ctx.fillStyle = "rgba(220,235,255,.6)"; ctx.fillRect(bx - 6, by + 64, 12, 26);
      drops.forEach(function (d) { K.glow(ctx, bx, by + 66 + d * 20, 2, "rgba(255,200,130,.95)", 2.2); });
      ctx.strokeStyle = "rgba(255,200,130,.7)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(bx, by + 90); ctx.quadraticCurveTo(bx, top + 120, cx - 40, top + 112); ctx.stroke();
      K.pill(ctx, "시간당 " + R + " mg", bx - 30, by + 112, { s: 10.5, c: KC.orange, box: [0, LW] });
      K.pill(ctx, "환자 " + pt + " · 청소율 " + CL[pt] + " L/시", 14, 28, { s: 12, c: KC.blue, box: [0, LW] });
      K.pill(ctx, "혈중 농도 " + conc.toFixed(1) + " mg/L", LW / 2, H - 12, { s: 11.5, a: "center", c: conc >= 10 && conc <= 20 ? KC.green : KC.red, box: [0, LW] });

      /* ── 오른쪽: 농도 그래프 ── */
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 123, title: "디지털 쌍둥이가 계산한 핏속 약 농도" });
      var g = K.chart(ctx, { x: RX + 4, y: 40, w: W - RX - 14, h: H - 44, x0: 0, x1: 24, y0: 0, y1: 40, xt: 4, yt: 4, xf: function (t) { return t + "시간"; }, yl: "mg/L" });
      var bandG = ctx.createLinearGradient(0, g.Y(20), 0, g.Y(10)); bandG.addColorStop(0, "rgba(63,211,163,.12)"); bandG.addColorStop(.5, "rgba(63,211,163,.28)"); bandG.addColorStop(1, "rgba(63,211,163,.12)");
      ctx.fillStyle = bandG; ctx.fillRect(g.L, g.Y(20), g.R - g.L, g.Y(10) - g.Y(20));
      K.pill(ctx, "초록 띠 = 알맞은 농도 10~20 mg/L", W - 14, 28, { s: 11.5, a: "right", c: KC.green });
      var pts = []; for (var t = 0; t <= 24 + 1e-9; t += 0.2) pts.push([t, Math.min(40, css * (1 - Math.exp(-CL[pt] / 20 * t)))]);
      K.plot(ctx, g, pts, KC.red, { w: 3 });
      if (css <= 40) { K.line(ctx, { x: g.L, y: g.Y(css) }, { x: g.R, y: g.Y(css) }, "rgba(255,211,107,.6)", 1.2, [4, 4]); K.pill(ctx, "안정 농도 " + css.toFixed(1), g.L + 8, g.Y(css) + (css > 30 ? 22 : -8), { s: 11, c: KC.yellow }); }
      var tt = Math.min(tPh, 24); K.glow(ctx, g.X(tt), g.Y(Math.min(40, conc)), 4.5, "rgba(255,220,220,.98)", 3);
      return ok;
    }
    function update() {
      var ok = draw();
      put("tw-read",
        "<span class='k'>투여 속도</span><span class='v y'>" + R + " mg/시</span>" +
        "<span class='k'>청소율</span><span class='v b'>" + CL[pt] + " L/시</span><span class='sub'>환자 " + pt + "의 몸이 약을 치우는 빠르기</span>" +
        "<span class='k'>안정 농도</span><span class='v " + (ok ? "g" : "r") + "'>" + (R / CL[pt]).toFixed(1) + " mg/L</span><span class='sub'>= 투여 속도 ÷ 청소율</span>" +
        "<span class='ok " + (ok ? "g" : "r") + "'>" + (ok ? "알맞은 농도(10~20)" : (R / CL[pt] > 20 ? "너무 높음 · 부작용 위험" : "너무 낮음 · 약효 없음")) + "</span>");
      $("tw-info").innerHTML = "환자 " + pt + " 에게 시간당 " + R + " mg → 안정 농도 " + (R / CL[pt]).toFixed(1) + " mg/L. " + (ok ? "알맞습니다." : (R / CL[pt] > 20 ? "너무 높아 부작용 위험이 있습니다." : "너무 낮아 약효가 없습니다."));
      if (ok && !got[pt]) { got[pt] = true; got["r" + pt] = R; window.sthState("twGot", got); mission(); }
    }
    function mission() {
      if (got.A) done("m1-4a"); if (got.B) done("m1-4b");
      if (got.A && got.B) {
        window.sthState("twBest", "환자 A 시간당 " + got.rA + " mg, 환자 B 시간당 " + got.rB + " mg");
        window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("twBest") + ". 같은 약도 몸마다 알맞은 양이 두 배나 다릅니다 — 디지털 쌍둥이가 여는 맞춤 의료입니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    segWire("tw-p", function (x) { pt = x; tPh = 0; update(); });
    $("tw-r").addEventListener("input", function (e) { R = +e.target.value; $("tw-r-val").textContent = R + " mg"; tPh = 0; update(); });
    pauser("tw-play", st, ["시간 멈추기", "시간 흐르게"]);
    if (REDUCE) tPh = 24;
    K.animate(canvas, function (dt) {
      if (!st.on) return;
      tPh += dt / 1000 * 2.4; if (tPh > 30) tPh = 0;     /* 화면 1초 = 2.4시간 */
      acc += dt * R / 100; if (acc > 400 && R > 0) { acc = 0; drops.push(0); }
      drops = drops.map(function (d) { return d + dt / 500; }).filter(function (d) { return d < 1; });
      draw();
    });
    update(); mission();
  })();

  function finish() { window.sthState("r1", "해결 · " + (window.sthState("batBest") || "") + " / " + (window.sthState("twBest") || "")); }
  function vs() {
    var p = window.sthState("p1") || "";
    $("e1-vs").innerHTML = "<b>나의 첫 대답</b> " + (p || "기록 없음") + "<br><b>배터리 예측</b> " + (window.sthState("batBest") || "-") + "<br><b>메디컬 트윈</b> " + (window.sthState("twBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[융합과학 탐구 Ⅲ] 이야기 ① 2035년의 등굣길",
    items: [
      { id: "e1a", label: "내가 예측하는 미래 융합기술", hint: "10년 뒤 등장할 융합과학기술 하나를 예측하고, 어떤 분야의 어떤 발전 추세를 근거로 삼았는지 쓰세요." },
      { id: "e1b", label: "예측의 불확실성", hint: "배터리 예측처럼 가정이 조금 바뀌면 결과가 어떻게 달라지는지 예를 들어 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 사막의 딸기, 물만 내뿜는 차
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "사건 파일 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "p2", title: "토론자의 첫 발언",
    question: "난제가 한 분야의 기술만으로 풀리지 않는 까닭은?",
    options: ["㉠ 원인이 여러 겹으로 얽혀 있고 이해관계자가 많아서", "㉡ 과학자들이 게을러서", "㉢ 난제는 원래 풀 수 없는 문제라서"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 스마트팜 */
  (function () {
    var canvas = $("c-farm"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, th = 25;
    function sim(t) { var m = 40, arr = [m], mn = 99, mx = 0, w = 0; for (var d = 1; d <= 30; d++) { m -= 3.5; mn = Math.min(mn, m); if (m < t) { m += 10; w++; } mx = Math.max(mx, m); arr.push(m); } return { arr: arr, mn: mn, mx: mx, w: w }; }
    var st = { on: !REDUCE }, day = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var r = sim(th), ok = r.mn >= 30 && r.mx <= 45, LW = 290;
      var di = Math.min(30, Math.floor(day)), m = r.arr[di], wet = di > 0 && r.arr[di] > r.arr[di - 1];
      /* ── 왼쪽: 스마트팜 화분 단면 ── */
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 131 });
      var soilY = 150;
      var sg = ctx.createLinearGradient(0, soilY, 0, H), wetA = clamp((m - 10) / 45, 0, 1);
      sg.addColorStop(0, "rgb(" + Math.round(150 - 80 * wetA) + "," + Math.round(105 - 55 * wetA) + "," + Math.round(70 - 35 * wetA) + ")");
      sg.addColorStop(1, "rgb(" + Math.round(90 - 50 * wetA) + "," + Math.round(60 - 32 * wetA) + "," + Math.round(40 - 20 * wetA) + ")");
      ctx.fillStyle = "#4a5070"; ctx.beginPath(); ctx.roundRect(40, soilY - 10, LW - 80, H - soilY + 10 - 12, [4, 4, 10, 10]); ctx.fill();
      ctx.fillStyle = sg; ctx.fillRect(46, soilY, LW - 92, H - soilY - 18);
      var R2 = K.rng(5); for (var gr = 0; gr < 60; gr++) { ctx.fillStyle = "rgba(255,230,190," + (0.08 + R2() * .12) + ")"; ctx.fillRect(48 + R2() * (LW - 96), soilY + 2 + R2() * (H - soilY - 22), 2, 2); }
      /* 딸기 포기 */
      var px = LW / 2, droop = m < 30 ? (30 - m) / 20 : 0;
      ctx.strokeStyle = "#3faa5a"; ctx.lineWidth = 3; ctx.lineCap = "round";
      [-1, 0, 1].forEach(function (k) { ctx.beginPath(); ctx.moveTo(px, soilY); ctx.quadraticCurveTo(px + k * 20, soilY - 50, px + k * 40, soilY - 66 + droop * 34); ctx.stroke(); });
      [-1, 0, 1].forEach(function (k) { var lx = px + k * 40, ly = soilY - 70 + droop * 34, lg = ctx.createRadialGradient(lx - 4, ly - 4, 2, lx, ly, 18); lg.addColorStop(0, "#8fe08a"); lg.addColorStop(1, "#2f8a43"); ctx.fillStyle = lg; ctx.beginPath(); ctx.ellipse(lx, ly, 18, 11, k * .5, 0, 6.2832); ctx.fill(); });
      [[-26, -18], [24, -14]].forEach(function (q) { var fx = px + q[0], fy = soilY + q[1], bg = ctx.createRadialGradient(fx - 3, fy - 3, 1, fx, fy, 9); bg.addColorStop(0, "#ff9aa0"); bg.addColorStop(1, "#c0192c"); ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(fx - 8, fy - 4); ctx.quadraticCurveTo(fx, fy + 14, fx + 8, fy - 4); ctx.quadraticCurveTo(fx, fy - 9, fx - 8, fy - 4); ctx.fill(); });
      ctx.strokeStyle = "rgba(220,200,160,.45)"; ctx.lineWidth = 1.2;
      [-1, 1].forEach(function (k) { ctx.beginPath(); ctx.moveTo(px, soilY); ctx.quadraticCurveTo(px + k * 30, soilY + 40, px + k * 50, soilY + 80); ctx.stroke(); });
      /* 수분 센서와 물 주는 관 */
      var sx = 70; ctx.fillStyle = "#c9d2f0"; ctx.fillRect(sx - 3, soilY - 26, 6, 70); ctx.fillStyle = "#3a4270"; ctx.beginPath(); ctx.roundRect(sx - 10, soilY - 40, 20, 16, 4); ctx.fill();
      K.glow(ctx, sx, soilY - 32, 2.4, m < th ? "rgba(255,107,129,.98)" : "rgba(63,211,163,.98)", 3);
      ctx.strokeStyle = "#8aa0d8"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(20, 52); ctx.lineTo(LW - 30, 52); ctx.stroke();
      if (wet) for (var dq = 0; dq < 7; dq++) { var dy = 58 + ((day % 1) * 90 + dq * 13) % 90; K.glow(ctx, px - 30 + dq * 10, dy, 2, "rgba(127,211,255,.95)", 2.4); }
      K.pill(ctx, "수분 센서", 14, soilY - 50, { s: 10.5, c: KC.blue, box: [0, LW] });
      K.pill(ctx, (di) + "일째 · 흙 수분 " + m.toFixed(1) + "%" + (wet ? " · 물!" : ""), 14, 28, { s: 12, c: m >= 30 && m <= 45 ? KC.green : KC.red, box: [0, LW] });

      /* ── 오른쪽: 30일 기록 ── */
      var RX = LW + 8;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 133, title: "흙 수분 30일 기록 · 물 준 횟수 " + r.w + "번" });
      var g = K.chart(ctx, { x: RX + 4, y: 40, w: W - RX - 14, h: H - 44, x0: 0, x1: 30, y0: 10, y1: 55, xt: 6, yt: 3, xf: function (d) { return d + "일"; }, yf: function (v2) { return v2 + "%"; } });
      var bandG = ctx.createLinearGradient(0, g.Y(45), 0, g.Y(30)); bandG.addColorStop(0, "rgba(63,211,163,.12)"); bandG.addColorStop(.5, "rgba(63,211,163,.28)"); bandG.addColorStop(1, "rgba(63,211,163,.12)");
      ctx.fillStyle = bandG; ctx.fillRect(g.L, g.Y(45), g.R - g.L, g.Y(30) - g.Y(45));
      K.line(ctx, { x: g.L, y: g.Y(th) }, { x: g.R, y: g.Y(th) }, KC.yellow, 1.5, [5, 4]);
      K.pill(ctx, "물 주기 기준 " + th + "%", g.R - 6, g.Y(th) + (th > 40 ? 22 : -8), { s: 11, a: "right", c: KC.yellow });
      K.plot(ctx, g, r.arr.map(function (v2, d) { return [d, v2]; }), KC.blue);
      K.pill(ctx, "딸기가 잘 자라는 30~45%", g.L + 8, g.Y(45) - 8, { s: 11, c: KC.green });
      K.pill(ctx, "최저 " + r.mn.toFixed(1) + "% · 최고 " + r.mx.toFixed(1) + "%", W - 14, 28, { s: 11.5, a: "right", c: ok ? KC.green : KC.red });
      K.glow(ctx, g.X(di), g.Y(m), 4.5, "rgba(220,245,255,.98)", 3);
      return { ok: ok, r: r };
    }
    function update() {
      var o = draw();
      $("fm-info").innerHTML = "하루에 흙 수분이 약 3.5%p 줄고, 기준 아래로 떨어지면 센서가 물을 줘 약 10%p 올립니다. 기준이 낮으면 물을 주기 전에 너무 마르고, 높으면 물을 준 뒤 넘쳐 흘러갑니다.";
      if (o.ok && !ep.cleared(1)) {
        window.sthState("fmBest", "수분 " + th + "% 아래에서 물 주기 → 30일 동안 " + o.r.mn.toFixed(1) + " ~ " + o.r.mx.toFixed(1) + "%");
        window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("fmBest") + ". 센서 데이터로 필요한 만큼만 물을 주면 물이 부족한 곳에서도 작물을 키울 수 있습니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("fm-t").addEventListener("input", function (e) { th = +e.target.value; $("fm-t-val").textContent = th + "%"; update(); });
    pauser("fm-play", st, ["날짜 멈추기", "날짜 흐르게"]);
    K.animate(canvas, function (dt) { if (st.on) { day += dt / 1000 * 2.5; if (day >= 31) day = 0; draw(); } });
    update();
    if (ep.cleared(1)) window.sthMission("m2-2", true);
  })();

  /* 장면 3 — 수소차 (잘라 보는 디오라마: 도로 블록 위에 반으로 자른 수소차 + 아래에 경로·반응 읽음판) */
  (function () {
    var canvas = $("c-h2"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, k = 2, NEED = 440;
    var st = { on: !REDUCE }, drive = 0, puffs = [], ph = 0;
    var DH = 430;                                         /* 위 모형 칸 높이 */
    var OX = 388, OY = 120, SC = 0.66, CC = 0.866;
    var I = K.iso({ ox: OX, oy: OY, s: SC, L: 620, D: 260 }), L = I.L, D = I.D;
    var ZT = 70, X0 = 110, YC = 156, WC = 52;             /* 도로 윗면 높이, 차 뒤끝 x, 자른 면 y, 차 반폭 */
    /* 차 옆모습(뒤 u=0 → 앞 u=380), 위로 z */
    var BODY = [[8, 14], [0, 30], [2, 80], [34, 98], [84, 106], [128, 150], [266, 152], [312, 104], [370, 94], [382, 70], [380, 30], [368, 14]];
    var TANKS = [[34, 42, 19], [78, 42, 19], [128, 40, 19]];
    function onPlane(yv, fn) { ctx.save(); ctx.transform(CC * SC, 0.5 * SC, 0, -SC, OX + (X0 - yv) * CC * SC, OY + (X0 + yv) * 0.5 * SC - ZT * SC); fn(); ctx.restore(); }
    function pathPoly(pts) { ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.closePath(); }
    function along(pts, t) {                              /* 꺾은선 위 비율 t 의 점 */
      var seg = [], tot = 0, i;
      for (i = 1; i < pts.length; i++) { var d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); tot += d; }
      var want = t * tot;
      for (i = 0; i < seg.length; i++) {
        if (want <= seg[i] || i === seg.length - 1) { var f = seg[i] ? Math.min(1, want / seg[i]) : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]; }
        want -= seg[i];
      }
      return pts[0];
    }
    function P(u, z) { return I.P(X0 + u, YC, ZT + z); }
    var H2PIPE = [[146, 40], [168, 20], [288, 20], [300, 56]];
    var AIR = [[440, 76], [384, 76], [348, 72]];
    var WATER = [[298, 52], [284, 14], [12, 12], [-14, 12]];
    var WIRE = [[324, 52], [336, 46]];
    function road() {
      I.face(ctx, "front", function (Lw) {
        [[0, 34, "#6e5236", "#4d3925"], [34, 54, "#9a8a72", "#7a6b56"], [54, 63, "#5d5d66", "#4a4a52"], [63, 70, "#6f8f45", "#56733a"]].forEach(function (b) {
          var g = ctx.createLinearGradient(0, b[0], 0, b[1]); g.addColorStop(0, b[3]); g.addColorStop(1, b[2]);
          ctx.fillStyle = g; ctx.fillRect(0, b[0], Lw, b[1] - b[0]);
        });
        var R = K.rng(17); for (var i = 0; i < 320; i++) { ctx.fillStyle = R() > .5 ? "rgba(255,255,255,.18)" : "rgba(30,20,10,.25)"; ctx.fillRect(R() * Lw, R() * 54, 2, 2); }
      });
      I.face(ctx, "right", function (Lw) {
        [[0, 34, "#6e5236"], [34, 54, "#9a8a72"], [54, 70, "#4a4a52"]].forEach(function (b) { ctx.fillStyle = b[2]; ctx.fillRect(0, b[0], Lw, b[1] - b[0]); });
        ctx.fillStyle = "#6f8f45"; ctx.fillRect(0, 63, 20, 7); ctx.fillRect(Lw - 10, 63, 10, 7);
        var R = K.rng(19); for (var i = 0; i < 140; i++) { ctx.fillStyle = R() > .5 ? "rgba(255,255,255,.16)" : "rgba(30,20,10,.25)"; ctx.fillRect(R() * Lw, R() * 54, 2, 2); }
      });
      I.shade(ctx, "front", function () { return ZT; }); I.shade(ctx, "right", function () { return ZT; });
      I.plane(ctx, ZT, "#7ea052", null, 0, L, 0, 20); I.plane(ctx, ZT, "#7ea052", null, 0, L, 250, D);
      var a = I.P(0, 20, ZT), c = I.P(L, 250, ZT), ag = ctx.createLinearGradient(a.x, a.y, c.x, c.y); ag.addColorStop(0, "#4b4f5e"); ag.addColorStop(1, "#3a3d49");
      I.plane(ctx, ZT, ag, null, 0, L, 20, 250);
      function seg(x0, x1, y, col, w) { var p = I.P(x0, y, ZT), q = I.P(x1, y, ZT); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      seg(0, L, 26, "rgba(255,255,255,.75)", 2); seg(0, L, 244, "rgba(255,255,255,.75)", 2);
      var off = (ph * 0.12) % 70;
      for (var x = -70 + off; x < L; x += 70) seg(Math.max(0, x), Math.min(L, x + 36), 70, "rgba(255,211,107,.9)", 2.4);
      I.edges(ctx, ZT, ZT);
      [[40, 8], [180, 6], [330, 10], [480, 7], [600, 9]].forEach(function (t, i) { I.tree(ctx, t[0], t[1], ZT, 0.9 + (i % 2) * .15); });
    }
    function wheel(u) {
      onPlane(YC - WC + 12, function () {
        var g = ctx.createRadialGradient(u, 30, 4, u, 30, 30); g.addColorStop(0, "#3b3f48"); g.addColorStop(1, "#0d0f13");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(u, 30, 30, 0, 6.2832); ctx.fill();
        ctx.fillStyle = "#b9c2d0"; ctx.beginPath(); ctx.arc(u, 30, 15, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = "#6c7584"; ctx.lineWidth = 3;
        for (var i = 0; i < 5; i++) { var an = -ph * 0.01 + i * 1.2566; ctx.beginPath(); ctx.moveTo(u, 30); ctx.lineTo(u + Math.cos(an) * 14, 30 + Math.sin(an) * 14); ctx.stroke(); }
      });
    }
    function car() {
      /* 바닥 그림자 */
      var s0 = P(190, 0); ctx.fillStyle = "rgba(10,15,30,.28)"; ctx.beginPath(); ctx.ellipse(s0.x - 18, s0.y - 18, 150, 30, 0.52, 0, 6.2832); ctx.fill();
      wheel(70); wheel(300);
      /* 먼 쪽 반쪽 몸체 — 뒤 실루엣 */
      onPlane(YC - WC, function () { pathPoly(BODY); ctx.fillStyle = "#8b98ad"; ctx.fill(); });
      /* 지붕·보닛 윗면 띠 (유리창은 짙은 파랑) */
      var top = BODY.slice(1, 11);
      for (var i = 0; i < top.length - 1; i++) {
        var p0 = top[i], p1 = top[i + 1], du = p1[0] - p0[0], dz = p1[1] - p0[1], len = Math.hypot(du, dz) || 1;
        var lit = 0.72 + 0.32 * (du / len) + 0.12 * (dz / len), glassy = (i === 3 || i === 5);
        var a = I.P(X0 + p0[0], YC - WC, ZT + p0[1]), b = I.P(X0 + p1[0], YC - WC, ZT + p1[1]), c = I.P(X0 + p1[0], YC, ZT + p1[1]), d = I.P(X0 + p0[0], YC, ZT + p0[1]);
        I.quad(ctx, a, b, c, d, glassy ? "rgba(40,70,110,.88)" : K.tint("#dbe6f4", lit));
        ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = .8; ctx.stroke();
      }
      /* 자른 면 */
      onPlane(YC, function () {
        pathPoly(BODY); ctx.save(); ctx.clip();
        var ig = ctx.createLinearGradient(0, 160, 0, 0); ig.addColorStop(0, "#5a6680"); ig.addColorStop(1, "#343c4f"); ctx.fillStyle = ig; ctx.fillRect(-10, 0, 400, 170);
        /* 바닥판·뒤 짐칸 바닥 */
        ctx.fillStyle = "#9aa3b2"; ctx.fillRect(-10, 10, 400, 12); ctx.fillRect(0, 62, 110, 6);
        /* 앞 기계실 칸막이 */
        ctx.fillStyle = "#8b94a6"; ctx.fillRect(276, 14, 6, 96);
        /* 의자 */
        ctx.fillStyle = "#a88a66";
        ctx.beginPath(); ctx.roundRect(120, 64, 56, 12, 4); ctx.fill(); ctx.beginPath(); ctx.roundRect(122, 72, 14, 58, 5); ctx.fill();
        ctx.beginPath(); ctx.roundRect(206, 30, 52, 12, 4); ctx.fill(); ctx.beginPath(); ctx.roundRect(208, 38, 14, 82, 5); ctx.fill();
        /* 운전대 */
        ctx.strokeStyle = "#c9d2e0"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(262, 92); ctx.lineTo(282, 78); ctx.stroke();
        /* 수소 탱크(가로로 누운 원통의 단면) — 실은 수소가 많을수록 분자가 많다 */
        TANKS.forEach(function (t, j) {
          var tg = ctx.createRadialGradient(t[0] - 5, t[1] + 6, 3, t[0], t[1], t[2]); tg.addColorStop(0, "#5f6f8a"); tg.addColorStop(1, "#1e2533");
          ctx.fillStyle = tg; ctx.beginPath(); ctx.arc(t[0], t[1], t[2], 0, 6.2832); ctx.fill();
          ctx.strokeStyle = "#9fb3d6"; ctx.lineWidth = 2; ctx.stroke();
          ctx.fillStyle = "rgba(127,211,255,.18)"; ctx.beginPath(); ctx.arc(t[0], t[1], t[2] - 3, 0, 6.2832); ctx.fill();
          var R = K.rng(41 + j), n = Math.round(k * 2.2);
          for (var q = 0; q < n; q++) {
            var an = R() * 6.2832 + ph * 0.0012 * (R() > .5 ? 1 : -1), rr = Math.sqrt(R()) * (t[2] - 6), mx = t[0] + Math.cos(an) * rr, my = t[1] + Math.sin(an) * rr;
            ctx.fillStyle = "#f2f6ff"; ctx.beginPath(); ctx.arc(mx - 1.6, my, 1.7, 0, 6.2832); ctx.arc(mx + 1.6, my, 1.7, 0, 6.2832); ctx.fill();
          }
        });
        /* 관: 수소(파랑)·물(하늘)·전선(노랑) */
        function line(pts, col, w) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineJoin = "round"; ctx.beginPath(); pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.stroke(); }
        line(H2PIPE, "#6f86c8", 3.2); line(WATER, "#4fb6e8", 3); line(WIRE, "#ffd35a", 3);
        /* 연료 전지 스택 */
        var sg = ctx.createLinearGradient(296, 0, 346, 0); sg.addColorStop(0, "#41506b"); sg.addColorStop(1, "#27303f");
        ctx.fillStyle = sg; ctx.fillRect(294, 52, 54, 38);
        for (var x = 298; x < 346; x += 4) { ctx.fillStyle = (x / 4) % 2 ? "#9aa9c4" : "#56657f"; ctx.fillRect(x, 55, 2, 32); }
        /* 모터 */
        var mg = ctx.createRadialGradient(340, 36, 2, 342, 32, 17); mg.addColorStop(0, "#d7dde6"); mg.addColorStop(1, "#59626f");
        ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(342, 32, 16, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = "#2b2f3a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(342, 32, 7, 0, 6.2832); ctx.stroke();
        ctx.restore();
        pathPoly(BODY); ctx.strokeStyle = "#ff8a3d"; ctx.lineWidth = 3.2; ctx.stroke();
        /* 가까운 쪽 바퀴는 몸체 아래로 드러난 부분만 */
        [70, 300].forEach(function (u) { ctx.save(); ctx.beginPath(); ctx.rect(u - 34, -2, 68, 16); ctx.clip(); ctx.fillStyle = "#14171d"; ctx.beginPath(); ctx.arc(u, 30, 30, 0, 6.2832); ctx.fill(); ctx.restore(); });
      });
      /* 흐름 알갱이 */
      var tt = ph / 1000;
      function flow(pts, n, sp, col, r) { for (var i = 0; i < n; i++) { var p = along(pts, ((tt * sp + i / n) % 1 + 1) % 1), s = P(p[0], p[1]); K.glow(ctx, s.x, s.y, r, col, 2.6); } }
      flow(H2PIPE, 5, 0.35, "rgba(200,215,255,.95)", 2);
      flow(AIR, 4, 0.45, "rgba(255,138,138,.95)", 2.2);
      flow(WATER, 6, 0.3, "rgba(127,211,255,.98)", 2);
      flow(WIRE, 2, 1.2, "rgba(255,211,90,.98)", 1.8);
      /* 배기구 물방울 */
      puffs.forEach(function (p) { var s = P(-16 - p.t * 30, 12 - p.t * 12); K.glow(ctx, s.x, s.y, 2.6 * (1 - p.t) + .8, "rgba(127,211,255," + (0.9 * (1 - p.t)).toFixed(2) + ")", 2.6); });
    }
    function drawModel() {
      var range = k * 100, ok = range >= NEED;
      var fl = I.P(L, D, 0);
      K.studio(ctx, 0, 0, W, DH, { x: fl.x - 160, y: fl.y - 20, rx: 360, ry: 60 });
      ctx.save(); ctx.beginPath(); ctx.roundRect(0, 0, W, DH, 14); ctx.clip();
      road(); car();
      ctx.restore();
      var box = [0, W];
      I.label(ctx, X0 + 78, YC, ZT + 54, "수소 탱크 (압축 수소 " + k.toFixed(1) + " kg)", -110, 64, "#cfe0ff", box);
      I.label(ctx, X0 + 322, YC, ZT + 86, "연료 전지 — 수소 + 산소 → 물 + 전기", 70, -96, "#ffd35a", box);
      I.label(ctx, X0 + 352, YC, ZT + 26, "모터 — 전기로 바퀴를 돌림", 120, -10, "#e8ecff", box);
      I.label(ctx, X0 + 420, YC, ZT + 76, "공기 속 산소가 들어감", 96, -46, "#ff9aa0", box);
      I.label(ctx, X0 - 14, YC, ZT + 12, "배기구 → 물 약 " + (k * 9).toFixed(1) + " kg", -30, 128, "#9fdcff", box);
      var l2 = "수소 " + k.toFixed(1) + " kg → " + range.toFixed(0) + " km";
      if (range < 400) { K.bigText(ctx, "부산까지 못 간다", 22, 50, 28, "#ffffff"); K.bigText(ctx, l2, 22, 84, 18, "#ff9aac"); }
      else if (!ok) { K.bigText(ctx, "부산엔 닿지만 여유가 없다", 22, 50, 28, "#ffffff"); K.bigText(ctx, l2, 22, 84, 18, "#ffd35a"); }
      else if (k <= 4.7 + 1e-9) { K.bigText(ctx, "여유까지 챙겨 부산으로", 22, 50, 28, "#ffd35a"); K.bigText(ctx, l2, 22, 84, 18, "#ffffff"); }
      else { K.bigText(ctx, "필요한 것보다 더 실었다", 22, 50, 28, "#ffffff"); K.bigText(ctx, l2, 22, 84, 18, "#bfe6ff"); }
      K.warn(ctx, W - 14, 30, "⚠ 차를 반으로 잘라 속을 보임 · 장치 크기는 보기 쉽게 바꿈", "right");
    }
    function carIcon(x, y) {
      var bg = ctx.createLinearGradient(0, y - 18, 0, y + 6); bg.addColorStop(0, "#e9f3ff"); bg.addColorStop(.5, "#7fb6ff"); bg.addColorStop(1, "#2c4f8f");
      ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(x - 30, y + 2); ctx.lineTo(x - 28, y - 8); ctx.quadraticCurveTo(x - 14, y - 22, x + 6, y - 20); ctx.quadraticCurveTo(x + 22, y - 18, x + 30, y - 6); ctx.lineTo(x + 30, y + 2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(20,40,80,.75)"; ctx.beginPath(); ctx.moveTo(x - 16, y - 9); ctx.quadraticCurveTo(x - 8, y - 18, x + 6, y - 17); ctx.lineTo(x + 10, y - 9); ctx.closePath(); ctx.fill();
      [-18, 18].forEach(function (o) { ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(x + o, y + 3, 6, 0, 6.2832); ctx.fill(); ctx.fillStyle = "#9aa"; ctx.beginPath(); ctx.arc(x + o, y + 3, 2.4, 0, 6.2832); ctx.fill(); });
      K.glow(ctx, x + 30, y - 4, 2, "rgba(255,250,210,.95)", 4);
    }
    function mol(x, y, kind) {
      if (kind === "H2") { K.planet(ctx, x - 6, y, 7, "#f2f5ff", "#8a93b8"); K.planet(ctx, x + 6, y, 7, "#f2f5ff", "#8a93b8"); }
      else if (kind === "O2") { K.planet(ctx, x - 8, y, 10, "#ff8a8a", "#8a1a1a"); K.planet(ctx, x + 8, y, 10, "#ff8a8a", "#8a1a1a"); }
      else { K.planet(ctx, x, y, 10, "#ff8a8a", "#8a1a1a"); K.planet(ctx, x - 10, y + 7, 6, "#f2f5ff", "#8a93b8"); K.planet(ctx, x + 10, y + 7, 6, "#f2f5ff", "#8a93b8"); }
    }
    var Y0 = DH + 8, RY = Y0 + 96;
    function rX(km) { return 50 + km / 800 * 510; }
    function drawBottom() {
      var range = k * 100, LW = 600, x0 = 50, x1 = 560, y = RY, ok = range >= NEED;
      K.stage(ctx, 0, Y0, LW, H - Y0, "night", { seed: 141, title: "수소 " + k.toFixed(1) + " kg으로 갈 수 있는 거리" });
      var rd = ctx.createLinearGradient(0, y - 16, 0, y + 16); rd.addColorStop(0, "#2b2f45"); rd.addColorStop(.5, "#3a3f5c"); rd.addColorStop(1, "#2b2f45");
      ctx.fillStyle = rd; ctx.fillRect(x0 - 20, y - 16, x1 - x0 + 40, 32);
      ctx.strokeStyle = "rgba(255,211,107,.5)"; ctx.lineWidth = 1.5; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(x0 - 20, y); ctx.lineTo(x1 + 20, y); ctx.stroke(); ctx.setLineDash([]);
      var re = rX(Math.min(range, 800));
      ctx.save(); ctx.shadowColor = ok ? KC.green : KC.red; ctx.shadowBlur = 10; ctx.fillStyle = ok ? "rgba(63,211,163,.85)" : "rgba(255,107,129,.85)"; ctx.fillRect(x0, y + 18, re - x0, 6); ctx.restore();
      [[0, "서울"], [400, "부산 400 km"]].forEach(function (q) { K.glow(ctx, rX(q[0]), y, 5, "rgba(255,255,255,.95)", 2.4); K.pill(ctx, q[1], rX(q[0]), y - 30, { s: 12, a: "center", c: KC.ink, box: [0, LW] }); });
      ctx.strokeStyle = KC.yellow; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(rX(440), y - 18); ctx.lineTo(rX(440), y + 30); ctx.stroke();
      K.pill(ctx, "여유 포함 440 km", rX(440), y + 48, { s: 11, a: "center", c: KC.yellow, box: [0, LW] });
      carIcon(rX(Math.min(drive, range, 800)), y - 4);
      K.pill(ctx, "갈 수 있는 거리 " + range.toFixed(0) + " km", x0, H - 16, { s: 14, c: ok ? KC.green : KC.red, box: [0, LW] });
      K.pill(ctx, "배기구에서 나오는 것: 물", LW - 14, H - 16, { s: 11, a: "right", c: KC.blue, box: [0, LW] });
      var RX = LW + 8, RW = W - RX, my = Y0 + 66;
      K.stage(ctx, RX, Y0, RW, H - Y0, "lab", { seed: 143, title: "연료 전지 안의 반응" });
      mol(RX + 34, my - 16, "H2"); mol(RX + 34, my + 16, "H2");
      K.t(ctx, "+", RX + 66, my + 5, { s: 18, a: "center", c: KC.mute });
      mol(RX + 100, my, "O2");
      K.arrow(ctx, { x: RX + 128, y: my }, { x: RX + 168, y: my }, KC.ink, 2, 9);
      mol(RX + 200, my - 18, "W"); mol(RX + 200, my + 18, "W");
      K.t(ctx, "2H₂ + O₂ → 2H₂O", RX + RW / 2, my + 52, { s: 14, a: "center", c: KC.ink, w: "900" });
      kv(ctx, "나오는 물 (수소 4 g → 물 36 g, 9배)", "약 " + (k * 9).toFixed(1) + " kg", RX + 18, Y0 + 136, KC.blue, 20);
      K.pill(ctx, "달릴 때 배기가스 이산화 탄소 0 g", RX + RW / 2, H - 14, { s: 11.5, a: "center", c: KC.green, box: [RX, W] });
    }
    function draw() { ctx.clearRect(0, 0, W, H); drawModel(); drawBottom(); }
    function update() {
      draw();
      $("h2-info").innerHTML = "2H₂ + O₂ → 2H₂O. 수소 분자 2개(4 g)가 물 분자 2개(36 g)가 되므로, 수소 1 kg을 쓰면 물이 약 9 kg 나옵니다. 수소 " + k.toFixed(1) + " kg → " + (k * 100).toFixed(0) + " km.";
      if (k * 100 >= NEED - 1e-9 && k <= 4.7 + 1e-9 && !ep.cleared(2)) {
        window.sthState("h2Best", "수소 " + k.toFixed(1) + " kg → " + (k * 100).toFixed(0) + " km, 물 약 " + (k * 9).toFixed(0) + " kg");
        window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("h2Best") + ". 달리는 동안 이산화 탄소 대신 물이 나옵니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("h2-k").addEventListener("input", function (e) { k = Math.round(+e.target.value * 10) / 10; $("h2-k-val").textContent = k.toFixed(1) + " kg"; update(); });
    pauser("h2-play", st, ["차 멈추기", "차 달리기"]);
    if (REDUCE) drive = 9999;
    K.animate(canvas, function (dt) {
      if (!st.on) return;
      ph += dt;
      var lim = Math.min(k * 100, 800);
      drive += dt / 1000 * 120; if (drive > lim + 160) drive = 0;
      if (Math.random() < .35) puffs.push({ t: 0 });
      puffs.forEach(function (p) { p.t += dt / 900; });
      puffs = puffs.filter(function (p) { return p.t < 1; });
      draw();
    });
    update();
    if (ep.cleared(2)) window.sthMission("m2-3", true);
  })();

  /* 장면 4 — 난제와 기술 */
  window.sthSort({
    mount: "s2-sort",
    buckets: [{ id: "cl", label: "🌡️ 기후 변화" }, { id: "fd", label: "🌾 물·식량 부족" }, { id: "rs", label: "⛏️ 자원 고갈" }, { id: "sh", label: "🕳️ 도시 싱크홀" }],
    items: [
      { t: "온실 기체 배출을 줄이려고, 재생 에너지로 만든 그린 수소로 달리는 연료 전지차", a: "cl", why: "만들 때도 달릴 때도 온실 기체를 거의 내지 않아 기후 변화 대응 기술입니다." },
      { t: "공장 굴뚝의 이산화 탄소를 포집해 저장하는 기술", a: "cl", why: "배출을 줄이는 기술입니다." },
      { t: "센서와 인공지능이 물과 양분을 조절하는 스마트팜", a: "fd", why: "적은 물로 작물을 키웁니다." },
      { t: "바닷물의 소금을 걸러 먹는 물을 만드는 해수 담수화", a: "fd", why: "물 부족을 해결합니다." },
      { t: "폐배터리에서 리튬·니켈을 다시 뽑아내는 재활용 기술", a: "rs", why: "한정된 광물을 다시 씁니다." },
      { t: "석유·석탄이 바닥나기 전에, 써도 없어지지 않는 태양광·풍력으로 에너지원을 바꾼다", a: "rs", why: "화석 연료 고갈에 대비합니다(온실 기체를 줄이는 효과도 함께 있습니다).", hint: "‘다 써 버리면 없는’ 자원을 대신합니다." },
      { t: "땅속 레이더로 지하의 빈 공간을 미리 찾아내는 탐사", a: "sh", why: "싱크홀을 예방합니다." },
      { t: "지하수 수위 센서로 과도한 지하수 사용을 감시", a: "sh", why: "지하수를 지나치게 뽑아 쓰는 것도 싱크홀 원인 가운데 하나입니다(도심에서는 낡은 하수관의 누수도 큰 원인입니다)." }
    ],
    onDone: function () { window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>난제마다 여러 분야의 기술이 함께 필요합니다."); ep.clear(3); ep.clear(4); }
  });
  if (ep.cleared(3)) window.sthMission("m2-4", true);

  function finish() { window.sthState("r2", "해결 · " + (window.sthState("fmBest") || "") + " / " + (window.sthState("h2Best") || "")); }
  function vs() {
    var p = window.sthState("p2") || "";
    $("e2-vs").innerHTML = "<b>나의 첫 발언</b> " + (p || "기록 없음") + "<br><b>스마트팜</b> " + (window.sthState("fmBest") || "-") + "<br><b>수소차</b> " + (window.sthState("h2Best") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[융합과학 탐구 Ⅲ] 이야기 ② 사막의 딸기, 물만 내뿜는 차",
    items: [
      { id: "w1", label: "난제 하나 고르기", hint: "인류가 겪는 난제 하나를 고르고, 어떤 분야들이 함께 붙어야 풀리는지 쓰세요." },
      { id: "e2b", label: "포럼 토의 발언문", hint: "고른 난제의 해결 기술 하나를 제안하고, 그 기술이 풀지 못하는 부분(비용, 원료, 관리 등)을 어떻게 보완할지 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ③ 스무 번 해 보면 한 번은 된다
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep3", key: "ep3", name: "사건 파일 ③", onDone: finish });

  window.sthGate({
    gate: "g3", key: "p3", title: "윤리 위원의 첫 판단",
    question: "여러 번 실험해 가장 잘 나온 한 번만 보고서에 쓰는 것은?",
    options: ["㉠ 실제로 나온 결과이니 문제없다", "㉡ 우연히 잘 나온 결과만 골라 전체를 속이므로 연구 윤리에 어긋난다", "㉢ 실험을 많이 했으니 오히려 더 믿을 만하다"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 선택적 보고 */
  (function () {
    var canvas = $("c-ph"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, n = 1;
    function P(k) { return 1 - Math.pow(0.95, k); }
    var RS = K.rng(29), LUCK = []; for (var q = 0; q < 40; q++) LUCK.push(RS() < 0.05 ? 1 : 0);
    if (LUCK.indexOf(1) < 0 || LUCK.indexOf(1) > 16) LUCK[13] = 1;   /* 예시가 보이도록 우연한 성공 하나를 둔다 */
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var LW = 600, p = P(n), hi = p > 0.5;
      K.stage(ctx, 0, 0, LW, H, "lab", { seed: 151, title: "효과가 없어도 ‘성공’이 한 번 이상 나올 확률" });
      var g = K.chart(ctx, { x: 6, y: 40, w: LW - 16, h: H - 44, x0: 0, x1: 40, y0: 0, y1: 1, xt: 4, yt: 2, xf: function (x) { return x ? Math.round(x) + "번" : ""; }, yf: function (y) { return Math.round(y * 100) + "%"; } });
      K.line(ctx, { x: g.L, y: g.Y(0.5) }, { x: g.R, y: g.Y(0.5) }, KC.red, 1.5, [5, 4]);
      K.pill(ctx, "50%", g.L + 8, g.Y(0.5) - 8, { s: 11, c: KC.red });
      var bw = (g.R - g.L) / 40 * .62;
      for (var k = 1; k <= 40; k++) {
        var x = g.X(k) - bw / 2, top = g.Y(P(k));
        if (k <= n) glowBar(ctx, x, top, bw, g.B - top, P(k) > 0.5 ? "255,107,129" : "255,179,92");
        else { ctx.fillStyle = "rgba(160,170,210,.18)"; ctx.fillRect(x, top, bw, g.B - top); }
      }
      K.pill(ctx, n + "번 → " + (p * 100).toFixed(1) + "%", g.X(n) + (n > 28 ? -10 : 10), g.Y(p) - 12, { s: 12, a: n > 28 ? "right" : "left", c: hi ? KC.red : KC.orange, box: [0, LW] });

      /* ── 오른쪽: 실험 기록장 ── */
      var RX = LW + 8, RW = W - RX;
      K.stage(ctx, RX, 0, RW, H, "night", { seed: 153, title: "녹차 실험 기록장 (예시)" });
      var cols = 8, cw = (RW - 36) / cols, found = 0;
      for (var i = 0; i < 40; i++) {
        var cx = RX + 18 + (i % cols) * cw + cw / 2, cy = 58 + Math.floor(i / cols) * 30, run = i < n, lucky = run && LUCK[i];
        if (lucky) found++;
        var tg = ctx.createLinearGradient(cx - 6, 0, cx + 6, 0); tg.addColorStop(0, "rgba(255,255,255,.25)"); tg.addColorStop(.5, "rgba(255,255,255,.08)"); tg.addColorStop(1, "rgba(255,255,255,.2)");
        ctx.fillStyle = tg; ctx.beginPath(); ctx.roundRect(cx - 6, cy - 10, 12, 22, [2, 2, 6, 6]); ctx.fill();
        if (run) { ctx.fillStyle = lucky ? "rgba(255,211,107,.95)" : "rgba(110,200,120,.7)"; ctx.beginPath(); ctx.roundRect(cx - 5, cy + 1, 10, 10, [0, 0, 5, 5]); ctx.fill(); }
        if (lucky) K.glow(ctx, cx, cy - 14, 2.6, "rgba(255,211,107,.98)", 3);
      }
      K.pill(ctx, "★ 우연히 ‘효과 있음’ " + found + "번", RX + 16, H - 44, { s: 11.5, c: KC.yellow, box: [RX, W] });
      K.pill(ctx, "P = 1 − 0.95ⁿ", RX + 16, H - 14, { s: 12, c: KC.ink, box: [RX, W] });
    }
    function update() {
      draw();
      $("ph-info").innerHTML = n + "번 실험하면, 녹차가 아무 효과가 없어도 적어도 한 번은 ‘효과 있음’처럼 보일 확률이 <b>" + (P(n) * 100).toFixed(1) + "%</b>. 그 한 번만 보고하면 읽는 사람은 효과가 있다고 믿게 됩니다.";
      if (P(n) > 0.5 && P(n - 1) <= 0.5 && !ep.cleared(1)) {
        window.sthState("phBest", n + "번 하면 헛된 ‘성공’ 확률 " + (P(n) * 100).toFixed(0) + "%, 20번이면 " + (P(20) * 100).toFixed(0) + "%");
        window.sthMission("m3-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("phBest") + ". 지훈이의 계획대로라면 가짜 성공이 나올 가능성이 더 큽니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("ph-n").addEventListener("input", function (e) { n = +e.target.value; $("ph-n-val").textContent = n + "번"; update(); });
    update();
    if (ep.cleared(1)) window.sthMission("m3-2", true);
  })();

  /* 장면 3 — 연구 진실성 */
  window.sthSort({
    mount: "s3-sort",
    buckets: [{ id: "ob", label: "🔍 객관성" }, { id: "ho", label: "🤝 정직성" }, { id: "op", label: "📂 개방성" }, { id: "fa", label: "⚖️ 공정성" }, { id: "ac", label: "🛡️ 책무성" }],
    items: [
      { t: "원하는 결론을 정해 두지 않고 선입견 없이 실험을 설계한다", a: "ob", why: "객관성입니다." },
      { t: "측정한 사람이 어느 쪽 새싹인지 모르게 해 기대가 측정에 끼어들지 않게 한다", a: "ob", why: "객관성을 지키는 방법입니다.", hint: "누구의 ‘기대’가 결과를 흔들 수 있나요?" },
      { t: "실패한 실험을 포함해 모든 결과를 있는 그대로 보고한다", a: "ho", why: "정직성입니다." },
      { t: "측정값을 그럴듯하게 바꾸거나 지어내지 않는다", a: "ho", why: "정직성입니다." },
      { t: "다른 사람이 따라 해 볼 수 있게 방법과 데이터를 공개한다", a: "op", why: "재현을 위한 개방성입니다." },
      { t: "실험 기록장을 누구나 확인할 수 있게 보관한다", a: "op", why: "개방성입니다." },
      { t: "친한 친구의 작품이라고 심사 점수를 더 주지 않는다", a: "fa", why: "공정성입니다." },
      { t: "모둠원이 기여한 만큼 이름을 올린다", a: "fa", why: "업적 평가의 공정성입니다." },
      { t: "결과가 틀린 것으로 밝혀지면 스스로 바로잡고 책임진다", a: "ac", why: "책무성입니다." },
      { t: "연구 과정과 결과의 타당성을 스스로 입증할 수 있게 준비한다", a: "ac", why: "책무성입니다." }
    ],
    onDone: function () { window.sthMission("m3-3", true, "<span class='m-tag'>미션 완료</span>다섯 기둥 가운데 하나라도 무너지면 연구 결과를 믿을 수 없게 됩니다."); ep.clear(2); }
  });
  if (ep.cleared(2)) window.sthMission("m3-3", true);

  /* 장면 4 — 전기차 */
  (function () {
    var canvas = $("c-ev"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, r = 0;
    var got = window.sthState("evGot") || { a: false, q: false };
    function perKm(rr) { return 0.18 * 0.46 * (1 - rr / 100); }
    function be(rr) { var d = 0.170 - perKm(rr); return d > 0 ? 6000 / d : Infinity; }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var KM = 150000, b = be(r), gas = function (km) { return 0.170 * km / 1000; }, ev = function (km) { return 6 + perKm(r) * km / 1000; };
      K.stage(ctx, 0, 0, W, H, "lab", { seed: 161, title: "만들고 달리는 동안의 누적 이산화 탄소" });
      var g = K.chart(ctx, { x: 6, y: 40, w: W - 20, h: H - 44, x0: 0, x1: KM, y0: 0, y1: 30, xt: 6, yt: 3, xf: function (km) { return km ? (km / 10000) + "만 km" : "0"; }, yf: function (t) { return t + " t"; } });
      /* 빚(빨강)과 이득(초록) */
      var cut = Math.min(b, KM), k;
      ctx.fillStyle = "rgba(255,107,129,.22)"; ctx.beginPath(); ctx.moveTo(g.X(0), g.Y(ev(0)));
      for (k = 0; k <= cut; k += cut / 60) ctx.lineTo(g.X(k), g.Y(ev(k)));
      for (k = cut; k >= 0; k -= cut / 60) ctx.lineTo(g.X(k), g.Y(gas(k)));
      ctx.closePath(); ctx.fill();
      if (b < KM) {
        ctx.fillStyle = "rgba(63,211,163,.24)"; ctx.beginPath(); ctx.moveTo(g.X(b), g.Y(ev(b)));
        ctx.lineTo(g.X(KM), g.Y(ev(KM))); ctx.lineTo(g.X(KM), g.Y(gas(KM))); ctx.closePath(); ctx.fill();
      }
      K.plot(ctx, g, [[0, gas(0)], [KM, gas(KM)]], KC.orange);
      K.plot(ctx, g, [[0, ev(0)], [KM, ev(KM)]], KC.green);
      K.pill(ctx, "휘발유차 · 1 km에 170 g", g.R - 6, g.Y(gas(KM)) + (gas(KM) > ev(KM) ? -10 : 24), { s: 11.5, a: "right", c: KC.orange });
      K.pill(ctx, "전기차 · 배터리 제조 6 t + 1 km에 " + (perKm(r) * 1000).toFixed(0) + " g", g.R - 6, g.Y(ev(KM)) + (gas(KM) > ev(KM) ? 24 : -10), { s: 11.5, a: "right", c: KC.green });
      K.pill(ctx, "배터리를 만들 때의 빚", g.X(0) + 10, g.Y(6) - 10, { s: 11, c: KC.red });
      if (b < KM) {
        K.line(ctx, { x: g.X(b), y: g.T }, { x: g.X(b), y: g.B }, KC.yellow, 1.5, [5, 4]);
        K.glow(ctx, g.X(b), g.Y(gas(b)), 5, "rgba(255,211,107,.98)", 3);
        K.pill(ctx, "이득이 되는 거리 " + (b / 10000).toFixed(1) + "만 km", g.X(b) + (b > 100000 ? -10 : 10), g.T + 14, { s: 12, a: b > 100000 ? "right" : "left", c: KC.yellow });
      } else K.pill(ctx, "15만 km 안에는 이득이 없음", g.R - 6, g.T + 14, { s: 12, a: "right", c: KC.red });
      K.line(ctx, { x: g.X(50000), y: g.B - 6 }, { x: g.X(50000), y: g.B }, KC.blue, 3);
      return b;
    }
    function update() {
      var b = draw(), ok = b <= 50000;
      put("ev-read",
        "<span class='k'>재생 에너지</span><span class='v b'>" + r + "%</span>" +
        "<span class='k'>전기차 1 km</span><span class='v g'>" + (perKm(r) * 1000).toFixed(0) + " g</span><span class='sub'>휘발유차 170 g</span>" +
        "<span class='k'>이득 거리</span><span class='v " + (ok ? "g" : "y") + "'>" + (b === Infinity ? "없음" : (b / 10000).toFixed(1) + "만 km") + "</span><span class='sub'>배터리 빚 6 t ÷ 1 km당 줄어드는 양</span>" +
        "<span class='ok " + (ok ? "g" : "r") + "'>" + (ok ? "5만 km 안에 이득" : "5만 km 안에는 아직 손해") + "</span>");
      $("ev-info").innerHTML = "재생 에너지 " + r + "% → 전기차는 1 km에 약 " + (perKm(r) * 1000).toFixed(0) + " g (휘발유차 170 g). 배터리를 만들 때 더 나온 6 t을 갚는 데 약 <b>" + (b / 10000).toFixed(1) + "만 km</b>.";
      if (b <= 50000 && r <= 50 && !got.a) { got.a = true; got.r = r; window.sthState("evGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m3-4a"); if (got.q) done("m3-4b");
      if (got.a && got.q) {
        window.sthState("evBest", "재생 에너지 " + got.r + "% 이상이면 5만 km 안에 이득");
        window.sthMission("m3-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("evBest") + ". 친환경 기술의 효과는 전기를 만드는 방식과 원료를 얻는 과정까지 따져야 알 수 있습니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    $("ev-r").addEventListener("input", function (e) { r = +e.target.value; $("ev-r-val").textContent = r + "%"; update(); });
    window.sthPick({
      mount: "s3-q1",
      q: "전기차 배터리 원료(리튬·니켈)를 캐는 과정에서 숲이 사라지고 현지 주민의 노동 착취 문제가 제기됩니다. 이 문제를 다루는 가장 알맞은 태도는?",
      options: ["친환경 기술이니 원료 문제는 신경 쓰지 않는다", "원료 채굴부터 폐배터리 재활용까지 전 과정의 환경·인권 영향을 함께 평가하고 개선한다", "전기차를 모두 금지한다"],
      answer: 1,
      why: ["편리한 기술 뒤의 비용을 외면하면 문제를 다른 곳으로 떠넘기는 것입니다.", "기술의 이익과 부담이 누구에게 돌아가는지 살피는 것이 과학 기술 윤리입니다.", "문제를 해결하기보다 기술의 이익까지 버리는 극단적인 선택입니다."],
      onDone: function () { got.q = true; window.sthState("evGot", got); mission(); }
    });
    update(); mission();
  })();

  function finish() { window.sthState("r3", "해결 · " + (window.sthState("phBest") || "") + " / " + (window.sthState("evBest") || "")); }
  function vs() {
    var p = window.sthState("p3") || "";
    $("e3-vs").innerHTML = "<b>나의 첫 판단</b> " + (p || "기록 없음") + (p.indexOf("㉡") === 0 ? " — 정확했습니다." : " — 계산이 보여 주듯, 여러 번 해서 골라내면 가짜 성공이 쉽게 나옵니다.") + "<br><b>전기차</b> " + (window.sthState("evBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk3", unitLabel: "[융합과학 탐구 Ⅲ] 이야기 ③ 스무 번 해 보면 한 번은 된다",
    items: [
      { id: "w2", label: "기술이 만드는 새 문제", hint: "그 기술이 문제를 풀면서 새로 만들 수 있는 윤리적 쟁점을 하나 쓰세요." },
      { id: "e3b", label: "지훈이에게 보내는 편지", hint: "잘 나온 결과만 보고하면 안 되는 까닭을 확률 계산과 연구 진실성의 기둥을 근거로 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ④ 반딧불이를 세는 사람들
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep4", key: "ep4", name: "사건 파일 ④", onDone: finish });

  window.sthGate({
    gate: "g4", key: "p4", title: "운영자의 첫 대답",
    question: "과학 지식이 없는 주민의 데이터가 연구에 도움이 될까요?",
    options: ["㉠ 전문가가 아니니 도움이 안 된다", "㉡ 규칙에 따라 모은 많은 시민의 데이터는 연구자 혼자 모을 수 없는 넓이와 양을 채워 준다", "㉢ 시민이 모으면 연구자는 필요 없다"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 지도 채우기 */
  (function () {
    var canvas = $("c-cov"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, n = 50;
    function cov(k) { return 1 - Math.pow(0.99, k); }
    var s = 5, ORDER = []; for (var i = 0; i < 500; i++) { s = (s * 9301 + 49297) % 233280; ORDER.push(Math.floor(s / 233280 * 100)); }
    var st = { on: !REDUCE }, tw = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var seen = {}, LW = 330, x0 = 40, y0 = 42, c = 23, cnt = 0;
      for (var i2 = 0; i2 < n; i2++) seen[ORDER[i2]] = (seen[ORDER[i2]] || 0) + 1;
      K.stage(ctx, 0, 0, LW, H, "night", { seed: 171, title: "군 지도 100칸 · 반딧불이 조사 (예시)" });
      /* 땅(숲·논)과 강 */
      var mg = ctx.createLinearGradient(x0, y0, x0 + 10 * c, y0 + 10 * c); mg.addColorStop(0, "#163a2a"); mg.addColorStop(.6, "#1f4a32"); mg.addColorStop(1, "#2c4a24");
      ctx.fillStyle = mg; ctx.beginPath(); ctx.roundRect(x0 - 4, y0 - 4, 10 * c + 6, 10 * c + 6, 8); ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.roundRect(x0 - 4, y0 - 4, 10 * c + 6, 10 * c + 6, 8); ctx.clip();
      ctx.strokeStyle = "rgba(90,170,255,.55)"; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x0 - 10, y0 + 40); ctx.bezierCurveTo(x0 + 80, y0 + 70, x0 + 120, y0 + 170, x0 + 10 * c + 10, y0 + 190); ctx.stroke();
      ctx.restore();
      var R = K.rng(3);
      for (var k = 0; k < 100; k++) {
        var gx = x0 + (k % 10) * c, gy = y0 + Math.floor(k / 10) * c;
        ctx.strokeStyle = "rgba(200,230,210,.12)"; ctx.lineWidth = 1; ctx.strokeRect(gx, gy, c - 1, c - 1);
        if (seen[k]) {
          cnt++;
          ctx.fillStyle = "rgba(255,211,107,.16)"; ctx.fillRect(gx + 1, gy + 1, c - 3, c - 3);
          var fx = gx + 5 + R() * (c - 10), fy = gy + 5 + R() * (c - 10), a = .55 + .45 * Math.sin(tw * 3 + k * 1.7);
          K.glow(ctx, fx, fy, 1.8, "rgba(210,255,120," + a.toFixed(2) + ")", 3.4);
        }
      }
      K.pill(ctx, "조사된 칸 " + cnt + " / 100", LW / 2, H - 12, { s: 11.5, a: "center", c: KC.yellow, box: [0, LW] });

      /* ── 오른쪽: 기대 채움률 ── */
      var RX = LW + 8, p = cov(n), ok = p >= 0.9;
      K.stage(ctx, RX, 0, W - RX, H, "lab", { seed: 173, title: "참여자 수에 따른 기대 채움률" });
      var g = K.chart(ctx, { x: RX + 4, y: 40, w: W - RX - 14, h: H - 44, x0: 0, x1: 500, y0: 0, y1: 1, xt: 5, yt: 4, xf: function (x) { return x + "명"; }, yf: function (y) { return Math.round(y * 100) + "%"; } });
      K.line(ctx, { x: g.L, y: g.Y(0.9) }, { x: g.R, y: g.Y(0.9) }, KC.red, 1.5, [5, 4]);
      K.pill(ctx, "목표 90%", g.R - 6, g.Y(0.9) + 22, { s: 11, a: "right", c: KC.red });
      var pts = []; for (var k3 = 0; k3 <= 500; k3 += 5) pts.push([k3, cov(k3)]);
      K.plot(ctx, g, pts, KC.blue);
      K.line(ctx, { x: g.X(n), y: g.B }, { x: g.X(n), y: g.Y(p) }, "rgba(255,179,92,.6)", 1.2, [3, 4]);
      K.glow(ctx, g.X(n), g.Y(p), 6, ok ? "rgba(63,211,163,.98)" : "rgba(255,179,92,.98)", 3);
      K.pill(ctx, n + "명 → " + (p * 100).toFixed(1) + "%", g.X(n) + (n > 330 ? -12 : 12), g.Y(p) + (p > 0.8 ? 24 : -12), { s: 12, a: n > 330 ? "right" : "left", c: ok ? KC.green : KC.orange, box: [RX, W] });
      K.pill(ctx, "= 1 − 0.99ⁿ", W - 14, 28, { s: 12, a: "right", c: KC.ink });
    }
    function update() {
      draw();
      $("cv-info").innerHTML = "한 칸이 아무에게도 조사되지 않을 확률은 0.99를 참여자 수만큼 곱한 값입니다. " + n + "명 → 기대 채움률 <b>" + (cov(n) * 100).toFixed(1) + "%</b>. 사람이 늘수록 이미 조사된 칸과 겹치는 일이 많아져 채움률이 천천히 오릅니다.";
      if (cov(n) >= 0.9 && n <= 260 && !ep.cleared(1)) {
        window.sthState("cvBest", n + "명 → 지도의 " + (cov(n) * 100).toFixed(0) + "% 기대");
        window.sthMission("m4-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("cvBest") + ". 칸이 100개인데 230명 넘게 필요한 까닭은 겹침 때문입니다. 칸을 나눠 맡기면 훨씬 적은 인원으로도 채울 수 있습니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("cv-n").addEventListener("input", function (e) { n = +e.target.value; $("cv-n-val").textContent = n + "명"; update(); });
    pauser("cv-play", st, ["반딧불이 멈추기", "반딧불이 보기"]);
    K.animate(canvas, function (dt) { if (st.on) { tw += dt / 1000; draw(); } });
    update();
    if (ep.cleared(1)) window.sthMission("m4-2", true);
  })();

  /* 장면 3 — 참여 방식 */
  window.sthSort({
    mount: "s4-sort",
    buckets: [{ id: "d", label: "데이터 수집에 참여", sub: "관찰·측정해 올린다" }, { id: "p", label: "문제 해결에 참여", sub: "아이디어·분석을 보탠다" }, { id: "r", label: "규칙·정책에 참여", sub: "제도를 함께 만든다" }],
    items: [
      { t: "반딧불이 목격 위치와 시각을 앱에 올린다", a: "d", why: "데이터 수집 참여입니다." },
      { t: "스마트폰 가속도 센서로 지진 진동을 감지해 보낸다", a: "d", why: "시민 과학 센서 네트워크입니다." },
      { t: "집 앞에 미세 먼지 센서를 달아 실시간 값을 공유한다", a: "d", why: "데이터 수집 참여입니다." },
      { t: "휠체어로 들어갈 수 있는 가게를 지도에 표시한다(배리어 프리 지도)", a: "p", why: "이동의 어려움이라는 사회 문제를 함께 풉니다.", hint: "데이터를 모으는 것에서 나아가 누구의 어떤 문제를 풀고 있나요?" },
      { t: "단백질 구조 맞추기 게임 ‘폴드잇’에서 새로운 구조를 찾아낸다", a: "p", why: "게임으로 과학 문제 해결에 기여합니다." },
      { t: "멸종 위기종 목격 자료를 보고 보호 구역 아이디어를 제안한다", a: "p", why: "분석과 제안으로 참여합니다." },
      { t: "인공지능 안전 법안 공청회에 참석해 의견을 낸다", a: "r", why: "규칙 만들기에 참여합니다." },
      { t: "반딧불이 서식지 보호 조례 제정을 군 의회에 청원한다", a: "r", why: "정책 참여입니다." }
    ],
    onDone: function () { window.sthMission("m4-3", true, "<span class='m-tag'>미션 완료</span>시민은 데이터, 아이디어, 목소리로 과학 기술의 사회 문제 해결에 참여합니다."); ep.clear(2); }
  });
  if (ep.cleared(2)) window.sthMission("m4-3", true);

  /* 장면 4 — 법안 만들기 (기존 조항 선택기) */
  (function () {
    var got = window.sthState("billGot") || { a: false, b: false };
    function mission() {
      if (got.a) done("m4-4a"); if (got.b) done("m4-4b");
      if (got.a && got.b) { window.sthMission("m4-4", true, "<span class='m-tag'>미션 완료</span>" + (window.sthState("billBest") || "") + ". 안전과 부담의 균형을 근거와 함께 제안하는 것이 시민의 정책 참여입니다."); ep.clear(3); ep.clear(4); }
    }
    var STEPS = ["① 생활 속 인공지능의 사고·쟁점 사례 조사", "② 필요한 안전 기준(데이터 출처, 설명 가능성, 책임 소재) 논의", "③ 논의한 기준을 조항 형태로 작성", "④ 발표·질의·보완 뒤 모의 표결"];
    if (got.a) filledOrder("s4-order", STEPS);
    else window.sthOrder({ mount: "s4-order", steps: STEPS, onDone: function () { got.a = true; window.sthState("billGot", got); mission(); } });
    var GROUPS = [
      { t: "① 출시 전 관리", items: [
        { ico: "🔐", name: "고위험 AI 사전 인증 의무화", safe: 9, burden: 7, detail: "채용·신용 평가·의료 진단에 쓰이는 AI는 출시 전 안전성 인증을 받습니다. 안전은 크게 높아지지만 출시가 늦어집니다." },
        { ico: "🌱", name: "스타트업 규제 샌드박스 제공", safe: 2, burden: 1, detail: "초기 기업에 일정 기간 규제를 유예합니다. 혁신에 유리하지만 안전 점검은 느슨해집니다." } ] },
      { t: "② 투명성", items: [
        { ico: "💬", name: "AI 판단 설명 요구권 보장", safe: 6, burden: 3, detail: "이용자가 AI 판단의 근거를 설명해 달라고 요구할 수 있습니다. 신뢰를 높이지만 추가 비용이 듭니다." },
        { ico: "📂", name: "학습 데이터 출처 공개 의무", safe: 5, burden: 4, detail: "학습 데이터의 출처와 수집 방식을 공개합니다. 편향을 점검할 수 있지만 영업 비밀 부담이 커집니다." } ] },
      { t: "③ 사고 뒤 책임", items: [
        { ico: "⚖️", name: "사고 발생 시 책임 소재 명확화", safe: 7, burden: 5, detail: "AI 사고 때 개발자·운영자·이용자 가운데 누가 책임지는지 미리 정합니다. 피해 구제가 빨라집니다." },
        { ico: "🔍", name: "정기 편향성 감사 의무화", safe: 8, burden: 6, detail: "특정 집단에 불리한 편향이 없는지 정기적으로 감사받습니다. 공정성은 높아지지만 비용이 듭니다." } ] }
    ];
    var grid = $("c4-bill-grid"), sel = window.sthState("billSel") || {}, MAXSUM = 30;
    if (typeof sel !== "object" || sel === null) sel = {};
    function render() {
      var safe = 0, burden = 0, cnt = 0, names = [];
      GROUPS.forEach(function (g, gi) { var k = sel["g" + gi]; if (k === 0 || k === 1) { var p = g.items[k]; safe += p.safe; burden += p.burden; cnt++; names.push(p.name); } });
      $("c4-safe-val").textContent = safe; $("c4-burden-val").textContent = burden;
      $("c4-safe-bar").style.width = Math.min(100, safe / MAXSUM * 100) + "%";
      $("c4-burden-bar").style.width = Math.min(100, burden / MAXSUM * 100) + "%";
      var ok = cnt === 3 && safe >= 20 && burden <= 15;
      $("c4-bill-result").innerHTML = cnt === 0 ? "분야마다 조항을 하나씩 골라 보세요. 안전 보호와 규제 부담은 대체로 함께 커집니다." : cnt < 3 ? "<b>조항 " + cnt + "개</b> · 안전 " + safe + " · 부담 " + burden + ". 남은 분야에서도 하나씩 고르세요." : "<b>조항 3개</b> · 안전 " + safe + " · 부담 " + burden + ". " + (ok ? "✅ 안전을 지키면서 부담을 알맞게 묶은 법안입니다." : (safe < 20 ? "안전장치가 아직 부족합니다. 효과가 큰 조항으로 바꿔 보세요." : "산업계가 감당하기 어려운 부담입니다. 비슷한 효과를 내는 가벼운 조항으로 바꿔 보세요."));
      if (ok && !got.b) { got.b = true; window.sthState("billBest", "법안: " + names.join(", ") + " (안전 " + safe + ", 부담 " + burden + ")"); window.sthState("billGot", got); mission(); }
    }
    GROUPS.forEach(function (g, gi) {
      var lab = document.createElement("div"); lab.className = "ctrl-label"; lab.textContent = g.t; grid.appendChild(lab);
      var row = document.createElement("div"); row.className = "card-grid"; row.setAttribute("data-group", "bill" + gi); grid.appendChild(row);
      var btns = g.items.map(function (p, k) {
        var b = document.createElement("button"); b.type = "button"; b.className = "pick-card" + (sel["g" + gi] === k ? " on" : "");
        b.innerHTML = "<div class='pc-ico'>" + p.ico + "</div><div class='pc-name'>" + p.name + "</div><div class='pc-sub'>안전 +" + p.safe + " · 부담 +" + p.burden + "<br>" + p.detail + "</div>";
        b.addEventListener("click", function () { sel["g" + gi] = k; btns.forEach(function (x, j) { x.classList.toggle("on", j === k); }); window.sthState("billSel", sel); render(); });
        row.appendChild(b); return b;
      });
    });
    render(); mission();
  })();

  function finish() { window.sthState("r4", "해결 · " + (window.sthState("cvBest") || "") + " / " + (window.sthState("billBest") || "")); }
  function vs() {
    var p = window.sthState("p4") || "";
    $("e4-vs").innerHTML = "<b>나의 첫 대답</b> " + (p || "기록 없음") + "<br><b>시민 과학</b> " + (window.sthState("cvBest") || "-") + "<br><b>우리 모둠 법안</b> " + (window.sthState("billBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk4", unitLabel: "[융합과학 탐구 Ⅲ] 이야기 ④ 반딧불이를 세는 사람들",
    items: [
      { id: "e4a", label: "우리 지역 시민 과학 제안", hint: "우리 지역의 사회 문제 하나를 골라, 시민이 어떤 데이터를 모으거나 어떤 방식으로 참여하면 해결에 도움이 될지 제안하세요." },
      { id: "e4b", label: "우리 모둠 법안의 근거", hint: "고른 조항과 안전·부담의 균형을 그렇게 정한 까닭을 쓰세요." }
    ]
  });
})();

/* ========================================================================= 07 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[융합과학 탐구 Ⅲ] 융합과학 탐구의 전망 — 정리",
  recap: [
    { key: "r1", label: "① 2035년의 등굣길" },
    { key: "r2", label: "② 사막의 딸기, 물만 내뿜는 차" },
    { key: "r3", label: "③ 스무 번 해 보면 한 번은 된다" },
    { key: "r4", label: "④ 반딧불이를 세는 사람들" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  items: [
    { id: "all", label: "네 사건을 꿰는 한 문장", hint: "미래 기술, 난제, 윤리, 시민 참여. 네 이야기를 ‘융합과학기술’과 ‘책임’이라는 말을 넣어 한 문장으로 이어 보세요." },
    { id: "w3", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 08 우리 반 */
window.sthShare({
  mount: "share", unit: "cvg-3", unitLabel: "[융합과학 탐구 Ⅲ] 융합과학 탐구의 전망",
  rows: [
    { key: "r1", label: "① 2035년의 등굣길" },
    { key: "r2", label: "② 사막의 딸기, 물만 내뿜는 차" },
    { key: "r3", label: "③ 스무 번 해 보면 한 번은 된다" },
    { key: "r4", label: "④ 반딧불이를 세는 사람들" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "네 사건을 꿰는 한 문장" }
});

})();
