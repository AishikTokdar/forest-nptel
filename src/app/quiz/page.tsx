"use client";
import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { getAvailableWeeks, getQuestionsCountForWeek } from "@/data/questions";
import { Book, CheckCircle, Shuffle, LayoutGrid, List, Search } from "lucide-react";
import Link from "next/link";
import { useVirtualizer } from '@tanstack/react-virtual';
import debounce from 'lodash/debounce';

// Memoized WeekCard component with performance optimizations
const WeekCard = React.memo(({ week, totalQuestions }: { week: string; totalQuestions: number }) => {
  const weekNumber = week.replace('week', '');
  const weekTitle = `Week ${weekNumber}`;

  // Pre-compute styles to avoid recalculation
  const styles = useMemo(() => ({
    container: "group focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black rounded-xl",
    card: "bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/10 group-focus:border-green-500/50 relative overflow-hidden",
    iconContainer: "p-2 rounded-full bg-gray-700/50 group-hover:bg-green-500/10 transition-colors",
    icon: "text-gray-400 group-hover:text-green-400 transition-colors group-hover:rotate-6 transform duration-300",
  }), []);

  return (
    <Link href={`/quiz/${week}`} className={styles.container}>
      <div className={styles.card}>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
              {weekTitle}
            </h3>
            <div className={styles.iconContainer}>
              <Book className={styles.icon} size={24} />
            </div>
          </div>
          
          <div className="flex items-center text-gray-400 text-sm">
            <CheckCircle size={16} className="mr-2 text-green-400" />
            <span>{totalQuestions} Questions</span>
          </div>
        </div>
      </div>
    </Link>
  );
});

WeekCard.displayName = 'WeekCard';

// Memoized MixedQuizCard component with performance optimizations
const MixedQuizCard = React.memo(() => {
  const styles = useMemo(() => ({
    container: "block w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-black rounded-xl",
    card: "bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/10 group-focus:border-green-500/50 relative overflow-hidden",
    iconContainer: "p-2 rounded-full bg-gray-700/50 group-hover:bg-green-500/10 transition-colors",
    icon: "text-gray-400 group-hover:text-green-400 transition-colors group-hover:rotate-12 transform duration-300",
  }), []);

  return (
    <Link href="/quiz/mixed" className={styles.container}>
      <div className={styles.card}>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors">
              All Weeks
            </h3>
            <div className={styles.iconContainer}>
              <Shuffle className={styles.icon} size={24} />
            </div>
          </div>
          
          <div className="flex items-center text-gray-400 text-sm">
            <CheckCircle size={16} className="mr-2 text-green-400" />
            <span>All Questions</span>
          </div>
        </div>
      </div>
    </Link>
  );
});

MixedQuizCard.displayName = 'MixedQuizCard';

// Memoized search input component
const SearchInput = React.memo(({ onSearch }: { onSearch: (value: string) => void }) => {
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch(value);
    }, 300),
    [onSearch]
  );

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search weeks..."
        className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white w-64
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        onChange={(e) => debouncedSearch(e.target.value)}
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

// Memoized view toggle component
const ViewToggle = React.memo(({ viewType, onToggle }: { viewType: 'grid' | 'list'; onToggle: (type: 'grid' | 'list') => void }) => (
  <div className="flex items-center gap-2">
    <button
      onClick={() => onToggle('grid')}
      className={`p-2 rounded-lg transition-colors ${viewType === 'grid' ? 'bg-green-500/20 text-green-400' : 'bg-gray-800/50 text-gray-400'}`}
      aria-label="Grid view"
    >
      <LayoutGrid size={20} />
    </button>
    <button
      onClick={() => onToggle('list')}
      className={`p-2 rounded-lg transition-colors ${viewType === 'list' ? 'bg-green-500/20 text-green-400' : 'bg-gray-800/50 text-gray-400'}`}
      aria-label="List view"
    >
      <List size={20} />
    </button>
  </div>
));

ViewToggle.displayName = 'ViewToggle';

export default function QuizWeekSelector() {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const parentRef = useRef<HTMLDivElement>(null);

  // Memoize available weeks
  const weeks = useMemo(() => getAvailableWeeks(), []);

  // Memoize filtered weeks based on search query
  const filteredWeeks = useMemo(() => 
    weeks.filter(week => week.toLowerCase().includes(searchQuery.toLowerCase())),
    [weeks, searchQuery]
  );

  // Virtualization setup for list view
  const rowVirtualizer = useVirtualizer({
    count: filteredWeeks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      rowVirtualizer.cleanup();
    };
  }, [rowVirtualizer]);

  return (
    <div className="min-h-screen bg-black relative">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
      
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
            <h1 className="text-4xl font-bold text-white mb-4 pt-8">
              Practice Quizzes
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Test your knowledge with our comprehensive quiz collection. Select a week to start practicing.
            </p>
          </div>

          <div className="flex items-center justify-between mb-8">
            <SearchInput onSearch={setSearchQuery} />
            <ViewToggle viewType={viewType} onToggle={setViewType} />
          </div>

          {viewType === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWeeks.map((week) => (
                <WeekCard
                  key={week}
                  week={week}
                  totalQuestions={getQuestionsCountForWeek(week)}
                />
              ))}
            </div>
          ) : (
            <div ref={parentRef} className="h-[600px] overflow-auto">
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow: { index: number; start: number; size: number }) => (
                  <div
                    key={virtualRow.index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <WeekCard
                      week={filteredWeeks[virtualRow.index]}
                      totalQuestions={getQuestionsCountForWeek(filteredWeeks[virtualRow.index])}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-2xl">
              <MixedQuizCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
