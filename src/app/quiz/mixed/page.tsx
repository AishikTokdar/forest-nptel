"use client";
import React, { useState, useEffect } from "react";
import { questionsByWeek } from "@/data/questions";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle } from "lucide-react";
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

export default function MixedQuiz() {
  // Combine all questions from all weeks
  const allQuestions = Object.values(questionsByWeek).flat();
  
  // State for quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState(allQuestions);

  // Shuffle questions on component mount
  useEffect(() => {
    setShuffledQuestions(shuffleArray(allQuestions));
  }, [allQuestions]);

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
    <div className="min-h-screen bg-black text-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
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

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-8">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${calculateProgress()}%` }}
          />
        </div>

        {/* Question */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">{currentQuestion.question}</h2>
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswerSelect(option)}
                className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                  showResult
                    ? option === currentQuestion.answer
                      ? "bg-green-500/20 border border-green-500"
                      : option === selectedAnswer
                      ? "bg-red-500/20 border border-red-500"
                      : "bg-gray-700/50 border border-gray-600"
                    : "bg-gray-700/50 border border-gray-600 hover:bg-gray-700 hover:border-gray-500"
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

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="flex items-center px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!showResult || currentQuestionIndex === shuffledQuestions.length - 1}
            className="flex items-center px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>

        {/* Score */}
        {currentQuestionIndex === shuffledQuestions.length - 1 && showResult && (
          <div className="mt-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
            <p className="text-xl text-gray-400">
              Your score: {score} out of {shuffledQuestions.length}
            </p>
            <Link
              href="/quiz"
              className="inline-flex items-center mt-4 px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
            >
              Try Another Quiz
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 