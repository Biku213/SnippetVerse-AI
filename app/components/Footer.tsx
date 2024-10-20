import React from 'react';

import { Github, Twitter, Linkedin } from 'lucide-react';


const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
        <div className="  dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; 2024 SnippetVerse AI. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" aria-label="GitHub" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <Github className="h-6 w-6" />
            </a>
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <Linkedin className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
