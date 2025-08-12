import { Flame, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useUserStats } from '@/hooks/useUserStats';

export const StreakDisplay = () => {
  const { stats } = useUserStats();

  return (
    <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-200/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-full">
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="text-lg font-bold text-orange-700 dark:text-orange-300">
                {stats.currentStreak} Day Streak
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Best: {stats.longestStreak} days
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">
              🔥
            </div>
            <div className="text-xs text-muted-foreground">
              Keep it up!
            </div>
          </div>
        </div>
        
        {stats.currentStreak === 0 && (
          <div className="mt-3 p-2 bg-muted/50 rounded text-center">
            <div className="text-sm text-muted-foreground">
              Solve a question to start your streak! 💪
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};