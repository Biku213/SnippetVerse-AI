  "use client"
  import React, { useState, useEffect } from 'react';
  import { useRouter } from 'next/navigation';
  import { useMutation } from 'convex/react';
  import { api } from '@/convex/_generated/api';
  import CodeEditor from '../components/CodeEditor';
  import { useAuth } from '@clerk/nextjs';
  import { useTheme } from 'next-themes';
  import { motion } from 'framer-motion';
  import { Button } from '../components/ui/button';
  import { Input } from '../components/ui/input';
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '../components/ui/select';
  import { Loader2, Copy, Check, Share2 } from 'lucide-react';
  import { toast } from 'react-hot-toast';
  import ReactMarkdown from 'react-markdown';

  export default function SubmitCodePage() {
    const router = useRouter();
    const { userId } = useAuth();
    const { theme } = useTheme();
    const [title, setTitle] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [refinedCode, setRefinedCode] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isRefining, setIsRefining] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedSnippetId, setSubmittedSnippetId] = useState<string | null>(null);
    const [charCount, setCharCount] = useState(0);
    const [isRefinedCopied, setIsRefinedCopied] = useState(false);

    const createCodeSnippet = useMutation(api.codeSnippets.createCodeSnippet);
    const addNotification = useMutation(api.notifications.addNotification);

    useEffect(() => {
      setCharCount(code.length);
    }, [code]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsAnalyzing(true);
      setIsSubmitting(true);
      setError('');

      try {
        const response = await fetch('/api/analyze-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to analyze code');
        }

        const data = await response.json();
        setAnalysis(data.analysis);

        const snippetId = await createCodeSnippet({
          userId: userId!,
          title,
          language,
          content: code,
          analysis: data.analysis,
        });
        setSubmittedSnippetId(snippetId);

        await addNotification({
          userId: userId!,
          content: `Your code snippet "${title}" has been submitted for review.`,
          snippetId: snippetId,
        });

        toast.success('Code snippet submitted successfully');
      } catch (error) {
        console.error('Error submitting code:', error);
        toast.error('Failed to submit code snippet');
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsAnalyzing(false);
        setIsSubmitting(false);
      }
    };

    const handleRefineCode = async () => {
      setIsRefining(true);
      setError('');

      try {
        const response = await fetch('/api/refine-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language, analysis }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to refine code');
        }

        const data = await response.json();
        setRefinedCode(data.refinedCode);
        toast.success('Code refined successfully');
      } catch (error) {
        console.error('Error refining code:', error);
        toast.error('Failed to refine code');
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsRefining(false);
      }
    };

    const handleAcceptRefinedCode = () => {
      setCode(refinedCode);
      setRefinedCode('');
      toast.success('Refined code accepted');
    };

    const handleCopyCode = (textToCopy: string, setIsCopiedState: (value: boolean) => void) => {
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setIsCopiedState(true);
          toast.success('Code copied to clipboard');
          setTimeout(() => setIsCopiedState(false), 2000);
        })
        .catch(() => toast.error('Failed to copy code'));
    };
    const handleShareCode = () => {
      if (submittedSnippetId) {
        const shareUrl = `${window.location.origin}/snippet/${submittedSnippetId}`;
        navigator.clipboard.writeText(shareUrl)
          .then(() => {
            toast.success('Share link copied to clipboard');
          })
          .catch(() => toast.error('Failed to copy share link'));
      } else {
        toast.error('No snippet available to share');
      }
    };

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
              Submit Code for Review
            </h1>
            
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your code snippet"
                required
                className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300"
              />
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="ruby">Ruby</SelectItem>
                  <SelectItem value="go">Go</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="php">PHP</SelectItem>
                  <SelectItem value="swift">Swift</SelectItem>
                  <SelectItem value="kotlin">Kotlin</SelectItem>
                </SelectContent>
              </Select>
              <div className="mb-4 border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
                <CodeEditor
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || '')}
                  theme={theme === 'dark' ? 'vs-dark' : 'light'}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Character count: {charCount}
                </span>
                <Button
                  type="submit"
                  disabled={isAnalyzing || isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300"
                >
                  {isAnalyzing || isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isAnalyzing ? 'Analyzing...' : 'Submitting...'}
                    </>
                  ) : (
                    'Submit for Review'
                  )}
                </Button>
              </div>
            </form>
            {error && (
              <div className="mt-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-md relative" role="alert">
                {error}
              </div>
            )}
            {(analysis || refinedCode) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 mb-8 grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {analysis && (
                  <div className="lg:col-span-1">
                    <h2 className="text-2xl font-bold mb-4">Code Analysis:</h2>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-md text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 overflow-auto max-h-[calc(100vh-300px)] prose dark:prose-invert">
                      <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                  </div>
                )}
               {refinedCode && (
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-4">Refined Code:</h2>
          <div className="mb-4 border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
            <CodeEditor
              language={language}
              value={refinedCode}
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
              onClick={() => handleCopyCode(refinedCode, setIsRefinedCopied)}
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
            <Button
              onClick={handleShareCode}
              disabled={!submittedSnippetId}
              className="bg-purple-600 hover:bg-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Code
            </Button>
          
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            <div className="mt-8">
              <Button
                onClick={handleRefineCode}
                disabled={isRefining || !analysis}
                className="bg-purple-600 hover:bg-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300 mr-4"
              >
                {isRefining ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Refining...
                  </>
                ) : (
                  'Refine Code'
                )}
              </Button>
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-purple-600 hover:bg-purple-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300"
              >
                Back to Dashboard
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }