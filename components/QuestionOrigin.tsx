/** Place directly below a heading whose content came from a workshop question. */
export function QuestionOrigin({ lesson }: { lesson: number }) {
  if (!Number.isInteger(lesson) || lesson < 1) return null;
  return <p className="question-origin">第{lesson}回の質問から追加</p>;
}
