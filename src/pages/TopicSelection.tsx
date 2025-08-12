import { useParams, useNavigate } from "react-router-dom";
import { TopicProgressCard } from "@/components/TopicProgressCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { topics, chapters } from "@/data/mockData";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const TopicSelection = () => {
  const { classId, subjectId, chapterId } = useParams<{ 
    classId: string; 
    subjectId: string; 
    chapterId: string; 
  }>();
  const navigate = useNavigate();

  const chapterTopics = topics[chapterId || ""] || [];
  const chapter = chapters[subjectId || ""]?.find(c => c.id === chapterId);
  
  // Get completed questions for progress calculation
  const [completedQuestions] = useLocalStorage<string[]>("completed_questions", []);

  // Calculate progress for each topic (mock data for now)
  const getTopicProgress = (topicId: string) => {
    // This would normally come from a service that tracks per-topic progress
    // For now, returning random progress for demonstration
    const completed = completedQuestions.filter(q => q.startsWith(topicId)).length;
    const total = Math.max(10, completed + Math.floor(Math.random() * 20)); // Mock total
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 animate-fade-in">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/chapters/${classId}/${subjectId}`)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{chapter?.name}</h1>
            <p className="text-muted-foreground">Choose a topic</p>
          </div>
        </div>

        {/* Topic List */}
        <div className="space-y-3">
          {chapterTopics.map((topic, index) => {
            const progress = getTopicProgress(topic.id);
            return (
              <TopicProgressCard
                key={topic.id}
                topicId={topic.id}
                topicName={topic.name}
                topicNumber={index + 1}
                progress={progress}
                onClick={() => navigate(`/question-list/${classId}/${subjectId}/${chapterId}/${topic.id}`)}
              />
            );
          })}
        </div>

        {chapterTopics.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <p className="text-muted-foreground">No topics available for this chapter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicSelection;