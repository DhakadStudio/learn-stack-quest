import { useState } from 'react';
import { BarChart3, Clock, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUserStats } from '@/hooks/useUserStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const PerformanceButton = () => {
  const { stats, formatTime } = useUserStats();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 bg-background/50 backdrop-blur-sm"
        >
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Performance</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Your Performance
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Questions Solved
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-2xl font-bold text-primary">
                  {stats.totalQuestionsCompleted}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stats.questionsToday} today
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  Time Spent
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-2xl font-bold text-secondary">
                  {formatTime(stats.totalTimeSpent)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-2xl font-bold text-accent">
                  {stats.currentStreak}
                </div>
                <div className="text-xs text-muted-foreground">days</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-1">
                  <Trophy className="w-3 h-3" />
                  Best Streak
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-2xl font-bold text-warning">
                  {stats.longestStreak}
                </div>
                <div className="text-xs text-muted-foreground">days</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Accuracy Rate
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">
                  {stats.totalQuestionsAttempted > 0 
                    ? Math.round((stats.totalQuestionsCompleted / stats.totalQuestionsAttempted) * 100)
                    : 0}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {stats.totalQuestionsCompleted}/{stats.totalQuestionsAttempted}
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${stats.totalQuestionsAttempted > 0 
                      ? (stats.totalQuestionsCompleted / stats.totalQuestionsAttempted) * 100 
                      : 0}%` 
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};