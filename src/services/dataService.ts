import { supabase } from '@/integrations/supabase/client';
import { useLocalData } from '@/hooks/useLocalData';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { toast } from 'sonner';
import { localDatabase } from './localDatabase';
import { subjects, chapters, topics } from '@/data/mockData';

export interface Subject {
  id: string;
  class_id: string;
  name: string;
  icon?: string;
}

export interface Chapter {
  id: string;
  subject_id: string;
  name: string;
  chapter_number?: number;
}

export interface Topic {
  id: string;
  chapter_id: string;
  name: string;
  topic_number?: number;
}

export interface Question {
  id: string;
  topic_id: string;
  question_text: string;
  answer_text: string;
  year?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  image_url?: string;
  concepts?: string[];
  estimated_time?: number;
}

export interface TopicProgress {
  total_questions: number;
  completed_questions: number;
  percentage_completed: number;
}

// Service hooks using local data with error handling
export const useSubjects = (classId: string) => {
  try {
    // Use local data directly - no network calls needed
    const classSubjects = subjects[classId] || [];
    return {
      data: classSubjects,
      loading: false,
      error: null,
      refreshData: () => Promise.resolve(),
      clearCache: () => Promise.resolve(),
      fetchData: () => Promise.resolve()
    };
  } catch (error) {
    console.error('Error getting subjects:', error);
    return {
      data: [],
      loading: false,
      error: 'Failed to load subjects',
      refreshData: () => Promise.resolve(),
      clearCache: () => Promise.resolve(),
      fetchData: () => Promise.resolve()
    };
  }
};

export const useChapters = (subjectId: string) => {
  try {
    // Use local data directly - no network calls needed
    const subjectChapters = chapters[subjectId] || [];
    return {
      data: subjectChapters,
      loading: false,
      error: null,
      refreshData: () => Promise.resolve(),
      clearCache: () => Promise.resolve(),
      fetchData: () => Promise.resolve()
    };
  } catch (error) {
    console.error('Error getting chapters:', error);
    return {
      data: [],
      loading: false,
      error: 'Failed to load chapters',
      refreshData: () => Promise.resolve(),
      clearCache: () => Promise.resolve(),
      fetchData: () => Promise.resolve()
    };
  }
};

export const useTopics = (chapterId: string) => {
  try {
    // Use local data directly - no network calls needed
    const chapterTopics = topics[chapterId] || [];
    return {
      data: chapterTopics,
      loading: false,
      error: null,
      refreshData: () => Promise.resolve(),
      clearCache: () => Promise.resolve(),
      fetchData: () => Promise.resolve()
    };
  } catch (error) {
    console.error('Error getting topics:', error);
    return {
      data: [],
      loading: false,
      error: 'Failed to load topics',
      refreshData: () => Promise.resolve(),
      clearCache: () => Promise.resolve(),
      fetchData: () => Promise.resolve()
    };
  }
};

export const useQuestions = (topicId: string) => {
  const { isOnline } = useNetworkStatus();
  
  return useLocalData(
    `questions_${topicId}`,
    async () => {
      try {
        // Initialize local database
        await localDatabase.initialize();
        
        if (isOnline) {
          // Try to fetch from Supabase first
          const { data, error } = await supabase
            .from('questions')
            .select('*')
            .eq('topic_id', topicId)
            .order('created_at');
          
          if (error) {
            console.error('Supabase error:', error);
            throw error;
          }
          
          if (data && data.length > 0) {
            // Save to local database for offline access
            await localDatabase.saveQuestions(topicId, data);
            return data;
          }
        }
        
        // Fallback to local database
        const localQuestions = await localDatabase.getQuestions(topicId);
        if (localQuestions.length > 0) {
          if (!isOnline) {
            toast.info('Using offline data');
          }
          return localQuestions;
        }
        
        // If no data found anywhere, show appropriate message
        if (!isOnline) {
          toast.error('No internet connection and no offline data available');
        } else {
          toast.info('No questions found for this topic');
        }
        
        return [];
      } catch (error) {
        console.error('Error fetching questions:', error);
        
        // Try local database as final fallback
        try {
          const localQuestions = await localDatabase.getQuestions(topicId);
          if (localQuestions.length > 0) {
            toast.info('Using offline data');
            return localQuestions;
          }
        } catch (localError) {
          console.error('Local database error:', localError);
        }
        
        toast.error('Failed to load questions');
        return [];
      }
    }
  );
};

export const useTopicProgress = (topicId: string) => {
  const { isOnline } = useNetworkStatus();
  
  return useLocalData(
    `topic_progress_${topicId}`,
    async () => {
      if (!isOnline) {
        return { total_questions: 0, completed_questions: 0, percentage_completed: 0 };
      }
      
      // Get total questions for this topic
      const { count: totalQuestions } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('topic_id', topicId);
      
      // This would require user authentication to get actual progress
      // For now, return basic structure
      return {
        total_questions: totalQuestions || 0,
        completed_questions: 0,
        percentage_completed: 0
      };
    },
    1000 * 60 * 5 // 5 minutes cache for progress data
  );
};