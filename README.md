# SnippertVerse AI: AI-Assisted Code Review Platform

SnippertVerse AI is an innovative web application designed to empower developers with AI-powered code reviews and efficient code snippet management. Built on a robust tech stack including Next.js, Convex, and Clerk, this platform offers a seamless experience for improving code quality and sharing knowledge.

## Key Features

1. **Secure Authentication**: Powered by Clerk, ensuring protected routes and user data safety.
2. **Intuitive Code Snippet Management**: Submit, view, and organize your code snippets effortlessly.
3. **AI-Powered Code Analysis**: Leverage Google's Gemini AI for insightful code reviews and suggestions.
4. **Personalized Dashboard**: Get an overview of your submitted snippets at a glance.
5. **Rich Code Editor**: Enjoy syntax highlighting and language-specific features with Monaco Editor.
6. **Real-time Updates**: Experience seamless, real-time data synchronization powered by Convex.
7. **Responsive Design**: Access the platform on any device with a consistent, modern UI.
8. **Notification System**: Stay informed about important events and snippet updates.

## Why Choose SnippertVerse AI?

SnippertVerse AI stands out as your personal code improvement assistant. By combining the power of AI with a user-friendly interface, it offers:

- **Instant Feedback**: Get immediate insights on your code quality and potential improvements.
- **Learning Opportunities**: Understand best practices and industry standards through AI suggestions.
- **Collaboration**: Easily share and discuss code snippets with team members or the community.
- **Time Efficiency**: Streamline your code review process and focus on writing better code.
- **Continuous Improvement**: Track your progress and see how your coding skills evolve over time.

## Video Demo

[SnippetVerse AI Video Demo] https://github.com/user-attachments/assets/c8478694-cb86-4b17-bf7c-d8e5e267def6

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Biku213/SnippetVerse-AI.git
   cd SnippetVerse-AI
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. ## Environment Variables

   To run SnippetVerse AI, you need to set up a few environment variables. Create a `.env.local` file in the root directory of your project and include the following variables:

   ```bash
   # Convex Deployment Information
   CONVEX_DEPLOYMENT=your_convex_deployment_id
   NEXT_PUBLIC_CONVEX_URL=https://your_convex_url

   # Google AI API Key
   GEMINI_API_KEY=your_gemini_api_key

   # Clerk Authentication Information
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   ```

4. Start the Convex backend:
   Make sure you have the Convex CLI installed. If you haven’t installed it yet, run:
   ```bash
   npm install -g convex
   ```

````

Then, in the root of your project, run:

```bash
convex dev
```

5. Start the development server:
   In another terminal window, run:

   ```bash
   npm run dev
   ```

6. Open `http://localhost:3000` in your browser to use SnippetVerse AI.

## Technical Stack

- Frontend: Next.js with TypeScript
- Backend: Convex
- Authentication: Clerk
- AI Integration: Google's Gemini AI
- UI: shadcn/ui and Tailwind CSS
- Code Editor: Monaco Editor
- State Management: React hooks and Convex
- Notifications: react-hot-toast
````
