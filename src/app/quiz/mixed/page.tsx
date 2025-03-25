"use client";
import React, { useState, useEffect } from "react";
import { questionsByWeek } from "@/data/questions";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Timer } from "lucide-react";
import Link from "next/link";

// Function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Combine all questions from all weeks
const allQuestions = Object.values(questionsByWeek).flat();

export default function MixedQuiz() {
  // State for quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState(allQuestions);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isTabActive, setIsTabActive] = useState(true);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState(0);
  const timerRef = React.useRef<NodeJS.Timeout>();
  const autoAdvanceRef = React.useRef<NodeJS.Timeout>();

  // Timer effect
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (autoAdvanceRef.current) {
        clearTimeout(autoAdvanceRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Auto-advance effect
  useEffect(() => {
    if (showResult && currentQuestionIndex < shuffledQuestions.length - 1) {
      setAutoAdvanceCountdown(5);
      
      const countdownInterval = setInterval(() => {
        setAutoAdvanceCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            handleNext();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [showResult, currentQuestionIndex, shuffledQuestions.length]);

  // Format time helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Shuffle questions on component mount only
  useEffect(() => {
    setShuffledQuestions(shuffleArray(allQuestions));
  }, []); // Empty dependency array means this runs once on mount

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === currentQuestion.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setAutoAdvanceCountdown(0);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const calculateProgress = () => {
    return ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
  };

  return (
    <div className="min-h-screen relative bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05),rgba(0,0,0,0)_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.05),rgba(0,0,0,0)_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(34,197,94,0.05),rgba(0,0,0,0)_50%)]" />
        <div className="absolute inset-0 backdrop-blur-[100px]" />
      </div>

      {/* Content Container with Glass Effect */}
      <div className="relative z-10 py-16">
        {/* Floating Timer with enhanced glass effect */}
        <div className="fixed left-4 top-1/2 -translate-y-1/2 bg-gray-800/40 backdrop-blur-md border border-gray-700/50 rounded-lg p-4 shadow-lg z-50 hover:bg-gray-800/50 transition-all duration-300">
          <div className="flex flex-col items-center space-y-2">
            <Timer className={`w-6 h-6 ${isTabActive ? 'text-purple-400' : 'text-gray-500'} transition-colors duration-300`} />
            <div className={`text-xl font-mono font-bold ${isTabActive ? 'text-purple-400' : 'text-gray-500'} transition-colors duration-300`}>
              {formatTime(timeSpent)}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with glass effect */}
          <div className="flex items-center justify-between mb-8 bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50">
            <Link
              href="/quiz"
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to Weeks
            </Link>
            <div className="text-sm text-gray-400">
              Question {currentQuestionIndex + 1} of {shuffledQuestions.length}
            </div>
          </div>

          {/* Progress Bar with glow effect */}
          <div className="w-full bg-gray-800/50 rounded-full h-2 mb-8 overflow-hidden backdrop-blur-sm">
            <div
              className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>

          {/* Question Container with enhanced glass effect */}
          <div className="bg-gray-800/30 backdrop-blur-md rounded-xl p-6 mb-8 border border-gray-700/50 shadow-lg">
            <h2 className="text-xl font-bold mb-6">{currentQuestion.question}</h2>
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswerSelect(option)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                    showResult
                      ? option === currentQuestion.answer
                        ? "bg-green-500/20 border border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]"
                        : option === selectedAnswer
                        ? "bg-red-500/20 border border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                        : "bg-gray-700/30 border border-gray-600/50"
                      : "bg-gray-700/30 border border-gray-600/50 hover:bg-gray-700/50 hover:border-gray-500/50"
                  }`}
                  disabled={showResult}
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-gray-400">{String.fromCharCode(65 + index)}.</span>
                    <span>{option}</span>
                    {showResult && (
                      <span className="ml-auto">
                        {option === currentQuestion.answer ? (
                          <CheckCircle className="text-green-400" size={20} />
                        ) : option === selectedAnswer ? (
                          <XCircle className="text-red-400" size={20} />
                        ) : null}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation with glass effect */}
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
              {showResult && autoAdvanceCountdown > 0 && (
                <div className="text-sm text-purple-400 animate-pulse">
                  Auto-advancing in {autoAdvanceCountdown}s...
                </div>
              )}
              <button
                onClick={handleNext}
                disabled={!showResult || currentQuestionIndex === shuffledQuestions.length - 1}
                className="flex items-center px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ArrowRight className="ml-2" size={20} />
              </button>
            </div>
          </div>

          {/* Score with glass effect */}
          {currentQuestionIndex === shuffledQuestions.length - 1 && showResult && (
            <div className="mt-8 text-center bg-gray-800/30 backdrop-blur-md rounded-xl p-8 border border-gray-700/50">
              <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
              <p className="text-xl text-gray-400">
                Your score: {score} out of {shuffledQuestions.length}
              </p>
              <Link
                href="/quiz"
                className="inline-flex items-center mt-4 px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 transition-all duration-300"
              >
                Try Another Quiz
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 