"use client";

import { questionsByWeek } from "@/data/questions";
import { ArrowLeft, Check, X, RefreshCw, Timer, Award, Brain } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Question } from "@/types/Question";
import Link from "next/link";
import { motion } from "framer-motion";
import { logger } from '@/utils/logger';

// Progress storage key generator
const getProgressKey = (week: string) => `quiz_progress_${week}`;
const PROGRESS_EXPIRY_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds

export default function QuizPage({ params }: { params: { week: string } }) {
  const week = params.week;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isTabActive, setIsTabActive] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const lastActiveTimeRef = useRef<Date | null>(null);

  // Load saved progress with expiry check
  useEffect(() => {
    const savedProgress = localStorage.getItem(getProgressKey(week));
    if (savedProgress) {
      const { answers, timestamp } = JSON.parse(savedProgress);
      const now = new Date().getTime();
      if (now - timestamp < PROGRESS_EXPIRY_TIME) {
        setUserAnswers(answers);
      } else {
        localStorage.removeItem(getProgressKey(week));
      }
    }
  }, [week]);

  // Save progress with timestamp
  useEffect(() => {
    if (Object.keys(userAnswers).length > 0) {
      localStorage.setItem(
        getProgressKey(week),
        JSON.stringify({
          answers: userAnswers,
          timestamp: new Date().getTime()
        })
      );
    }
  }, [userAnswers, week]);

  const shuffleQuestions = () => {
    const allQuestions =
      week === "all" ? Object.values(questionsByWeek).flat() : questionsByWeek[week] || [];
    const shuffled = allQuestions
      .sort(() => Math.random() - 0.5)
      .map((q) => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5),
      }));
    setQuestions(shuffled);
    setUserAnswers({});
    setQuizCompleted(false);
    setScore(0);
    setTimeSpent(0);
    setStartTime(new Date());
    localStorage.removeItem(getProgressKey(week));
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden
        setIsTabActive(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = undefined;
        }
        lastActiveTimeRef.current = new Date();
      } else {
        // Tab is visible
        setIsTabActive(true);
        if (lastActiveTimeRef.current) {
          const timeDiff = Math.floor((new Date().getTime() - lastActiveTimeRef.current.getTime()) / 1000);
          setTimeSpent((prev: number) => prev + timeDiff);
        }
        if (!quizCompleted) {
          // Clear any existing interval before starting a new one
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          timerRef.current = setInterval(() => {
            setTimeSpent((prev: number) => prev + 1);
          }, 1000);
        }
      }
    };

    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial setup
    if (!quizCompleted) {
      timerRef.current = setInterval(() => {
        setTimeSpent((prev: number) => prev + 1);
      }, 1000);
    }

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [quizCompleted]);

  useEffect(() => {
    try {
      const allQuestions =
        week === "all" ? Object.values(questionsByWeek).flat() : questionsByWeek[week] || [];
      
      if (!allQuestions || allQuestions.length === 0) {
        logger.error('Failed to load questions', { week, questionsCount: 0 });
        return;
      }

      const shuffled = allQuestions
        .sort(() => Math.random() - 0.5)
        .map((q) => ({
          ...q,
          options: [...q.options].sort(() => Math.random() - 0.5),
        }));
      setQuestions(shuffled);
      logger.info('Questions loaded successfully', { 
        week, 
        questionsCount: shuffled.length 
      });
    } catch (error) {
      logger.error('Error shuffling questions', { 
        week, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }, [week]);

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    try {
      if (!quizCompleted) {
        setUserAnswers((prev: { [key: number]: string }) => ({ ...prev, [questionIndex]: answer }));
        logger.info('Answer selected', { 
          questionIndex, 
          isCorrect: answer === questions[questionIndex].answer 
        });
      }
    } catch (error) {
      logger.error('Error selecting answer', { 
        questionIndex, 
        answer, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  const handleQuizSubmit = () => {
    try {
      if (quizCompleted) return;
      
      const newScore = questions.reduce((acc: number, question: Question, index: number) => {
        return acc + (userAnswers[index] === question.answer ? 1 : 0);
      }, 0);
      setScore(newScore);
      setQuizCompleted(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      window.scrollTo(0, 0);

      logger.info('Quiz completed', { 
        score: newScore, 
        totalQuestions: questions.length,
        timeSpent 
      });
    } catch (error) {
      logger.error('Error submitting quiz', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        answers: userAnswers 
      });
    }
  };

  const handleRedoQuiz = () => {
    try {
      shuffleQuestions();
      window.scrollTo(0, 0);
      logger.info('Quiz reset', { week });
    } catch (error) {
      logger.error('Error resetting quiz', { 
        week,
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  };

  const weekTitle = week === "all" ? "All Weeks" : `Week ${week.replace("week", "")}`;

  const formatQuestion = (question: string) => {
    return question
      .replace(/-->/g, "→")
      .replace(/"([^"]*)"/g, (match, p1) => `"<i>${p1}</i>"`)
      .replace(/\(Fill in the blanks?\)/i, "");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-green-400";
    if (percentage >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const calculateProgress = () => {
    const answeredQuestions = Object.keys(userAnswers).length;
    return (answeredQuestions / questions.length) * 100;
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Floating Timer and Progress Bar */}
      {!quizCompleted && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed left-4 top-1/2 -translate-y-1/2 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 shadow-lg z-50"
          role="status"
          aria-label="Quiz progress"
        >
          <div className="flex flex-col items-center space-y-4">
            {/* Timer */}
            <div className="flex flex-col items-center space-y-2">
              <Timer className={`w-6 h-6 ${isTabActive ? 'text-blue-400' : 'text-gray-500'}`} aria-hidden="true" />
              <div className={`text-xl font-mono font-bold ${isTabActive ? 'text-blue-400' : 'text-gray-500'}`} role="timer">
                {formatTime(timeSpent)}
              </div>
              {!isTabActive && (
                <div className="text-xs text-gray-500 mt-1" role="status">
                  Timer paused
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div 
              className="w-32 bg-gray-800/50 rounded-full h-2 overflow-hidden backdrop-blur-sm"
              role="progressbar"
              aria-valuenow={calculateProgress()}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Quiz progress"
            >
              <div
                className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
            <div className="text-sm text-gray-400 text-center">
              {Object.keys(userAnswers).length}/{questions.length}
            </div>
          </div>
        </motion.div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <Link 
            href="/quiz" 
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4 sm:mb-0"
            aria-label="Back to Week Selection"
          >
            <ArrowLeft className="mr-2" size={20} aria-hidden="true" />
            Back to Week Selection
          </Link>
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">{weekTitle}</h1>
          </div>
        </div>

        {quizCompleted && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8"
            role="region"
            aria-label="Quiz results"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-8 mb-4 sm:mb-0">
                <div className="text-center">
                  <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" aria-hidden="true" />
                  <div className="text-sm text-gray-400">Score</div>
                  <div className={`text-3xl font-bold ${getScoreColor(score, questions.length)}`}>
                    {score}/{questions.length}
                  </div>
                </div>
                <div className="text-center">
                  <Timer className="w-8 h-8 text-blue-400 mx-auto mb-2" aria-hidden="true" />
                  <div className="text-sm text-gray-400">Time</div>
                  <div className="text-3xl font-bold text-blue-400">{formatTime(timeSpent)}</div>
                </div>
                <div className="text-center">
                  <Brain className="w-8 h-8 text-green-400 mx-auto mb-2" aria-hidden="true" />
                  <div className="text-sm text-gray-400">Accuracy</div>
                  <div className="text-3xl font-bold text-green-400">
                    {Math.round((score / questions.length) * 100)}%
                  </div>
                </div>
              </div>
              <button
                onClick={handleRedoQuiz}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                aria-label="Try quiz again"
              >
                <RefreshCw className="mr-2" size={20} aria-hidden="true" />
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        <div className="space-y-8" role="list">
          {questions.map((question, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden"
              role="listitem"
            >
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-start">
                  <span className="text-2xl font-bold text-green-400 mr-4" aria-hidden="true">{index + 1}</span>
                  <h2 
                    className="text-lg text-white"
                    dangerouslySetInnerHTML={{ __html: formatQuestion(question.question) }}
                    id={`question-${index}`}
                  />
                </div>
              </div>
              <div className="p-6">
                <div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  role="radiogroup"
                  aria-labelledby={`question-${index}`}
                >
                  {question.options.map((option, optionIndex) => (
                    <button
                      key={optionIndex}
                      onClick={() => handleAnswerSelect(index, option)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleAnswerSelect(index, option);
                        }
                      }}
                      disabled={quizCompleted}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        quizCompleted
                          ? option === question.answer
                            ? "border-green-500 bg-green-500/10 text-white"
                            : userAnswers[index] === option
                            ? "border-red-500 bg-red-500/10 text-white"
                            : "border-gray-600 bg-gray-700/50 text-gray-400"
                          : userAnswers[index] === option
                          ? "border-green-500 bg-green-500/10 text-white"
                          : "border-gray-600 bg-gray-700/50 hover:bg-gray-700 text-gray-300"
                      }`}
                      role="radio"
                      aria-checked={userAnswers[index] === option}
                      aria-label={option}
                      tabIndex={0}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {quizCompleted && (
                          option === question.answer ? (
                            <Check className="text-green-400" size={20} aria-label="Correct answer" />
                          ) : userAnswers[index] === option ? (
                            <X className="text-red-400" size={20} aria-label="Incorrect answer" />
                          ) : null
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!quizCompleted && questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="sticky bottom-8 mt-8"
          >
            <button
              className="w-full px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-lg font-semibold flex items-center justify-center space-x-2"
              onClick={handleQuizSubmit}
              aria-label="Submit quiz"
            >
              <span>Submit Quiz</span>
              <Award size={20} aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
