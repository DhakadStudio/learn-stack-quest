import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

export interface LocalQuestion {
  id: string;
  topic_id: string;
  question_text: string;
  answer_text: string;
  year?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  image_url?: string;
  concepts?: string[];
  estimated_time?: number;
  created_at: string;
}

class LocalDatabase {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private isInitialized = false;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Only initialize on native platforms
      if (Capacitor.isNativePlatform()) {
        // Create database
        this.db = await this.sqlite.createConnection(
          'question_bank_local',
          false,
          'no-encryption',
          1,
          false
        );

        await this.db.open();

        // Create tables
        await this.createTables();
        this.isInitialized = true;
      }
    } catch (error) {
      console.warn('Failed to initialize local database:', error);
      // Continue without local database on error
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) return;

    const createQuestionTable = `
      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        topic_id TEXT NOT NULL,
        question_text TEXT NOT NULL,
        answer_text TEXT NOT NULL,
        year INTEGER,
        difficulty TEXT,
        image_url TEXT,
        concepts TEXT,
        estimated_time INTEGER DEFAULT 60,
        created_at TEXT NOT NULL
      );
    `;

    await this.db.execute(createQuestionTable);
  }

  async saveQuestions(topicId: string, questions: LocalQuestion[]): Promise<void> {
    if (!this.db || !this.isInitialized) return;

    try {
      // Delete existing questions for this topic
      await this.db.run('DELETE FROM questions WHERE topic_id = ?', [topicId]);

      // Insert new questions
      for (const question of questions) {
        await this.db.run(
          `INSERT INTO questions (id, topic_id, question_text, answer_text, year, difficulty, image_url, concepts, estimated_time, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            question.id,
            question.topic_id,
            question.question_text,
            question.answer_text,
            question.year || null,
            question.difficulty || null,
            question.image_url || null,
            question.concepts ? JSON.stringify(question.concepts) : null,
            question.estimated_time || 60,
            question.created_at
          ]
        );
      }
    } catch (error) {
      console.error('Failed to save questions to local database:', error);
    }
  }

  async getQuestions(topicId: string): Promise<LocalQuestion[]> {
    if (!this.db || !this.isInitialized) return [];

    try {
      const result = await this.db.query('SELECT * FROM questions WHERE topic_id = ?', [topicId]);
      
      if (result.values && result.values.length > 0) {
        return result.values.map((row: any) => ({
          id: row.id,
          topic_id: row.topic_id,
          question_text: row.question_text,
          answer_text: row.answer_text,
          year: row.year,
          difficulty: row.difficulty,
          image_url: row.image_url,
          concepts: row.concepts ? JSON.parse(row.concepts) : null,
          estimated_time: row.estimated_time,
          created_at: row.created_at
        }));
      }
    } catch (error) {
      console.error('Failed to get questions from local database:', error);
    }

    return [];
  }

  async clearCache(): Promise<void> {
    if (!this.db || !this.isInitialized) return;

    try {
      await this.db.run('DELETE FROM questions');
    } catch (error) {
      console.error('Failed to clear local database cache:', error);
    }
  }

  async close(): Promise<void> {
    if (this.db && this.isInitialized) {
      try {
        await this.sqlite.closeConnection('question_bank_local', false);
        this.isInitialized = false;
        this.db = null;
      } catch (error) {
        console.error('Failed to close local database:', error);
      }
    }
  }
}

export const localDatabase = new LocalDatabase();