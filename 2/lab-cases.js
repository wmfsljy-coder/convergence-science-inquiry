/* 융합과학 탐구 Ⅱ 융합과학 탐구의 과정 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

function Phi(z) { var t = 1 / (1 + 0.3275911 * Math.abs(z / Math.SQRT2)), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z / 2); return 0.5 * (1 + (z >= 0 ? y : -y)); }

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 평균과 표준 편차 */
  {
    id: "c1", about: "03", tag: "평균 · 표준 편차", title: "셔틀콕 공장의 불량률", short: "셔틀콕 품질",
    who: "🏸", name: "셔틀콕 제조 공장",
    say: "“국제 경기용 셔틀콕은 무게가 <b>4.74~5.50 g</b> 이어야 해요. 우리 공장에는 기계가 두 대 있는데, 무게의 표준 편차가 A는 <b>0.10 g</b>, B는 <b>0.20 g</b>이에요. 평균 무게는 조절할 수 있고요. 만든 셔틀콕의 <b>99% 이상</b>이 규격 안에 들게 해 주세요.”",
    predict: {
      q: "평균 무게를 규격의 한가운데(5.12 g)에 맞추면 어느 기계든 99% 이상 합격할까요?",
      options: ["㉠ 그렇다 — 평균만 맞으면 된다", "㉡ 아니다 — 표준 편차가 크면 평균이 맞아도 규격 밖으로 많이 벗어난다", "㉢ 평균과 관계없이 항상 불량이 없다"],
      answer: 1
    },
    task: "기계를 고르고 평균 무게를 조절해 합격률 <b>99% 이상</b>을 만드세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, sd = 0.2, mu = 4.9;
      function pass() { return Phi((5.50 - mu) / sd) - Phi((4.74 - mu) / sd); }
        function draw() {
        var K = window.sthKit, SP = window.sthSP19, LT = K.LT, CH = cv.H, p = pass(), ok = p >= 0.99;
        ctx.clearRect(0, 0, W, CH); K.studio(ctx, 0, 0, W, CH, { x: 760, y: 118, rx: 80, ry: 10 });
        K.card(ctx, 10, 10, 600, CH - 20, "과자 한 봉지의 무게 분포");
        var g = SP.chart(ctx, { x: 16, y: 48, w: 586, h: CH - 62, x0: 4.4, x1: 5.8, y0: 0, y1: 1.05, xt: 7, yt: 1, xf: function (v) { return v.toFixed(1) + " g"; }, yf: function () { return ""; }, pl: 20 });
        ctx.fillStyle = "rgba(15,159,118,.14)"; ctx.fillRect(g.X(4.74), g.T, g.X(5.50) - g.X(4.74), g.B - g.T);
        var pts = []; for (var gg = 4.4; gg <= 5.8; gg += 0.005) pts.push([gg, Math.exp(-Math.pow(gg - mu, 2) / (2 * sd * sd))]);
        ctx.fillStyle = "rgba(28,126,214,.15)"; ctx.beginPath(); ctx.moveTo(g.X(4.4), g.B); pts.forEach(function (q) { ctx.lineTo(g.X(q[0]), g.Y(q[1])); }); ctx.lineTo(g.X(5.8), g.B); ctx.closePath(); ctx.fill();
        SP.plot(ctx, g, pts, LT.blue);
        [4.74, 5.50].forEach(function (v) { K.line(ctx, { x: g.X(v), y: g.T }, { x: g.X(v), y: g.B }, LT.red, 1.6, [5, 4]); SP.lbl(ctx, v.toFixed(2) + " g", g.X(v), g.T + 12, { s: 10.5, a: "center", c: LT.red }); });
        /* 전자저울 미니어처 */
        var sx = 760, sy = 78;
        SP.poly(ctx, [{ x: sx - 50, y: sy + 10 }, { x: sx + 40, y: sy + 10 }, { x: sx + 56, y: sy - 4 }, { x: sx - 34, y: sy - 4 }], "#eef1f5");
        ctx.fillStyle = "#b5bfcc"; ctx.fillRect(sx - 50, sy + 10, 90, 18); SP.poly(ctx, [{ x: sx + 40, y: sy + 10 }, { x: sx + 56, y: sy - 4 }, { x: sx + 56, y: sy + 14 }, { x: sx + 40, y: sy + 28 }], "#8a96a8");
        ctx.fillStyle = "#1c2230"; ctx.fillRect(sx - 34, sy + 14, 44, 11); K.t(ctx, mu.toFixed(2), sx - 12, sy + 23, { s: 9.5, w: "900", a: "center", c: "#5affc0" });
        SP.poly(ctx, [{ x: sx - 24, y: sy }, { x: sx + 20, y: sy }, { x: sx + 30, y: sy - 8 }, { x: sx - 14, y: sy - 8 }], "#f59f00");
        SP.card(ctx, 624, 140, 262, CH - 152, null, [["기계", sd === 0.1 ? "A (σ 0.10 g)" : "B (σ 0.20 g)"], ["평균 무게", mu.toFixed(2) + " g", LT.blue], ["합격률", (p * 100).toFixed(2) + "%", ok ? LT.green : LT.red]], null, { top: 28, gap: 28 });
      }
    cv.canvas._redraw = draw;
      api.seg({ label: "기계", value: 0.2, options: [{ v: 0.1, t: "A · 표준 편차 0.10 g" }, { v: 0.2, t: "B · 표준 편차 0.20 g" }], onPick: function (x) { sd = +x; draw(); api.changed(); } });
      api.slider({ label: "평균 무게", min: 4.6, max: 5.6, step: 0.02, value: 4.9, fmt: function (x) { return x.toFixed(2) + " g"; }, onInput: function (x) { mu = Math.round(x * 100) / 100; draw(); api.changed(); } });
      api.info("종 모양 곡선은 셔틀콕 무게의 분포입니다. 초록 구간 밖으로 나간 넓이가 불량입니다.");
      draw();
      return {
        judge: function () {
          var p = pass();
          if (p >= 0.99) return { ok: true, msg: (sd === 0.1 ? "기계 A" : "기계 B") + " · 평균 " + mu.toFixed(2) + " g → 합격률 " + (p * 100).toFixed(2) + "%." };
          return { ok: false, msg: "합격률 " + (p * 100).toFixed(2) + "% — " + (sd === 0.2 ? "기계 B는 퍼짐이 커서 평균을 어디에 두어도 99%를 넘기 어렵습니다." : "평균을 규격 가운데 쪽으로 옮겨 보세요.") };
        }
      };
    },
    hints: ["기계 B는 평균을 한가운데 둬도 약 94%입니다.", "기계 A를 고르고 평균을 약 4.98~5.26 g 사이에 두세요."],
    solution: "<b>기계 A</b>, 평균 <b>약 4.98~5.26 g</b>.",
    why: "평균은 분포의 <b>중심</b>을, 표준 편차는 <b>퍼짐</b>을 알려 줍니다. 퍼짐이 큰 기계는 중심을 아무리 잘 맞춰도 규격 밖으로 벗어나는 제품이 많습니다. 공장의 품질 관리는 두 값을 함께 보고, 퍼짐을 줄이는 쪽으로 기계를 개선합니다.<br>※ 셔틀콕 무게 규격(4.74~5.50 g)은 세계 배드민턴 연맹 규칙에 따른 값이고, 기계의 표준 편차는 가상의 값입니다."
  },

  /* ------------------------------------------------------------------ 2. 결론의 평가: 상관과 인과 */
  {
    id: "c2", about: "04", tag: "결론 도출과 평가", title: "아이스크림이 물놀이 사고를 부른다?", short: "상관과 인과",
    who: "🍦", name: "지역 신문 데이터 기자",
    say: "“한 해 동안 날마다 모은 데이터를 보니 <b>아이스크림 판매량</b>이 많은 날일수록 <b>물놀이 사고</b>도 많았어요. 편집장님은 ‘아이스크림을 먹으면 사고가 난다’는 기사를 쓰라는데, 정말 그렇게 결론 내려도 될까요? 두 값에 함께 영향을 주는 <b>제3의 변인</b>이 있는지 확인해 주세요.”",
    predict: {
      q: "아이스크림 판매량과 물놀이 사고가 함께 늘어나는 까닭으로 가장 그럴듯한 것은?",
      options: ["㉠ 아이스크림이 수영 실력을 떨어뜨려서", "㉡ 더운 날에는 아이스크림도 많이 팔리고 물놀이도 많이 해서", "㉢ 사고가 나면 아이스크림을 사 먹어서"],
      answer: 1
    },
    task: "보기 방식을 바꾸고 기온대를 골라, 기온이 비슷한 날끼리 비교하면 두 값의 관계(상관 계수)가 <b>거의 0</b>(−0.2~0.2)이 되는 것을 확인하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, view = "all", band = 25;
      var D = [];
      [5, 10, 15, 20, 25, 30, 35].forEach(function (T) {
        [-32, -16, 0, 16, 32].forEach(function (ni) { [-1.2, -0.4, 0.4, 1.2].forEach(function (na) { D.push({ T: T, ice: 20 + 6 * T + ni, acc: Math.max(0, 0.25 * (T - 8) + na) }); }); });
      });
      function sub() { return view === "all" ? D : D.filter(function (d) { return Math.abs(d.T - band) <= 2.5; }); }
      function corr(a) { var n = a.length; if (n < 3) return 0; var mx = 0, my = 0; a.forEach(function (d) { mx += d.ice; my += d.acc; }); mx /= n; my /= n; var sxy = 0, sxx = 0, syy = 0; a.forEach(function (d) { sxy += (d.ice - mx) * (d.acc - my); sxx += (d.ice - mx) * (d.ice - mx); syy += (d.acc - my) * (d.acc - my); }); return sxy / Math.sqrt(sxx * syy); }
        function draw() {
        var K = window.sthKit, SP = window.sthSP19, LT = K.LT, CH = cv.H, a = sub(), r = corr(a), ok = Math.abs(r) <= 0.2;
        ctx.clearRect(0, 0, W, CH); K.studio(ctx, 0, 0, W, CH);
        K.card(ctx, 10, 10, 580, CH - 20, "아이스크림 판매량과 물놀이 사고");
        var g = SP.chart(ctx, { x: 16, y: 48, w: 566, h: CH - 62, x0: -20, x1: 250, y0: 0, y1: 8, xt: 5, yt: 4, pl: 34, xl: "아이스크림 판매량 →", yl: "물놀이 사고 ↑" });
        D.forEach(function (d) { var on = a.indexOf(d) >= 0, px = g.X(d.ice + (d.acc * 7 % 5)), py = g.Y(Math.min(8, d.acc)); if (on) K.planet(ctx, px, py, 4.5, "#ffb0a0", "#c0301a"); else { ctx.fillStyle = "rgba(92,112,134,.3)"; ctx.beginPath(); ctx.arc(px, py, 3, 0, 6.2832); ctx.fill(); } });
        /* 온도계 미니어처 */
        var tx = 740, ty = 40;
        ctx.fillStyle = "#e6ebf2"; ctx.beginPath(); ctx.roundRect(tx - 9, ty, 18, 100, 9); ctx.fill(); ctx.strokeStyle = "rgba(20,40,90,.3)"; ctx.stroke();
        var lvl = view === "all" ? 70 : 20 + band * 2;
        ctx.fillStyle = LT.red; ctx.fillRect(tx - 3, ty + 100 - lvl, 6, lvl); K.planet(ctx, tx, ty + 108, 13, "#ff8a8a", "#a8202e");
        K.t(ctx, view === "all" ? "모든 날" : (band - 2.5) + "~" + (band + 2.5) + " ℃", tx + 22, ty + 60, { s: 12, w: "900", c: LT.ink });
        SP.card(ctx, 604, 150, 282, CH - 162, null, [["날 수", a.length + "일"], ["상관 계수 r", r.toFixed(2), ok ? LT.green : LT.red]], [ok ? "기온을 같게 하니 관계가 사라졌다" : "강한 상관 — 원인일까?", ok], { top: 28, gap: 28 });
      }
    cv.canvas._redraw = draw;
      api.seg({ label: "보기", value: "all", options: [{ v: "all", t: "모든 날" }, { v: "band", t: "기온이 비슷한 날끼리" }], onPick: function (x) { view = x; draw(); api.changed(); } });
      api.slider({ label: "비교할 기온대의 가운데", min: 10, max: 30, step: 5, value: 25, fmt: function (x) { return x + " ℃ (±2.5)"; }, onInput: function (x) { band = x; draw(); api.changed(); } });
      api.info("상관 계수 r은 −1~1 사이의 값으로, 1에 가까울수록 함께 늘고 0에 가까울수록 관계가 없습니다.");
      draw();
      return {
        judge: function () {
          var r = corr(sub());
          if (view === "band" && Math.abs(r) <= 0.2) return { ok: true, msg: "기온이 비슷한 날끼리 보면 r = " + r.toFixed(2) + " — 아이스크림과 사고는 관계가 거의 없습니다. 둘 다 <b>기온</b> 때문에 함께 늘어난 것입니다." };
          return { ok: false, msg: view === "all" ? "모든 날을 함께 보면 r = " + r.toFixed(2) + " 로 강한 관계처럼 보입니다. 제3의 변인(기온)을 고정해 보세요." : "r = " + r.toFixed(2) + " — 다른 기온대도 살펴보세요." };
        }
      };
    },
    hints: ["‘기온이 비슷한 날끼리’로 바꾸세요.", "기온대를 10~30 ℃ 가운데 어디로 바꿔도, 기온이 같은 날끼리는 r이 0 가까이로 떨어집니다."],
    solution: "<b>기온이 비슷한 날끼리</b> 보기에서 기온대 하나를 고르면 r이 거의 0입니다.",
    why: "두 변인이 함께 변한다(<b>상관</b>)고 해서 하나가 다른 하나의 원인(<b>인과</b>)인 것은 아닙니다. 여기서는 기온이라는 제3의 변인이 둘을 함께 움직였습니다. 결론을 내린 뒤에는 이렇게 다른 설명이 가능한지 따져 <b>평가</b>해야 합니다. 인과를 확인하려면 다른 조건을 같게 둔 비교나 실험이 필요합니다.<br>※ 화면의 데이터는 수업을 위해 만든 값입니다."
  },

  /* ------------------------------------------------------------------ 3. 공공 데이터 가공 */
  {
    id: "c3", about: "01", tag: "공공 데이터 활용", title: "새 버스 정류장은 어디에", short: "정류장 위치",
    who: "🚌", name: "군청 교통과",
    say: "“2 km 길이의 마을 도로에 버스 정류장을 하나 새로 세우려 해요. 공공 데이터로 받은 마을별 인구는 아래와 같아요. 주민들이 정류장까지 걷는 거리의 <b>합이 가장 작아지는 곳</b>(±50 m)을 찾아 주세요.”<br>200 m 지점 300명 · 700 m 120명 · 1,100 m 500명 · 1,600 m 200명 · 1,900 m 80명",
    predict: {
      q: "걷는 거리의 합을 가장 작게 하는 정류장 위치는?",
      options: ["㉠ 도로의 한가운데(1,000 m)", "㉡ 사람 수로 가중치를 준 평균 위치", "㉢ 주민을 위치 순으로 줄 세웠을 때 가운데 사람이 사는 곳"],
      answer: 2
    },
    task: "정류장 위치를 옮겨 주민 전체가 걷는 거리의 합이 가장 작은 곳(±50 m)을 찾으세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(250), ctx = cv.ctx, W = cv.W, pos = 500;
      var V = [[200, 300], [700, 120], [1100, 500], [1600, 200], [1900, 80]];
      function total(p) { return V.reduce(function (a, q) { return a + q[1] * Math.abs(q[0] - p); }, 0); }
      var best = 1e18, bp = 0; for (var p = 0; p <= 2000; p += 10) { var tt = total(p); if (tt < best) { best = tt; bp = p; } }
        function draw() {
        var K = window.sthKit, SP = window.sthSP19, LT = K.LT, CH = cv.H, x0 = 40, x1 = 560, y = 150, t = total(pos), ok = Math.abs(pos - bp) <= 50;
        function X(m) { return x0 + m / 2000 * (x1 - x0); }
        ctx.clearRect(0, 0, W, CH); K.studio(ctx, 0, 0, W, CH, { x: 300, y: 214, rx: 280, ry: 14 });
        /* 마을 길 블록(입체 띠) + 마을마다 집 미니어처 */
        SP.poly(ctx, [{ x: x0 - 20, y: y + 20 }, { x: x1 + 20, y: y + 20 }, { x: x1 + 44, y: y - 30 }, { x: x0 + 4, y: y - 30 }], "#bcd59a");
        ctx.fillStyle = "#8a6a44"; ctx.fillRect(x0 - 20, y + 20, x1 - x0 + 40, 12);
        SP.poly(ctx, [{ x: x0 - 16, y: y + 10 }, { x: x1 + 18, y: y + 10 }, { x: x1 + 26, y: y - 6 }, { x: x0 - 8, y: y - 6 }], "#5b6474");
        ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = "#f5d36b"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0 - 12, y + 2); ctx.lineTo(x1 + 22, y + 2); ctx.stroke(); ctx.restore();
        V.forEach(function (q, qi) {
          var nh = Math.max(1, Math.round(q[1] / 80));
          for (var h = 0; h < nh; h++) { var hx = X(q[0]) - nh * 7 + h * 14 + 10, hy = y - 22 - (h % 2) * 6; SP.poly(ctx, [{ x: hx - 6, y: hy }, { x: hx + 6, y: hy }, { x: hx + 6, y: hy - 10 }, { x: hx - 6, y: hy - 10 }], "#efe7da"); SP.poly(ctx, [{ x: hx - 8, y: hy - 10 }, { x: hx + 8, y: hy - 10 }, { x: hx, y: hy - 18 }], "#c0553f"); }
          K.pill(ctx, q[1] + "명", X(q[0]) + 10, y - 50 - (qi % 2) * 14, { s: 10.5, a: "center", c: KC9(K) });
          K.t(ctx, q[0] + " m", X(q[0]), y + 48, { s: 10, w: "700", a: "center", c: LT.mute });
        });
        var px = X(pos);
        ctx.strokeStyle = "#3d4452"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(px, y + 14); ctx.lineTo(px, y - 34); ctx.stroke();
        ctx.fillStyle = "#1c7ed6"; ctx.beginPath(); ctx.roundRect(px - 14, y - 52, 28, 20, 5); ctx.fill(); K.t(ctx, "🚏", px, y - 37, { s: 13, a: "center" });
        K.t(ctx, "정류장 " + pos.toLocaleString() + " m", px, y - 60, { s: 11, w: "900", a: "center", c: LT.blue });
        SP.card(ctx, 600, 14, 286, CH - 28, "모두가 걷는 거리의 합", [["정류장 위치", pos.toLocaleString() + " m", LT.blue], ["걷는 거리 합", (t / 1000).toFixed(0) + " 명·km", ok ? LT.green : LT.red], ["1인 평균", (t / 1200).toFixed(0) + " m"]], [ok ? "걷는 거리 합이 가장 작은 곳" : "더 줄일 수 있다", ok], { top: 60, gap: 30 });
      }
      function KC9(K) { return K.C.ink; }
    cv.canvas._redraw = draw;
      api.slider({ label: "정류장 위치", min: 0, max: 2000, step: 10, value: 500, fmt: function (x) { return x.toLocaleString() + " m"; }, onInput: function (x) { pos = x; draw(); api.changed(); } });
      api.info("정류장을 조금 옮길 때 가까워지는 사람과 멀어지는 사람의 수를 비교해 보세요. 가까워지는 사람이 더 많으면 그쪽으로 옮기는 것이 낫습니다.");
      draw();
      return {
        judge: function () {
          if (Math.abs(pos - bp) <= 50) return { ok: true, msg: pos.toLocaleString() + " m — 걷는 거리 합이 가장 작습니다. 500명이 사는 1,100 m 마을이 전체 1,200명의 가운데 사람을 품고 있기 때문입니다." };
          return { ok: false, msg: pos.toLocaleString() + " m — 더 줄일 수 있습니다. 한쪽으로 조금씩 옮겨 합이 줄어드는지 보세요." };
        }
      };
    },
    hints: ["전체 1,200명을 위치 순으로 줄 세우면 600번째 사람은 어느 마을에 사나요?", "200 m에 300명, 700 m까지 420명, 1,100 m까지 920명 — 600번째는 1,100 m 마을입니다."],
    solution: "<b>1,050~1,150 m</b> (1,100 m 마을 근처).",
    why: "걷는 거리의 합이 가장 작은 곳은 사람들을 위치 순으로 세웠을 때의 <b>가운데(가중 중앙값)</b>입니다. 사람 수로 가중치를 준 평균 위치(약 972 m)나 도로의 한가운데(1,000 m)와는 다릅니다. 공공 데이터(인구)를 그대로 보는 대신 목적에 맞게 <b>가공</b>해야 올바른 답이 나옵니다. 실제 정류장 위치는 여기에 안전·도로 폭·노선도 함께 따져 정합니다."
  }
  ]
});
})();
