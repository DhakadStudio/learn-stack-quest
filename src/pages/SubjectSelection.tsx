import { useParams, useNavigate } from "react-router-dom";
import { SelectionCard } from "@/components/SelectionCard";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useSubjects } from "@/services/dataService";
import { ArrowLeft } from "lucide-react";

const SubjectSelection = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { data: classSubjects, loading, error } = useSubjects(classId || "");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="min-h-screen bg-background/95 backdrop-blur-sm">
          <div className="max-w-md mx-auto px-4 py-8">
            <LoadingSkeleton type="list" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="min-h-screen bg-background/95 backdrop-blur-sm">
        <div className="max-w-md mx-auto px-4 py-8 space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4 animate-fade-in">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="shadow-card bg-background/50 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Class {classId}</h1>
              <p className="text-muted-foreground">Choose a subject to continue</p>
            </div>
          </div>

          {/* Subject Grid */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Available Subjects</h2>
            <div className="grid grid-cols-1 gap-3">
              {classSubjects?.map((subject) => (
                <SelectionCard
                  key={subject.id}
                  title={subject.name}
                  icon={<span className="text-2xl">{subject.icon}</span>}
                  onClick={() => navigate(`/chapters/${classId}/${subject.id}`)}
                  className="h-16 flex-row justify-start text-left pl-6"
                />
              )) || []}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelection;