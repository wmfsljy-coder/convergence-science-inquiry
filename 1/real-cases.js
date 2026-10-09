/* 융합과학 탐구 Ⅰ 융합과학 탐구의 이해 — 실제 자료
   r1 두 병동은 얼마나 달랐나 — 빈 종합병원 제1·제2병동의 산모 사망률(1841~1846)
   r2 차이가 사라진 해 — 손 씻기 뒤 두 병동의 사망률이 같아진 때
   r3 데이터 품질 — 2026년 창원 40.4 °C는 잘못 잰 값일까
   자료: data/semmelweis.js (제멜바이스 1861), data/cw155.js, data/cw-dg-2026.js */
(function () {
"use strict";
var S = window.REAL_SEMM || { yearly: [] };
var Y = S.yearly;                                     /* [연도, 제1 출산, 제1 사망, 제2 출산, 제2 사망] */
function row(y) { for (var i = 0; i < Y.length; i++) if (Y[i][0] === y) return Y[i]; return [y, 1, 0, 1, 0]; }
function r1(r) { return r[1] ? r[2] / r[1] * 100 : 0; }
function r2(r) { return r[3] ? r[4] / r[3] * 100 : 0; }
var SUM = [0, 0, 0, 0]; Y.forEach(function (r) { if (r[0] >= 1841 && r[0] <= 1846) for (var k = 0; k < 4; k++) SUM[k] += r[k + 1]; });
var P1 = SUM[0] ? SUM[1] / SUM[0] * 100 : 9.9, P2 = SUM[2] ? SUM[3] / SUM[2] * 100 : 3.9, RAT = P1 / P2;
var CLOSE = 1848; for (var y = 1847; y <= 1858; y++) { var q = row(y); if (r1(q) <= r2(q) * 1.2) { CLOSE = y; break; } }
var SRC = "<small>출처: 이그나츠 제멜바이스(1861) 『산욕열의 원인, 개념, 예방』의 표 — 빈 종합병원 산과 제1병동(의사·의대생)과 제2병동(조산사)의 해마다 출산 수와 산욕열 사망 수, 1833~1858. 위키백과(CC BY-SA)에 옮겨 적힌 값. 사본은 data/semmelweis.js.</small>";
var ZH = (window.REAL_CW155 || {}).heat2026 || [], ZDG = ((window.REAL_CWDG || {}).dg || []);
function zDg(md) { for (var i = 0; i < ZDG.length; i++) if (ZDG[i][0] === md) return ZDG[i][2]; return null; }
var ZPK = 0; ZH.forEach(function (r, i) { if (r[1] > ZH[ZPK][1]) ZPK = i; });
var Z_NB = ZH.length > 4 ? (ZH[ZPK - 2][1] + ZH[ZPK - 1][1] + ZH[ZPK + 1][1] + ZH[ZPK + 2][1]) / 4 : 38.45, Z_GAP = ZH.length ? ZH[ZPK][1] - Z_NB : 1.95;
function zMd(md) { return +md.slice(0, 2) + "월 " + (+md.slice(3)) + "일"; }
var SRC_Z = "<small>출처: 기상청 날씨누리 과거 관측 일별 자료 — 창원(155)·대구(143) 2026년 날마다 최고 기온. 사본은 data/cw155.js, data/cw-dg-2026.js.</small>";

function chart(H, ctx, W, CH, a, b, pick) {
  H.paper(ctx, W, CH);
  var x0 = 60, x1 = 600, y0 = 26, y1 = CH - 36, n = b - a + 1, bw = (x1 - x0) / n;
  function Yv(v) { return y1 - v / 17 * (y1 - y0); }
  H.axes(ctx, x0, y0, x1, y1);
  [0, 5, 10, 15].forEach(function (v) { H.text(ctx, v + "%", x0 - 6, Yv(v) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
  for (var y = a; y <= b; y++) {
    var r = row(y), x = x0 + (y - a) * bw, on = pick === y;
    H.box(ctx, x + bw * 0.12, Yv(r1(r)), bw * 0.36, y1 - Yv(r1(r)), H.v("--rose-700"), on ? 1 : 0.75);
    H.box(ctx, x + bw * 0.52, Yv(r2(r)), bw * 0.36, y1 - Yv(r2(r)), H.v("--brand"), on ? 1 : 0.75);
    if (on) { ctx.save(); ctx.strokeStyle = H.v("--amber-700"); ctx.lineWidth = 2; ctx.strokeRect(x + 2, y0, bw - 4, y1 - y0); ctx.restore(); }
    if (n <= 12 || (y - a) % 2 === 0) H.text(ctx, y, x + bw / 2, y1 + 15, { s: 10, a: "center", c: H.v("--mist") });
  }
  H.text(ctx, "산모 사망률 — 빨강: 제1병동(의사·의대생), 파랑: 제2병동(조산사)", x0 + 6, y0 - 10, { s: 11, w: "700", c: H.v("--mist") });
}

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 비교 집단을 두고 원인을 좁혀 가는 탐구 방법을 설명해 보세요.",
  cases: [
  {
    id: "r1", sec: "03", tag: "실제 자료 · 비교 집단", title: "두 병동은 얼마나 달랐나", short: "두 병동",
    who: "🏥", name: "빈 종합병원 기록실",
    say: "“같은 병원, 같은 도시의 두 병동인데 소문이 달랐어요. 산모들은 제1병동에 가지 않으려고 울며 빌었다고 합니다. 제멜바이스가 남긴 <b>실제 기록</b>으로 <b>1841~1846년</b> 6년을 합쳐 두 병동의 사망률을 구하고, 제1병동이 제2병동의 <b>몇 배</b>였는지 알려 주세요.”",
    predict: {
      q: "두 병동의 사망률이 다르다면, 원인을 찾기 위해 먼저 무엇을 따져야 할까요?",
      options: ["㉠ 두 병동에서 다른 점(누가 아기를 받는지 등)", "㉡ 두 병동에서 같은 점만", "㉢ 날씨"],
      answer: 0
    },
    task: "제1병동 사망률 ÷ 제2병동 사망률 을 슬라이더로 맞추세요(± 0.2).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, g = 1;
      function draw() {
        chart(H, ctx, W, cv.H, 1841, 1846, null);
        H.rows(ctx, 640, 30, [["제1병동 6년 출산 · 사망", SUM[0].toLocaleString() + " · " + SUM[1].toLocaleString()], ["제2병동 6년 출산 · 사망", SUM[2].toLocaleString() + " · " + SUM[3].toLocaleString()], ["내 답 (몇 배)", g.toFixed(1) + " 배", null, true]], 62);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "제1병동은 제2병동의 몇 배", min: 1, max: 6, step: 0.1, value: 1, fmt: function (x) { return x.toFixed(1) + " 배"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("사망률 = 사망 ÷ 출산 × 100. 두 병동은 날마다 번갈아 산모를 받아서, 어느 병동에 가는지는 거의 우연이었어요 — 그래서 두 병동은 좋은 비교 집단이 됩니다. " + SRC
        + "<div data-map='{\"id\":\"vienna-akh\",\"name\":\"옛 빈 종합병원 (오스트리아 빈, 지금은 빈 대학 캠퍼스)\",\"lat\":48.2155,\"lng\":16.3545,\"zoom\":17,\"ask\":\"옛 빈 종합병원 건물을 지도에서 찾아보세요. 여러 개의 안뜰로 이어진 건물 모양을 보고, 해부실과 산과 병동을 오가던 의사들의 움직임을 상상해 한두 문장으로 적어 오세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(g - RAT) <= 0.2 + 1e-9) return { ok: true, msg: "제1병동 " + P1.toFixed(1) + "%, 제2병동 " + P2.toFixed(1) + "% — 약 " + RAT.toFixed(1) + " 배입니다. 제1병동에서는 열 명 가운데 한 명꼴로 산모가 죽었습니다." };
          return { ok: false, msg: g.toFixed(1) + " 배는 맞지 않습니다. 6년을 합친 사망률을 각각 구해 나누세요." };
        }
      };
    },
    hints: ["제1병동: " + SUM[1] + " ÷ " + SUM[0] + " × 100 ≈ " + P1.toFixed(1) + "%.", "제2병동: " + SUM[3] + " ÷ " + SUM[2] + " × 100. 제1 ÷ 제2 = ?"],
    solution: "약 <b>" + RAT.toFixed(1) + " 배</b> (" + P1.toFixed(1) + "% 대 " + P2.toFixed(1) + "%).",
    why: "두 병동의 가장 큰 차이는 아기를 받는 사람이었습니다. 제1병동은 아침마다 시신을 해부한 뒤 오는 의사·의대생이, 제2병동은 해부를 하지 않는 조산사가 맡았습니다. 제멜바이스는 분만 자세, 신부의 종소리, 붐비는 정도 같은 다른 가능성을 하나씩 지워 가다가, 1847년 동료 콜레치카가 해부 중 손을 베인 뒤 산욕열과 같은 증상으로 죽자 ‘시체에서 온 무엇’을 의심하게 되었습니다.<br>"
      + "의학·통계·생물학이 만난 이 탐구는, 비교 집단을 두고 다른 점을 하나씩 따지는 것이 원인을 좁히는 강력한 방법임을 보여 줍니다."
  },
  {
    id: "r2", sec: "03", tag: "실제 자료 · 가설 검증", title: "차이가 사라진 해", short: "같아진 해",
    who: "🧼", name: "제멜바이스",
    say: "“1847년 5월부터 제1병동의 의사와 의대생은 염소 용액으로 손을 씻었어요. 내 가설이 맞다면 두 병동의 차이가 사라져야 합니다. 1847년부터 해마다 보며, 제1병동 사망률이 <b>제2병동과 거의 같아진(1.2 배 이하) 첫해</b>를 찾아 주세요.”",
    predict: {
      q: "손 씻기 뒤 두 병동의 차이가 사라진다면, 그것은 무엇을 뒷받침할까요?",
      options: ["㉠ 두 병동의 차이가 아기를 받는 사람의 손에서 왔다는 가설", "㉡ 날씨가 원인이라는 가설", "㉢ 아무것도 뒷받침하지 않는다"],
      answer: 0
    },
    task: "제1병동 사망률이 제2병동의 1.2 배 이하가 된 첫해를 고르세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, y = 1841;
      function draw() {
        chart(H, ctx, W, cv.H, 1841, 1858, y);
        var r = row(y);
        H.rows(ctx, 640, 30, [["고른 해", y + "년", "--amber-700"], ["제1병동 · 제2병동", r1(r).toFixed(2) + "% · " + r2(r).toFixed(2) + "%"], ["제1 ÷ 제2", (r2(r) ? r1(r) / r2(r) : 0).toFixed(2) + " 배", null, true]], 62);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "연도", min: 1841, max: 1858, step: 1, value: 1841, fmt: function (x) { return x + "년"; }, onInput: function (x) { y = x; api.changed(); draw(); } });
      api.info("1847년은 5월 중순에야 손 씻기를 시작했으니, 그해 전체 값에는 손 씻기 전 몇 달이 섞여 있어요. 1849년 이후 값도 함께 보세요. " + SRC);
      draw();
      return {
        judge: function () {
          var r = row(y), k = r2(r) ? r1(r) / r2(r) : 9;
          if (y === CLOSE) { var c = row(CLOSE); return { ok: true, msg: CLOSE + "년 제1병동 " + r1(c).toFixed(2) + "%, 제2병동 " + r2(c).toFixed(2) + "% — 처음으로 두 병동이 거의 같아졌습니다. 제1병동의 사망률은 1846년 " + r1(row(1846)).toFixed(1) + "%에서 열 분의 1 쯤으로 떨어졌어요." }; }
          if (y < 1847) return { ok: false, msg: y + "년은 손 씻기 전입니다. 1847년부터 보세요." };
          if (y < CLOSE) return { ok: false, msg: y + "년은 " + k.toFixed(1) + " 배로 아직 차이가 큽니다. 그다음 해는요?" };
          return { ok: false, msg: y + "년(" + k.toFixed(2) + " 배)보다 먼저 같아진 해가 있어요." };
        }
      };
    },
    hints: ["1847년부터 한 해씩 옮기며 오른쪽 ‘제1 ÷ 제2’를 보세요.", "1847년은 손 씻기를 한 해의 중간에 시작했어요. 그다음 해는?"],
    solution: "<b>" + CLOSE + "년</b>.",
    why: "가설에서 끌어낸 예측(‘손을 씻으면 두 병동의 차이가 사라진다’)이 실제 자료로 확인되었습니다. 하지만 제멜바이스는 왜 손을 씻어야 하는지 설명할 이론(세균)을 갖지 못했고, 자료를 늦게 발표했으며, 반대하는 의사들과 크게 다투었습니다. 1849년 그가 제1병동을 떠나고(1850년에는 빈도 떠났어요) 1850년대에는 두 병동 모두 사망률이 다시 오르내렸습니다(1854년 제1병동 9.1%, 제2병동 6.2%). 비교 집단도 함께 오를 때는 원인을 한쪽(손 씻기가 느슨해진 것)에만 돌리기 어렵다는 점도 이 자료가 주는 교훈입니다.<br>"
      + "좋은 증거만으로는 부족하고, 원리를 설명하는 이론과 설득하는 소통이 함께해야 과학 지식이 받아들여진다는 것을 보여 주는 사례입니다."
  },
  {
    id: "r3", sec: "03", tag: "실제 자료 · 데이터 품질", title: "40.4 °C는 잘못 잰 값일까", short: "이상값 확인",
    who: "📍", name: "창원기상대(기상청)",
    say: "“2026년 " + (ZH.length ? zMd(ZH[ZPK][0]) : "8월 1일") + ", 진해와 가까운 <b>창원기상대</b>의 낮 최고 기온은 <b>" + (ZH.length ? ZH[ZPK][1] : 40.4) + " °C</b>로 1985년 관측을 시작한 뒤 가장 높았습니다. 자료를 정리하다 보면 이렇게 튀는 값을 만나요. 기계 고장으로 잘못 잰 값이면 지워야 하고, 진짜 극단이면 꼭 남겨야 합니다. 먼저 <b>그날 값이 앞뒤 이틀(나흘)의 평균보다 몇 °C 높은지</b> 구해 주세요.”",
    predict: {
      q: "다른 값과 동떨어진 값(이상값)을 만났을 때 가장 먼저 할 일은?",
      options: ["㉠ 평균을 흐리니 바로 지운다", "㉡ 앞뒤 날, 가까운 다른 관측소 같은 다른 증거와 견주어 진짜인지 확인한다", "㉢ 가장 눈에 띄니 그대로 크게 발표한다"],
      answer: 1
    },
    task: "그래프의 값으로 <b>그날 최고 기온 − 앞뒤 이틀(4일)의 평균</b>을 슬라이더로 맞추세요(± 0.2 °C).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(290), ctx = cv.ctx, W = cv.W, k = 0;
      var x0 = 50, x1 = 640, y0 = 24, y1 = 250, n = ZH.length || 1;
      function X(i) { return x0 + i / (n - 1) * (x1 - x0); }
      function Y(t) { return y1 - (t - 28) / 14 * (y1 - y0); }
      function draw() {
        H.paper(ctx, W, cv.H); H.axes(ctx, x0, y0, x1, y1);
        [30, 33, 36, 39, 42].forEach(function (t) { H.text(ctx, t + "°", x0 - 8, Y(t) + 4, { s: 10, a: "right", c: H.v("--mist") }); H.dash(ctx, x0, Y(t), x1, Y(t), H.v("--line"), 0.5); });
        H.line(ctx, ZH.map(function (r, i) { return [X(i), Y(zDg(r[0]) || 28)]; }), H.v("--brand"), 2);
        H.line(ctx, ZH.map(function (r, i) { return [X(i), Y(r[1])]; }), H.v("--coral-700"), 2.5);
        ZH.forEach(function (r, i) {
          H.dot(ctx, X(i), Y(r[1]), Math.abs(i - ZPK) <= 2 ? 4 : 2.5, H.v("--coral-700"));
          if (Math.abs(i - ZPK) <= 2) H.text(ctx, r[1].toFixed(1), X(i), Y(r[1]) - 8, { s: 11, w: "800", a: "center", c: H.v("--coral-700") });
          if (i % 4 === 0) H.text(ctx, zMd(r[0]), X(i), y1 + 15, { s: 10, a: "center", c: H.v("--mist") });
        });
        H.box(ctx, 680, 30, 12, 12, H.v("--coral-700")); H.text(ctx, "창원(바닷가)", 698, 41, { s: 12, w: "800" });
        H.box(ctx, 680, 52, 12, 12, H.v("--brand")); H.text(ctx, "대구(내륙)", 698, 63, { s: 12, w: "800" });
        H.rows(ctx, 680, 96, [["대구의 그 무렵 최고", Math.max.apply(null, ZH.map(function (r) { return zDg(r[0]) || 0; })).toFixed(1) + " °C", "--brand"], ["내 답 (차이)", "+" + k.toFixed(1) + " °C", null, true]], 56);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "그날 − 앞뒤 이틀 평균", min: 0, max: 6, step: 0.1, value: 0, fmt: function (x) { return "+" + x.toFixed(1) + " °C"; }, onInput: function (x) { k = x; api.changed(); draw(); } });
      api.info("앞뒤 이틀 = 그날 앞의 이틀과 뒤의 이틀, 모두 나흘입니다. " + SRC_Z
        + "<div data-link='{\"id\":\"kma-cw155-aug\",\"title\":\"창원 2026년 8월 일별 기온\",\"src\":\"기상청 날씨누리\",\"url\":\"https://www.weather.go.kr/w/weather/land/past-obs/obs-by-day.do?stn=155&yy=2026&mm=8&obs=1\",\"ask\":\"8월 1일의 최고 기온과 최저 기온을 확인하고, 지점을 부산으로 바꿔 같은 날 값을 찾아 오세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (Math.abs(k - Z_GAP) <= 0.2) return { ok: true, msg: "앞뒤 나흘 평균 " + Z_NB.toFixed(2) + " °C보다 " + Z_GAP.toFixed(1) + " °C 높습니다. 앞뒤 날도 37 ~ 39.5 °C였으니 혼자 튄 값이 아닙니다." };
          return { ok: false, msg: "+" + k.toFixed(1) + " °C는 " + (k < Z_GAP ? "작습니다" : "큽니다") + ". 그날을 뺀 앞뒤 나흘의 값을 더해 4로 나눈 뒤 빼 보세요." };
        }
      };
    },
    hints: ["앞뒤 나흘: " + (ZH.length > 4 ? [ZH[ZPK - 2][1], ZH[ZPK - 1][1], ZH[ZPK + 1][1], ZH[ZPK + 2][1]].join(" + ") : "") + " = ?", "그 합 ÷ 4 를 " + (ZH.length ? ZH[ZPK][1] : 40.4) + "에서 빼세요."],
    solution: (ZH.length ? ZH[ZPK][1] : 40.4) + " − " + Z_NB.toFixed(2) + " ≈ <b>+" + Z_GAP.toFixed(1) + " °C</b>.",
    why: "그날 값은 앞뒤 날보다 2 °C쯤 높을 뿐, 앞뒤 날도 37 ~ 39.5 °C의 불볕더위였습니다. 같은 무렵 내륙의 대구도 최고 " + Math.max.apply(null, ZH.map(function (r) { return zDg(r[0]) || 0; })).toFixed(1) + " °C까지 올랐습니다. 여러 증거가 ‘큰 폭염이 실제로 있었다’를 가리키므로, 이 값은 지울 이상값이 아니라 남겨야 할 <b>극값</b>입니다.<br>"
      + "데이터를 다룰 때 튀는 값을 무조건 지우면, 가장 중요한 사건(기록적 폭염·호우)을 놓칩니다. 반대로 고장 난 센서의 값을 그대로 두면 잘못된 결론을 냅니다. 그래서 기상청도 관측값마다 ‘앞뒤 시각과 견주기, 이웃 관측소와 견주기, 물리적으로 가능한 범위인지 보기’ 같은 품질 검사를 거친 뒤 자료를 공개합니다."
  }
  ]
});
})();
