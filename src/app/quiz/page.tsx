"use client";
import React from "react";
import { questionsByWeek } from "@/data/questions";
import WeekSelector from "@/components/WeekSelector";

export default function QuizWeekSelector() {
  const weeks = Object.keys(questionsByWeek);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center">
      <WeekSelector weeks={weeks} />
    </div>
  );
}
