/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Users, Target, Heart, Github } from 'lucide-react';

const FeatureSection = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
      <Icon size={32} className="text-green-400" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export default function About() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">About Forest NPTEL</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We&apos;re dedicated to making forest management education accessible and engaging
            for students across India through the NPTEL platform.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <FeatureSection
            icon={Users}
            title="Our Mission"
            description="To provide high-quality educational resources and tools for students pursuing forest management studies through NPTEL."
          />
          <FeatureSection
            icon={Target}
            title="Our Vision"
            description="To become the leading supplementary learning platform for forest management education in India."
          />
          <FeatureSection
            icon={Heart}
            title="Our Values"
            description="We believe in open education, environmental conservation, and the power of technology to transform learning."
          />
        </div>

        {/* Platform Features */}
        <div className="bg-gray-800/50 rounded-xl p-8 mb-20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            What Makes Us Different
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-400">Interactive Learning</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Comprehensive quiz system with immediate feedback</li>
                <li>• Progress tracking and performance analytics</li>
                <li>• Week-wise organized content</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-400">Quality Content</h3>
              <ul className="space-y-2 text-gray-400">
                <li>• Aligned with NPTEL curriculum</li>
                <li>• Regular updates and improvements</li>
                <li>• Curated additional resources</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-20">
          <h2 className="text-2xl font-bold text-white mb-8">Meet the Team</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Our platform is maintained by a dedicated team of students and educators
            passionate about forestry and environmental conservation.
          </p>
          <a
            href="https://github.com/AishikTokdar/forest-nptel"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-gray-700 text-base font-medium rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-colors duration-200"
          >
            <Github className="mr-2" size={20} />
            View Project on GitHub
          </a>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-green-500/10 via-green-600/10 to-green-700/10 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-gray-400 mb-6">
            Have questions or suggestions? We&apos;d love to hear from you!
          </p>
          <a
            href="mailto:aishiktokdar@gmail.com"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
} 