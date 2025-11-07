import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Rate limiting state
interface RateLimitState {
  attempts: number;
  lastAttempt: number;
  blockedUntil: number;
}

const getRateLimitKey = (action: string, identifier: string) => 
  `rate_limit_${action}_${identifier}`;

const getStoredRateLimit = (key: string): RateLimitState => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : { attempts: 0, lastAttempt: 0, blockedUntil: 0 };
  } catch {
    return { attempts: 0, lastAttempt: 0, blockedUntil: 0 };
  }
};

const setStoredRateLimit = (key: string, state: RateLimitState) => {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    // Silently fail if localStorage is unavailable
  }
};

const checkRateLimit = (action: string, identifier: string): { allowed: boolean; waitTime?: number } => {
  const key = getRateLimitKey(action, identifier);
  const state = getStoredRateLimit(key);
  const now = Date.now();

  // Check if currently blocked
  if (state.blockedUntil > now) {
    return { allowed: false, waitTime: Math.ceil((state.blockedUntil - now) / 1000) };
  }

  // Reset if last attempt was more than 15 minutes ago
  if (now - state.lastAttempt > 15 * 60 * 1000) {
    setStoredRateLimit(key, { attempts: 0, lastAttempt: 0, blockedUntil: 0 });
    return { allowed: true };
  }

  // Allow up to 5 attempts
  if (state.attempts >= 5) {
    // Calculate exponential backoff: 2^(attempts-5) minutes, max 30 minutes
    const backoffMinutes = Math.min(Math.pow(2, state.attempts - 4), 30);
    const blockedUntil = now + backoffMinutes * 60 * 1000;
    setStoredRateLimit(key, { ...state, blockedUntil });
    return { allowed: false, waitTime: backoffMinutes * 60 };
  }

  return { allowed: true };
};

const recordAttempt = (action: string, identifier: string, success: boolean) => {
  const key = getRateLimitKey(action, identifier);
  const state = getStoredRateLimit(key);
  const now = Date.now();

  if (success) {
    // Clear rate limit on success
    setStoredRateLimit(key, { attempts: 0, lastAttempt: 0, blockedUntil: 0 });
  } else {
    // Increment attempts on failure
    setStoredRateLimit(key, {
      attempts: state.attempts + 1,
      lastAttempt: now,
      blockedUntil: 0
    });
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    // Check rate limit
    const rateLimitCheck = checkRateLimit('signup', email);
    if (!rateLimitCheck.allowed) {
      const error = {
        message: `Too many signup attempts. Please try again in ${rateLimitCheck.waitTime} seconds.`
      };
      toast.error(error.message);
      return { error };
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        recordAttempt('signup', email, false);
        throw error;
      }

      recordAttempt('signup', email, true);
      toast.success('Account created! Please check your email to verify.');
      return { error: null };
    } catch (error: any) {
      console.error('Sign up failed');
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    // Check rate limit
    const rateLimitCheck = checkRateLimit('signin', email);
    if (!rateLimitCheck.allowed) {
      const error = {
        message: `Too many signin attempts. Please try again in ${rateLimitCheck.waitTime} seconds.`
      };
      toast.error(error.message);
      return { error };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        recordAttempt('signin', email, false);
        throw error;
      }

      recordAttempt('signin', email, true);
      toast.success('Signed in successfully!');
      return { error: null };
    } catch (error: any) {
      console.error('Sign in failed');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out failed');
      toast.error('Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
