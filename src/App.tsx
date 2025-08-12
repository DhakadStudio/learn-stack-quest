import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { localDatabase } from "@/services/localDatabase";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import Index from "./pages/Index";
import SubjectSelection from "./pages/SubjectSelection";
import ChapterSelection from "./pages/ChapterSelection";
import TopicSelection from "./pages/TopicSelection";
import QuestionSelection from "./pages/QuestionSelection";
import QuestionSession from "./pages/QuestionSession";
import BookmarkedQuestions from "./pages/BookmarkedQuestions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/**
 * Main App Component
 * 
 * Sets up the application with theme provider, query client, and routing
 * Includes both light and dark theme support with system preference detection
 */
const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we've shown loading before in this session
    const hasShownLoading = sessionStorage.getItem('hasShownLoading');
    if (hasShownLoading) {
      setIsLoading(false);
    }
  }, []);

  const handleLoadingComplete = async () => {
    try {
      // Initialize local database
      await localDatabase.initialize();
    } catch (error) {
      console.error('Failed to initialize local database:', error);
    }
    
    sessionStorage.setItem('hasShownLoading', 'true');
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem 
        disableTransitionOnChange
      >
        <LoadingScreen onComplete={handleLoadingComplete} />
      </ThemeProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem 
        disableTransitionOnChange
      >
        <TooltipProvider>
          <OfflineIndicator />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/subjects/:classId" element={<SubjectSelection />} />
              <Route path="/chapters/:classId/:subjectId" element={<ChapterSelection />} />
              <Route path="/topics/:classId/:subjectId/:chapterId" element={<TopicSelection />} />
              {/* Question selection page - shows list of questions to choose from */}
              <Route path="/question-list/:classId/:subjectId/:chapterId/:topicId" element={<QuestionSelection />} />
              {/* Question session page - actual question solving interface */}
              <Route path="/questions/:classId/:subjectId/:chapterId/:topicId" element={<QuestionSession />} />
              <Route path="/bookmarks" element={<BookmarkedQuestions />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
