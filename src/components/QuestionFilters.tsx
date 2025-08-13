import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Filter, 
  CheckCircle2, 
  Circle, 
  Target, 
  Layers,
  Zap,
  Clock,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuestionFilters {
  status: "all" | "completed" | "incomplete";
  difficulty: "all" | "simple" | "medium" | "hard";
  concepts: "all" | "single" | "multi";
}

interface QuestionFiltersProps {
  filters: QuestionFilters;
  onFiltersChange: (filters: QuestionFilters) => void;
  questionCounts: {
    total: number;
    completed: number;
    incomplete: number;
    simple: number;
    medium: number;
    hard: number;
    single: number;
    multi: number;
  };
}

/**
 * Question Filters Component
 * 
 * Provides filtering options for questions based on:
 * - Completion status (all, completed, incomplete)
 * - Difficulty level (all, simple, medium, hard)
 * - Concept complexity (all, single concept, multi concept)
 */
export const QuestionFilters = ({ 
  filters, 
  onFiltersChange, 
  questionCounts 
}: QuestionFiltersProps) => {

  // Update specific filter while keeping others
  const updateFilter = <K extends keyof QuestionFilters>(
    key: K, 
    value: QuestionFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="bg-gradient-card border border-border/50">
      <CardContent className="p-4 space-y-4">
        {/* Filter header */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Filters</h3>
        </div>

        {/* Completion Status Filter */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Status
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.status === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("status", "all")}
              className="h-7 px-3 text-xs"
            >
              All ({questionCounts.total})
            </Button>
            <Button
              variant={filters.status === "incomplete" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("status", "incomplete")}
              className="h-7 px-3 text-xs"
            >
              <Circle className="w-3 h-3 mr-1" />
              Incomplete ({questionCounts.incomplete})
            </Button>
            <Button
              variant={filters.status === "completed" ? "secondary" : "outline"}
              size="sm"
              onClick={() => updateFilter("status", "completed")}
              className="h-7 px-3 text-xs"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Completed ({questionCounts.completed})
            </Button>
          </div>
        </div>

        {/* Difficulty Filter */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Difficulty
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.difficulty === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("difficulty", "all")}
              className="h-7 px-3 text-xs"
            >
              All
            </Button>
            <Button
              variant={filters.difficulty === "simple" ? "secondary" : "outline"}
              size="sm"
              onClick={() => updateFilter("difficulty", "simple")}
              className={cn(
                "h-7 px-3 text-xs",
                filters.difficulty === "simple" && "bg-secondary text-secondary-foreground"
              )}
            >
              <Zap className="w-3 h-3 mr-1" />
              Simple ({questionCounts.simple})
            </Button>
            <Button
              variant={filters.difficulty === "medium" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("difficulty", "medium")}
              className={cn(
                "h-7 px-3 text-xs",
                filters.difficulty === "medium" && "bg-warning text-warning-foreground"
              )}
            >
              <Clock className="w-3 h-3 mr-1" />
              Medium ({questionCounts.medium})
            </Button>
            <Button
              variant={filters.difficulty === "hard" ? "destructive" : "outline"}
              size="sm"
              onClick={() => updateFilter("difficulty", "hard")}
              className="h-7 px-3 text-xs"
            >
              <Target className="w-3 h-3 mr-1" />
              Hard ({questionCounts.hard})
            </Button>
          </div>
        </div>

        {/* Concept Complexity Filter */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Layers className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Concepts
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.concepts === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("concepts", "all")}
              className="h-7 px-3 text-xs"
            >
              All
            </Button>
            <Button
              variant={filters.concepts === "single" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("concepts", "single")}
              className="h-7 px-3 text-xs"
            >
              <Target className="w-3 h-3 mr-1" />
              Single ({questionCounts.single})
            </Button>
            <Button
              variant={filters.concepts === "multi" ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter("concepts", "multi")}
              className="h-7 px-3 text-xs"
            >
              <Layers className="w-3 h-3 mr-1" />
              Multi ({questionCounts.multi})
            </Button>
          </div>
        </div>

        {/* Active filters display */}
        {(filters.status !== "all" || filters.difficulty !== "all" || filters.concepts !== "all") && (
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFiltersChange({ status: "all", difficulty: "all", concepts: "all" })}
              className="h-6 px-2 text-xs"
            >
              Clear All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
