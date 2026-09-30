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
      { t: "충돌 회피·자율 비행과 전지·모터 기술이 합쳐져 있다", a: "uam", why: "UAM 에 필요한 기술들입니다.", hint: "하늘을 나는 교통수단의 기술입니다." },
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
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 600, y0 = 30, y1 = 260;
      function X(y) { return x0 + (y - 2025) / 20 * (x1 - x0); }
      function Y(e) { return y1 - (e - 200) / 500 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [2025, 2030, 2035, 2040, 2045].forEach(function (y) { text(ctx, y + "", X(y), y1 + 16, { s: 10.5, a: "center", c: v("--mist") }); });
      [200, 300, 400, 500, 600].forEach(function (e) { text(ctx, e + "", x0 - 6, Y(e) + 4, { s: 10, a: "right", c: v("--mist") }); });
      ctx.strokeStyle = v("--rose"); ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(x0, Y(400)); ctx.lineTo(x1, Y(400)); ctx.stroke(); ctx.setLineDash([]);
      text(ctx, "하늘 택시 기준 400 Wh/kg", x1, Y(400) - 6, { s: 11, w: "800", a: "right", c: v("--rose-700") });
      ctx.save(); ctx.beginPath(); ctx.rect(x0, y0 - 8, x1 - x0 + 4, y1 - y0 + 8); ctx.clip();
      ctx.strokeStyle = v("--brand"); ctx.lineWidth = 3; ctx.beginPath();
      for (var y = 2025; y <= 2045; y += 0.25) { if (y === 2025) ctx.moveTo(X(y), Y(E(y, g))); else ctx.lineTo(X(y), Y(E(y, g))); } ctx.stroke(); ctx.restore();
      ctx.fillStyle = v("--coral"); ctx.beginPath(); ctx.arc(X(yr), Y(Math.min(E(yr, g), 700)), 7, 0, Math.PI * 2); ctx.fill();
      text(ctx, "배터리 에너지 밀도 (Wh/kg) — 연 " + g + "% 추세", x0 + 6, 22, { s: 12, w: "800" });
      text(ctx, yr + "년", 640, 80, { s: 16, w: "900" });
      text(ctx, E(yr, g).toFixed(0) + " Wh/kg", 640, 116, { s: 22, w: "900", c: E(yr, g) >= 400 ? v("--green-700") : v("--ink") });
      text(ctx, E(yr, g) >= 400 ? "기준 도달" : "아직 부족", 640, 146, { s: 13, w: "800", c: E(yr, g) >= 400 ? v("--green-700") : v("--mist") });
    }
    function update() {
      draw();
      var f = first(g), ch = false;
      $("bt-info").innerHTML = "연 " + g + "% 씩 좋아지면 " + yr + "년에 약 <b>" + E(yr, g).toFixed(0) + " Wh/kg</b>. 복리처럼 불어나므로 몇 %p 차이가 여러 해의 차이를 만듭니다.";
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
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 560, y0 = 30, y1 = 240, css = R / CL[pt];
      function X(t) { return x0 + t / 24 * (x1 - x0); }
      function Y(c) { return y1 - Math.min(c, 40) / 40 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      ctx.fillStyle = v("--green"); ctx.globalAlpha = .15; ctx.fillRect(x0, Y(20), x1 - x0, Y(10) - Y(20)); ctx.globalAlpha = 1;
      text(ctx, "알맞은 농도 10 ~ 20 mg/L", x1, Y(20) - 6, { s: 11, w: "800", a: "right", c: v("--green-700") });
      [0, 10, 20, 30, 40].forEach(function (c) { text(ctx, c + "", x0 - 6, Y(c) + 4, { s: 10, a: "right", c: v("--mist") }); });
      [0, 6, 12, 18, 24].forEach(function (t) { text(ctx, t + "시간", X(t), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      ctx.strokeStyle = v("--coral"); ctx.lineWidth = 3; ctx.beginPath();
      for (var t = 0; t <= 24; t += 0.2) { var c = css * (1 - Math.exp(-CL[pt] / 20 * t)); if (t === 0) ctx.moveTo(X(t), Y(c)); else ctx.lineTo(X(t), Y(c)); } ctx.stroke();
      text(ctx, "환자 " + pt + " 의 디지털 쌍둥이 — 핏속 약 농도", x0 + 6, 22, { s: 12, w: "800" });
      var ok = css >= 10 && css <= 20;
      text(ctx, "안정 농도", 610, 80, { s: 12, c: v("--mist") });
      text(ctx, css.toFixed(1) + " mg/L", 610, 112, { s: 22, w: "900", c: ok ? v("--green-700") : v("--rose-700") });
      text(ctx, "= 투여 속도 ÷ 청소율", 610, 140, { s: 11.5, c: v("--mist") });
      return ok;
    }
    function update() {
      var ok = draw();
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
    segWire("tw-p", function (x) { pt = x; update(); });
    $("tw-r").addEventListener("input", function (e) { R = +e.target.value; $("tw-r-val").textContent = R + " mg"; update(); });
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
    function draw() {
      paper(ctx, W, H);
      var r = sim(th), x0 = 60, x1 = 600, y0 = 30, y1 = 260;
      function X(d) { return x0 + d / 30 * (x1 - x0); }
      function Y(m) { return y1 - (m - 10) / 45 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      ctx.fillStyle = v("--green"); ctx.globalAlpha = .15; ctx.fillRect(x0, Y(45), x1 - x0, Y(30) - Y(45)); ctx.globalAlpha = 1;
      [10, 20, 30, 40, 50].forEach(function (m) { text(ctx, m + "%", x0 - 6, Y(m) + 4, { s: 10, a: "right", c: v("--mist") }); });
      [0, 10, 20, 30].forEach(function (d) { text(ctx, d + "일", X(d), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      ctx.strokeStyle = v("--amber"); ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(x0, Y(th)); ctx.lineTo(x1, Y(th)); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = v("--brand"); ctx.lineWidth = 2.5; ctx.beginPath();
      r.arr.forEach(function (m, d) { if (d) { ctx.lineTo(X(d), Y(m + 3.5 * 0)); } else ctx.moveTo(X(d), Y(m)); }); ctx.stroke();
      text(ctx, "흙 수분 (%) — 초록 띠: 딸기가 잘 자라는 30 ~ 45%", x0 + 6, 22, { s: 12, w: "800" });
      var ok = r.mn >= 30 && r.mx <= 45;
      text(ctx, "물 준 횟수 " + r.w + "번", 640, 80, { s: 14, w: "900" });
      text(ctx, "가장 낮을 때 " + r.mn.toFixed(1) + "%", 640, 116, { s: 13, w: "800", c: r.mn >= 30 ? v("--green-700") : v("--rose-700") });
      text(ctx, "가장 높을 때 " + r.mx.toFixed(1) + "%", 640, 144, { s: 13, w: "800", c: r.mx <= 45 ? v("--green-700") : v("--rose-700") });
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
    update();
    if (ep.cleared(1)) window.sthMission("m2-2", true);
  })();

  /* 장면 3 — 수소차 */
  (function () {
    var canvas = $("c-h2"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, k = 2, NEED = 440;
    function draw() {
      paper(ctx, W, H);
      var range = k * 100, x0 = 60, x1 = 560, y = 120;
      function X(km) { return x0 + km / 800 * (x1 - x0); }
      ctx.strokeStyle = v("--line"); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
      ctx.strokeStyle = range >= NEED ? v("--green") : v("--coral"); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(X(Math.min(range, 800)), y); ctx.stroke();
      text(ctx, "서울", x0, y - 16, { s: 12, w: "800", a: "center" });
      text(ctx, "부산 400 km", X(400), y - 16, { s: 12, w: "800", a: "center" });
      ctx.fillStyle = v("--ink"); ctx.beginPath(); ctx.arc(X(400), y, 5, 0, Math.PI * 2); ctx.fill();
      text(ctx, "여유 포함 440 km", X(440), y + 30, { s: 10.5, a: "center", c: v("--mist") });
      text(ctx, "갈 수 있는 거리 " + range.toFixed(0) + " km", x0, 220, { s: 16, w: "900", c: range >= NEED ? v("--green-700") : v("--rose-700") });
      var rx = 610;
      text(ctx, "수소 " + k.toFixed(1) + " kg", rx, 70, { s: 16, w: "900" });
      text(ctx, "나오는 물 약 " + (k * 9).toFixed(1) + " kg", rx, 110, { s: 14, w: "800", c: v("--brand-700") });
      text(ctx, "(수소 4 g → 물 36 g, 9배)", rx, 134, { s: 11, c: v("--mist") });
      text(ctx, "배기가스 이산화 탄소 0 g", rx, 170, { s: 12.5, w: "800", c: v("--green-700") });
    }
    function update() {
      draw();
      $("h2-info").innerHTML = "2H₂ + O₂ → 2H₂O. 수소 분자 2개(4 g)가 물 분자 2개(36 g)가 되므로, 수소 1 kg 을 쓰면 물이 약 9 kg 나옵니다. 수소 " + k.toFixed(1) + " kg → " + (k * 100).toFixed(0) + " km.";
      if (k * 100 >= NEED - 1e-9 && k <= 4.7 + 1e-9 && !ep.cleared(2)) {
        window.sthState("h2Best", "수소 " + k.toFixed(1) + " kg → " + (k * 100).toFixed(0) + " km, 물 약 " + (k * 9).toFixed(0) + " kg");
        window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("h2Best") + ". 달리는 동안 이산화 탄소 대신 물이 나옵니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("h2-k").addEventListener("input", function (e) { k = Math.round(+e.target.value * 10) / 10; $("h2-k-val").textContent = k.toFixed(1) + " kg"; update(); });
    update();
    if (ep.cleared(2)) window.sthMission("m2-3", true);
  })();

  /* 장면 4 — 난제와 기술 */
  window.sthSort({
    mount: "s2-sort",
    buckets: [{ id: "cl", label: "🌡️ 기후 변화" }, { id: "fd", label: "🌾 물·식량 부족" }, { id: "rs", label: "⛏️ 자원 고갈" }, { id: "sh", label: "🕳️ 도시 싱크홀" }],
    items: [
      { t: "재생 에너지로 만든 그린 수소로 달리는 연료 전지차", a: "cl", why: "달리며 온실 기체를 내지 않습니다." },
      { t: "공장 굴뚝의 이산화 탄소를 포집해 저장하는 기술", a: "cl", why: "배출을 줄이는 기술입니다." },
      { t: "센서와 인공지능이 물과 양분을 조절하는 스마트팜", a: "fd", why: "적은 물로 작물을 키웁니다." },
      { t: "바닷물의 소금을 걸러 먹는 물을 만드는 해수 담수화", a: "fd", why: "물 부족을 해결합니다." },
      { t: "폐배터리에서 리튬·니켈을 다시 뽑아내는 재활용 기술", a: "rs", why: "한정된 광물을 다시 씁니다." },
      { t: "태양광·풍력처럼 고갈되지 않는 에너지로 전환", a: "rs", why: "화석 연료 고갈에 대비합니다.", hint: "‘다 써 버리면 없는’ 자원을 대신합니다." },
      { t: "땅속 레이더로 지하의 빈 공간을 미리 찾아내는 탐사", a: "sh", why: "싱크홀을 예방합니다." },
      { t: "지하수 수위 센서로 과도한 지하수 사용을 감시", a: "sh", why: "지하수 남용이 싱크홀의 원인입니다." }
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
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 600, y0 = 30, y1 = 240;
      function X(k) { return x0 + (k - 1) / 39 * (x1 - x0); }
      function Y(p) { return y1 - p * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [0, 0.5, 1].forEach(function (p) { text(ctx, (p * 100) + "%", x0 - 6, Y(p) + 4, { s: 10, a: "right", c: v("--mist") }); });
      [1, 10, 20, 30, 40].forEach(function (k) { text(ctx, k + "번", X(k), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      ctx.strokeStyle = v("--rose"); ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(x0, Y(0.5)); ctx.lineTo(x1, Y(0.5)); ctx.stroke(); ctx.setLineDash([]);
      for (var k = 1; k <= 40; k++) { ctx.fillStyle = k <= n ? v("--coral") : v("--line"); var bh = P(k) * (y1 - y0); ctx.fillRect(X(k) - 5, y1 - bh, 10, bh); }
      text(ctx, "효과가 없어도 ‘성공’이 한 번 이상 나올 확률", x0 + 6, 22, { s: 12, w: "800" });
      text(ctx, n + "번 실험", 640, 80, { s: 16, w: "900" });
      text(ctx, (P(n) * 100).toFixed(1) + "%", 640, 120, { s: 26, w: "900", c: P(n) >= 0.5 ? v("--rose-700") : v("--ink") });
      text(ctx, "= 1 − 0.95ⁿ", 640, 150, { s: 12, c: v("--mist") });
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
      paper(ctx, W, H);
      var x0 = 60, x1 = 600, y0 = 30, y1 = 250, KM = 150000;
      function X(km) { return x0 + km / KM * (x1 - x0); }
      function Y(t) { return y1 - t / 30 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [0, 10, 20, 30].forEach(function (t) { text(ctx, t + " t", x0 - 6, Y(t) + 4, { s: 10, a: "right", c: v("--mist") }); });
      [0, 50000, 100000, 150000].forEach(function (km) { text(ctx, (km / 10000) + "만 km", X(km), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      ctx.strokeStyle = v("--mist"); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(KM), Y(0.170 * KM / 1000)); ctx.stroke();
      ctx.strokeStyle = v("--teal"); ctx.beginPath(); ctx.moveTo(X(0), Y(6)); ctx.lineTo(X(KM), Y(6 + perKm(r) * KM / 1000)); ctx.stroke();
      text(ctx, "휘발유차", X(KM) - 4, Y(0.170 * KM / 1000) + 16, { s: 11, w: "800", a: "right", c: v("--mist") });
      text(ctx, "전기차", X(KM) - 4, Y(6 + perKm(r) * KM / 1000) - 8, { s: 11, w: "800", a: "right", c: v("--teal-700") });
      var b = be(r);
      if (b < KM) { ctx.strokeStyle = v("--amber"); ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(X(b), y0); ctx.lineTo(X(b), y1); ctx.stroke(); ctx.setLineDash([]); }
      text(ctx, "만들고 달리는 동안의 누적 이산화 탄소", x0 + 6, 22, { s: 12, w: "800" });
      text(ctx, "이득이 되는 거리", 640, 80, { s: 12, c: v("--mist") });
      text(ctx, (b / 10000).toFixed(1) + "만 km", 640, 112, { s: 22, w: "900", c: b <= 50000 ? v("--green-700") : v("--ink") });
      return b;
    }
    function update() {
      var b = draw();
      $("ev-info").innerHTML = "재생 에너지 " + r + "% → 전기차는 1 km 에 약 " + (perKm(r) * 1000).toFixed(0) + " g (휘발유차 170 g). 배터리를 만들 때 더 나온 6 t 을 갚는 데 약 <b>" + (b / 10000).toFixed(1) + "만 km</b>.";
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
    function draw() {
      paper(ctx, W, H);
      var seen = {}, x0 = 40, y0 = 30, c = 24;
      for (var i2 = 0; i2 < n; i2++) seen[ORDER[i2]] = (seen[ORDER[i2]] || 0) + 1;
      for (var k = 0; k < 100; k++) { var gx = x0 + (k % 10) * c, gy = y0 + Math.floor(k / 10) * c; ctx.fillStyle = seen[k] ? v("--amber") : v("--card-2"); ctx.fillRect(gx, gy, c - 3, c - 3); }
      text(ctx, "군 지도 100칸 (노란 칸: 조사됨, 예시)", x0, y0 + 10 * c + 18, { s: 11, c: v("--mist") });
      var gx0 = 330, gx1 = 600, gy0 = 30, gy1 = 250;
      function X(k2) { return gx0 + k2 / 500 * (gx1 - gx0); }
      function Y(p) { return gy1 - p * (gy1 - gy0); }
      axes(ctx, gx0, gy0, gx1, gy1);
      ctx.strokeStyle = v("--brand"); ctx.lineWidth = 2.5; ctx.beginPath();
      for (var k3 = 0; k3 <= 500; k3 += 5) { if (k3 === 0) ctx.moveTo(X(k3), Y(cov(k3))); else ctx.lineTo(X(k3), Y(cov(k3))); } ctx.stroke();
      ctx.strokeStyle = v("--rose"); ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(gx0, Y(0.9)); ctx.lineTo(gx1, Y(0.9)); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = v("--coral"); ctx.beginPath(); ctx.arc(X(n), Y(cov(n)), 6, 0, Math.PI * 2); ctx.fill();
      [0, 250, 500].forEach(function (k4) { text(ctx, k4 + "명", X(k4), gy1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      text(ctx, "기대 채움률", gx0, 20, { s: 11.5, w: "800" });
      text(ctx, n + "명", 640, 80, { s: 16, w: "900" });
      text(ctx, (cov(n) * 100).toFixed(1) + "%", 640, 116, { s: 24, w: "900", c: cov(n) >= 0.9 ? v("--green-700") : v("--ink") });
      text(ctx, "= 1 − 0.99ⁿ", 640, 144, { s: 12, c: v("--mist") });
    }
    function update() {
      draw();
      $("cv-info").innerHTML = "한 칸이 아무에게도 조사되지 않을 확률은 0.99 를 참여자 수만큼 곱한 값입니다. " + n + "명 → 기대 채움률 <b>" + (cov(n) * 100).toFixed(1) + "%</b>. 사람이 늘수록 이미 조사된 칸과 겹치는 일이 많아져 채움률이 천천히 오릅니다.";
      if (cov(n) >= 0.9 && n <= 260 && !ep.cleared(1)) {
        window.sthState("cvBest", n + "명 → 지도의 " + (cov(n) * 100).toFixed(0) + "% 기대");
        window.sthMission("m4-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("cvBest") + ". 칸이 100개인데 230명 넘게 필요한 까닭은 겹침 때문입니다. 칸을 나눠 맡기면 훨씬 적은 인원으로도 채울 수 있습니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("cv-n").addEventListener("input", function (e) { n = +e.target.value; $("cv-n-val").textContent = n + "명"; update(); });
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
        { ico: "🔐", name: "고위험 AI 사전 인증 의무화", safe: 9, burden: 7, detail: "채용·신용 평가·의료 진단에 쓰이는 AI 는 출시 전 안전성 인증을 받습니다. 안전은 크게 높아지지만 출시가 늦어집니다." },
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
    { key: "rLab", label: "응용 실험실" }
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
    { key: "rLab", label: "응용 실험실" }
  ],
  line: { id: "all", label: "네 사건을 꿰는 한 문장" }
});

})();
