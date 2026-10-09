/* 융합과학 탐구 Ⅱ 융합과학 탐구의 과정 — 소단원별 이야기 네 편
   01 필로티 2층은 왜 추울까 / 02 커피 필터 낙하 실험 / 03 학교 자기장 지도 / 04 선크림 보고서
   공용 부품: ../assets/theme.js (sthUnit·sthGate·sthWork), ../assets/story.js (sthStory·sthSort·sthOrder·sthPick) */
(function () {
"use strict";

window.sthUnit("cvg-2");

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
function segWire(id, attr, onPick) {
  var btns = Array.prototype.slice.call($(id).querySelectorAll("button"));
  btns.forEach(function (b) {
    b.type = "button";
    b.addEventListener("click", function () { btns.forEach(function (x) { x.classList.toggle("on", x === b); }); onPick(b.getAttribute(attr)); });
  });
}
function filledOrder(mount, steps) { $(mount).innerHTML = "<div class='order sort'><div class='slots'>" + steps.map(function (s) { return "<div class='slot filled'>" + s + "</div>"; }).join("") + "</div></div>"; }
function seeded(seed) { var s = seed; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
function gauss(r) { var u1 = Math.max(1e-6, r()), u2 = r(); return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2); }

/* =========================================================================
   이야기 ① 필로티 2층은 왜 추울까
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep1", key: "ep1", name: "사건 파일 ①", onDone: finish });

  window.sthGate({
    gate: "g1", key: "p1", title: "첫 짐작",
    question: "필로티 2층이 유난히 추운 까닭으로 가장 그럴듯한 것은?",
    options: ["㉠ 2층 주민이 난방을 덜 해서", "㉡ 바닥 아래가 비어 있어 찬 바깥 공기에 바닥이 그대로 닿아서", "㉢ 기분 탓이다"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 이상값 걸러 내기 */
  (function () {
    var canvas = $("c-cl"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, X = 3;
    var IN = [], OUT = [], h;
    for (h = 0; h < 24; h++) { IN.push(Math.round((16 + 3.5 * Math.cos(2 * Math.PI * (h - 15) / 24)) * 10) / 10); OUT.push(Math.round((-2 + 4 * Math.cos(2 * Math.PI * (h - 14) / 24)) * 10) / 10); }
    IN[7] = -40.0; IN[15] = 85.0;
    var BAD = [7, 15], med = IN.slice().sort(function (a, b) { return a - b; })[12];
    function kept() { return IN.map(function (t) { return Math.abs(t - med) <= X; }); }
    function draw() {
      paper(ctx, W, H);
      var k = kept(), x0 = 60, x1 = 600, y0 = 30, y1 = 290;
      function Xp(i) { return x0 + i / 23 * (x1 - x0); }
      function Y(t) { return y1 - (Math.max(-45, Math.min(90, t)) + 45) / 135 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [-40, 0, 40, 80].forEach(function (t) { text(ctx, t + " ℃", x0 - 6, Y(t) + 4, { s: 10, a: "right", c: v("--mist") }); });
      [0, 6, 12, 18, 23].forEach(function (i) { text(ctx, i + "시", Xp(i), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      ctx.fillStyle = v("--amber"); ctx.globalAlpha = .15; ctx.fillRect(x0, Y(med + X), x1 - x0, Y(med - X) - Y(med + X)); ctx.globalAlpha = 1;
      ctx.strokeStyle = v("--brand"); ctx.lineWidth = 2; ctx.beginPath();
      OUT.forEach(function (t, i) { if (i) ctx.lineTo(Xp(i), Y(t)); else ctx.moveTo(Xp(i), Y(t)); }); ctx.stroke();
      IN.forEach(function (t, i) { ctx.fillStyle = k[i] ? v("--coral") : v("--mist"); ctx.beginPath(); ctx.arc(Xp(i), Y(t), k[i] ? 5 : 4, 0, Math.PI * 2); ctx.fill(); if (!k[i]) { ctx.strokeStyle = v("--rose"); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(Xp(i) - 6, Y(t) - 6); ctx.lineTo(Xp(i) + 6, Y(t) + 6); ctx.stroke(); } });
      text(ctx, "● 실내 기록계  — 기상청 바깥 기온  ▒ 남기는 범위", x0 + 6, 20, { s: 11.5, w: "800" });
      var keptIn = IN.filter(function (t, i) { return k[i]; }), mi = keptIn.reduce(function (a, b) { return a + b; }, 0) / Math.max(1, keptIn.length), mo = OUT.reduce(function (a, b) { return a + b; }, 0) / 24;
      var rx = 640;
      text(ctx, "지운 값 " + (24 - keptIn.length) + "개", rx, 60, { s: 14, w: "900" });
      text(ctx, "실내 평균 " + mi.toFixed(1) + " ℃", rx, 110, { s: 13, w: "800", c: v("--coral-700") });
      text(ctx, "바깥 평균 " + mo.toFixed(1) + " ℃", rx, 140, { s: 13, w: "800", c: v("--brand-700") });
      text(ctx, "차이 " + (mi - mo).toFixed(1) + " ℃", rx, 180, { s: 18, w: "900" });
      return { k: k, mi: mi, mo: mo };
    }
    function update() {
      var r = draw(), badGone = BAD.every(function (i) { return !r.k[i]; }), realKept = r.k.filter(function (x, i) { return BAD.indexOf(i) < 0 && x; }).length;
      $("cl-info").innerHTML = "중앙값 " + med + " ℃에서 ±" + X + " ℃ 안의 값만 남깁니다. 오작동 값 " + (badGone ? "모두 제거" : "남음") + " · 진짜 값 " + realKept + "/22 개 남음. 평균은 튀는 값 하나에도 크게 흔들리지만, 중앙값은 잘 흔들리지 않아 기준으로 쓰기 좋습니다.";
      if (badGone && realKept === 22 && !ep.cleared(1)) {
        window.sthState("clBest", "±" + X + " ℃ 기준 → 실내 평균 " + r.mi.toFixed(1) + " ℃, 바깥보다 " + (r.mi - r.mo).toFixed(1) + " ℃ 높음");
        window.sthMission("m1-2", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("clBest") + ". 가공한 데이터로 ‘바깥이 추운 밤에 실내 온도가 얼마나 따라 내려가나’를 물을 수 있게 되었습니다.");
        ep.clear(1);
      }
    }
    canvas._redraw = draw;
    $("cl-x").addEventListener("input", function (e) { X = +e.target.value; $("cl-x-val").textContent = X + " ℃"; update(); });
    update();
    if (ep.cleared(1)) window.sthMission("m1-2", true);
  })();

  /* 장면 3 — 가설 가르기 */
  window.sthSort({
    mount: "s1-sort",
    buckets: [{ id: "h", label: "검증할 수 있는 가설", sub: "변인 사이의 관계를 실험·측정으로 확인 가능" }, { id: "x", label: "가설로 쓰기 어려운 문장", sub: "막연하거나, 가치 판단이거나, 확인할 수 없음" }],
    items: [
      { t: "바닥 아래가 비어 있는 방은 막힌 방보다 밤사이 온도가 더 많이 내려간다", a: "h", why: "조작 변인(바닥 아래 공간)과 종속 변인(온도 변화)이 분명합니다." },
      { t: "바깥 기온이 낮을수록 필로티 2층의 바닥 온도가 더 낮아진다", a: "h", why: "측정으로 확인할 수 있는 관계입니다." },
      { t: "바닥에 단열재를 깔면 필로티 2층의 밤사이 온도 하강이 줄어든다", a: "h", why: "단열재 유무를 바꿔 검증할 수 있습니다." },
      { t: "필로티 1층을 유리벽으로 막으면 2층 바닥 온도가 올라간다", a: "h", why: "바꾸는 것과 재는 것이 드러납니다." },
      { t: "필로티 건물은 나쁜 건물이다", a: "x", why: "가치 판단이라 실험으로 검증할 수 없습니다." },
      { t: "2층은 왠지 춥다", a: "x", why: "무엇이 무엇에 영향을 주는지 드러나지 않습니다." },
      { t: "필로티 2층에 사는 사람은 추위를 잘 탄다", a: "x", why: "사람의 느낌에 기대어 있고, 건물 구조와의 관계를 검증하기 어렵습니다.", hint: "무엇을 바꾸고 무엇을 잴 수 있나요?" },
      { t: "건물은 언젠가 모두 무너진다", a: "x", why: "탐구 문제와 관계없고, 확인할 수 있는 조건이 없습니다." }
    ],
    onDone: function () { window.sthMission("m1-3", true, "<span class='m-tag'>미션 완료</span>좋은 가설은 ‘무엇을 바꾸면(조작 변인) 무엇이 어떻게 달라진다(종속 변인)’로 쓰여 검증할 수 있습니다."); ep.clear(2); }
  });
  if (ep.cleared(2)) window.sthMission("m1-3", true);

  /* 장면 4 — 모형 실험 설계 */
  (function () {
    var canvas = $("c-md"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    var VARS = [
      { id: "floor", t: "바닥 아래 공간", diff: false, key: true },
      { id: "wall", t: "벽 두께", diff: false },
      { id: "win", t: "창문 크기", diff: true },
      { id: "heat", t: "처음 온도", diff: false },
      { id: "mat", t: "상자 재료", diff: true }
    ];
    var ran = null;
    VARS.forEach(function (x) {
      var g = document.createElement("div"); g.className = "ctrl-group";
      g.innerHTML = "<div class='ctrl-label'>" + x.t + " (A와 B)</div>";
      var sg = document.createElement("div"); sg.className = "seg";
      [[false, "같음"], [true, "다름"]].forEach(function (o) {
        var b = document.createElement("button"); b.type = "button"; b.textContent = o[1];
        if (x.diff === o[0]) b.classList.add("on");
        b.addEventListener("click", function () {
          Array.prototype.forEach.call(sg.children, function (c) { c.classList.toggle("on", c === b); });
          if (x.diff !== o[0]) { x.diff = o[0]; ran = null; draw(); $("md-info").innerHTML = "설계가 바뀌었습니다. 다시 실행해 보세요."; }
        });
        sg.appendChild(b);
      });
      g.appendChild(sg); $("md-ctrl").appendChild(g);
    });
    function fair() { return VARS.every(function (x) { return x.key ? x.diff : !x.diff; }); }
    function curves() {
      var tA = 8, tB = 8;
      VARS.forEach(function (x) { if (!x.diff) return; if (x.id === "floor") tB = 5; if (x.id === "wall") tB -= 1.5; if (x.id === "win") tB -= 1; if (x.id === "mat") tA += 1.5; });
      var T0A = 20, T0B = VARS[3].diff ? 23 : 20;
      function T(T0, tau, t) { return -3 + (T0 + 3) * Math.exp(-t / tau); }
      var a = [], b = []; for (var t = 0; t <= 12; t += 0.25) { a.push(T(T0A, tA, t)); b.push(T(T0B, tB, t)); }
      return { a: a, b: b };
    }
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 600, y0 = 30, y1 = 260;
      function Xp(i, n) { return x0 + i / (n - 1) * (x1 - x0); }
      function Y(t) { return y1 - (t + 5) / 30 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [0, 10, 20].forEach(function (t) { text(ctx, t + " ℃", x0 - 6, Y(t) + 4, { s: 10, a: "right", c: v("--mist") }); });
      text(ctx, "0시간", x0, y1 + 16, { s: 10, c: v("--mist") }); text(ctx, "12시간", x1, y1 + 16, { s: 10, a: "right", c: v("--mist") });
      if (ran) {
        [["a", "--brand", "모형 A"], ["b", "--coral", "모형 B" + (VARS[0].diff ? "(필로티)" : "")]].forEach(function (s) {
          var arr = ran[s[0]]; ctx.strokeStyle = v(s[1]); ctx.lineWidth = 2.5; ctx.beginPath();
          arr.forEach(function (t, i) { if (i) ctx.lineTo(Xp(i, arr.length), Y(t)); else ctx.moveTo(Xp(i, arr.length), Y(t)); }); ctx.stroke();
          text(ctx, s[2] + " " + arr[arr.length - 1].toFixed(1) + " ℃", x1 + 10, Y(arr[arr.length - 1]) + 4, { s: 11.5, w: "800", c: v(s[1] + "-700") });
        });
      } else text(ctx, "실행하면 두 모형의 12시간 온도 변화가 그려집니다 (바깥 −3 ℃)", (x0 + x1) / 2, (y0 + y1) / 2, { s: 12, a: "center", c: v("--mist") });
    }
    $("md-run").addEventListener("click", function () {
      ran = curves(); draw();
      var others = VARS.filter(function (x) { return !x.key && x.diff; }).map(function (x) { return x.t; });
      if (!VARS[0].diff) { $("md-info").innerHTML = "두 모형의 바닥 아래 공간이 같습니다. 가설의 <b>조작 변인</b>을 다르게 해야 비교할 수 있습니다."; return; }
      if (others.length) { $("md-info").innerHTML = "온도 차이는 보이지만 <b>" + others.join(", ") + "</b>도 달라, 차이가 바닥 때문인지 알 수 없습니다. 통제 변인은 같게 두세요."; return; }
      var d = ran.a[ran.a.length - 1] - ran.b[ran.b.length - 1];
      $("md-info").innerHTML = "공정한 실험입니다. 12시간 뒤 필로티 모형(B)이 <b>" + d.toFixed(1) + " ℃</b> 더 낮습니다. 바닥 아래 공간만 달랐으니 이 차이는 바닥 때문이라고 말할 수 있습니다.";
      if (!ep.cleared(3)) {
        window.sthState("mdBest", "바닥 아래 공간만 다르게 → 필로티 모형이 12시간 뒤 " + d.toFixed(1) + " ℃ 더 낮음");
        window.sthMission("m1-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("mdBest") + ". 가설이 모형 실험으로 지지되었습니다.");
        ep.clear(3); ep.clear(4);
      }
    });
    canvas._redraw = draw; draw();
    if (ep.cleared(3)) window.sthMission("m1-4", true);
  })();

  function finish() { window.sthState("r1", "해결 · " + (window.sthState("mdBest") || "")); }
  function vs() {
    var p = window.sthState("p1") || "";
    $("e1-vs").innerHTML = "<b>나의 첫 짐작</b> " + (p || "기록 없음") + "<br><b>데이터 가공</b> " + (window.sthState("clBest") || "-") + "<br><b>모형 실험</b> " + (window.sthState("mdBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk1", unitLabel: "[융합과학 탐구 Ⅱ] 이야기 ① 필로티 2층은 왜 추울까",
    items: [
      { id: "w1", label: "내가 세운 가설", hint: "탐구 문제 하나를 정하고, 검증 가능한 가설로 바꿔 쓰세요.", ph: "문제: … / 가설: …" },
      { id: "e1b", label: "모형 실험 설계서", hint: "위 가설을 검증할 모형 실험에서 조작 변인·종속 변인·통제 변인을 적고, 공공 데이터를 어떻게 함께 쓸지 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ② 커피 필터 낙하 실험
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep2", key: "ep2", name: "사건 파일 ②", onDone: finish });

  window.sthGate({
    gate: "g2", key: "p2", title: "첫 예상",
    question: "필터를 여러 장 겹쳐 떨어뜨리면 종단 속도는 어떻게 될까요?",
    options: ["㉠ 무게와 관계없이 같다", "㉡ 무거울수록 커진다", "㉢ 무거울수록 작아진다"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — MBL 절차와 측정 간격 */
  (function () {
    var got = window.sthState("mblGot") || { a: false, b: false }, rate = 5;
    var STEPS = ["① 센서와 분석 프로그램이 도는 기기를 유선 또는 블루투스로 연결한다", "② 수집을 시작하면 측정값이 실시간으로 기기에 전송된다", "③ 분석 프로그램으로 그래프·통계를 만든다", "④ 모둠의 데이터와 분석 결과를 네트워크로 공유한다"];
    function mission() {
      if (got.a) done("m2-2a"); if (got.b) done("m2-2b");
      if (got.a && got.b) { window.sthMission("m2-2", true, "<span class='m-tag'>미션 완료</span>MBL 준비 끝. 1초에 " + (got.r || 20) + "번이면 1.5초 낙하 동안 " + Math.round(1.5 * (got.r || 20)) + "개의 점을 얻습니다."); ep.clear(1); }
    }
    if (got.a) filledOrder("s2-order", STEPS);
    else window.sthOrder({ mount: "s2-order", steps: STEPS, onDone: function () { got.a = true; window.sthState("mblGot", got); mission(); } });
    var canvas = $("c-rate"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h;
    function draw() {
      paper(ctx, W, H);
      var x0 = 50, x1 = 600, y0 = 30, y1 = 200, n = Math.floor(1.5 * rate) + 1;
      axes(ctx, x0, y0, x1, y1);
      ctx.strokeStyle = v("--mist"); ctx.lineWidth = 1.5; ctx.beginPath();
      for (var t = 0; t <= 1.5; t += 0.01) { var vv = Math.tanh(9.8 * t / 2) * 2, xx = x0 + t / 1.5 * (x1 - x0), yy = y1 - vv / 2.2 * (y1 - y0); if (t === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy); } ctx.stroke();
      var noise = rate > 50 ? 0.25 : 0.03, r = seeded(rate);
      ctx.fillStyle = v("--coral");
      for (var k = 0; k < n; k++) { var tk = k / rate, vk = Math.tanh(9.8 * tk / 2) * 2 + gauss(r) * noise; ctx.beginPath(); ctx.arc(x0 + tk / 1.5 * (x1 - x0), y1 - vk / 2.2 * (y1 - y0), 4, 0, Math.PI * 2); ctx.fill(); }
      text(ctx, "낙하 1.5초 동안 찍힌 점 " + n + "개", x0 + 6, 22, { s: 12.5, w: "800" });
      text(ctx, n >= 30 && rate <= 50 ? "✅ 알맞은 간격" : (n < 30 ? "점이 너무 적어 변화가 안 보임" : "너무 촘촘해 계산한 속도의 잡음이 커짐"), x1 + 10, 80, { s: 13, w: "900", c: n >= 30 && rate <= 50 ? v("--green-700") : v("--rose-700") });
      return n;
    }
    function update() {
      var n = draw();
      $("rt-info").innerHTML = "1초에 " + rate + "번 측정 → 1.5초 동안 " + n + "개. 측정 간격(" + (1000 / rate).toFixed(0) + " ms)이 현상의 빠르기보다 충분히 짧아야 변화가 보입니다.";
      if (n >= 30 && rate <= 50 && !got.b) { got.b = true; got.r = rate; window.sthState("mblGot", got); mission(); }
    }
    canvas._redraw = draw;
    $("rt-v").addEventListener("input", function (e) { rate = +e.target.value; $("rt-v-val").textContent = rate + "번"; update(); });
    update(); mission();
  })();

  /* 장면 3 — 시각화 분류 */
  window.sthSort({
    mount: "s2-sort",
    buckets: [{ id: "graph", label: "📈 그래프", sub: "수치 관계·시간 변화" }, { id: "chart", label: "📊 차트", sub: "막대·부채꼴 크기로 비교" }, { id: "diagram", label: "🗺️ 다이어그램·지도", sub: "관계·구조·지리적 분포" }],
    items: [
      { t: "커피 필터의 속도가 시간에 따라 어떻게 변하는지", a: "graph", why: "시간에 따른 변화는 그래프가 가장 잘 보여 줍니다." },
      { t: "한 달 동안 매일 잰 우리 동네 미세 먼지 농도의 변화 추이", a: "graph", why: "시간 변화 추이입니다." },
      { t: "여러 나라의 연도별 이산화 탄소 배출량 증가 추세", a: "graph", why: "여러 계열의 변화를 한 좌표계에 선으로 나타냅니다." },
      { t: "반 학생들이 좋아하는 계절별 인원수 비교", a: "chart", why: "크기 비교는 막대 차트가 알맞습니다." },
      { t: "설문 응답자의 혈액형별 인원수", a: "chart", why: "막대의 크기로 비교합니다." },
      { t: "필터 1~6장의 종단 속도를 나란히 비교", a: "chart", why: "항목별 크기 비교입니다.", hint: "시간 변화가 아니라 항목 사이의 크기 비교입니다." },
      { t: "우리 지역 재활용 쓰레기 배출 장소와 수거 동선", a: "diagram", why: "지리적 분포와 동선은 지도가 알맞습니다." },
      { t: "먹이 그물처럼 여러 생물 사이의 관계 구조", a: "diagram", why: "관계 구조는 다이어그램입니다." },
      { t: "MBL의 센서 → 기기 → 분석 → 공유로 이어지는 흐름", a: "diagram", why: "과정의 흐름과 연결은 다이어그램으로 나타냅니다." }
    ],
    onDone: function () { window.sthMission("m2-3", true, "<span class='m-tag'>미션 완료</span>시각화는 데이터가 아니라 <b>목적</b>에 맞춰 고릅니다."); ep.clear(2); }
  });
  if (ep.cleared(2)) window.sthMission("m2-3", true);

  /* 장면 4 — 낙하 그래프 */
  (function () {
    var canvas = $("c-fall"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, view = "xt", n = 1, g = 9.8;
    function vt(k) { return Math.sqrt(k); }
    function vel(t, k) { var u = vt(k); return u * Math.tanh(g * t / u); }
    function pos(t, k) { var u = vt(k); return u * u / g * Math.log(Math.cosh(g * t / u)); }
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 580, y0 = 30, y1 = 260;
      axes(ctx, x0, y0, x1, y1);
      if (view === "bar") {
        for (var k = 1; k <= 6; k++) { var bh = vt(k) / 2.6 * (y1 - y0), bx = x0 + 20 + (k - 1) * 82; ctx.fillStyle = k === n ? v("--coral") : v("--mist"); ctx.fillRect(bx, y1 - bh, 56, bh); text(ctx, k + "장", bx + 28, y1 + 16, { s: 10.5, a: "center", c: v("--mist") }); }
        text(ctx, "필터 수별 마지막 속도 (막대 차트)", x0 + 6, 22, { s: 12, w: "800" });
      } else {
        var T = 1.5;
        ctx.strokeStyle = v("--coral"); ctx.lineWidth = 3; ctx.beginPath();
        for (var t = 0; t <= T; t += 0.01) { var val = view === "xt" ? pos(t, n) : vel(t, n), yy = y1 - val / (view === "xt" ? 2.4 : 2.6) * (y1 - y0), xx = x0 + t / T * (x1 - x0); if (t === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy); }
        ctx.stroke();
        text(ctx, view === "xt" ? "떨어진 거리 (m) — 시간" : "속력 (m/s) — 시간", x0 + 6, 22, { s: 12, w: "800" });
        [0, 0.5, 1.0, 1.5].forEach(function (s) { text(ctx, s.toFixed(1) + "초", x0 + s / T * (x1 - x0), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
        if (view === "vt") { var yv = y1 - vt(n) / 2.6 * (y1 - y0); ctx.strokeStyle = v("--amber"); ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(x0, yv); ctx.lineTo(x1, yv); ctx.stroke(); ctx.setLineDash([]); text(ctx, "평평해진 높이 = 종단 속도", x1, yv - 6, { s: 11, w: "800", a: "right", c: v("--amber-700") }); }
      }
      var rx = 620;
      text(ctx, "필터 " + n + "장", rx, 70, { s: 16, w: "900" });
      text(ctx, view === "vt" ? "종단 속도 " + vt(n).toFixed(2) + " m/s" : (view === "xt" ? "기울기가 일정해지는 곳을 찾아야…" : "속도 변화 과정은 안 보임"), rx, 110, { s: 13, w: "800", c: view === "vt" ? v("--green-700") : v("--mist") });
    }
    function update() {
      draw();
      $("fl-info").innerHTML = view === "vt" ? "속도-시간 그래프는 처음에 가파르게 오르다 평평해집니다. 평평해진 높이가 종단 속도입니다. 필터 " + n + "장 → <b>" + vt(n).toFixed(2) + " m/s</b>." : (view === "xt" ? "위치-시간 그래프에서는 기울기가 속력이라 종단 속도를 바로 읽기 어렵습니다." : "막대 차트는 크기 비교에는 좋지만 시간에 따라 속도가 어떻게 변하는지는 보여 주지 않습니다.");
      if (view === "vt" && vt(n) >= 1.9 && vt(n) <= 2.1 && !ep.cleared(3)) {
        window.sthState("flBest", "속도-시간 그래프 · 필터 " + n + "장 → 종단 속도 " + vt(n).toFixed(2) + " m/s");
        window.sthMission("m2-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("flBest") + ". 무게가 4배면 종단 속도는 2배 — 무거울수록 빨라지지만 비례하지는 않습니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    segWire("fl-v", "data-v", function (x) { view = x; update(); });
    $("fl-n").addEventListener("input", function (e) { n = +e.target.value; $("fl-n-val").textContent = n + "장"; update(); });
    update();
    if (ep.cleared(3)) window.sthMission("m2-4", true);
  })();

  function finish() { window.sthState("r2", "해결 · " + (window.sthState("flBest") || "")); }
  function vs() {
    var p = window.sthState("p2") || "";
    $("e2-vs").innerHTML = "<b>나의 첫 예상</b> " + (p || "기록 없음") + (p.indexOf("㉡") === 0 ? " — 맞았습니다." : " — 그래프는 무거울수록 커진다고 말합니다.") + "<br><b>나의 그래프</b> " + (window.sthState("flBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk2", unitLabel: "[융합과학 탐구 Ⅱ] 이야기 ② 커피 필터 낙하 실험",
    items: [
      { id: "e2a", label: "디지털 도구로 데이터를 모은 과정", hint: "MBL의 네 단계를 따라 우리 모둠이 한 일을 쓰고, 측정 간격을 그렇게 정한 까닭을 쓰세요." },
      { id: "e2b", label: "이 그래프를 고른 까닭", hint: "종단 속도를 보여 주려고 어떤 시각 자료를 골랐는지, 다른 것보다 나은 점을 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ③ 학교 자기장 지도
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep3", key: "ep3", name: "사건 파일 ③", onDone: finish });
  var PL = [{ name: "교실", m: 57, sd: 4, c: "--teal" }, { name: "과학실", m: 64, sd: 5, c: "--coral" }, { name: "복도", m: 62, sd: 4.5, c: "--brand" }, { name: "운동장", m: 63, sd: 6, c: "--violet" }];
  PL.forEach(function (p, i) { var r = seeded(i * 131 + 7); p.s = []; for (var k = 0; k < 100; k++) p.s.push(p.m + gauss(r) * p.sd); });
  function avg(p, n) { var s = 0; for (var k = 0; k < n; k++) s += p.s[k]; return s / n; }

  window.sthGate({
    gate: "g3", key: "p3", title: "선생님의 물음",
    question: "교실 55, 과학실 68 — 한 번씩 잰 두 값으로 ‘과학실 자기장이 더 세다’고 결론 내려도 될까요?",
    options: ["㉠ 된다 — 68이 더 크니까", "㉡ 안 된다 — 측정마다 흔들림이 있으니 여러 번 재어 퍼짐까지 봐야 한다", "㉢ 된다 — 스마트폰은 틀리지 않으니까"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 표준 편차 */
  (function () {
    var got = window.sthState("sdGot") || { a: false, b: false };
    var FIG = "<table><tr><th></th><th>1회</th><th>2회</th><th>3회</th><th>4회</th><th>5회</th><th>평균</th><th>표준 편차</th></tr><tr><td>앱 A</td><td>50</td><td>51</td><td>49</td><td>50</td><td>50</td><td>50</td><td>약 0.7</td></tr><tr><td>앱 B</td><td>45</td><td>55</td><td>48</td><td>52</td><td>50</td><td>50</td><td>약 3.8</td></tr></table><div style=\"font-size:12px;margin:4px 0 0\">표준 편차는 (n − 1)로 나눈 표본 표준 편차입니다(n으로 나누면 0.6, 3.4).</div>";
    function mission() { if (got.a && got.b) { window.sthMission("m3-2", true, "<span class='m-tag'>미션 완료</span>평균이 같아도 표준 편차가 작은 쪽이 더 믿을 만합니다. 평균만으로는 데이터의 특성을 다 알 수 없습니다."); ep.clear(1); } }
    window.sthPick({
      mount: "s3-q1",
      q: "같은 자리를 두 앱으로 다섯 번씩 쟀습니다. 더 믿을 만한 앱은?" + FIG,
      options: ["앱 A — 값이 평균 둘레에 좁게 모여 있다(표준 편차가 작다)", "앱 B — 값이 다양해서 더 많은 정보를 준다", "평균이 같으니 둘 다 똑같다"],
      answer: 0,
      why: ["표준 편차가 작을수록 측정이 일정합니다(정밀도가 높음).", "값이 넓게 흩어지는 것은 측정이 불안정하다는 뜻입니다.", "평균이 같아도 퍼짐이 다르면 믿을 만한 정도가 다릅니다."],
      onDone: function () { got.a = true; window.sthState("sdGot", got); mission(); }
    });
    window.sthPick({
      mount: "s3-q2",
      q: "앱 B로 한 번만 재서 45가 나왔다면, 참값이 50 이라도 이상하지 않은 까닭은?",
      options: ["앱 B는 표준 편차가 커서 한 번 잰 값이 평균에서 5쯤 벗어나는 일이 흔하기 때문", "45가 참값이기 때문", "앱이 고장 났기 때문"],
      answer: 0,
      why: ["퍼짐이 큰 측정은 한두 번의 값만으로 결론을 내리기 어렵습니다. 여러 번 재어 평균을 내야 합니다.", "한 번의 값은 참값에서 벗어날 수 있습니다.", "측정은 원래 흔들립니다. 그 정도를 표준 편차로 나타냅니다."],
      onDone: function () { got.b = true; window.sthState("sdGot", got); mission(); }
    });
    mission();
  })();

  /* 장면 3 — 측정 횟수와 오차 막대 (기존 시뮬레이션) */
  (function () {
    var canvas = $("c4"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, n = 3;
    function draw() {
      paper(ctx, W, H);
      var padTop = 40, padBot = 44, maxVal = 75, chartH = H - padTop - padBot, barW = (W - 40) / PL.length;
      for (var g = 0; g <= 75; g += 25) { var gy = padTop + chartH - g / maxVal * chartH; ctx.strokeStyle = v("--line"); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(40, gy); ctx.lineTo(W - 10, gy); ctx.stroke(); text(ctx, g + "", 34, gy + 3, { s: 10, a: "right", c: v("--mist") }); }
      PL.forEach(function (p, i) {
        var a = avg(p, n), se = p.sd / Math.sqrt(n), bh = a / maxVal * chartH, bx = 40 + i * barW + barW * 0.22, bw = barW * 0.56, by = padTop + chartH - bh;
        ctx.fillStyle = v(p.c); ctx.fillRect(bx, by, bw, bh);
        var seH = se / maxVal * chartH, ex = bx + bw / 2;
        ctx.strokeStyle = v("--ink"); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(ex, by - seH); ctx.lineTo(ex, by + seH); ctx.moveTo(ex - 6, by - seH); ctx.lineTo(ex + 6, by - seH); ctx.moveTo(ex - 6, by + seH); ctx.lineTo(ex + 6, by + seH); ctx.stroke();
        text(ctx, a.toFixed(1) + " ± " + se.toFixed(2), ex, by - seH - 8, { s: 11, w: "800", a: "center" });
        text(ctx, p.name, ex, H - padBot + 20, { s: 12, a: "center", c: v("--mist") });
      });
      text(ctx, "평균 자기장 (μT) · 오차 막대 = 표준 오차", 12, 18, { s: 11.5, w: "800" });
    }
    function update() {
      draw();
      var maxSe = Math.max.apply(null, PL.map(function (p) { return p.sd / Math.sqrt(n); }));
      $("c4-n-val").textContent = n;
      $("c4-info").innerHTML = "장소마다 " + n + "번 → 가장 큰 표준 오차 <b>" + maxSe.toFixed(2) + " μT</b>. 측정 횟수가 늘수록 표준 오차(σ/√n)가 줄어 평균을 더 믿을 수 있습니다.";
      if (maxSe <= 1 + 1e-9 && n <= 46 && !ep.cleared(2)) {
        window.sthState("seBest", "장소마다 " + n + "번 → 표준 오차 모두 1 μT 이하");
        window.sthMission("m3-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("seBest") + ". 표준 편차가 가장 큰 운동장(6 μT)이 기준을 정합니다: 6 ÷ √36 = 1.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    $("c4-n").addEventListener("input", function (e) { n = +e.target.value; update(); });
    update();
    if (ep.cleared(2)) window.sthMission("m3-3", true);
  })();

  /* 장면 4 — 막대가 겹치는가 */
  (function () {
    var canvas = $("c-ht"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, pair = 0, n = 3;
    var got = window.sthState("htGot") || { a: false, b: false };
    function sep(i, k) { var a = PL[i], b = PL[1], ma = avg(a, k), mb = avg(b, k), ea = 2 * a.sd / Math.sqrt(k), eb = 2 * b.sd / Math.sqrt(k); return { ma: ma, mb: mb, ea: ea, eb: eb, apart: Math.abs(ma - mb) > ea + eb }; }
    var FIRST = 100; for (var k = 3; k <= 100; k++) if (sep(0, k).apart) { FIRST = k; break; }
    function draw() {
      paper(ctx, W, H);
      var r = sep(pair, n), x0 = 60, x1 = 600, y = [100, 180];
      function X(m) { return x0 + (m - 45) / 30 * (x1 - x0); }
      [45, 55, 65, 75].forEach(function (m) { text(ctx, m + " μT", X(m), 250, { s: 10, a: "center", c: v("--mist") }); ctx.strokeStyle = v("--line"); ctx.beginPath(); ctx.moveTo(X(m), 60); ctx.lineTo(X(m), 235); ctx.stroke(); });
      [[PL[pair], r.ma, r.ea], [PL[1], r.mb, r.eb]].forEach(function (q, i) {
        ctx.strokeStyle = v(q[0].c); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(X(q[1] - q[2]), y[i]); ctx.lineTo(X(q[1] + q[2]), y[i]); ctx.stroke();
        ctx.fillStyle = v(q[0].c); ctx.beginPath(); ctx.arc(X(q[1]), y[i], 8, 0, Math.PI * 2); ctx.fill();
        text(ctx, q[0].name + " " + q[1].toFixed(1) + " ± " + q[2].toFixed(1), X(q[1]), y[i] - 16, { s: 11.5, w: "800", a: "center" });
      });
      text(ctx, "평균 ± 2 × 표준 오차 · 측정 " + n + "번", x0, 30, { s: 12.5, w: "800" });
      text(ctx, r.apart ? "막대가 떨어짐 — 차이가 있다고 말할 근거" : "막대가 겹침 — 차이를 주장하기 어려움", 620, 140, { s: 13, w: "900", c: r.apart ? v("--green-700") : v("--rose-700") });
      return r;
    }
    function update() {
      var r = draw(), ch = false;
      $("ht-info").innerHTML = PL[pair].name + " " + r.ma.toFixed(1) + " μT, 과학실 " + r.mb.toFixed(1) + " μT (측정 " + n + "번). 차이 " + Math.abs(r.ma - r.mb).toFixed(1) + " μT, 두 막대 반쪽 길이의 합 " + (r.ea + r.eb).toFixed(1) + " μT.";
      if (pair === 0 && r.apart && n <= FIRST + 5 && !got.a) { got.a = ch = true; got.n = n; }
      if (pair === 3 && n === 100 && !r.apart && !got.b) { got.b = ch = true; }
      if (ch) { window.sthState("htGot", got); mission(); }
    }
    function mission() {
      if (got.a) done("m3-4a"); if (got.b) done("m3-4b");
      if (got.a && got.b) {
        window.sthState("htBest", "교실·과학실은 " + got.n + "번 재면 구별, 운동장·과학실은 100번 재도 구별 안 됨");
        window.sthMission("m3-4", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("htBest") + ". 가설의 일부만 데이터로 지지됩니다.");
        ep.clear(3); ep.clear(4);
      }
    }
    canvas._redraw = draw;
    segWire("ht-p", "data-v", function (x) { pair = +x; update(); });
    $("ht-n").addEventListener("input", function (e) { n = +e.target.value; $("ht-n-val").textContent = n; update(); });
    update(); mission();
  })();

  function finish() { window.sthState("r3", "해결 · " + (window.sthState("htBest") || "")); }
  function vs() {
    var p = window.sthState("p3") || "";
    $("e3-vs").innerHTML = "<b>나의 첫 판단</b> " + (p || "기록 없음") + "<br><b>측정 횟수</b> " + (window.sthState("seBest") || "-") + "<br><b>가설 검증</b> " + (window.sthState("htBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk3", unitLabel: "[융합과학 탐구 Ⅱ] 이야기 ③ 학교 자기장 지도",
    items: [
      { id: "w2", label: "평균만으로는 모자란 이유", hint: "같은 평균인데 성질이 다른 두 자료를 떠올려 보고, 표준편차가 왜 필요한지 쓰세요." },
      { id: "e3b", label: "자기장 가설 검증 보고", hint: "‘과학실 자기장이 더 세다’는 가설 가운데 무엇이 지지되고 무엇이 보류되었는지, 측정 횟수와 오차 막대를 근거로 쓰세요." }
    ]
  });
})();

/* =========================================================================
   이야기 ④ 선크림 보고서
   ========================================================================= */
(function () {
  var ep = window.sthStory({ root: "ep4", key: "ep4", name: "사건 파일 ④", onDone: finish });

  window.sthGate({
    gate: "g4", key: "p4", title: "첫 생각",
    question: "측정한 세 점(0.5, 1.0, 1.5 mg/cm²)을 직선으로 이어 2.0 mg/cm²의 차단율을 예측해도 될까요?",
    options: ["㉠ 된다 — 점이 직선에 가깝다", "㉡ 조심해야 한다 — 측정 범위 밖이고, 차단율은 100%를 넘을 수 없다", "㉢ 아예 예측할 수 없다"],
    onPick: function () { ep.clear(0); }
  });

  /* 장면 2 — 내삽·외삽 (기존 시뮬레이션) */
  (function () {
    var canvas = $("c5"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, mode = "inter", noise = 1.0;
    var got = window.sthState("ieGot") || { i: false, e: false, big: false };
    var pts = []; for (var i = 0; i <= 8; i++) pts.push({ x: i, y: 3 + Math.sin(i * 0.6) * 1.6 + i * 0.35 });
    pts.push({ x: 9, y: 3 + Math.sin(9 * 0.6) * 1.6 + 9 * 0.35 }); pts.push({ x: 10, y: 3 + Math.sin(10 * 0.6) * 1.6 + 10 * 0.35 });
    function draw() {
      paper(ctx, W, H);
      var padL = 50, padR = 30, padT = 30, padB = 40, cw = W - padL - padR, chh = H - padT - padB, maxX = 10, maxY = 9;
      function P(p) { return { x: padL + p.x / maxX * cw, y: padT + chh - Math.max(-2, Math.min(11, p.y)) / maxY * chh }; }
      axes(ctx, padL, padT, padL + cw, padT + chh);
      var gs = mode === "inter" ? 2 : 6, ge = mode === "inter" ? 6 : 10;
      var known = pts.filter(function (p) { return mode === "inter" ? (p.x <= 2 || (p.x >= 6 && p.x <= 8)) : p.x <= 6; });
      var pred = pts.filter(function (p) { return p.x >= gs - 0.01 && p.x <= ge + 0.01; }), up = [], lo = [];
      pred.forEach(function (p) { var d = mode === "inter" ? Math.min(Math.abs(p.x - gs), Math.abs(p.x - ge)) : p.x - gs, b = noise * (0.15 + (mode === "inter" ? 0.35 : 0.9) * d) * 0.5; up.push({ x: p.x, y: p.y + b }); lo.push({ x: p.x, y: p.y - b }); });
      ctx.save(); ctx.beginPath(); ctx.rect(padL, padT, cw, chh); ctx.clip();
      ctx.globalAlpha = 0.18; ctx.fillStyle = v("--coral"); ctx.beginPath();
      up.forEach(function (p, k) { var q = P(p); if (k) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); });
      for (var k = lo.length - 1; k >= 0; k--) { var q2 = P(lo[k]); ctx.lineTo(q2.x, q2.y); }
      ctx.closePath(); ctx.fill(); ctx.restore(); ctx.globalAlpha = 1;
      ctx.fillStyle = v("--teal"); known.forEach(function (p) { var q = P(p); ctx.beginPath(); ctx.arc(q.x, q.y, 4, 0, Math.PI * 2); ctx.fill(); });
      ctx.setLineDash([5, 5]); ctx.strokeStyle = v("--coral"); ctx.lineWidth = 2; ctx.beginPath();
      pred.forEach(function (p, k) { var q = P(p); if (k) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y); }); ctx.stroke(); ctx.setLineDash([]);
      var g1 = P({ x: gs, y: 0 }).x, g2 = P({ x: ge, y: 0 }).x;
      text(ctx, mode === "inter" ? "예측 구간(내삽) · 음영 = 불확실성" : "예측 구간(외삽) · 음영 = 불확실성", (g1 + g2) / 2, padT + 16, { s: 11, a: "center", c: v("--mist") });
      text(ctx, "● 측정된 데이터", padL, H - 10, { s: 11, c: v("--teal-700") });
      text(ctx, "● 예측값", padL + 130, H - 10, { s: 11, c: v("--coral-700") });
    }
    function update() {
      draw();
      $("c5-info").innerHTML = mode === "inter" ? "<b>내삽</b> — 측정 범위 <b>안</b>의 빈 구간을 예측합니다. 양쪽 관측값이 붙잡아 주어 불확실성이 좁습니다. 예) 일기도의 등압선 그리기." : "<b>외삽</b> — 측정 범위 <b>밖</b>을 예측합니다. 데이터에서 멀어질수록 불확실성이 빠르게 넓어지고, 측정 오차가 크면 더 넓어집니다. 예) 기후 변화 예측.";
      var ch = false;
      if (mode === "inter" && !got.i) { got.i = ch = true; }
      if (mode === "extra" && !got.e) { got.e = ch = true; }
      if (mode === "extra" && noise >= 2.5 && !got.big) { got.big = ch = true; }
      if (ch) { window.sthState("ieGot", got); mission(); }
    }
    function mission() {
      if (got.i && got.e) done("m4-2a"); if (got.big) done("m4-2b");
      if (got.i && got.e && got.big) { window.sthMission("m4-2", true, "<span class='m-tag'>미션 완료</span>외삽은 데이터에서 멀어질수록, 오차가 클수록 불확실성이 크게 늘어납니다."); ep.clear(1); }
    }
    canvas._redraw = draw;
    segWire("c5-mode", "data-m", function (m) { mode = m; update(); });
    $("c5-noise").addEventListener("input", function (e) { noise = +e.target.value; $("c5-noise-val").textContent = noise.toFixed(1); update(); });
    update(); mission();
  })();

  /* 장면 3 — 선크림 예측 */
  (function () {
    var canvas = $("c-sun"), ctx = window.setupCanvas(canvas), W = canvas._w, H = canvas._h, md = "lin", measured = !!window.sthState("snMeas");
    function real(m) { return 100 * (1 - Math.pow(1 / 50, m / 2)); }
    var D = [0.5, 1.0, 1.5].map(function (m) { return { m: m, y: real(m) }; });
    var mx = 1.0, my = D.reduce(function (a, d) { return a + d.y; }, 0) / 3, sl = D.reduce(function (a, d) { return a + (d.m - mx) * (d.y - my); }, 0) / D.reduce(function (a, d) { return a + (d.m - mx) * (d.m - mx); }, 0);
    function lin(m) { return my + sl * (m - mx); }
    function pred(m) { return md === "lin" ? lin(m) : real(m); }
    function draw() {
      paper(ctx, W, H);
      var x0 = 60, x1 = 560, y0 = 30, y1 = 260;
      function X(m) { return x0 + m / 2.4 * (x1 - x0); }
      function Y(p) { return y1 - (Math.min(p, 118) - 40) / 80 * (y1 - y0); }
      axes(ctx, x0, y0, x1, y1);
      [40, 60, 80, 100].forEach(function (p) { text(ctx, p + "%", x0 - 6, Y(p) + 4, { s: 10, a: "right", c: v("--mist") }); });
      ctx.strokeStyle = v("--rose"); ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(x0, Y(100)); ctx.lineTo(x1, Y(100)); ctx.stroke(); ctx.setLineDash([]);
      [0.5, 1, 1.5, 2].forEach(function (m) { text(ctx, m.toFixed(1), X(m), y1 + 16, { s: 10, a: "center", c: v("--mist") }); });
      text(ctx, "mg/cm²", x1, y1 + 30, { s: 10, a: "right", c: v("--mist") });
      ctx.fillStyle = v("--mist"); ctx.globalAlpha = .12; ctx.fillRect(X(1.5), y0, X(2.4) - X(1.5), y1 - y0); ctx.globalAlpha = 1;
      text(ctx, "측정 범위 밖", X(1.95), y0 + 14, { s: 10.5, a: "center", c: v("--mist") });
      ctx.strokeStyle = v("--brand"); ctx.lineWidth = 2.5; ctx.beginPath();
      for (var m = 0.3; m <= 2.3; m += 0.02) { if (m === 0.3) ctx.moveTo(X(m), Y(pred(m))); else ctx.lineTo(X(m), Y(pred(m))); } ctx.stroke();
      ctx.fillStyle = v("--teal"); D.forEach(function (d) { ctx.beginPath(); ctx.arc(X(d.m), Y(d.y), 6, 0, Math.PI * 2); ctx.fill(); });
      var p2 = pred(2.0);
      ctx.strokeStyle = v("--coral"); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X(2), Y(p2), 8, 0, Math.PI * 2); ctx.stroke();
      if (measured) { ctx.fillStyle = v("--green"); ctx.beginPath(); ctx.arc(X(2), Y(real(2)), 6, 0, Math.PI * 2); ctx.fill(); }
      text(ctx, "예측 (2.0 mg/cm²)", 610, 70, { s: 12, c: v("--mist") });
      text(ctx, p2.toFixed(1) + "%", 610, 100, { s: 22, w: "900", c: p2 > 100 ? v("--rose-700") : v("--ink") });
      if (measured) { text(ctx, "실제 측정", 610, 150, { s: 12, c: v("--mist") }); text(ctx, real(2).toFixed(1) + "%", 610, 180, { s: 22, w: "900", c: v("--green-700") }); }
      return p2;
    }
    function update() {
      var p2 = draw();
      $("sn-info").innerHTML = (md === "lin" ? "직선 모형은 측정한 세 점을 잘 지나지만, 2.0 mg/cm²에서 <b>" + p2.toFixed(1) + "%</b> — 100%를 넘는 말이 안 되는 값을 냅니다." : "‘100%에 다가가는 곡선’은 바를수록 차단율이 늘지만 100%를 넘지 않는 성질을 담고 있습니다. 2.0 mg/cm²에서 <b>" + p2.toFixed(1) + "%</b>.") + (measured ? " 실제 측정값은 <b>98.0%</b>." : "");
      if (measured && md === "exp" && Math.abs(p2 - 98) <= 1 && !ep.cleared(2)) {
        window.sthState("snBest", "곡선 모형 예측 " + p2.toFixed(1) + "% = 실제 98.0% (직선은 " + lin(2).toFixed(0) + "%)");
        window.sthMission("m4-3", true, "<span class='m-tag'>미션 완료</span>" + window.sthState("snBest") + ". 결론을 새 측정과 현상의 성질로 평가해 모형을 골랐습니다.");
        ep.clear(2);
      }
    }
    canvas._redraw = draw;
    segWire("sn-m", "data-v", function (x) { md = x; update(); });
    $("sn-meas").addEventListener("click", function () { measured = true; window.sthState("snMeas", 1); update(); });
    update();
    if (ep.cleared(2)) window.sthMission("m4-3", true);
  })();

  /* 장면 4 — 발표 절차와 토론 */
  (function () {
    var got = window.sthState("comGot") || { a: false, b: false };
    function mission() {
      if (got.a) done("m4-4a"); if (got.b) done("m4-4b");
      if (got.a && got.b) { window.sthMission("m4-4", true, "<span class='m-tag'>미션 완료</span>발표 자료의 과정을 세우고, 토론의 논점을 정리했습니다. 증거에 근거한 논증이 과학적 의사소통의 핵심입니다."); ep.clear(3); ep.clear(4); }
    }
    var STEPS = ["① 계획 수립 — 청중과 핵심 메시지를 정하고 흐름을 기획한다", "② 자료 제작 — 일관된 디자인으로 그림·그래프를 논리적으로 배치한다", "③ 검토 및 수정 — 오류와 오타, 논리의 일관성을 확인한다"];
    if (got.a) filledOrder("s4-order", STEPS);
    else window.sthOrder({ mount: "s4-order", steps: STEPS, onDone: function () { got.a = true; window.sthState("comGot", got); mission(); } });
    window.sthSort({
      mount: "s4-sort",
      buckets: [{ id: "tp", label: "전통 과학실의 장점" }, { id: "tm", label: "전통 과학실의 단점" }, { id: "sp", label: "지능형 과학실의 장점" }, { id: "sm", label: "지능형 과학실의 단점" }],
      items: [
        { t: "손으로 직접 만지고 재며 기본 탐구 기능을 기른다", a: "tp", why: "직접 실험 중심의 학습입니다." },
        { t: "모둠이 함께 기구를 다루며 협력한다", a: "tp", why: "협력 활동을 촉진합니다." },
        { t: "재료와 기기가 한정되어 할 수 있는 실험이 적다", a: "tm", why: "전통 과학실의 한계입니다." },
        { t: "위험한 약품·불을 다루다 안전사고가 날 수 있다", a: "tm", why: "안전사고 위험입니다." },
        { t: "센서·시뮬레이션으로 위험한 실험을 안전하게 한다", a: "sp", why: "안전한 실험 환경입니다." },
        { t: "학생마다 속도에 맞춰 개인 맞춤형으로 배울 수 있다", a: "sp", why: "개인 맞춤형 학습입니다." },
        { t: "갖추는 비용이 많이 든다", a: "sm", why: "높은 구축 비용입니다." },
        { t: "기기가 고장 나면 수업이 멈추고 기술에 기대게 된다", a: "sm", why: "기술 의존과 장애 문제입니다." }
      ],
      onDone: function () { got.b = true; window.sthState("comGot", got); mission(); }
    });
    mission();
  })();

  function finish() { window.sthState("r4", "해결 · " + (window.sthState("snBest") || "")); }
  function vs() {
    var p = window.sthState("p4") || "";
    $("e4-vs").innerHTML = "<b>나의 첫 생각</b> " + (p || "기록 없음") + (p.indexOf("㉡") === 0 ? " — 정확했습니다." : " — 직선 외삽은 113%라는 불가능한 값을 냈지요.") + "<br><b>나의 결론</b> " + (window.sthState("snBest") || "-");
  }
  ep.onShow(function (i) { if (i === 4) vs(); });
  if (ep.at() === 4) vs();
  window.sthWork({
    mount: "wk4", unitLabel: "[융합과학 탐구 Ⅱ] 이야기 ④ 선크림 보고서",
    items: [
      { id: "w3", label: "내삽과 외삽", hint: "둘 중 어느 쪽이 더 위험한지, 왜 그런지 쓰세요." },
      { id: "e4b", label: "발표 슬라이드 세 장 구상", hint: "선크림 탐구를 발표한다면 세 장의 슬라이드에 각각 무엇(문제·과정·결론)을 어떤 그림과 함께 넣을지 쓰고, 지능형 과학실 토론에서 내 입장을 한 줄 덧붙이세요." }
    ]
  });
})();

/* ========================================================================= 07 정리하기 */
window.sthWork({
  mount: "wk", unitLabel: "[융합과학 탐구 Ⅱ] 융합과학 탐구의 과정 — 정리",
  recap: [
    { key: "r1", label: "① 필로티 2층은 왜 추울까" },
    { key: "r2", label: "② 커피 필터 낙하 실험" },
    { key: "r3", label: "③ 학교 자기장 지도" },
    { key: "r4", label: "④ 선크림 보고서" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  items: [
    { id: "all", label: "네 사건을 꿰는 한 문장", hint: "문제 발견 → 수집·시각화 → 검증 → 결론·발표. 네 이야기가 탐구의 어느 단계를 보여 주는지 한 문장으로 이어 보세요." },
    { id: "w4", label: "아직 헷갈리는 것", hint: "다음 시간에 여기서부터 시작합니다." }
  ]
});

/* ========================================================================= 08 우리 반 */
window.sthShare({
  mount: "share", unit: "cvg-2", unitLabel: "[융합과학 탐구 Ⅱ] 융합과학 탐구의 과정",
  rows: [
    { key: "r1", label: "① 필로티 2층은 왜 추울까" },
    { key: "r2", label: "② 커피 필터 낙하 실험" },
    { key: "r3", label: "③ 학교 자기장 지도" },
    { key: "r4", label: "④ 선크림 보고서" },
    { key: "rQuiz", label: "수준별 문제" },
    { key: "rLab", label: "응용 실험실" },
    { key: "rReal", label: "실제 자료" }
  ],
  line: { id: "all", label: "네 사건을 꿰는 한 문장" }
});

})();
