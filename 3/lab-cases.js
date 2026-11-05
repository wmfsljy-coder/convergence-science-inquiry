/* 융합과학 탐구 Ⅲ 과학기술 사회와 융합과학 탐구 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 난제 해결: 싱크홀 센서 */
  {
    id: "c1", about: "02", tag: "난제 해결 · 비용", title: "땅꺼짐을 미리 알리는 센서 줄", short: "싱크홀 센서",
    who: "🕳️", name: "구청 도로안전과",
    say: "“낡은 하수관 <b>1,200 m</b> 구간에서 땅꺼짐이 자주 일어나요. 땅속 진동·수분 센서를 관을 따라 빈틈없이 달고 싶은데, 예산은 <b>200만 원</b>뿐이에요. 센서는 두 종류예요. <b>보급형</b>은 앞뒤 20 m를 감시하고 한 개에 6만 원, <b>고성능</b>은 앞뒤 60 m를 감시하고 한 개에 25만 원이에요.”",
    predict: {
      q: "관 전체를 빈틈없이 감시하려면 어느 센서가 더 싸게 먹힐까요?",
      options: ["㉠ 고성능 — 감시 범위가 세 배나 넓으니까", "㉡ 보급형 — 감시 1 m 당 비용이 더 싸니까", "㉢ 두 센서의 총비용은 항상 같다"],
      answer: 1
    },
    task: "센서 종류와 개수를 정해 관 <b>1,200 m</b> 전체를 감시하면서 예산 <b>200만 원</b> 안에 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(260), ctx = cv.ctx, W = cv.W, L = 1200, type = "hi", n = 6;
      function spec() { return type === "hi" ? { r: 60, c: 25, t: "고성능" } : { r: 20, c: 6, t: "보급형" }; }
      function cover() { var s = spec(); return Math.min(1, n * 2 * s.r / L); }
      function cost() { return n * spec().c; }
        function draw() {
        var K = window.sthKit, SP = window.sthSP19, LT = K.LT, CH = cv.H, s = spec(), x0 = 40, x1 = 580, y = 150, cv_ = cover(), co = cost();
        function X(m) { return x0 + m / L * (x1 - x0); }
        ctx.clearRect(0, 0, W, CH); K.studio(ctx, 0, 0, W, CH, { x: 310, y: 236, rx: 290, ry: 14 });
        /* 땅을 잘라 본 블록 + 하수관(원통) + 센서 */
        var DX = 22, DY = -16;
        SP.poly(ctx, [{ x: x0 - 20, y: 74 }, { x: x1 + 20, y: 74 }, { x: x1 + 20 + DX, y: 74 + DY }, { x: x0 - 20 + DX, y: 74 + DY }], "#9cc46e");
        var gg = ctx.createLinearGradient(0, 74, 0, 216); gg.addColorStop(0, "#b08a5e"); gg.addColorStop(1, "#6e4f32"); ctx.fillStyle = gg; ctx.fillRect(x0 - 20, 74, x1 - x0 + 40, 142);
        SP.poly(ctx, [{ x: x1 + 20, y: 74 }, { x: x1 + 20 + DX, y: 74 + DY }, { x: x1 + 20 + DX, y: 216 + DY }, { x: x1 + 20, y: 216 }], "#5a3f28");
        [[120, 74], [300, 74], [470, 74]].forEach(function (b) { SP.poly(ctx, [{ x: b[0], y: b[1] }, { x: b[0] + 50, y: b[1] }, { x: b[0] + 50, y: b[1] - 30 }, { x: b[0], y: b[1] - 30 }], "#e9ecf2"); SP.poly(ctx, [{ x: b[0], y: b[1] - 30 }, { x: b[0] + 50, y: b[1] - 30 }, { x: b[0] + 60, y: b[1] - 38 }, { x: b[0] + 10, y: b[1] - 38 }], "#c5cedb"); });
        var pg = ctx.createLinearGradient(0, y - 14, 0, y + 14); pg.addColorStop(0, "#c9d0da"); pg.addColorStop(.4, "#f1f3f6"); pg.addColorStop(1, "#7d8796");
        ctx.fillStyle = pg; ctx.fillRect(x0, y - 14, x1 - x0, 28);
        ctx.fillStyle = "rgba(224,49,49,.25)"; ctx.fillRect(x0, y - 14, x1 - x0, 28);
        for (var i = 0; i < n; i++) {
          var p = (i + 0.5) * L / n, a1 = X(Math.max(0, p - s.r)), b1 = X(Math.min(L, p + s.r));
          ctx.fillStyle = "rgba(15,159,118,.55)"; ctx.fillRect(a1, y - 14, b1 - a1, 28);
          SP.poly(ctx, [{ x: X(p) - 5, y: y - 14 }, { x: X(p) + 5, y: y - 14 }, { x: X(p) + 5, y: y - 24 }, { x: X(p) - 5, y: y - 24 }], "#1c2230");
          ctx.fillStyle = "#1c7ed6"; ctx.beginPath(); ctx.arc(X(p), y - 19, n > 30 ? 1.5 : 2.5, 0, 6.2832); ctx.fill();
        }
        ctx.fillStyle = "#5c6b8a"; ctx.beginPath(); ctx.ellipse(x0, y, 7, 14, 0, 0, 6.2832); ctx.fill(); ctx.fillStyle = "#2a303b"; ctx.beginPath(); ctx.ellipse(x0, y, 4, 10, 0, 0, 6.2832); ctx.fill();
        K.t(ctx, "0 m", x0, y + 34, { s: 10.5, w: "800", a: "center", c: "#fff4dc" });
        K.t(ctx, "1,200 m", x1, y + 34, { s: 10.5, w: "800", a: "center", c: "#fff4dc" });
        K.pill(ctx, "하수관 1,200 m · 초록 = 감시되는 구간 · 분홍 = 빈틈", 16, CH - 12, { s: 11, c: K.C.ink });
        SP.card(ctx, 620, 14, 266, CH - 28, "땅속 하수관 감시 센서", [["센서", s.t + " × " + n + "개"], ["감시 비율", (cv_ * 100).toFixed(0) + "%", cv_ >= 1 ? LT.green : LT.red], ["총비용", co + "만 원", co <= 200 ? LT.green : LT.red]], [cv_ >= 1 && co <= 200 ? "빈틈없이 · 예산 안" : "빈틈이나 예산 초과", cv_ >= 1 && co <= 200], { top: 60, gap: 30 });
      }
    cv.canvas._redraw = draw;
      api.seg({ label: "센서 종류", value: "hi", options: [{ v: "hi", t: "고성능 · ±60 m · 25만 원" }, { v: "lo", t: "보급형 · ±20 m · 6만 원" }], onPick: function (x) { type = x; draw(); api.changed(); } });
      api.slider({ label: "센서 개수", min: 1, max: 40, step: 1, value: 6, fmt: function (x) { return x + "개"; }, onInput: function (x) { n = Math.round(x); draw(); api.changed(); } });
      api.info("센서는 관을 따라 같은 간격으로 놓입니다. 한 개가 감시하는 길이는 반경의 두 배입니다.");
      draw();
      return {
        judge: function () {
          var c = cover(), co = cost(), s = spec();
          if (c >= 1 && co <= 200) return { ok: true, msg: s.t + " " + n + "개 → 빈틈 없이 감시, 총 " + co + "만 원." };
          if (c < 1) return { ok: false, msg: "아직 " + ((1 - c) * 100).toFixed(0) + "%가 비어 있습니다. 1,200 m ÷ (반경 × 2) 개가 필요합니다." };
          return { ok: false, msg: "총 " + co + "만 원 — 예산을 넘었어요. " + (type === "hi" ? "고성능은 최소 10개(250만 원)가 필요합니다." : "개수를 줄여 보세요.") };
        }
      };
    },
    hints: ["고성능은 1,200 ÷ 120 = 10개 → 250만 원, 보급형은 1,200 ÷ 40 = 30개 → 180만 원입니다.", "보급형을 30~33개 고르세요."],
    solution: "<b>보급형 30~33개</b> (30개면 180만 원).",
    why: "감시 1 m 당 비용은 보급형 6 ÷ 40 = 0.15만 원, 고성능 25 ÷ 120 ≈ 0.21만 원입니다. 성능이 좋은 기술이 늘 좋은 해결책은 아니며, 난제를 풀 때는 <b>효과와 비용</b>을 함께 따져야 합니다. 실제 도시에서는 센서 데이터에 지하 공간 지도·강수량 같은 자료를 결합해 위험 구간을 우선 감시합니다.<br>※ 센서의 감시 범위와 가격은 계산을 위한 가상의 값입니다."
  },

  /* ------------------------------------------------------------------ 2. 연구 윤리: 여러 번 분석하기 */
  {
    id: "c2", about: "03", tag: "연구 진실성", title: "열 가지 지표, 하나만 나와도 발표?", short: "여러 번 분석",
    who: "🧪", name: "건강 음료 연구팀",
    say: "“새 음료가 건강에 좋은지 <b>10가지 지표</b>(혈압, 수면, 집중력 …)를 모두 분석할 거예요. 보통은 한 지표에서 우연히 ‘효과 있음’이 나올 확률(유의 기준)을 5%로 두는데, 그러면 효과가 전혀 없어도 어느 하나는 우연히 걸릴 수 있다고 들었어요. 10가지를 다 분석해도 <b>하나라도 우연히 걸릴 확률이 5% 이하</b>가 되도록 지표마다 기준을 정해 주세요.”",
    predict: {
      q: "지표마다 기준을 5%로 두고 10가지를 분석하면, 효과가 없어도 적어도 하나가 ‘효과 있음’으로 나올 확률은?",
      options: ["㉠ 5% 그대로", "㉡ 약 40%", "㉢ 100%"],
      answer: 1
    },
    task: "지표 하나의 유의 기준을 조절해 10가지를 모두 분석할 때 <b>하나라도 우연히 ‘효과 있음’으로 걸릴 확률이 5% 이하</b>가 되게 하세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, a = 5, K = 10;
      function fw(k) { return 1 - Math.pow(1 - a / 100, k); }
        function draw() {
        var KT = window.sthKit, SP = window.sthSP19, LT = KT.LT, CH = cv.H, f = fw(K), ok = f <= 0.05 + 1e-9;
        ctx.clearRect(0, 0, W, CH); KT.studio(ctx, 0, 0, W, CH);
        KT.card(ctx, 10, 10, 600, CH - 20, "적어도 하나 거짓 발견될 확률");
        var x0 = 60, x1 = 580, y0 = 50, y1 = 226, bw = (x1 - x0) / 20, DX = 6, DY = -5;
        function Y(p) { return y1 - p / 0.7 * (y1 - y0); }
        ctx.fillStyle = "rgba(255,255,255,.85)"; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
        for (var k = 1; k <= 20; k++) {
          var p = Math.min(0.7, fw(k)), xx = x0 + (k - 1) * bw + 3, w = bw - 9, top = Y(p), c = SP.mt(k === K ? "blue" : "#b8c2d0");
          SP.poly(ctx, [{ x: xx + w, y: y1 }, { x: xx + w + DX, y: y1 + DY }, { x: xx + w + DX, y: top + DY }, { x: xx + w, y: top }], c[2]);
          SP.poly(ctx, [{ x: xx, y: top }, { x: xx + w, y: top }, { x: xx + w + DX, y: top + DY }, { x: xx + DX, y: top + DY }], c[0]);
          ctx.fillStyle = c[1]; ctx.fillRect(xx, top, w, y1 - top);
          if (k % 5 === 0 || k === 1) KT.t(ctx, String(k), x0 + (k - 0.5) * bw, y1 + 16, { s: 10.5, w: "700", a: "center", c: LT.mute });
        }
        KT.line(ctx, { x: x0, y: Y(0.05) }, { x: x1, y: Y(0.05) }, LT.red, 1.6, [5, 4]);
        KT.t(ctx, "5%", x0 - 8, Y(0.05) + 4, { s: 10.5, w: "900", a: "right", c: LT.red });
        KT.t(ctx, "50%", x0 - 8, Y(0.5) + 4, { s: 10.5, w: "700", a: "right", c: LT.mute });
        KT.t(ctx, "분석한 지표 수", x1, y1 + 32, { s: 11, w: "700", a: "right", c: LT.mute });
        SP.card(ctx, 624, 14, 262, CH - 28, "지표 10가지를 함께 볼 때", [["지표 하나의 기준", a.toFixed(1) + "%"], ["지표 수", "10개"], ["하나라도 걸릴 확률", (f * 100).toFixed(1) + "%", ok ? LT.green : LT.red]], [ok ? "전체 5% 이하로 지켰다" : "우연히 걸릴 확률이 크다", ok], { top: 60, gap: 30 });
      }
    cv.canvas._redraw = draw;
      api.slider({ label: "지표 하나의 유의 기준", min: 0.1, max: 5, step: 0.1, value: 5, fmt: function (x) { return x.toFixed(1) + "%"; }, onInput: function (x) { a = Math.round(x * 10) / 10; draw(); api.changed(); } });
      api.info("막대는 효과가 전혀 없을 때, 분석한 지표 가운데 적어도 하나가 우연히 ‘효과 있음’으로 나올 확률입니다.");
      draw();
      return {
        judge: function () {
          var f = fw(K);
          if (f <= 0.05 + 1e-9) return { ok: true, msg: "기준 " + a.toFixed(1) + "% → 10가지 가운데 하나라도 우연히 걸릴 확률 " + (f * 100).toFixed(1) + "%." };
          return { ok: false, msg: "하나라도 우연히 걸릴 확률 " + (f * 100).toFixed(1) + "% — 지표 하나의 기준을 더 엄격하게(작게) 하세요." };
        }
      };
    },
    hints: ["1 − (1 − 기준)¹⁰ ≤ 0.05가 되어야 합니다.", "대략 5% ÷ 10 = 0.5% 이하로 두면 됩니다."],
    solution: "지표 하나의 기준을 <b>0.5% 이하</b>로 (0.5%면 약 4.9%).",
    why: "분석을 여러 번 하면 우연히 ‘효과 있음’이 나올 기회도 늘어납니다. 5% 기준으로 10번 분석하면 약 40% 확률로 적어도 하나가 걸립니다. 그 하나만 골라 발표하는 것은 <b>선택적 보고</b>로, 연구 진실성(정직성·개방성)을 어기는 일입니다. 그래서 연구자는 무엇을 몇 번 분석할지 미리 공개하고, 분석 횟수만큼 기준을 엄격하게 합니다(기준 ÷ 분석 횟수 — 본페로니 보정)."
  },

  /* ------------------------------------------------------------------ 3. 시민 과학: 인원과 교육 */
  {
    id: "c3", about: "04", tag: "시민 과학 · 데이터 품질", title: "철새를 세는 주말 조사단", short: "시민 조사단",
    who: "🦢", name: "하천 생태 모임",
    say: "“겨울 철새 수를 시민들이 함께 세요. 한 사람이 센 값은 실제보다 <b>평균 30%</b> 쯤 틀리는데, 한 시간 교육을 받으면 <b>12%</b>로 줄어요. 여러 사람이 센 값을 평균하면 오차가 줄어든다고 해요. 평균값의 오차를 <b>5% 이하</b>로 만들고 싶어요. 봉사 시간은 모두 합쳐 <b>40시간</b>까지 쓸 수 있어요. 조사는 한 사람당 1시간, 교육을 받으면 1시간이 더 들어요.”",
    predict: {
      q: "참여자를 4배로 늘리면 평균값의 오차는 어떻게 될까요?",
      options: ["㉠ 1/4로 줄어든다", "㉡ 1/2로 줄어든다", "㉢ 변하지 않는다"],
      answer: 1
    },
    task: "교육 여부와 참여 인원을 정해 평균값의 오차 <b>5% 이하</b>, 봉사 시간 <b>40시간 이하</b>를 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, tr = "no", n = 10;
      function sd() { return tr === "yes" ? 12 : 30; }
      function err() { return sd() / Math.sqrt(n); }
      function hours() { return n * (tr === "yes" ? 2 : 1); }
        function draw() {
        var K = window.sthKit, SP = window.sthSP19, LT = K.LT, CH = cv.H, e = err(), h = hours(), ok = e <= 5 + 1e-9 && h <= 40;
        ctx.clearRect(0, 0, W, CH); K.studio(ctx, 0, 0, W, CH);
        K.card(ctx, 10, 10, 600, CH - 20, "참여 인원과 평균값의 오차(%)");
        var g = SP.chart(ctx, { x: 16, y: 48, w: 586, h: CH - 62, x0: 1, x1: 60, y0: 0, y1: 32, xt: 6, yt: 4, xf: function (v) { return Math.round(v) + "명"; }, yf: function (v) { return v + "%"; }, pl: 40 });
        [["no", 30], ["yes", 12]].forEach(function (c) { var pts = []; for (var k = 1; k <= 60; k++) pts.push([k, Math.min(32, c[1] / Math.sqrt(k))]); SP.plot(ctx, g, pts, c[0] === tr ? LT.blue : "#b8c2d0", { w: c[0] === tr ? 3 : 1.8, glow: false }); });
        SP.lbl(ctx, "교육 없음", g.X(8) + 6, g.Y(30 / Math.sqrt(8)) - 8, { s: 10.5, c: tr === "no" ? LT.blue : LT.mute });
        SP.lbl(ctx, "교육 받음", g.X(3) + 8, g.Y(12 / Math.sqrt(3)) + 16, { s: 10.5, c: tr === "yes" ? LT.blue : LT.mute });
        K.line(ctx, { x: g.L, y: g.Y(5) }, { x: g.R, y: g.Y(5) }, LT.red, 1.6, [5, 4]);
        SP.lbl(ctx, "5%", g.R - 4, g.Y(5) - 6, { s: 10.5, a: "right", c: LT.red });
        if (n <= 60) { ctx.fillStyle = ok ? LT.green : LT.orange; ctx.beginPath(); ctx.arc(g.X(n), g.Y(Math.min(32, e)), 6.5, 0, 6.2832); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke(); }
        for (var q = 0; q < Math.min(n, 24); q++) { var hx = 650 + (q % 12) * 19, hy = 46 + Math.floor(q / 12) * 26; ctx.fillStyle = tr === "yes" ? "#0f9f76" : "#7d8fc0"; ctx.beginPath(); ctx.roundRect(hx - 5, hy, 10, 12, [5, 5, 2, 2]); ctx.fill(); K.planet(ctx, hx, hy - 4, 4, "#f6d2b4", "#b47a50"); }
        SP.card(ctx, 624, 104, 262, CH - 116, null, [["조사단", (tr === "yes" ? "교육 받음" : "교육 없음") + " · " + n + "명"], ["평균값의 오차", e.toFixed(1) + "%", e <= 5 + 1e-9 ? LT.green : LT.red], ["봉사 시간", h + "시간", h <= 40 ? LT.green : LT.red]], null, { top: 30, gap: 28 });
      }
    cv.canvas._redraw = draw;
      api.seg({ label: "사전 교육", value: "no", options: [{ v: "no", t: "교육 없음 · 오차 30%" }, { v: "yes", t: "교육 1시간 · 오차 12%" }], onPick: function (x) { tr = x; draw(); api.changed(); } });
      api.slider({ label: "참여 인원", min: 1, max: 60, step: 1, value: 10, fmt: function (x) { return x + "명"; }, onInput: function (x) { n = Math.round(x); draw(); api.changed(); } });
      api.info("평균값의 오차 = 한 사람의 오차 ÷ √(인원). 곡선 위의 점이 지금 조사단입니다.");
      draw();
      return {
        judge: function () {
          var e = err(), h = hours();
          if (e <= 5 + 1e-9 && h <= 40) return { ok: true, msg: (tr === "yes" ? "교육 받은 " : "교육 없이 ") + n + "명 → 오차 " + e.toFixed(1) + "%, 봉사 " + h + "시간." };
          if (e > 5 + 1e-9) return { ok: false, msg: "오차 " + e.toFixed(1) + "% — 인원을 늘리거나 교육으로 한 사람의 오차를 줄여 보세요." };
          return { ok: false, msg: "봉사 " + h + "시간 — 40시간을 넘었어요. 오차 5%를 지키는 최소 인원을 찾아보세요." };
        }
      };
    },
    hints: ["교육 없이: 30 ÷ √n ≤ 5 → n ≥ 36명 (36시간).", "교육 받으면: 12 ÷ √n ≤ 5 → n ≥ 6명 (12시간). 둘 다 가능합니다."],
    solution: "<b>교육 없이 36~40명</b> 또는 <b>교육 받고 6~20명</b>. 교육을 받으면 봉사 시간이 1/3 이하로 줄어듭니다.",
    why: "여러 사람이 독립적으로 잰 값을 평균하면 오차가 <b>√(인원)</b>에 반비례해 줄어듭니다. 그래서 시민 과학은 참여자가 많을수록 데이터가 믿을 만해집니다. 하지만 한 사람의 정확도를 높이는 <b>교육</b>은 훨씬 적은 인원으로 같은 품질을 얻게 해 줍니다. 참여의 양과 질을 함께 설계하는 것이 시민 과학의 핵심입니다.<br>※ 개인 오차 30%·12%는 계산을 위한 가상의 값이며, 실제로는 모든 사람이 같은 방향으로 틀리는 치우침은 평균해도 줄지 않습니다."
  }
  ]
});
})();
