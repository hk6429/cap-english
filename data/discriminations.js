// 114 年英語科（閱讀）逐題鑑別度。
// 來源：114P英語（閱讀）試題分析.pdf，國立臺灣師範大學心理與教育測驗研究發展中心。
// 其餘年份未在目前可核對的來源中取得逐題鑑別度，因此不推算、不填值。
(function attachDiscriminations() {
  const values = [
    0.55, 0.72, 0.69, 0.55, 0.67, 0.65, 0.64, 0.56, 0.72, 0.57,
    0.59, 0.72, 0.64, 0.31, 0.53, 0.68, 0.47, 0.57, 0.36, 0.64,
    0.65, 0.70, 0.70, 0.66, 0.60, 0.63, 0.69, 0.61, 0.65, 0.62,
    0.65, 0.47, 0.63, 0.61, 0.56, 0.49, 0.56, 0.42, 0.61, 0.61,
    0.64, 0.51, 0.60,
  ];
  const source = {
    label: "114P英語（閱讀）試題分析",
    publisher: "國立臺灣師範大學心理與教育測驗研究發展中心",
  };
  const bank = (window.BANK || []).find(item => item.year === 114);
  if (!bank) return;
  bank.questions.forEach(question => {
    const disc = values[question.no - 1];
    if (!Number.isFinite(disc)) return;
    question.disc = disc;
    question.discSource = source;
  });
})();
