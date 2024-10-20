"use client";

import React, { useEffect, useState } from 'react';
import { SignUp } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import Image from 'next/image';


const SignUpPage = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" 
         style={{ 
           backgroundImage: "url('https://images.unsplash.com/photo-1633185075416-c9ef98858411?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-70"></div>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg px-4 z-10"
      >
        <div className="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-lg shadow-2xl overflow-hidden p-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-6"
          >
            <Image
              src={theme === 'dark' ? '/snippetverse-white.png' : '/snippet-verse.png'}
              alt="SnippetVerse AI Logo"
              width={150}
              height={50}
              className="mx-auto"
            />
          </motion.div>
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg',
                card: 'bg-transparent shadow-none',
                headerTitle: 'text-3xl font-bold text-gray-800 dark:text-white',
                headerSubtitle: 'text-sm text-gray-600 dark:text-gray-300',
                socialButtonsBlockButton: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 hover:-translate-y-1 hover:shadow-md',
                socialButtonsBlockButtonText: 'text-gray-600 dark:text-gray-300',
                formFieldLabel: 'text-sm font-medium text-gray-700 dark:text-gray-300',
                formFieldInput: 'mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition duration-300 ease-in-out',
                footerActionLink: 'text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition duration-300 ease-in-out',
              },
              layout: {
                socialButtonsPlacement: 'bottom',
              },
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
