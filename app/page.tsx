"use client"
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { RocketIcon, CodeIcon, CheckIcon, Share2Icon } from 'lucide-react';
import { AuthAwareButton } from './components/AuthAwareButton';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  index: number;
}

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-100 to-purple-100 dark:from-gray-900 dark:to-blue-900 min-h-screen">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white sm:text-6xl md:text-7xl mt-12">
            <span className="block mb-2">Welcome to</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500 dark:from-blue-400 dark:to-purple-400">
              SnippetVerse AI
            </span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Elevate your code quality with AI-assisted reviews and improvement suggestions.
          </p>
          <motion.div 
            className="mt-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AuthAwareButton />
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 gap-8 sm:grid-cols-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </motion.div>
      </main>
    </div>
  );
}

const features = [
  {
    title: "AI-Powered Analysis",
    description: "Get instant code analysis and improvement suggestions using advanced AI.",
    icon: <RocketIcon className="w-8 h-8" />,
    color: "from-purple-500 to-blue-500",
  },
  {
    title: "Code Refinement",
    description: "Automatically refine your code with AI-generated improvements.",
    icon: <CheckIcon className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Advanced Code Editor",
    description: "Edit your code with our feature-rich Monaco-powered code editor.",
    icon: <CodeIcon className="w-8 h-8" />,
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "One-Click Sharing",
    description: "Easily share your code snippets with others using a generated link.",
    icon: <Share2Icon className="w-8 h-8" />,
    color: "from-orange-500 to-red-500",
  },
];

function FeatureCard({ title, description, icon, color, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <MotionCard 
        className="h-full transition-all duration-300 hover:shadow-2xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className={`p-3 rounded-full bg-gradient-to-r ${color} text-white`}>
              {icon}
            </div>
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-lg">{description}</CardDescription>
        </CardContent>
      </MotionCard>
    </motion.div>
  );
}
