import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json({ error: 'Missing code or language' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Step 1: Analyze the code
    const analysisPrompt = `Analyze the following ${language} code and provide suggestions for improvement, potential bugs, and best practices:

${code}

Please format your response in the following way:
1. Code Quality: [Brief overview of code quality]
2. Potential Bugs: [List any potential bugs]
3. Suggestions for Improvement: [List suggestions]
4. Best Practices: [List any best practices that could be applied]`;

    const analysisResult = await model.generateContent(analysisPrompt);
    const analysis = analysisResult.response.text();

    // Step 2: Refine the code based on the analysis
    const refinementPrompt = `Given the following ${language} code and its analysis, please refine the code to address the issues and implement the suggestions. If no refinement is needed, return the original code.

Original Code:
${code}

Analysis:
${analysis}

Please provide the refined code or the original code if no refinement is needed. Only return the code, no explanations.`;

    const refinementResult = await model.generateContent(refinementPrompt);
    const refinedCode = refinementResult.response.text();

    console.log('Analysis response:', analysis);
    console.log('Refinement response:', refinedCode);

    // Check if the refined code is valid
    if (!refinedCode.trim()) {
      throw new Error('Refined code is empty');
    }

    return NextResponse.json({ analysis, refinedCode });
  } catch (error) {
    console.error('Error refining code:', error);
    return NextResponse.json({ 
      error: 'Failed to refine code', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}