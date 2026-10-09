/* 융합과학 탐구 Ⅲ 과학기술 사회와 융합과학 탐구 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 난제 해결: 싱크홀 센서 */
  {
    id: "c1", tag: "난제 해결 · 비용", title: "땅꺼짐을 미리 알리는 센서 줄", short: "싱크홀 센서",
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
        H.paper(ctx, W, cv.H);
        var s = spec(), x0 = 40, x1 = 580, y = 130;
        function X(m) { return x0 + m / L * (x1 - x0); }
        H.text(ctx, "하수관 1,200 m", x0, 40, { s: 12, w: "800", c: H.v("--mist") });
        H.box(ctx, x0, y - 10, x1 - x0, 20, H.v("--rose"), 0.28);
        for (var i = 0; i < n; i++) {
          var p = (i + 0.5) * L / n;
          H.box(ctx, X(Math.max(0, p - s.r)), y - 10, X(Math.min(L, p + s.r)) - X(Math.max(0, p - s.r)), 20, H.v("--green"), 0.45);
          H.dot(ctx, X(p), y, n > 30 ? 3 : 5, H.v("--brand"));
        }
        H.text(ctx, "0 m", x0, y + 36, { s: 10.5, w: "700", a: "center", c: H.v("--mist") });
        H.text(ctx, "1,200 m", x1, y + 36, { s: 10.5, w: "700", a: "center", c: H.v("--mist") });
        H.text(ctx, "초록: 감시되는 구간   분홍: 빈틈", x0, 215, { s: 11.5, w: "700", c: H.v("--mist") });
        var cv_ = cover(), co = cost();
        H.rows(ctx, 640, 40, [["센서", s.t + " × " + n + "개"], ["감시 비율", (cv_ * 100).toFixed(0) + "%", cv_ >= 1 ? "--green-700" : "--rose-700", true], ["총비용", co + "만 원", co <= 200 ? "--green-700" : "--rose-700", true]], 62);
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
    id: "c2", tag: "연구 진실성", title: "열 가지 지표, 하나만 나와도 발표?", short: "여러 번 분석",
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
        H.paper(ctx, W, cv.H);
        var x0 = 60, x1 = 580, y0 = 30, y1 = 225, bw = (x1 - x0) / 20;
        function Y(p) { return y1 - p / 0.7 * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        for (var k = 1; k <= 20; k++) {
          var p = Math.min(0.7, fw(k));
          H.box(ctx, x0 + (k - 1) * bw + 3, Y(p), bw - 6, y1 - Y(p), k === K ? H.v("--brand") : H.v("--mist"), k === K ? 0.9 : 0.35);
          if (k % 5 === 0 || k === 1) H.text(ctx, String(k), x0 + (k - 0.5) * bw, y1 + 16, { s: 10.5, w: "700", a: "center", c: H.v("--mist") });
        }
        H.dash(ctx, x0, Y(0.05), x1, Y(0.05), H.v("--rose"), 1.5);
        H.text(ctx, "5%", x0 - 8, Y(0.05) + 4, { s: 10.5, w: "800", a: "right", c: H.v("--rose-700") });
        H.text(ctx, "50%", x0 - 8, Y(0.5) + 4, { s: 10.5, w: "700", a: "right", c: H.v("--mist") });
        H.text(ctx, "분석한 지표 수", x1, y1 + 34, { s: 11, w: "700", a: "right", c: H.v("--mist") });
        H.text(ctx, "적어도 하나 거짓 발견될 확률", x0 + 6, y0 - 10, { s: 11, w: "700", c: H.v("--mist") });
        var f = fw(K);
        H.rows(ctx, 640, 50, [["지표 하나의 기준", a.toFixed(1) + "%"], ["지표 10가지 분석", "10개"], ["하나라도 걸릴 확률", (f * 100).toFixed(1) + "%", f <= 0.05 + 1e-9 ? "--green-700" : "--rose-700", true]], 58);
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
    id: "c3", tag: "시민 과학 · 데이터 품질", title: "철새를 세는 주말 조사단", short: "시민 조사단",
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
        H.paper(ctx, W, cv.H);
        var x0 = 60, x1 = 580, y0 = 30, y1 = 225;
        function X(k) { return x0 + (k - 1) / 59 * (x1 - x0); }
        function Y(e) { return y1 - Math.min(e, 32) / 32 * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        [["no", 30], ["yes", 12]].forEach(function (c) {
          var pts = []; for (var k = 1; k <= 60; k++) pts.push([X(k), Y(c[1] / Math.sqrt(k))]);
          H.line(ctx, pts, c[0] === tr ? H.v("--brand") : H.v("--mist"), c[0] === tr ? 3 : 1.5);
        });
        H.text(ctx, "교육 없음", X(8), Y(30 / Math.sqrt(8)) - 10, { s: 10.5, w: "800", c: tr === "no" ? H.v("--brand") : H.v("--mist") });
        H.text(ctx, "교육 받음", X(3) + 6, Y(12 / Math.sqrt(3)) + 16, { s: 10.5, w: "800", c: tr === "yes" ? H.v("--brand") : H.v("--mist") });
        H.dash(ctx, x0, Y(5), x1, Y(5), H.v("--rose"), 1.5);
        H.text(ctx, "5%", x0 - 8, Y(5) + 4, { s: 10.5, w: "800", a: "right", c: H.v("--rose-700") });
        if (n <= 60) H.dot(ctx, X(n), Y(err()), 6, H.v("--amber"));
        H.text(ctx, "참여 인원", x1, y1 + 18, { s: 11, w: "700", a: "right", c: H.v("--mist") });
        H.text(ctx, "평균값의 오차(%)", x0 + 6, y0 - 10, { s: 11, w: "700", c: H.v("--mist") });
        var e = err(), h = hours();
        H.rows(ctx, 640, 40, [["조사단", (tr === "yes" ? "교육 받음" : "교육 없음") + " · " + n + "명"], ["평균값의 오차", e.toFixed(1) + "%", e <= 5 + 1e-9 ? "--green-700" : "--rose-700", true], ["봉사 시간", h + "시간", h <= 40 ? "--green-700" : "--rose-700", true]], 62);
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
