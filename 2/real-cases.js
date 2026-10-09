/* 융합과학 탐구 Ⅱ 융합과학 탐구의 과정 — 실제 자료
   r1 우리 학교에서 나침반은 진북에서 몇 도 어긋날까 — 세계 자기장 모형(WMM2025)의 편각
   r2 지구 자기장은 땅속으로 몇 도 기울어 있을까 — 수평·연직 성분으로 복각 구하기
   자료: data/wmm-school.js (WMM2025, 영국 지질조사국 계산 서비스) */
(function () {
"use strict";
var M = window.REAL_WMM || { D: -8.43, I: 51.2, F: 49639, H: 31087, Z: 38699, X: 30751, Y: -4559, dD: -2.5, date: "2026-10-03" };
var IC = Math.atan2(M.Z, M.H) * 180 / Math.PI;
var SRC = "<small>출처: 세계 자기장 모형 WMM2025(미국 NOAA NCEI · 영국 지질조사국), " + M.date + " 학교 근처(북위 35.13°, 동경 128.70°) 해발 0 m 값. 실제 학교 안에서는 철근·전선·컴퓨터 때문에 값이 달라질 수 있습니다. 사본은 data/wmm-school.js.</small>";
function deg(d) { return (d < 0 ? "서쪽 " : "동쪽 ") + Math.abs(d).toFixed(1) + "°"; }

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 우리 학교 자기장 지도의 기준값과 측정 오차를 설명해 보세요.",
  cases: [
  {
    id: "r1", tag: "실제 자료 · 편각", title: "우리 학교에서 나침반은 몇 도 어긋날까", short: "편각",
    who: "🧭", name: "학교 자기장 지도 동아리",
    say: "“나침반 바늘은 정확히 북극(진북)을 가리키지 않아요. 세계 자기장 모형으로 계산한 <b>우리 학교 근처의 자기장 성분</b>입니다. 북쪽 성분 X와 동쪽 성분 Y로 <b>편각</b>(나침반 북쪽이 진북에서 어긋난 각)을 구해 주세요. 편각 = arctan(Y ÷ X)이고, 음수면 서쪽입니다.”",
    predict: {
      q: "우리나라에서 나침반의 N 극은 진북에 비해 어느 쪽을 가리킬까요?",
      options: ["㉠ 정확히 진북", "㉡ 진북보다 조금 서쪽", "㉢ 진북보다 조금 동쪽"],
      answer: 1
    },
    task: "편각을 슬라이더로 맞추세요(± 0.5°, 서쪽은 음수).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(280), ctx = cv.ctx, W = cv.W, d = 0;
      function draw() {
        H.paper(ctx, W, cv.H);
        var cx = 220, cy = 140, R = 110;
        ctx.save(); ctx.strokeStyle = H.v("--line"); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
        H.text(ctx, "진북", cx, cy - R - 8, { s: 12, w: "900", a: "center" }); H.text(ctx, "동", cx + R + 14, cy + 4, { s: 12, w: "900", a: "center" }); H.text(ctx, "서", cx - R - 14, cy + 4, { s: 12, w: "900", a: "center" });
        H.line(ctx, [[cx, cy], [cx, cy - R]], H.v("--line"), 2);
        var a = (d - 90) * Math.PI / 180; H.arrow(ctx, cx, cy, cx + Math.cos(a) * (R - 8), cy + Math.sin(a) * (R - 8), H.v("--coral-700"), 4, 12);
        H.text(ctx, "내가 맞춘 나침반 북쪽 " + deg(d), cx, cy + R + 22, { s: 12, w: "800", a: "center", c: H.v("--coral-700") });
        H.rows(ctx, 470, 40, [["북쪽 성분 X", M.X.toLocaleString() + " nT"], ["동쪽 성분 Y", M.Y.toLocaleString() + " nT"], ["내 답 (편각)", d.toFixed(1) + "°", null, true]], 60);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "편각", min: -20, max: 20, step: 0.1, value: 0, fmt: function (x) { return x.toFixed(1) + "°"; }, onInput: function (x) { d = x; api.changed(); draw(); } });
      api.info("nT(나노테슬라)는 자기장의 세기 단위입니다. Y가 음수면 자기장이 서쪽으로 기울어 있다는 뜻입니다. " + SRC
        + "<div data-link='{\"id\":\"noaa-wmm\",\"title\":\"NOAA 자기장 계산기\",\"src\":\"미국 해양대기청 NCEI\",\"url\":\"https://www.ngdc.noaa.gov/geomag/calculators/magcalc.shtml\",\"ask\":\"우리 학교의 위도·경도를 넣고 편각(Declination)을 계산해, 이 사례의 값과 비교해 오세요. 해마다 얼마나(도 또는 분, 1° = 60′) 변한다고 나오는지도 적어 오세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(d - M.D) <= 0.5 + 1e-9) return { ok: true, msg: "arctan(" + M.Y + " ÷ " + M.X + ") ≈ " + M.D.toFixed(1) + "° — 나침반 북쪽이 진북보다 서쪽으로 약 " + Math.abs(M.D).toFixed(1) + "° 어긋납니다. 해마다 약 " + Math.abs(M.dD) + "′ 씩 더 서쪽으로 갑니다." };
          return { ok: false, msg: d.toFixed(1) + "°는 맞지 않습니다. Y ÷ X를 먼저 계산하고 arctan을 구하세요(음수면 서쪽)." };
        }
      };
    },
    hints: ["Y ÷ X = " + (M.Y / M.X).toFixed(3) + " 입니다.", "arctan(" + (M.Y / M.X).toFixed(3) + ") ≈ ? (계산기 tan⁻¹)"],
    solution: "약 <b>" + M.D.toFixed(1) + "°</b> (진북보다 서쪽으로 " + Math.abs(M.D).toFixed(1) + "°).",
    why: "지구의 자기 북극은 지리상 북극과 떨어져 있고 해마다 움직입니다. 그래서 지역마다 나침반이 가리키는 방향이 진북과 다르며, 우리나라는 서쪽으로 약 8~9° 어긋납니다. 등산 지도나 항해 지도에 편각을 적어 두는 까닭입니다.<br>"
      + "학교 자기장 지도를 만들 때 스마트폰 자기 센서로 잰 방향이 이 기준값과 크게 다르면, 그곳에 철근·전선·금속 같은 ‘자기 이상’이 있다는 뜻입니다. 기준값을 알아야 측정이 의미를 가집니다."
  },
  {
    id: "r2", tag: "실제 자료 · 복각", title: "지구 자기장은 땅속으로 몇 도 기울어 있을까", short: "복각",
    who: "📱", name: "스마트폰 센서 탐구팀",
    say: "“자기장은 수평으로만 놓여 있지 않고 땅속으로 비스듬히 들어가요. 같은 모형의 <b>수평 성분 H</b>와 <b>연직 성분 Z</b>로 <b>복각</b>(자기장이 수평면과 이루는 각)을 구해 주세요. 복각 = arctan(Z ÷ H).”",
    predict: {
      q: "우리나라에서 자기장은 수평면에 대해 어떻게 기울어 있을까요?",
      options: ["㉠ 거의 수평이다", "㉡ 땅속으로 비스듬히(수십 도) 기울어 있다", "㉢ 거의 수직이다"],
      answer: 1
    },
    task: "복각을 슬라이더로 맞추세요(± 0.5°).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(260), ctx = cv.ctx, W = cv.W, a = 20;
      function draw() {
        H.paper(ctx, W, cv.H);
        var x0 = 80, y0 = 60, L = 185;
        H.line(ctx, [[40, y0], [440, y0]], H.v("--line"), 2); H.text(ctx, "땅 (수평면)", 40, y0 - 8, { s: 11, w: "800", c: H.v("--mist") });
        var r = a * Math.PI / 180; H.arrow(ctx, x0, y0, x0 + Math.cos(r) * L, y0 + Math.sin(r) * L, H.v("--coral-700"), 4, 12);
        H.text(ctx, "내가 맞춘 자기장 방향 " + a.toFixed(1) + "°", x0 + 140, y0 - 30, { s: 11.5, w: "800", c: H.v("--coral-700") });
        H.rows(ctx, 520, 40, [["수평 성분 H", M.H.toLocaleString() + " nT"], ["연직 성분 Z (아래로)", M.Z.toLocaleString() + " nT"], ["전체 세기 F", M.F.toLocaleString() + " nT"], ["내 답 (복각)", a.toFixed(1) + "°", null, true]], 52);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "복각", min: 0, max: 90, step: 0.1, value: 20, fmt: function (x) { return x.toFixed(1) + "°"; }, onInput: function (x) { a = x; api.changed(); draw(); } });
      api.info("스마트폰 자기 센서 앱으로 x·y·z 성분을 재어 보면 비슷한 값(수십 μT = 수만 nT)이 나옵니다. 1 μT = 1,000 nT. " + SRC);
      draw();
      return {
        judge: function () {
          if (Math.abs(a - IC) <= 0.5 + 1e-9) return { ok: true, msg: "arctan(" + M.Z + " ÷ " + M.H + ") ≈ " + IC.toFixed(1) + "° — 자기장이 땅속으로 약 " + Math.round(IC) + "° 기울어 들어갑니다." };
          return { ok: false, msg: a.toFixed(1) + "°는 맞지 않습니다. Z ÷ H를 계산한 뒤 arctan을 구하세요." };
        }
      };
    },
    hints: ["Z ÷ H = " + (M.Z / M.H).toFixed(3) + " 입니다.", "arctan(" + (M.Z / M.H).toFixed(3) + ") ≈ ?"],
    solution: "약 <b>" + IC.toFixed(1) + "°</b>.",
    why: "지구 자기장은 자기 적도에서는 수평에 가깝고, 자극으로 갈수록 땅속으로 깊이 기울어 자극에서는 수직이 됩니다. 북위 35° 인 우리나라에서는 약 51° 기울어 있습니다. 철새와 바다거북은 이 복각과 세기를 느껴 길을 찾는다고 알려져 있습니다.<br>"
      + "탐구에서 측정값을 믿으려면 이렇게 ‘이론값(모형값)’과 비교하고, 차이가 나면 그 까닭(주변 금속, 센서 보정, 기울어진 휴대폰)을 따져 보아야 합니다."
  }
  ]
});
})();
