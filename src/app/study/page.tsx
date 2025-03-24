"use client";
import React, { useState, useMemo } from 'react';
import { Book, FileText, Download, ChevronDown, ChevronRight, Search, Filter, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Module {
  title: string;
  description: string;
  topics: string[];
  resources: {
    pdfUrl: string;
    weekNumber: number;
  };
}

const courseModules: Module[] = [
  {
    title: "Introduction to Forest Management",
    description: "Understanding the basics of forest management, its history, and fundamental concepts.",
    topics: [
      "What is a forest?",
      "Classification of forests",
      "Value of forests"
    ],
    resources: {
      pdfUrl: "https://drive.google.com/file/d/1oo1ctqb7_DdMSlWFRwFQWg9on-gfxAEu/view",
      weekNumber: 1
    }
  },
  {
    title: "Basics of Silviculture",
    description: "Understanding silvicultural systems and forest production techniques.",
    topics: [
      "What is Silviculture?",
      "Plant Growth Factors",
      "Ecological Succession"
    ],
    resources: {
      pdfUrl: "https://drive.google.com/file/d/13ak11coXevLRSKqtnoBt3-yfFdgCorvR/view",
      weekNumber: 2
    }
  },
  {
    title: "Forest Soils",
    description: "Study of forest soils, their types, and nutrient cycles.",
    topics: [
      "Soil and Soil Profile",
      "Major Soil Types",
      "Nutrient Cycles"
    ],
    resources: {
      pdfUrl: "https://drive.google.com/file/d/12mlbg2_jpE4jxCL_Op9OJgjb72lI-M04/view",
      weekNumber: 3
    }
  },
  {
    title: "Forest Mensuration",
    description: "Techniques and methods for measuring forest resources.",
    topics: [
      "Tree Form",
      "Measurement of Tree attributes - I",
      "Measurement of Tree attributes - II"
    ],
    resources: {
      pdfUrl: "https://drive.google.com/file/d/1gx2tuQilxd-hl8wQO0ti0M3izFAcjeRu/view",
      weekNumber: 4
    }
  },
  {
    title: "Forest Surveying",
    description: "Modern and classical tools for forest surveying.",
    topics: [
      "Classical Tools",
      "Photogrammetry",
      "LiDAR"
    ],
    resources: {
      pdfUrl: "https://drive.google.com/file/d/1LW6XHqbtCrIo6_7mf2y-rd3_2Cp96TMU/view",
      weekNumber: 5
    }
  },
  {
    title: "Forest Protection",
    description: "Study of forest protection measures and management of threats.",
    topics: [
      "Kinds of Threats",
      "Forest Fire",
      "Forest Law"
    ],
    resources: {
      pdfUrl: "https://drive.google.com/file/d/1xrbRoC3TH1ZVElMgGiUY4QjRJ8o6Mb4q/view",
      weekNumber: 6
    }
  },
  {
    title: "Silvicultural Management",
    description: "Advanced silvicultural systems and management techniques.",
    topics: [
      "Regeneration",
      "Silvicultural Systems",
      "Clear Felling System",
      "Shelterwood System",
      "Selection System"
    ],
    resources: {
      pdfUrl: "https://drive.google.com/file/d/1YsGpb4ajU8aSKWBt41k3uopzMw9uDgOy/view",
      weekNumber: 7
    }
  },
  {
    title: "Modern Forest Management",
    description: "Contemporary approaches to forest management and conservation.",
    topics: [
      "NTFP (Non-Timber Forest Products)",
      "Social Forestry and Tribal Welfare",
      "Conservation of Wild Animals",
      "Modern Inventory Techniques"
    ],
    resources: {
      pdfUrl: "https://drive.google.com/file/d/19Ji5oVnN7G-bNhvkFOAOdRNQ6Ye0HxKy/view",
      weekNumber: 8
    }
  }
];

const ModuleCard = ({ module, index, isExpanded, onToggle, searchQuery }: { 
  module: Module; 
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  searchQuery: string;
}) => {
  const handleResourceClick = (url: string, isDownload: boolean = false) => {
    if (url) {
      if (isDownload) {
        // Convert Google Drive view URL to direct download URL
        const fileId = url.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1];
        if (fileId) {
          window.open(`https://drive.google.com/uc?export=download&id=${fileId}`, '_blank');
        } else {
          window.open(url, '_blank');
        }
      } else {
        window.open(url, '_blank');
      }
    }
  };

  const filteredTopics = useMemo(() => {
    if (!searchQuery) return module.topics;
    return module.topics.filter(topic => 
      topic.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [module.topics, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-green-500/30 transition-colors"
    >
      <div
        className="p-6 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-green-400 text-sm font-medium px-2 py-1 bg-green-400/10 rounded-full">
              Week {module.resources.weekNumber}
            </span>
            <h3 className="text-xl font-semibold text-white group-hover:text-green-400">
              {module.title}
            </h3>
          </div>
          {isExpanded ? (
            <ChevronDown className="text-gray-400 w-5 h-5" />
          ) : (
            <ChevronRight className="text-gray-400 w-5 h-5" />
          )}
        </div>
        <p className="mt-2 text-gray-400">{module.description}</p>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Topics Covered:</h4>
                <ul className="space-y-2">
                  {filteredTopics.map((topic, i) => (
                    <li key={i} className="text-gray-400 flex items-center group">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2" />
                      <span className="group-hover:text-white transition-colors">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={() => handleResourceClick(module.resources.pdfUrl)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-green-600/20 hover:bg-green-600/30 text-green-400 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span>View Notes</span>
                </button>
                <button 
                  onClick={() => handleResourceClick(module.resources.pdfUrl, true)}
                  className="flex items-center justify-center px-4 py-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 transition-colors"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function StudyMaterial() {
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  const filteredModules = useMemo(() => {
    return courseModules.filter(module => {
      const matchesSearch = searchQuery === '' || 
        module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesWeek = selectedWeek === null || module.resources.weekNumber === selectedWeek;
      
      return matchesSearch && matchesWeek;
    });
  }, [courseModules, searchQuery, selectedWeek]);

  const weeks = useMemo(() => {
    return Array.from(new Set(courseModules.map(module => module.resources.weekNumber))).sort((a, b) => a - b);
  }, []);

  return (
    <div className="min-h-screen bg-black relative">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
      
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-block">
              <Book className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-white mb-4">
                Study Material
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Access comprehensive study notes for the NPTEL Forest Management course. 
                Each module contains detailed notes and topic summaries.
              </p>
            </div>
          </div>

          {/* Course Book Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Course Textbook
                </h2>
                <p className="text-gray-400">
                  Access the official course textbook and additional resources from NPTEL
                </p>
              </div>
              <a
                href="https://drive.google.com/file/d/1dWLDHrl0si104vXv1Ia7MHkKSFTJWyTk/view"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <span>View Course Book</span>
                <ExternalLink className="ml-2 w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search topics, modules, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50"
              />
            </div>

            {/* Week Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedWeek(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedWeek === null
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                All Weeks
              </button>
              {weeks.map(week => (
                <button
                  key={week}
                  onClick={() => setSelectedWeek(week)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedWeek === week
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  Week {week}
                </button>
              ))}
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid gap-6">
            {filteredModules.map((module, index) => (
              <ModuleCard
                key={index}
                module={module}
                index={index}
                isExpanded={expandedModule === index}
                onToggle={() => setExpandedModule(expandedModule === index ? null : index)}
                searchQuery={searchQuery}
              />
            ))}
          </div>

          {/* No Results Message */}
          {filteredModules.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No modules found matching your search criteria.</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
              Content based on NPTEL Forest Management course curriculum. 
              For more detailed information, visit the{" "}
              <a
                href="https://nptel.ac.in/courses/102104082"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                official NPTEL course page
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 