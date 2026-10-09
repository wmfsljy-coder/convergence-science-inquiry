/* 융합과학 탐구 Ⅲ 융합과학 탐구의 전망 — 실제 자료
   r1 반딧불이 기록이 2012년에 갑자기 늘어난 까닭 — GBIF의 우리나라 반딧불이과 기록
   r2 시민 과학자의 기록은 얼마나 늘었나 — 사람이 관찰해 올린 기록만 보기
   자료: data/gbif-fireflies.js (세계 생물다양성 정보 기구 GBIF) */
(function () {
"use strict";
var G = window.REAL_GBIF || { total: 0, years: [], basis: {} };
var Y = G.years.filter(function (r) { return r[0] >= 2005 && r[0] <= 2025; });   /* [연도, 전체, 사람 관찰] */
var PK = Y.reduce(function (b, r) { return r[1] > b[1] ? r : b; }, Y[0] || [2012, 0, 0]);
function sum(a, b, i) { return Y.filter(function (r) { return r[0] >= a && r[0] <= b; }).reduce(function (s, r) { return s + r[i]; }, 0); }
var H1 = sum(2017, 2021, 2), H2 = sum(2022, 2025, 2);
var R2 = H1 ? (H2 / 4) / (H1 / 5) : 0;
var SRC = "<small>출처: 세계 생물다양성 정보 기구(GBIF) — 대한민국의 반딧불이과(Lampyridae) 기록 " + G.total.toLocaleString() + "건 가운데 연도가 적힌 기록을 해마다 셈(전체 / 사람이 관찰해 올린 기록). 표본 " + (G.basis.PRESERVED_SPECIMEN || 0) + "건, 관찰 " + (G.basis.HUMAN_OBSERVATION || 0) + "건. 받은 날 2026-10-03, 사본은 data/gbif-fireflies.js.</small>";

function chart(H, ctx, W, CH, i, pick) {
  H.paper(ctx, W, CH);
  var x0 = 60, x1 = 640, y0 = 24, y1 = CH - 36, mx = Math.max.apply(null, Y.map(function (r) { return r[i]; })) * 1.1 || 1;
  function X(y) { return x0 + (y - 2004.5) / 21 * (x1 - x0); }
  function Yv(v) { return y1 - v / mx * (y1 - y0); }
  H.axes(ctx, x0, y0, x1, y1);
  [0, 0.5, 1].forEach(function (f) { H.text(ctx, Math.round(mx / 1.1 * f), x0 - 6, Yv(mx / 1.1 * f) + 4, { s: 10, a: "right", c: H.v("--mist") }); });
  [2005, 2010, 2015, 2020, 2025].forEach(function (y) { H.text(ctx, y, X(y), y1 + 15, { s: 10, a: "center", c: H.v("--mist") }); });
  Y.forEach(function (r) { var on = pick === r[0]; H.box(ctx, X(r[0]) - 9, Yv(r[i]), 18, y1 - Yv(r[i]), on ? H.v("--amber-700") : (i === 2 ? H.v("--green-700") : H.v("--brand")), on ? 1 : 0.8); });
  H.text(ctx, i === 2 ? "사람이 관찰해 올린 기록 수" : "반딧불이 기록 수 (전체)", x0 + 6, y0 - 8, { s: 11, w: "700", c: H.v("--mist") });
}

window.sthLab({
  mount: "real", key: "real", result: "rReal", label: "실제 자료",
  doneNote: "정리하기 탭에서 실제 자료로 시민 과학의 힘과 데이터를 읽을 때 조심할 점을 적어 보세요.",
  cases: [
  {
    id: "r1", tag: "실제 자료 · 데이터 해석", title: "반딧불이 기록이 한 해에 갑자기 늘어난 까닭", short: "기록의 봉우리",
    who: "✨", name: "생물다양성 자료실",
    say: "“전 세계의 생물 기록을 모으는 GBIF에서 우리나라 <b>반딧불이 기록 수</b>를 해마다 세어 봤어요. 한 해만 유난히 기록이 많습니다. 그해 반딧불이가 정말 갑자기 늘어났을까요? <b>기록이 가장 많은 해</b>를 찾고, 그 까닭을 골라 주세요.”",
    predict: {
      q: "생물 기록 수가 많아진 해는 그 생물이 실제로 많아진 해일까요?",
      options: ["㉠ 그렇다, 기록 수 = 개체 수다", "㉡ 아니다, 조사·기록한 사람과 방법이 늘어도 기록 수가 는다", "㉢ 기록 수와 개체 수는 늘 반대다"],
      answer: 1
    },
    task: "기록이 가장 많은 해를 고르고, 그 까닭을 고르세요.",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, y = 2005, why = "none";
      function val(yy) { for (var i = 0; i < Y.length; i++) if (Y[i][0] === yy) return Y[i]; return [yy, 0, 0]; }
      function draw() {
        chart(H, ctx, W, cv.H, 1, y);
        var v = val(y);
        H.rows(ctx, 680, 50, [["고른 해", y + "년", "--amber-700"], ["전체 기록", v[1] + " 건", null, true], ["그 가운데 사람 관찰", v[2] + " 건"]], 60);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "연도", min: 2005, max: 2025, step: 1, value: 2005, fmt: function (x) { return x + "년"; }, onInput: function (x) { y = x; api.changed(); draw(); } });
      api.seg({ label: "기록이 많은 까닭", value: "none", options: [{ v: "boom", t: "그해 반딧불이가 크게 늘어서" }, { v: "spec", t: "한 기관의 표본 기록이 그해로 한꺼번에 들어가서" }, { v: "weather", t: "그해 날씨가 맑아서" }], onPick: function (x) { why = x; api.changed(); } });
      api.info("오른쪽 판의 ‘사람 관찰’과 전체 기록을 견주어 보세요. 나머지는 대부분 박물관·연구 기관의 표본 기록입니다. " + SRC
        + "<div data-link='{\"id\":\"gbif-kr\",\"title\":\"GBIF — 생물 기록 찾아보기\",\"src\":\"세계 생물다양성 정보 기구\",\"url\":\"https://www.gbif.org/occurrence/search?country=KR&taxon_key=4737\",\"ask\":\"우리나라 반딧불이 기록을 지도로 보고, 기록이 가장 많이 몰린 지역 한 곳과 그곳에 기록이 많은 까닭을 짐작해 적어 오세요.\"}'></div>");
      draw();
      return {
        judge: function () {
          if (y !== PK[0]) return { ok: false, msg: y + "년은 " + val(y)[1] + "건입니다. 더 많은 해가 있습니다." };
          if (why !== "spec") return { ok: false, msg: "해는 맞았습니다. 그해 ‘사람 관찰’은 " + PK[2] + "건뿐이에요. 나머지는 어디서 왔을까요?" };
          return { ok: true, msg: PK[0] + "년 " + PK[1] + "건 가운데 사람 관찰은 " + PK[2] + "건 — 나머지 대부분은 국립생물자원관 한 곳의 표본 기록(약 880건)으로, 날짜가 대부분(약 720건) 2012년 1월 1일로 적혀 있어 정확한 날짜 대신 연도만 적은 기록으로 보입니다." };
        }
      };
    },
    hints: ["가장 높은 막대를 고르고 오른쪽 판의 두 숫자를 견주세요.", "전체에 비해 사람 관찰이 아주 적습니다."],
    solution: "<b>" + PK[0] + "년</b>, 한 기관의 표본 기록이 그해로 한꺼번에 들어갔기 때문.",
    why: "데이터베이스의 기록 수는 생물의 수뿐 아니라, 누가 언제 얼마나 조사하고 등록했는지에 크게 좌우됩니다. 한 기관이 표본 자료를 한꺼번에 올리거나, 날짜를 모르는 기록에 연도만(1월 1일로) 적으면 그해 기록이 수백 건 늘어납니다. 그래서 기록 수로 개체 수의 변화를 말하려면, 같은 방법으로 같은 곳을 꾸준히 조사한 자료(모니터링)가 필요합니다.<br>"
      + "2015년의 작은 봉우리도 같은 까닭입니다. 그해 200건 가운데 사람 관찰은 1건뿐이고, 나머지는 표본 자료와 유전자 바코드 자료가 한꺼번에 들어온 것입니다. 자료가 어떻게 만들어졌는지(메타데이터)를 확인하는 것은 데이터 탐구의 첫걸음입니다."
  },
  {
    id: "r2", tag: "실제 자료 · 시민 과학", title: "시민 과학자의 기록은 얼마나 늘었나", short: "시민 과학",
    who: "📸", name: "시민 과학 프로젝트",
    say: "“이번에는 <b>사람이 직접 관찰해 올린 기록</b>만 봅시다. 스마트폰으로 사진을 찍어 올리는 시민 과학 플랫폼이 퍼지면서 기록이 늘었어요. <b>2017~2021년</b>의 한 해 평균과 <b>2022~2025년</b>의 한 해 평균을 견주어, 최근이 <b>몇 배</b>인지 구해 주세요.”",
    predict: {
      q: "시민 과학 기록이 늘어나면 과학자에게 어떤 도움이 될까요?",
      options: ["㉠ 도움이 안 된다", "㉡ 더 넓은 지역·시기의 분포를 알 수 있지만, 기록하는 사람이 많은 곳에 치우칠 수 있다", "㉢ 개체 수를 정확히 알 수 있다"],
      answer: 1
    },
    task: "두 기간의 한 해 평균을 구해 최근 ÷ 이전 을 슬라이더로 맞추세요(± 1 배).",
    build: function (stage, api) {
      var H = api.h, cv = api.canvas(270), ctx = cv.ctx, W = cv.W, g = 1;
      function draw() {
        chart(H, ctx, W, cv.H, 2, null);
        H.rows(ctx, 680, 40, [["2017~2021 (5년) 합", H1 + " 건"], ["2022~2025 (4년) 합", H2 + " 건"], ["내 답 (몇 배)", g.toFixed(0) + " 배", null, true]], 60);
      }
      cv.canvas._redraw = draw;
      api.slider({ label: "최근 한 해 평균은 이전의 몇 배", min: 1, max: 30, step: 1, value: 1, fmt: function (x) { return x + " 배"; }, onInput: function (x) { g = x; api.changed(); draw(); } });
      api.info("한 해 평균 = 합 ÷ 햇수. " + SRC);
      draw();
      return {
        judge: function () {
          if (Math.abs(g - R2) <= 1) return { ok: true, msg: "(" + H2 + " ÷ 4) ÷ (" + H1 + " ÷ 5) ≈ " + R2.toFixed(1) + " 배 — 시민 과학 기록이 크게 늘었습니다." };
          return { ok: false, msg: g + " 배는 " + (g < R2 ? "작습니다" : "큽니다") + ". 두 기간의 햇수가 달라요(5년, 4년)." };
        }
      };
    },
    hints: ["이전 한 해 평균 = " + H1 + " ÷ 5, 최근 한 해 평균 = " + H2 + " ÷ 4.", "최근 평균 ÷ 이전 평균 ≈ ?"],
    solution: "약 <b>" + R2.toFixed(1) + " 배</b>.",
    why: "누구나 스마트폰으로 관찰을 올리고 전문가가 확인하는 시민 과학 덕분에, 연구자 몇 명으로는 불가능한 넓은 범위의 자료가 모입니다. 반딧불이는 빛 공해와 물 오염에 민감해 환경 상태를 알려 주는 지표 생물이라, 이런 기록이 모이면 서식지 보전에 쓰일 수 있습니다.<br>"
      + "다만 사람이 많이 다니는 곳, 기록이 쉬운 시기에 기록이 몰리므로, 분석할 때는 ‘어디를 얼마나 찾아봤는지’를 함께 따져야 합니다. ※ 2022년부터 늘어난 사람 관찰 기록은 대부분 네이처링 같은 국내 시민 과학 플랫폼과, 해마다 올라오는 시민 과학 모니터링 자료에서 왔습니다. 관찰하는 사람이 늘어서인지, 새 플랫폼이 GBIF에 자료를 보내기 시작해서인지도 함께 따져야 해요 — r1과 같은 질문입니다."
  }
  ]
});
})();
