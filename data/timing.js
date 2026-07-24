// 教育會考英語科（閱讀）作答時間為 60 分鐘。
// 每題建議時間依該年度／場次的完整閱讀題數換算，不固定假設為 43 題。
(function attachTiming(root) {
  const EXAM_SECONDS = 60 * 60;

  function sourceKey(question) {
    return `${question.era}|${question.year}|${question.sitting || ""}`;
  }

  function bankQuestionCount(question, allQuestions) {
    if (!question) return 0;
    const key = sourceKey(question);
    return allQuestions.filter(item => sourceKey(item) === key).length;
  }

  function secondsPerQuestion(question, allQuestions) {
    const count = bankQuestionCount(question, allQuestions);
    return count ? EXAM_SECONDS / count : 0;
  }

  function totalSeconds(questions, allQuestions) {
    return Math.round(
      questions.reduce(
        (sum, question) => sum + secondsPerQuestion(question, allQuestions),
        0,
      ),
    );
  }

  root.CAP_ENGLISH_TIMING = {
    EXAM_SECONDS,
    bankQuestionCount,
    secondsPerQuestion,
    totalSeconds,
  };
})(window);
