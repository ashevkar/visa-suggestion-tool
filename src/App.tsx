import React, { useState, useCallback } from "react";
import {
  Bot,
  Clipboard,
  Check,
  Code,
  Cpu,
  CornerDownLeft,
  Heart,
} from "lucide-react";
import {
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
} from "@mui/icons-material";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

// Define the result type
interface GenerationResult {
  suggestedComponents: string[];
  codeSnippet: string;
}

// Main App Component
export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!prompt || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:3001/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `API request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Sorry, something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  const handleCopyCode = () => {
    if (!result?.codeSnippet) return;

    const textarea = document.createElement("textarea");
    textarea.value = result.codeSnippet;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
    document.body.removeChild(textarea);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };
 

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={darkMode ? 'dark' : ''}>
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen font-sans relative">
                      <div className="absolute top-4 right-4 z-10">
              <IconButton 
                onClick={toggleDarkMode}
                size="small"
                className="text-gray-600  dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-200"
              >
                {darkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
              </IconButton>
            </div>
          
          <div className="container mx-auto p-4 md:p-8">
            <header className="text-center mb-8 md:mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900 dark:text-blue-100">
                Visa UI Generator
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                Describe your desired UI and get{" "}
                <code className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-md">
                  @visa/nova-react
                </code>{" "}
                code instantly.
              </p>
            </header>

            <main className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., A login form with email, password, and a submit button"
                  className="w-full p-4 pr-32 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 resize-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  rows={3}
                  disabled={isLoading}
                />

                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt}
                  className="absolute top-2/3 right-4 -translate-y-1/2 flex items-center justify-center gap-2 bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:scale-100"
                >
                  {isLoading ? (
                    <>
                      <Spinner /> Generating...
                    </>
                  ) : (
                    <>
                      Generate <CornerDownLeft size={18} />
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {result && (
                <div className="mt-8 grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1">
                    <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                      <Cpu size={22} />
                      Suggested Components
                    </h2>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {result.suggestedComponents.map(
                        (comp: string, index: number) => (
                          <span
                            key={index}
                            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full"
                          >
                            {comp}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                      <Code size={22} />
                      Generated Code
                    </h2>
                    <div className="mt-4 relative bg-gray-900 dark:bg-gray-950 text-white rounded-xl p-4 font-mono text-sm overflow-x-auto">
                      <button
                        onClick={handleCopyCode}
                        className="absolute top-2 right-3 p-2 bg-gray-700 dark:bg-gray-600 rounded-md hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors"
                        title="Copy code"
                      >
                        {copied ? (
                          <Check size={16} className="text-green-400" />
                        ) : (
                          <Clipboard size={16} />
                        )}
                      </button>
                      <pre>
                        <code className="whitespace-pre-wrap">
                          {result.codeSnippet}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {!isLoading && !result && (
                <div className="text-center mt-12 text-gray-500 dark:text-gray-400">
                  <Bot size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">
                    Your generated UI code will appear here.
                  </p>
                  <p>
                    Try an example like "A user profile card with an avatar
                    and contact info".
                  </p>
                </div>
              )}
            </main>

            <footer className="text-center mt-8 text-gray-500 dark:text-gray-400 text-sm">
              <p>
                To use the generated code, you must have{" "}
                <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                  @visa/nova-react
                </code>{" "}
                installed in your project.
              </p>
              <p className="mt-1">
                Run:{" "}
                <code className="text-xs bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                  npm install @visa/nova-react @visa/charts-react
                </code>
              </p>
              <span className="flex items-center justify-center gap-1 text-sm opacity-75 mt-4">
                Made with <Heart size={15} className="opacity-50" /> by
                Aishwarya Shevkar.
              </span>
            </footer>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

// A simple spinner component for loading states
const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);
