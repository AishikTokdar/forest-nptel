"use client";
import Link from 'next/link';
import { TreePine } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Quiz', path: '/quiz' },
    { name: 'Study Material', path: '/study' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3">
            <TreePine className="h-6 w-6 text-green-400" />
            <span className="font-normal text-2xl text-white">Forest NPTEL</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center space-x-10">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className="relative"
                >
                  <span className={`text-lg ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-300 hover:text-white transition-colors'
                  }`}>
                    {item.name}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-[19px] left-0 w-full h-[2px] bg-green-400" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 