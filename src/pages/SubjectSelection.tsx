import { useParams, useNavigate } from "react-router-dom";
import { SelectionCard } from "@/components/SelectionCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { subjects, isAd } from "@/data/mockData";

const SubjectSelection = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();

  const classSubjects = subjects[classId || ""] || [];

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 animate-fade-in">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Class {classId}</h1>
            <p className="text-muted-foreground">Choose a subject</p>
          </div>
        </div>

        {/* Subject Grid */}
        <div className="grid grid-cols-2 gap-4">
          {classSubjects.map((subject) => (
            <SelectionCard
              key={subject.id}
              title={subject.name}
              icon={<span className="text-2xl">{subject.icon}</span>}
              onClick={() => {
                if (isAd(subject.id)) {
                  // Handle ad click
                  console.log("Ad clicked:", subject.name);
                } else {
                  navigate(`/chapters/${classId}/${subject.id}`);
                }
              }}
              isAd={isAd(subject.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectSelection;