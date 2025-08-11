import { useParams, useNavigate } from "react-router-dom";
import { SelectionCard } from "@/components/SelectionCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { chapters, subjects, isAd } from "@/data/mockData";

const ChapterSelection = () => {
  const { classId, subjectId } = useParams<{ classId: string; subjectId: string }>();
  const navigate = useNavigate();

  const subjectChapters = chapters[subjectId || ""] || [];
  const subject = subjects[classId || ""]?.find(s => s.id === subjectId);

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 animate-fade-in">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/subjects/${classId}`)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{subject?.name}</h1>
            <p className="text-muted-foreground">Choose a chapter</p>
          </div>
        </div>

        {/* Chapter List */}
        <div className="space-y-3">
          {subjectChapters.map((chapter, index) => (
            <SelectionCard
              key={chapter.id}
              title={`${index + 1}. ${chapter.name}`}
              onClick={() => {
                if (isAd(chapter.id)) {
                  // Handle ad click
                  console.log("Ad clicked:", chapter.name);
                } else {
                  navigate(`/topics/${classId}/${subjectId}/${chapter.id}`);
                }
              }}
              className="h-16"
              isAd={isAd(chapter.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChapterSelection;