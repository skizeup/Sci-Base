'use client';

import { useState } from 'react';
import type { Quiz, Question, Difficulty } from '@/lib/types';
import { useQuizScore } from '@/hooks/useQuizScore';
import { useTranslation } from '@/contexts/LocaleContext';

const difficultyStyles: Record<Difficulty, string> = {
  facile: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  moyen: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  difficile: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
};

function DifficultyBadge({ difficulty, label }: { difficulty: Difficulty; label: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${difficultyStyles[difficulty]}`}>
      {label}
    </span>
  );
}

interface QuizProps {
  quiz: Quiz;
  topicSlug: string;
}

export default function QuizComponent({ quiz, topicSlug }: QuizProps) {
  const { t } = useTranslation();
  const questions = quiz.questions;
  const total = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Map<string, number>>(new Map());
  const [finished, setFinished] = useState(false);

  const { bestScore, saveScore } = useQuizScore(topicSlug);

  const currentQuestion: Question = questions[currentIndex];
  const progress = ((currentIndex + (finished ? 1 : 0)) / total) * 100;

  function handleValidate() {
    if (selectedAnswer === null) return;
    setIsRevealed(true);
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, selectedAnswer);
    setAnswers(newAnswers);
    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setIsRevealed(false);
    } else {
      const finalScore = selectedAnswer === currentQuestion.correct_answer ? score + 1 : score;
      setFinished(true);
      saveScore(finalScore, total);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsRevealed(false);
    setScore(0);
    setAnswers(new Map());
    setFinished(false);
  }

  if (finished) {
    let finalScore = 0;
    for (const q of questions) {
      const userAnswer = answers.get(q.id);
      if (userAnswer === q.correct_answer) finalScore++;
    }

    const percentage = Math.round((finalScore / total) * 100);
    const byDifficulty = { facile: { correct: 0, total: 0 }, moyen: { correct: 0, total: 0 }, difficile: { correct: 0, total: 0 } };
    for (const q of questions) {
      byDifficulty[q.difficulty].total++;
      const userAnswer = answers.get(q.id);
      if (userAnswer === q.correct_answer) byDifficulty[q.difficulty].correct++;
    }

    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 p-8 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 dark:from-brand-900/20 dark:to-brand-800/20 border border-brand-200 dark:border-brand-800">
          <div className="text-6xl font-bold text-brand-600 dark:text-brand-400 mb-2">
            {finalScore}/{total}
          </div>
          <div className="text-lg text-gray-600 dark:text-gray-300 mb-1">
            {percentage >= 80 ? t('quiz.excellent') : percentage >= 60 ? t('quiz.wellDone') : percentage >= 40 ? t('quiz.notBad') : t('quiz.keepGoing')}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('quiz.percentage', { pct: percentage })}
          </div>
          {bestScore !== null && bestScore > finalScore && (
            <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              {t('quiz.bestScore', { score: bestScore, total })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {(Object.entries(byDifficulty) as [Difficulty, { correct: number; total: number }][]).map(
            ([diff, data]) =>
              data.total > 0 && (
                <div key={diff} className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <DifficultyBadge difficulty={diff} label={t(`quiz.difficulty.${diff}`)} />
                  <div className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {data.correct}/{data.total}
                  </div>
                </div>
              )
          )}
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('quiz.reviewTitle')}</h3>
          {questions.map((q, i) => {
            const userAnswer = answers.get(q.id);
            const isCorrect = userAnswer === q.correct_answer;
            return (
              <div
                key={q.id}
                className={`p-4 rounded-lg border ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10'
                    : 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    isCorrect ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                  }`}>
                    {isCorrect ? '\u2713' : '\u2717'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {i + 1}. {q.question}
                    </p>
                    {!isCorrect && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t('quiz.correctAnswer', { answer: q.options[q.correct_answer] })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            {t('quiz.restart')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>{t('quiz.question', { current: currentIndex + 1, total })}</span>
          <span>{t('quiz.correctAnswers', { count: score, plural: score > 1 ? 's' : '' })}</span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 dark:bg-brand-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <DifficultyBadge difficulty={currentQuestion.difficulty} label={t(`quiz.difficulty.${currentQuestion.difficulty}`)} />
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {currentQuestion.type === 'true_false' ? t('quiz.trueOrFalse') : t('quiz.mcq')}
          </span>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {currentQuestion.question}
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, i) => {
          let optionClass = 'border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600';

          if (selectedAnswer === i && !isRevealed) {
            optionClass = 'border-brand-500 dark:border-brand-400 bg-brand-50 dark:bg-brand-900/20 ring-2 ring-brand-500/20';
          }

          if (isRevealed) {
            if (i === currentQuestion.correct_answer) {
              optionClass = 'border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20';
            } else if (i === selectedAnswer) {
              optionClass = 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20';
            } else {
              optionClass = 'border-gray-200 dark:border-gray-700 opacity-50';
            }
          }

          return (
            <button
              key={i}
              onClick={() => !isRevealed && setSelectedAnswer(i)}
              disabled={isRevealed}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${optionClass} ${
                isRevealed ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border ${
                  selectedAnswer === i && !isRevealed
                    ? 'border-brand-500 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                    : isRevealed && i === currentQuestion.correct_answer
                      ? 'border-emerald-500 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400'
                      : isRevealed && i === selectedAnswer
                        ? 'border-red-500 text-red-600 dark:border-red-400 dark:text-red-400'
                        : 'border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400'
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-gray-900 dark:text-gray-100 text-sm">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {isRevealed && (
        <div className={`p-4 rounded-lg mb-6 ${
          selectedAnswer === currentQuestion.correct_answer
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <p className={`text-sm font-medium mb-1 ${
            selectedAnswer === currentQuestion.correct_answer
              ? 'text-emerald-800 dark:text-emerald-300'
              : 'text-red-800 dark:text-red-300'
          }`}>
            {selectedAnswer === currentQuestion.correct_answer ? t('quiz.correct') : t('quiz.incorrect')}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {currentQuestion.explanation}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        {!isRevealed ? (
          <button
            onClick={handleValidate}
            disabled={selectedAnswer === null}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              selectedAnswer === null
                ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
                : 'bg-brand-600 text-white hover:bg-brand-700'
            }`}
          >
            {t('quiz.validate')}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            {currentIndex < total - 1 ? t('quiz.next') : t('quiz.viewResults')}
          </button>
        )}
      </div>
    </div>
  );
}
