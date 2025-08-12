import { supabase } from '@/integrations/supabase/client';
import { useLocalData } from '@/hooks/useLocalData';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { toast } from 'sonner';

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

// Service hooks using the data fetching pattern
export const useSubjects = (classId: string) => {
  const { isOnline } = useNetworkStatus();
  
  return useLocalData(
    `subjects_${classId}`,
    async () => {
      if (!isOnline) {
        toast.error('No internet connection. Please check your network.');
        throw new Error('No internet connection');
      }
      
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('class_id', classId)
        .order('name');
      
      if (error) throw error;
      return data || [];
    }
  );
};

export const useChapters = (subjectId: string) => {
  const { isOnline } = useNetworkStatus();
  
  return useLocalData(
    `chapters_${subjectId}`,
    async () => {
      if (!isOnline) {
        toast.error('No internet connection. Please check your network.');
        throw new Error('No internet connection');
      }
      
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('subject_id', subjectId)
        .order('chapter_number');
      
      if (error) throw error;
      return data || [];
    }
  );
};

export const useTopics = (chapterId: string) => {
  const { isOnline } = useNetworkStatus();
  
  return useLocalData(
    `topics_${chapterId}`,
    async () => {
      if (!isOnline) {
        toast.error('No internet connection. Please check your network.');
        throw new Error('No internet connection');
      }
      
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('chapter_id', chapterId)
        .order('topic_number');
      
      if (error) throw error;
      return data || [];
    }
  );
};

export const useQuestions = (topicId: string) => {
  const { isOnline } = useNetworkStatus();
  
  return useLocalData(
    `questions_${topicId}`,
    async () => {
      if (!isOnline) {
        toast.error('No internet connection. Please check your network.');
        throw new Error('No internet connection');
      }
      
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('topic_id', topicId)
        .order('created_at');
      
      if (error) throw error;
      return data || [];
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