import React from 'react';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: keyof typeof Icons;
  title: string;
  description: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => {
  const Icon = Icons[icon] as LucideIcon;

  return (
    <div className="bg-gray-900/50 p-6 border border-gray-700 transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-700/50 rounded-lg group">
      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} className="text-white" />
      </div>
      <h2 className="text-xl font-bold mb-2 text-white group-hover:text-green-400 transition-colors">{title}</h2>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard; 