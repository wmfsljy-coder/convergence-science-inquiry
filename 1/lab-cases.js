/* 융합과학 탐구 Ⅰ 융합과학 탐구의 이해 — 응용 실험실
   이야기에서 찾은 개념을 처음 보는 상황에 써 본다. 공용 엔진: ../assets/lab.js (sthLab) */
(function () {
"use strict";

window.sthLab({
  mount: "lab", key: "lab", result: "rLab",
  cases: [

  /* ------------------------------------------------------------------ 1. 물리학 + 의학 */
  {
    id: "c1", tag: "융합 · 물리학과 의학", title: "소리로 몸속을 보는 초음파", short: "초음파 영상",
    who: "🩺", name: "병원 영상의학과",
    say: "“초음파 검사기는 몸에 소리를 보내고 되돌아오는 메아리를 들어 영상을 만들어요. 소리는 몸의 부드러운 조직에서 1초에 약 <b>1,540 m</b> 를 갑니다. 피부에서 <b>8 cm</b> 깊이에 있는 장기를 보려면, 소리를 보낸 뒤 몇 마이크로초(μs) 뒤에 돌아온 메아리를 들어야 할까요?”",
    predict: {
      q: "초음파 검사기가 깊이를 계산하는 원리와 가장 비슷한 것은?",
      options: ["㉠ 박쥐가 내는 소리의 메아리로 먹이의 거리를 아는 것", "㉡ 사진기가 빛을 모아 상을 맺는 것", "㉢ 체온계가 열을 재는 것"],
      answer: 0
    },
    task: "메아리를 듣는 시간을 조절해 <b>8 cm</b> 깊이(±0.2 cm)의 장기를 영상에 담으세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(260), ctx = cv.ctx, W = cv.W, t = 40;
      function depth(us) { return 1540 * us * 1e-6 / 2 * 100; }
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 80, y0 = 40, s = 18, d = depth(t);
        H.box(ctx, x0, y0, 400, 12 * s, H.v("--coral-100"), 1);
        H.box(ctx, x0 + 120, y0 + 7.4 * s, 160, 1.2 * s, H.v("--rose"), 0.7);
        H.text(ctx, "장기 (8 cm)", x0 + 200, y0 + 8.3 * s, { s: 11.5, w: "800", a: "center" });
        H.box(ctx, x0 + 170, y0 - 22, 60, 22, H.v("--mist"), 1);
        H.text(ctx, "탐촉자", x0 + 200, y0 - 7, { s: 10.5, w: "800", a: "center", c: H.v("--on-accent") });
        H.dash(ctx, x0, y0 + d * s, x0 + 400, y0 + d * s, H.v("--brand"), 2);
        H.arrow(ctx, x0 + 200, y0 + 2, x0 + 200, Math.min(y0 + d * s, y0 + 12 * s), H.v("--brand"), 2, 8);
        [0, 4, 8, 12].forEach(function (c) { H.text(ctx, c + " cm", x0 - 8, y0 + c * s + 4, { s: 10, a: "right", c: H.v("--mist") }); });
        var ok = Math.abs(d - 8) <= 0.2;
        H.rows(ctx, 560, 60, [["메아리 시간", t + " μs"], ["계산된 깊이", d.toFixed(2) + " cm", ok ? "--green-700" : "--rose-700", true]], 70);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "메아리를 듣는 시간", min: 20, max: 200, step: 1, value: 40, fmt: function (x) { return x + " μs"; }, onInput: function (x) { t = x; draw(); api.changed(); } });
      api.info("깊이 = 소리의 속력 × 시간 ÷ 2. 소리는 장기까지 갔다가 돌아오므로 2로 나눕니다. 1 μs = 100만 분의 1초.");
      draw();
      return {
        judge: function () {
          var d = depth(t);
          if (Math.abs(d - 8) <= 0.2) return { ok: true, msg: t + " μs → 깊이 " + d.toFixed(2) + " cm — 장기가 선명하게 잡힙니다." };
          return { ok: false, msg: t + " μs → 깊이 " + d.toFixed(2) + " cm — " + (d < 8 ? "너무 얕은 곳을 보고 있습니다." : "너무 깊은 곳을 보고 있습니다.") };
        }
      };
    },
    hints: ["왕복 거리는 16 cm = 0.16 m 입니다.", "시간 = 0.16 ÷ 1,540 초 ≈ 104 μs."],
    solution: "약 <b>102 ~ 106 μs</b>.",
    why: "초음파 영상은 <b>물리학</b>(파동의 반사와 속력), <b>공학</b>(탐촉자와 신호 처리), <b>의학</b>(장기의 생김새 판단)이 만난 융합 기술입니다. 박쥐와 돌고래가 메아리로 거리를 재는 방식, 배가 바다 깊이를 재는 음향 측심과도 원리가 같습니다. 방사선을 쓰지 않아 임신부 검사에도 널리 쓰입니다."
  },

  /* ------------------------------------------------------------------ 2. 데이터 · 표본 크기 */
  {
    id: "c2", tag: "데이터 · 표본 크기", title: "여론 조사, 몇 명에게 물을까", short: "표본 크기",
    who: "📊", name: "청소년 여론 조사 동아리",
    say: "“전교생에게 ‘급식 메뉴 투표제’ 찬반을 조사하려는데, 모두에게 묻기는 어려워요. 무작위로 뽑은 n 명에게 물으면 결과가 실제와 다를 수 있는 폭(95% 신뢰 수준의 오차 한계)은 약 <b>0.98 ÷ √n</b> 이래요. 오차 한계를 <b>±3.1%p 이하</b>로 하되, 설문 비용을 아끼려면 필요 이상 많이 묻지 않아야 해요(1,100명 이하).”",
    predict: {
      q: "표본을 4배로 늘리면 오차 한계는 어떻게 될까요?",
      options: ["㉠ 4분의 1로 준다", "㉡ 절반으로 준다", "㉢ 변하지 않는다"],
      answer: 1
    },
    task: "조사 인원을 조절해 오차 한계 <b>±3.1%p 이하</b>, 인원 <b>1,100명 이하</b>를 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(260), ctx = cv.ctx, W = cv.W, n = 200;
      function moe(k) { return 0.98 / Math.sqrt(k) * 100; }
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 60, x1 = 540, y0 = 30, y1 = 220;
        function X(k) { return x0 + (k - 100) / 2900 * (x1 - x0); }
        function Y(m) { return y1 - m / 10 * (y1 - y0); }
        H.axes(ctx, x0, y0, x1, y1);
        var pts = []; for (var k = 100; k <= 3000; k += 20) pts.push([X(k), Y(Math.min(10, moe(k)))]);
        H.line(ctx, pts, H.v("--brand"), 2.5);
        H.dash(ctx, x0, Y(3.1), x1, Y(3.1), H.v("--amber"), 1.5);
        H.text(ctx, "±3.1%p", x1 + 4, Y(3.1) + 4, { s: 10.5, w: "800", c: H.v("--amber-700") });
        H.dot(ctx, X(n), Y(Math.min(10, moe(n))), 6, H.v("--coral"));
        [100, 1000, 2000, 3000].forEach(function (k) { H.text(ctx, k + "명", X(k), y1 + 16, { s: 10, a: "center", c: H.v("--mist") }); });
        var ok = moe(n) <= 3.1 + 1e-9 && n <= 1100;
        H.rows(ctx, 620, 60, [["조사 인원", n.toLocaleString() + "명"], ["오차 한계", "±" + moe(n).toFixed(2) + "%p", ok ? "--green-700" : "--rose-700", true]], 70);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "조사 인원", min: 100, max: 3000, step: 50, value: 200, fmt: function (x) { return x.toLocaleString() + "명"; }, onInput: function (x) { n = x; draw(); api.changed(); } });
      api.info("오차 한계는 √n 에 반비례합니다. 인원이 많을수록 줄지만, 줄어드는 속도는 점점 느려집니다.");
      draw();
      return {
        judge: function () {
          var m = moe(n);
          if (m <= 3.1 + 1e-9 && n <= 1100) return { ok: true, msg: n.toLocaleString() + "명 → ±" + m.toFixed(2) + "%p. 신문의 여론 조사가 흔히 1,000명에게 묻는 까닭입니다." };
          return { ok: false, msg: n.toLocaleString() + "명 → ±" + m.toFixed(2) + "%p — " + (m > 3.1 ? "오차가 아직 큽니다." : "필요보다 많이 묻고 있습니다.") };
        }
      };
    },
    hints: ["0.98 ÷ √n ≤ 0.031 → √n ≥ 31.6.", "n ≥ 약 1,000명."],
    solution: "<b>1,000 ~ 1,100명</b>.",
    why: "데이터가 많을수록 우연한 오차가 서로 상쇄되어 결과를 더 믿을 수 있습니다(큰 수의 법칙). 그러나 오차는 √n 에 반비례해, 오차를 절반으로 줄이려면 4배의 인원이 필요합니다. 또 아무리 많이 물어도 표본이 한쪽으로 치우치면(예: 한 반에서만 조사) 오차가 줄지 않습니다 — 크기와 <b>대표성</b>이 함께 중요합니다."
  },

  /* ------------------------------------------------------------------ 3. 디지털 도구 · 측정 주기 */
  {
    id: "c3", tag: "디지털 탐구 도구", title: "슬로 모션으로 공을 잡아라", short: "촬영 속도",
    who: "🎥", name: "과학 탐구 동아리",
    say: "“스마트폰 카메라로 초속 <b>20 m</b> 로 날아가는 공을 찍어 속력을 분석하려 해요. 한 장면과 다음 장면 사이에 공이 <b>10 cm 넘게</b> 움직이면 공의 궤적을 정확히 이을 수 없어요. 그렇다고 너무 빠르게 찍으면 파일이 커지고 화면이 어두워져요. 1초에 몇 장(fps)으로 찍어야 할까요? (240 fps 이하로)”",
    predict: {
      q: "촬영 속도(1초에 찍는 장수)를 2배로 하면 장면 사이 공의 이동 거리는?",
      options: ["㉠ 2배가 된다", "㉡ 절반이 된다", "㉢ 변하지 않는다"],
      answer: 1
    },
    task: "촬영 속도를 조절해 장면 사이 이동 거리 <b>10 cm 이하</b>, 촬영 속도 <b>240 fps 이하</b>를 맞추세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(240), ctx = cv.ctx, W = cv.W, fps = 60;
      function gap(f) { return 20 / f * 100; }
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 40, sc = 2.2, g = gap(fps);
        H.text(ctx, "장면마다 찍힌 공의 위치 (0.5 m 구간)", x0, 30, { s: 12.5, w: "800" });
        for (var d = 0; d <= 50 + 1e-9; d += g) H.dot(ctx, x0 + d * sc * 3, 120, 9, H.v("--coral"));
        H.line(ctx, [[x0, 150], [x0 + 150 * sc, 150]], H.v("--line"), 1.5);
        H.text(ctx, "0", x0, 168, { s: 10, c: H.v("--mist") }); H.text(ctx, "50 cm", x0 + 150 * sc, 168, { s: 10, a: "right", c: H.v("--mist") });
        var ok = g <= 10 + 1e-9 && fps <= 240;
        H.rows(ctx, 620, 60, [["촬영 속도", fps + " fps"], ["장면 사이 이동", g.toFixed(1) + " cm", ok ? "--green-700" : "--rose-700", true]], 70);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "촬영 속도 (1초에 찍는 장수)", min: 30, max: 480, step: 30, value: 60, fmt: function (x) { return x + " fps"; }, onInput: function (x) { fps = x; draw(); api.changed(); } });
      api.info("장면 사이 이동 거리 = 속력 ÷ 촬영 속도. 20 m/s 를 cm 로 바꾸면 2,000 cm/s.");
      draw();
      return {
        judge: function () {
          var g = gap(fps);
          if (g <= 10 + 1e-9 && fps <= 240) return { ok: true, msg: fps + " fps → 장면마다 " + g.toFixed(1) + " cm. 공의 궤적을 촘촘히 이을 수 있습니다." };
          return { ok: false, msg: fps + " fps → 장면마다 " + g.toFixed(1) + " cm — " + (g > 10 ? "공이 너무 멀리 건너뜁니다." : "240 fps 보다 빠르면 파일이 너무 커집니다.") };
        }
      };
    },
    hints: ["2,000 cm/s ÷ fps ≤ 10 cm.", "fps ≥ 200. 이 슬라이더에서는 210 또는 240."],
    solution: "<b>210 ~ 240 fps</b>.",
    why: "디지털 탐구 도구의 측정 주기는 대상이 얼마나 빨리 변하는지에 맞춰야 합니다. 건물 흔들림을 재는 센서처럼, 카메라도 대상이 한 번 움직이는 동안 충분히 여러 번 찍어야 변화를 제대로 기록합니다. 스마트폰의 슬로 모션 기능(120~240 fps)은 이런 탐구에 바로 쓸 수 있는 디지털 도구입니다."
  }
  ]
});
})();
