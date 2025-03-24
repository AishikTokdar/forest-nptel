import React from "react";
import { Calendar, ArrowRight, Home } from "lucide-react";
import Link from "next/link";

interface WeekSelectorProps {
  weeks: string[];
}

const WeekSelector: React.FC<WeekSelectorProps> = ({ weeks }) => {
  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 min-h-screen h-full text-gray-300 py-16 px-8 sm:px-12 lg:px-16 font-sans flex flex-col items-center">
      <div className="max-w-5xl w-full text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Select a Week to Practice
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 mb-8">
          Start your journey towards mastering forest management with these interactive quizzes!
        </p>
        <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-300 inline-flex items-center justify-center bg-gray-800 hover:bg-gray-700 p-4 rounded-lg shadow-lg">
          <Home size={28} />
          <span className="ml-2">Home</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16 w-full max-w-5xl">
        {weeks.map((week) => (
          <Link
            key={week}
            href={`/quiz/${week}`}
            className="bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 p-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center justify-between"
          >
            <div className="flex items-center text-white">
              <Calendar className="mr-3 text-yellow-400" size={24} />
              <span className="text-lg sm:text-xl font-semibold">Week {week.replace("week", "")}</span>
            </div>
            <ArrowRight className="text-gray-300" size={24} />
          </Link>
        ))}
        <Link
          href="/quiz/all"
          className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center justify-between"
        >
          <div className="flex items-center">
            <Calendar className="mr-3 text-white" size={24} />
            <span className="text-lg sm:text-xl font-semibold">All Weeks</span>
          </div>
          <ArrowRight size={24} />
        </Link>
      </div>
      <div className="text-center mt-16">
        <p className="text-gray-400 text-sm">
          © 2025 Forests & Management. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default WeekSelector;
