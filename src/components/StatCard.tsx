import React from 'react';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  number: string;
  label: string;
  icon: keyof typeof Icons;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label, icon, color }) => {
  const Icon = Icons[icon] as LucideIcon;

  return (
    <div className="text-center">
      <div className={`flex items-center justify-center w-16 h-16 rounded-full ${color} mx-auto mb-4`}>
        <Icon size={32} className="text-white" />
      </div>
      <div className="text-4xl font-bold text-white mb-2">{number}</div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
};

export default StatCard; 