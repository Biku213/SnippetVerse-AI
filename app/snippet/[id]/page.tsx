"use client"
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams, useRouter } from 'next/navigation';
import CodeEditor from '../../components/CodeEditor';
import { Id } from '@/convex/_generated/dataModel';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { Loader2, Copy, Check, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

export default function SnippetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { theme } = useTheme();
  const [isCopied, setIsCopied] = useState(false);
  const [isRefinedCopied, setIsRefinedCopied] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState('');

  const snippet = useQuery(api.codeSnippets.getCodeSnippet, {
    id: id as Id<'codeSnippets'>
  });

  const updateCodeSnippet = useMutation(api.codeSnippets.updateCodeSnippet);

  const handleCopyCode = (code: string, setIsCopiedState: (value: boolean) => void) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setIsCopiedState(true);
        toast.success('Code copied to clipboard');
        setTimeout(() => setIsCopiedState(false), 2000);
      })
      .catch(() => toast.error('Failed to copy code'));
  };

  const handleRefineCode = async () => {
    if (!snippet) return;

    setIsRefining(true);
    setError('');

    try {
      const response = await fetch('/api/refine-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: snippet.content,
          language: snippet.language
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API responded with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      // Save the analysis and refined code to the database
      await updateCodeSnippet({
        id: snippet._id,
        analysis: data.analysis,
        refinedCode: data.refinedCode
      });

      if (data.refinedCode === snippet.content) {
        toast.success('No refinement needed. The code is already optimized.');
      } else {
        toast.success('Code analyzed and refined successfully');
      }

      router.refresh();
    } catch (error) {
      console.error('Error refining code:', error);
      toast.error('Failed to refine code');
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsRefining(false);
    }
  };

  const handleAcceptRefinedCode = async () => {
    if (!snippet || !snippet.refinedCode) return;

    try {
      await updateCodeSnippet({
        id: snippet._id,
        content: snippet.refinedCode,
        refinedCode: "" 
      });
      toast.success('Refined code accepted and saved');
      router.refresh();
    } catch (error) {
      console.error('Error updating code snippet:', error);
      toast.error('Failed to save refined code');
    }
  };

  if (snippet === undefined) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 text-gray-900 dark:text-gray-100">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (snippet === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 text-gray-900 dark:text-gray-100">
        <h2 className="text-2xl font-bold mb-4">Snippet not found</h2>
        <Button 
          onClick={() => router.push('/dashboard')}
          className="bg-purple-600 hover:bg-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <div className="max-w-full mx-auto px-4 py-8 mt-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
            {snippet.title}
          </h1>
          <Button
  onClick={() => {
    const shareUrl = `${window.location.origin}/snippet/${id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        console.log('Share link copied successfully');
        toast.success('Share link copied to clipboard');
      })
      .catch((error) => {
        console.error('Failed to copy share link:', error);
        toast.error('Failed to copy share link');
      });
  }}
  className="bg-purple-600 hover:bg-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300"
>
  <Share2 className="mr-2 h-4 w-4" />
  Share
</Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-4 flex justify-between items-center">
            <span><strong>Language:</strong> {snippet.language}</span>
            <Button
              onClick={() => handleCopyCode(snippet.content, setIsCopied)}
              className="bg-purple-600 hover:bg-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300"
            >
              {isCopied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
          <div className="mb-8 border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
            <CodeEditor
              language={snippet.language}
              value={snippet.content}
              onChange={() => {}}
              readOnly
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
            />
          </div>
          <div className="mt-8 mb-8">
            <Button
              onClick={handleRefineCode}
              disabled={isRefining}
              className="bg-purple-600 hover:bg-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300"
            >
              {isRefining ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing & Refining...
                </>
              ) : (
                'Analyze & Refine Code'
              )}
            </Button>
          </div>
          {error && (
            <div className="mt-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-md relative" role="alert">
              {error}
            </div>
          )}
          {(snippet.analysis || snippet.refinedCode) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-8 mb-8 grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {snippet.analysis && (
                <div className="lg:col-span-1">
                  <h2 className="text-2xl font-bold mb-4">Code Analysis:</h2>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-md text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 overflow-auto max-h-[calc(100vh-300px)] prose dark:prose-invert">
                    <ReactMarkdown>{snippet.analysis}</ReactMarkdown>
                  </div>
                </div>
              )}
              {snippet.refinedCode && snippet.refinedCode !== snippet.content && (
                <div className="lg:col-span-1">
                  <h2 className="text-2xl font-bold mb-4">Refined Code:</h2>
                  <div className="mb-4 border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
                    <CodeEditor
                      language={snippet.language}
                      value={snippet.refinedCode}
                      onChange={() => {}}
                      readOnly
                      theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    />
                  </div>
                  <div className="flex space-x-4">
                    <Button
                      onClick={handleAcceptRefinedCode}
                      className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors duration-300"
                    >
                      Accept Refined Code
                    </Button>
                    <Button
                      onClick={() => handleCopyCode(snippet.refinedCode!, setIsRefinedCopied)}
                      className="bg-purple-600 hover:bg-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300"
                    >
                      {isRefinedCopied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Refined Code
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          <Button
            onClick={() => router.push('/dashboard')}
            className="mt-8 bg-purple-600 hover:bg-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300"
          >
            Back to Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
}