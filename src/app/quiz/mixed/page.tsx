"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { questionsByWeek } from "@/data/questions";
import { ArrowLeft, ArrowRight, Check, X, Timer, Award, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Question } from "@/types/Question";
import { logger } from '@/utils/logger';

const AUTO_ADVANCE_DELAY = 3000; // 3 seconds in milliseconds

export default function MixedQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTabActive, setIsTabActive] = useState(true);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const autoAdvanceRef = useRef<NodeJS.Timeout>();
  const lastActiveTimeRef = useRef<Date | null>(null);

  // Define handleNext first
  const handleNext = useCallback(() => {
    try {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setAutoAdvanceCountdown(null);
        logger.info('Navigated to next question', { 
          newIndex: currentQuestionIndex + 1 
        });
      }
    } catch (error) {
      logger.error('Error navigating to next question', {
        currentIndex: currentQuestionIndex,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }, [currentQuestionIndex, questions.length]);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
  };

  // Timer effect
  useEffect(() => {
    try {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setIsTabActive(false);
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = undefined;
          }
          lastActiveTimeRef.current = new Date();
          logger.info('Quiz timer paused', { timeSpent });
        } else {
          setIsTabActive(true);
          if (lastActiveTimeRef.current) {
            const timeDiff = Math.floor(
              (new Date().getTime() - lastActiveTimeRef.current.getTime()) / 1000
            );
            setTimeSpent(prev => prev + timeDiff);
          }
          startTimer();
          logger.info('Quiz timer resumed', { timeSpent });
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      startTimer();

      return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } catch (error) {
      logger.error('Error in timer management', {
        error: error instanceof Error ? error.message : 'Unknown error',
        timeSpent
      });
    }
  }, [timeSpent]);

  // Auto-advance effect
  useEffect(() => {
    try {
      if (userAnswers[currentQuestionIndex] && currentQuestionIndex < questions.length - 1) {
        setAutoAdvanceCountdown(3);
        
        const countdownInterval = setInterval(() => {
          setAutoAdvanceCountdown((prevCountdown) => {
            if (prevCountdown === null || prevCountdown <= 1) {
              clearInterval(countdownInterval);
              handleNext();
              return null;
            }
            return prevCountdown - 1;
          });
        }, 1000);

        logger.info('Started auto-advance countdown', { 
          questionIndex: currentQuestionIndex 
        });

        return () => clearInterval(countdownInterval);
      }
    } catch (error) {
      logger.error('Error in auto-advance system', {
        questionIndex: currentQuestionIndex,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }, [userAnswers, currentQuestionIndex, handleNext, questions.length]);

  // Add error handling to question initialization
  useEffect(() => {
    try {
      const allQuestions = Object.values(questionsByWeek).flat();
      
      if (!allQuestions || allQuestions.length === 0) {
        logger.error('Failed to load questions for mixed quiz', { questionsCount: 0 });
        return;
      }

      const shuffled = allQuestions
        .sort(() => Math.random() - 0.5)
        .map(q => ({
          ...q,
          options: [...q.options].sort(() => Math.random() - 0.5),
        }));
      setQuestions(shuffled);
      logger.info('Mixed quiz questions loaded', { questionsCount: shuffled.length });
    } catch (error) {
      logger.error('Error initializing mixed quiz', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }, []);

  // Add error handling to answer selection
  const handleAnswerSelect = (answer: string) => {
    try {
      if (userAnswers[currentQuestionIndex]) {
        logger.warn('Attempted to answer already answered question', { 
          questionIndex: currentQuestionIndex 
        });
        return;
      }

      const isCorrect = answer === questions[currentQuestionIndex].answer;
      setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
      
      if (isCorrect) {
        setScore(prev => prev + 1);
      } else {
        setIncorrectCount(prev => prev + 1);
      }

      logger.info('Answer selected in mixed quiz', {
        questionIndex: currentQuestionIndex,
        isCorrect,
        currentScore: isCorrect ? score + 1 : score
      });
    } catch (error) {
      logger.error('Error selecting answer in mixed quiz', {
        questionIndex: currentQuestionIndex,
        answer,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handlePrevious = () => {
    try {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex(prev => prev - 1);
        setAutoAdvanceCountdown(null);
        logger.info('Navigated to previous question', { 
          newIndex: currentQuestionIndex - 1 
        });
      }
    } catch (error) {
      logger.error('Error navigating to previous question', {
        currentIndex: currentQuestionIndex,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateStats = () => {
    const attempted = Object.keys(userAnswers).length;
    return {
      attempted,
      correct: score,
      incorrect: incorrectCount
    };
  };

  const calculateProgress = () => {
    const answeredQuestions = Object.keys(userAnswers).length;
    return (answeredQuestions / questions.length) * 100;
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen relative bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05),rgba(0,0,0,0)_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.05),rgba(0,0,0,0)_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.05),rgba(0,0,0,0)_50%)]" />
        <div className="absolute inset-0 backdrop-blur-[100px]" />
      </div>

      {/* Left Floating Box - Timer and Progress */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-lg p-4 shadow-lg z-50 hover:bg-gray-800/50 transition-all duration-300">
        <div className="flex flex-col items-center space-y-4">
          {/* Timer */}
          <div className="flex flex-col items-center space-y-2">
            <Timer className={`w-6 h-6 ${isTabActive ? 'text-purple-400' : 'text-gray-500'} transition-colors duration-300`} />
            <div className={`text-xl font-mono font-bold ${isTabActive ? 'text-purple-400' : 'text-gray-500'} transition-colors duration-300`}>
              {formatTime(timeSpent)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-32 bg-gray-800/50 rounded-full h-2 overflow-hidden backdrop-blur-sm">
            <div
              className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
          <div className="text-sm text-gray-400 text-center">
            {Object.keys(userAnswers).length}/{questions.length}
          </div>

          {/* Accuracy */}
          <div className="text-sm font-semibold text-purple-400">
            {Math.round((calculateStats().correct / (calculateStats().attempted || 1)) * 100)}% Accuracy
          </div>
        </div>
      </div>

      {/* Right Floating Box - Stats */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-lg p-4 shadow-lg z-50 hover:bg-gray-800/50 transition-all duration-300">
        <div className="flex flex-col items-center space-y-4">
          {/* Attempted */}
          <div className="flex flex-col items-center space-y-1">
            <span className="text-sm text-gray-400">Attempted</span>
            <span className="text-xl font-bold text-white">{calculateStats().attempted}</span>
          </div>

          {/* Correct */}
          <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Correct</span>
            </div>
            <span className="text-xl font-bold text-green-400">{calculateStats().correct}</span>
          </div>

          {/* Incorrect */}
          <div className="flex flex-col items-center space-y-1">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-gray-400">Incorrect</span>
            </div>
            <span className="text-xl font-bold text-red-400">{calculateStats().incorrect}</span>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
            <Link
              href="/quiz"
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to Weeks
            </Link>
            <div className="text-sm text-gray-400">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden mb-8"
          >
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl text-white">{currentQuestion.question}</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={!!userAnswers[currentQuestionIndex]}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      userAnswers[currentQuestionIndex]
                        ? option === currentQuestion.answer
                          ? "border-green-500 bg-green-500/10 text-white"
                          : option === userAnswers[currentQuestionIndex]
                          ? "border-red-500 bg-red-500/10 text-white"
                          : "border-gray-600 bg-gray-700/50 text-gray-400"
                        : "border-gray-600 bg-gray-700/50 hover:bg-gray-700 text-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {userAnswers[currentQuestionIndex] && (
                        option === currentQuestion.answer ? (
                          <Check className="text-green-400" size={20} />
                        ) : option === userAnswers[currentQuestionIndex] ? (
                          <X className="text-red-400" size={20} />
                        ) : null
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between items-center bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="flex items-center px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="mr-2" size={20} />
              Previous
            </button>
            <div className="flex items-center space-x-4">
              {userAnswers[currentQuestionIndex] && autoAdvanceCountdown && (
                <div className="text-sm text-purple-400 animate-pulse">
                  Auto-advancing in {autoAdvanceCountdown}s...
                </div>
              )}
              <button
                onClick={handleNext}
                disabled={!userAnswers[currentQuestionIndex] || currentQuestionIndex === questions.length - 1}
                className="flex items-center px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ArrowRight className="ml-2" size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 