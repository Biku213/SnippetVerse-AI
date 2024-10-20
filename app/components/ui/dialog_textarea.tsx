import React, { ReactNode } from 'react';

// Dialog Component
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        {children}
        <button 
          className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded"
          onClick={() => onOpenChange(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export const DialogContent: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

export const DialogHeader: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const DialogTitle: React.FC<{ children: ReactNode }> = ({ children }) => (
  <h2 className="text-xl font-bold">{children}</h2>
);

export const DialogTrigger: React.FC<{ children: ReactNode; asChild?: boolean }> = ({ children }) => (
  <>{children}</>
);

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => (
  <textarea
    className={`w-full p-2 border rounded-md resize-none dark:bg-gray-700 dark:text-white ${className}`}
    {...props}
  />
);