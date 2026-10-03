/* 융합과학 탐구 Ⅰ 융합과학 탐구의 이해 — 실제 자료
   r1 두 병동은 얼마나 달랐나 — 빈 종합병원 제1·제2병동의 산모 사망률(1841 ~ 1846)
   r2 차이가 사라진 해 — 손 씻기 뒤 두 병동의 사망률이 같아진 때
   자료: data/semmelweis.js (제멜바이스 1861) */
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
var SRC = "<small>출처: 이그나츠 제멜바이스(1861) 『산욕열의 원인, 개념, 예방』의 표 — 빈 종합병원 산과 제1병동(의사·의대생)과 제2병동(조산사)의 해마다 출산 수와 산욕열 사망 수, 1833 ~ 1858. 위키백과(CC BY-SA)에 옮겨 적힌 값. 사본은 data/semmelweis.js.</small>";

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
    id: "r1", tag: "실제 자료 · 비교 집단", title: "두 병동은 얼마나 달랐나", short: "두 병동",
    who: "🏥", name: "빈 종합병원 기록실",
    say: "“같은 병원, 같은 도시의 두 병동인데 소문이 달랐어요. 산모들은 제1병동에 가지 않으려고 울며 빌었다고 합니다. 제멜바이스가 남긴 <b>실제 기록</b>으로 <b>1841 ~ 1846년</b> 6년을 합쳐 두 병동의 사망률을 구하고, 제1병동이 제2병동의 <b>몇 배</b>였는지 알려 주세요.”",
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
          if (Math.abs(g - RAT) <= 0.2 + 1e-9) return { ok: true, msg: "제1병동 " + P1.toFixed(1) + "%, 제2병동 " + P2.toFixed(1) + "% — 약 " + RAT.toFixed(1) + " 배입니다. 제1병동에서는 열 명 가운데 한 명꼴로 산모가 죽었어요." };
          return { ok: false, msg: g.toFixed(1) + " 배는 맞지 않습니다. 6년을 합친 사망률을 각각 구해 나누세요." };
        }
      };
    },
    hints: ["제1병동: " + SUM[1] + " ÷ " + SUM[0] + " × 100 ≈ " + P1.toFixed(1) + "%.", "제2병동: " + SUM[3] + " ÷ " + SUM[2] + " × 100. 제1 ÷ 제2 = ?"],
    solution: "약 <b>" + RAT.toFixed(1) + " 배</b> (" + P1.toFixed(1) + "% 대 " + P2.toFixed(1) + "%).",
    why: "두 병동의 가장 큰 차이는 아기를 받는 사람이었습니다. 제1병동은 아침마다 시신을 해부한 뒤 오는 의사·의대생이, 제2병동은 해부를 하지 않는 조산사가 맡았어요. 제멜바이스는 분만 자세, 신부의 종소리, 붐비는 정도 같은 다른 가능성을 하나씩 지워 가다가, 1847년 동료 콜레치카가 해부 중 손을 베인 뒤 산욕열과 같은 증상으로 죽자 ‘시체에서 온 무엇’을 의심하게 되었습니다.<br>"
      + "의학·통계·생물학이 만난 이 탐구는, 비교 집단을 두고 다른 점을 하나씩 따지는 것이 원인을 좁히는 강력한 방법임을 보여 줍니다."
  },
  {
    id: "r2", tag: "실제 자료 · 가설 검증", title: "차이가 사라진 해", short: "같아진 해",
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
          if (y === CLOSE) { var c = row(CLOSE); return { ok: true, msg: CLOSE + "년 제1병동 " + r1(c).toFixed(2) + "%, 제2병동 " + r2(c).toFixed(2) + "% — 처음으로 두 병동이 거의 같아졌습니다. 제1병동의 사망률은 1846년 " + r1(row(1846)).toFixed(1) + "% 에서 열 분의 1 쯤으로 떨어졌어요." }; }
          if (y < 1847) return { ok: false, msg: y + "년은 손 씻기 전입니다. 1847년부터 보세요." };
          if (y < CLOSE) return { ok: false, msg: y + "년은 " + k.toFixed(1) + " 배로 아직 차이가 큽니다. 그다음 해는요?" };
          return { ok: false, msg: y + "년(" + k.toFixed(2) + " 배)보다 먼저 같아진 해가 있어요." };
        }
      };
    },
    hints: ["1847년부터 한 해씩 옮기며 오른쪽 ‘제1 ÷ 제2’를 보세요.", "1847년은 손 씻기를 한 해의 중간에 시작했어요. 그다음 해는?"],
    solution: "<b>" + CLOSE + "년</b>.",
    why: "가설에서 끌어낸 예측(‘손을 씻으면 두 병동의 차이가 사라진다’)이 실제 자료로 확인되었습니다. 하지만 제멜바이스는 왜 손을 씻어야 하는지 설명할 이론(세균)을 갖지 못했고, 자료를 늦게 발표했으며, 반대하는 의사들과 크게 다투었어요. 1849년 그가 빈을 떠난 뒤 손 씻기가 느슨해지자, 그래프처럼 1850년대에 제1병동 사망률이 다시 오르내리며 높아진 해가 나타납니다.<br>"
      + "좋은 증거만으로는 부족하고, 원리를 설명하는 이론과 설득하는 소통이 함께해야 과학 지식이 받아들여진다는 것을 보여 주는 사례입니다."
  }
  ]
});
})();
