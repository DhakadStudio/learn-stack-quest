import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SubjectSelection from "./pages/SubjectSelection";
import ChapterSelection from "./pages/ChapterSelection";
import TopicSelection from "./pages/TopicSelection";
import QuestionSession from "./pages/QuestionSession";
import BookmarkedQuestions from "./pages/BookmarkedQuestions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/subjects/:classId" element={<SubjectSelection />} />
          <Route path="/chapters/:classId/:subjectId" element={<ChapterSelection />} />
          <Route path="/topics/:classId/:subjectId/:chapterId" element={<TopicSelection />} />
          <Route path="/questions/:classId/:subjectId/:chapterId/:topicId" element={<QuestionSession />} />
          <Route path="/bookmarks" element={<BookmarkedQuestions />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
