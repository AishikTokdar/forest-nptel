import React from "react";
import dynamic from "next/dynamic";
import { ArrowRight, TreePine, Leaf, Trees, Sprout, LeafyGreen, Mountain, BookOpen, Brain, Award, GraduationCap, Target, Users } from "lucide-react";
import Link from "next/link";

// Dynamically import heavy components
const FeatureCard = dynamic(() => import('@/components/FeatureCard'), {
  loading: () => <div className="animate-pulse bg-gray-800/50 rounded-lg h-48" />
});

const StatCard = dynamic(() => import('@/components/StatCard'), {
  loading: () => <div className="animate-pulse bg-gray-800/50 rounded-lg h-32" />
});

// Memoized icon components
const Icons = React.memo(() => (
  <div className="mt-16 flex justify-center space-x-8">
    {[TreePine, Leaf, Trees, Sprout, LeafyGreen, Mountain].map((Icon, index) => (
      <div
        key={index}
        className="relative group"
      >
        <div className={`absolute inset-0 bg-green-${400 + (index * 100)} rounded-full blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
        <Icon
          className={`text-green-${400 + (index * 100)} w-12 h-12 transform hover:scale-110 transition-transform duration-300 cursor-pointer`}
        />
      </div>
    ))}
  </div>
));

Icons.displayName = 'Icons';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl xl:text-7xl mb-6">
              <span className="block text-white">Master Forest Management</span>
              <span className="block mt-3 text-green-400">with NPTEL</span>
            </h1>
            <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto">
              Your comprehensive learning platform for the NPTEL Forest Management course. 
              Practice with our specialized quizzes, access study materials, and ace your FAT exam.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/quiz"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
              >
                Start Learning
                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </Link>
              <Link
                href="/study"
                className="inline-flex items-center px-6 py-3 border border-gray-700 text-base font-medium rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-colors duration-200"
              >
                Browse Study Material
              </Link>
            </div>
          </div>

          <Icons />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Why Choose Our Platform?</h2>
            <p className="mt-4 text-lg text-gray-400">Everything you need to excel in your Forest Management course</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="BookOpen"
              title="Comprehensive Content"
              description="Access detailed study materials covering all aspects of forest management and conservation."
              color="bg-blue-500"
            />
            <FeatureCard
              icon="Brain"
              title="Interactive Learning"
              description="Practice with our specialized quizzes designed to test and reinforce your knowledge."
              color="bg-purple-500"
            />
            <FeatureCard
              icon="Award"
              title="Exam Preparation"
              description="Prepare effectively for your FAT exam with our targeted study resources and practice tests."
              color="bg-yellow-500"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard
              number="100+"
              label="Practice Questions"
              icon="GraduationCap"
              color="bg-green-500"
            />
            <StatCard
              number="12"
              label="Course Weeks"
              icon="Target"
              color="bg-blue-500"
            />
            <StatCard
              number="24/7"
              label="Access"
              icon="Leaf"
              color="bg-purple-500"
            />
            <StatCard
              number="1000+"
              label="Active Students"
              icon="Users"
              color="bg-yellow-500"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
