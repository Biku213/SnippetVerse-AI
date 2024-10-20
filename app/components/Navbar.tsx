'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { Menu, Moon, Sun } from 'lucide-react';
import { Button } from '../components/ui/button';
import Notifications from './Notifications';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';

const Navbar = () => {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const NavItems = () => (
    <div className="flex space-x-6">
      <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
        Features
      </Link>
      
      <SignedIn>
        <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
          Dashboard
        </Link>
      </SignedIn>
    </div>
  );

  return (
    <nav className="bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-lg w-full fixed top-0 z-50 transition-all duration-300 ease-in-out">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
            <Image
                src={theme === 'dark' ? '/snippetverse-white.png' : '/snippet-verse.png'}
                alt="SnippetVerse AI Logo"
                width={150}
                height={50}
                className="mr-4"
              />
            </Link>
            <div className="hidden md:flex items-center space-x-8 ml-6">
              <NavItems />
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <SignedOut>
              <Link href="/sign-in" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
                Sign in
              </Link>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Sign up
              </Button>
            </SignedOut>
            <SignedIn>
            <Notifications userId={user?.id || ''} />
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />
              )}
            </Button>
          </div>
          <div className="md:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px] p-6">
                <div className="flex flex-col space-y-4 mt-6">
                  <NavItems />
                  <SignedOut>
                    <Link href="/sign-in" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
                      Sign in
                    </Link>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full">
                      Sign up
                    </Button>
                  </SignedOut>
                  <SignedIn>
                  <Notifications userId={user?.id || ''} />
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? (
                      <Sun className="h-[1.2rem] w-[1.2rem]" />
                    ) : (
                      <Moon className="h-[1.2rem] w-[1.2rem]" />
                    )}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
