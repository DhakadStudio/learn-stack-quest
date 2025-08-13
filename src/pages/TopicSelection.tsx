import { useParams, useNavigate } from "react-router-dom";
import { SelectionCard } from "@/components/SelectionCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { topics, chapters } from "@/data/mockData";

const TopicSelection = () => {
  const { classId, subjectId, chapterId } = useParams<{ 
    classId: string; 
    subjectId: string; 
    chapterId: string; 
  }>();
  const navigate = useNavigate();

  const chapterTopics = topics[chapterId || ""] || [];
  const chapter = chapters[subjectId || ""]?.find(c => c.id === chapterId);

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
          {chapterTopics.map((topic, index) => (
            <SelectionCard
              key={topic.id}
              title={`${index + 1}. ${topic.name}`}
              onClick={() => navigate(`/question-list/${classId}/${subjectId}/${chapterId}/${topic.id}`)}
              className="h-16"
            />
          ))}
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