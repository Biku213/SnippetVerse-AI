'use client'
import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { useQuery, useMutation } from 'convex/react';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { TrashIcon, PlusIcon, LoaderCircle, Loader, Moon, Sun, Code, FileText } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { Id } from '@/convex/_generated/dataModel';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

export default function DashboardPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in');
    } else if (isLoaded && userId) {
      setIsLoading(false);
    }
  }, [isLoaded, userId, router]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900'>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className='text-2xl font-semibold text-gray-800 dark:text-gray-200'
        >
          <LoaderCircle className="animate-spin" />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className='min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 text-gray-900 dark:text-gray-100 transition-colors duration-500'>
        <nav className="bg-white dark:bg-gray-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
              CodeVault
            </h1>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-full"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button
                onClick={() => router.push('/profile')}
                className="bg-purple-600 hover:bg-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300"
              >
                Profile
              </Button>
            </div>
          </div>
        </nav>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-12'>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0'
          >
            <h2 className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400'>
              Your Code Vault
            </h2>
            <div className='flex items-center space-x-4'>
              <Link href='/submit-code'>
                <Button className='bg-purple-600 hover:bg-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300'>
                  <PlusIcon className='mr-2 h-4 w-4' />
                  New Snippet
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-colors duration-500'
          >
            <div className='px-6 py-5 border-b border-gray-200 dark:border-gray-700'>
              <h3 className='text-2xl leading-6 font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400'>
                Your Code Snippets
              </h3>
            </div>
            <div>
              <CodeSnippetList userId={userId!} />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

function CodeSnippetList({ userId }: { userId: string }) {
  const codeSnippets = useQuery(api.codeSnippets.getCodeSnippets, {
    userId: userId || ''
  });
  const deleteCodeSnippet = useMutation(api.codeSnippets.deleteCodeSnippet);
  const updateCodeSnippet = useMutation(api.codeSnippets.updateCodeSnippet);
  const [sortBy, setSortBy] = useState('date');
  const [filterLanguage] = useState('');

  if (!codeSnippets)
    return (
      <div className='p-6 text-gray-600 dark:text-gray-400 text-center'>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader className="animate-spin" />
        </motion.div>
      </div>
    );

  if (codeSnippets.length === 0) {
    return (
      <div className='p-6 text-gray-600 dark:text-gray-400 text-center'>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl mb-4">Your code vault is empty!</p>
          <Link href="/submit-code">
            <Button className='bg-purple-600 hover:bg-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300'>
              <PlusIcon className='mr-2 h-4 w-4' />
              Add Your First Snippet
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleDelete = (snippetId: Id<"codeSnippets">) => {
    toast(
      t => (
        <div className='dark:text-gray-800'>
          <p>Are you sure you want to delete this code snippet?</p>
          <div className='mt-2'>
            <Button
              size='sm'
              className='bg-red-600 hover:bg-red-700 text-white transition-colors duration-300'
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await deleteCodeSnippet({ id: snippetId });
                  toast.success('Code snippet deleted successfully');
                } catch (error) {
                  console.error('Error deleting snippet:', error);
                  toast.error('Failed to delete code snippet');
                }
              }}
            >
              Delete
            </Button>
            <Button
              size='sm'
              variant='outline'
              className='ml-2'
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ),
      {
        duration: 5000,
        position: 'top-center'
      }
    );
  };

  const updateSnippetAnalysis = async (snippetId: Id<"codeSnippets">, analysis: string, refinedCode: string) => {
    try {
      await updateCodeSnippet({
        id: snippetId,
        analysis: analysis,
        refinedCode: refinedCode
      });
      toast.success('Snippet analysis updated successfully');
    } catch (error) {
      console.error('Error updating snippet analysis:', error);
      toast.error('Failed to update snippet analysis');
    }
  };

  const sortedSnippets = [...codeSnippets].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b._creationTime).getTime() - new Date(a._creationTime).getTime();
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'language') {
      return a.language.localeCompare(b.language);
    }
    return 0;
  });

  const filteredSnippets = filterLanguage
    ? sortedSnippets.filter(snippet => snippet.language.toLowerCase() === filterLanguage.toLowerCase())
    : sortedSnippets;

  return (
    <div>
      <div className="p-4 bg-gray-100 dark:bg-gray-700 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-4 mb-2 sm:mb-0">
          <label className="text-sm font-medium">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm py-1 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
            <option value="language">Language</option>
          </select>
        </div>
       
      </div>
      <ul className='divide-y divide-gray-200 dark:divide-gray-700'>
        <AnimatePresence>
          {filteredSnippets.map((snippet, index) => (
            <motion.li
              key={snippet._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className='py-6 px-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300'
            >
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center'>
                <div className="mb-4 sm:mb-0">
                  <h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
                    {snippet.title}
                  </h3>
                  <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                    {snippet.language} • {new Date(snippet._creationTime).toLocaleDateString()}
                  </p>
                </div>
                <div className='flex flex-wrap sm:flex-nowrap space-y-2 sm:space-y-0 sm:space-x-3'>
                  <Link href={`/snippet/${snippet._id}`}>
                    <Button
                      variant='outline'
                      className='w-full sm:w-auto border-purple-500 text-purple-500 hover:bg-purple-50 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-gray-700 transition-colors duration-300'
                    >
                      <Code className="w-4 h-4 mr-2" />
                      View Analysis
                    </Button>
                  </Link>
                 
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleDelete(snippet._id)}
                    className='w-full sm:w-auto text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300'
                  >
                    <TrashIcon className='h-5 w-4' />
                  </Button>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
