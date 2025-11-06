import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { localDatabase } from "@/services/localDatabase";
import { OfflineIndicator } from "@/components/OfflineIndicator";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
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
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/subjects/:classId" element={<ProtectedRoute><SubjectSelection /></ProtectedRoute>} />
            <Route path="/chapters/:classId/:subjectId" element={<ProtectedRoute><ChapterSelection /></ProtectedRoute>} />
            <Route path="/topics/:classId/:subjectId/:chapterId" element={<ProtectedRoute><TopicSelection /></ProtectedRoute>} />
            <Route path="/question-list/:classId/:subjectId/:chapterId/:topicId" element={<ProtectedRoute><QuestionSelection /></ProtectedRoute>} />
            <Route path="/questions/:classId/:subjectId/:chapterId/:topicId" element={<ProtectedRoute><QuestionSession /></ProtectedRoute>} />
            <Route path="/bookmarks" element={<ProtectedRoute><BookmarkedQuestions /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
