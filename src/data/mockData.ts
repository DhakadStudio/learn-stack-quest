export interface Subject {
  id: string;
  name: string;
  icon: string;
}

export interface Chapter {
  id: string;
  name: string;
  subjectId: string;
}

export interface Topic {
  id: string;
  name: string;
  chapterId: string;
}

// Question difficulty levels
export type QuestionDifficulty = "simple" | "medium" | "hard";

// Question completion status
export type QuestionStatus = "not_attempted" | "completed" | "bookmarked";

// Concepts used in questions
export interface Concept {
  id: string;
  name: string;
  description: string;
}

// Enhanced Question interface with new properties
export interface Question {
  id: string;
  text: string;
  answer: string;
  topicId: string;
  chapter: string;
  topic: string;
  difficulty: QuestionDifficulty;
  concepts: string[]; // Array of concept IDs
  isMultiConcept: boolean; // Whether question uses multiple concepts
  estimatedTime: number; // Estimated time to solve in minutes
  status?: QuestionStatus; // User's completion status
}

export const subjects: Record<string, Subject[]> = {
  "10": [
    { id: "math10", name: "Mathematics", icon: "📐" },
    { id: "sci10", name: "Science", icon: "🔬" },
    { id: "eng10", name: "English", icon: "📚" },
    { id: "sst10", name: "Social Science", icon: "🌍" },
    { id: "ad1", name: "Study Boost Pro", icon: "⭐" }, // Ad
  ],
  "12": [
    { id: "math12", name: "Mathematics", icon: "📊" },
    { id: "phy12", name: "Physics", icon: "⚛️" },
    { id: "chem12", name: "Chemistry", icon: "🧪" },
    { id: "bio12", name: "Biology", icon: "🧬" },
    { id: "eng12", name: "English", icon: "✍️" },
    { id: "ad2", name: "Premium Notes", icon: "💎" }, // Ad
  ],
};

export const chapters: Record<string, Chapter[]> = {
  "math10": [
    { id: "ch1", name: "Real Numbers", subjectId: "math10" },
    { id: "ch2", name: "Polynomials", subjectId: "math10" },
    { id: "ch3", name: "Linear Equations", subjectId: "math10" },
    { id: "ad3", name: "Math Mastery Course", subjectId: "math10" }, // Ad
  ],
  "sci10": [
    { id: "ch4", name: "Light - Reflection", subjectId: "sci10" },
    { id: "ch5", name: "Life Processes", subjectId: "sci10" },
    { id: "ch6", name: "Acids and Bases", subjectId: "sci10" },
  ],
  "math12": [
    { id: "ch7", name: "Relations and Functions", subjectId: "math12" },
    { id: "ch8", name: "Inverse Trigonometry", subjectId: "math12" },
    { id: "ch9", name: "Matrices", subjectId: "math12" },
  ],
  "phy12": [
    { id: "ch10", name: "Electric Charges", subjectId: "phy12" },
    { id: "ch11", name: "Current Electricity", subjectId: "phy12" },
    { id: "ch12", name: "Magnetic Effects", subjectId: "phy12" },
  ],
};

export const topics: Record<string, Topic[]> = {
  "ch1": [
    { id: "t1", name: "Rational Numbers", chapterId: "ch1" },
    { id: "t2", name: "Irrational Numbers", chapterId: "ch1" },
    { id: "t3", name: "Real Number System", chapterId: "ch1" },
  ],
  "ch2": [
    { id: "t4", name: "Introduction to Polynomials", chapterId: "ch2" },
    { id: "t5", name: "Geometrical Meaning", chapterId: "ch2" },
    { id: "t6", name: "Relationship between Zeros", chapterId: "ch2" },
  ],
};

// Concepts used across questions
export const concepts: Record<string, Concept> = {
  "c1": { id: "c1", name: "Fraction Conversion", description: "Converting decimals to fractions" },
  "c2": { id: "c2", name: "Proof by Contradiction", description: "Mathematical proof technique" },
  "c3": { id: "c3", name: "Decimal Division", description: "Converting fractions to decimals" },
  "c4": { id: "c4", name: "Irrational Numbers", description: "Understanding irrational number properties" },
  "c5": { id: "c5", name: "GCD Calculation", description: "Greatest Common Divisor calculation" },
  "c6": { id: "c6", name: "Algebraic Manipulation", description: "Basic algebraic operations" }
};

// Enhanced questions with difficulty, concepts, and time estimates
export const questions: Record<string, Question[]> = {
  "t1": [
    {
      id: "q1",
      text: "Express 0.36̄ as a fraction in simplest form.",
      answer: "Let x = 0.36̄ = 0.363636...\nMultiplying by 100: 100x = 36.363636...\nSubtracting: 100x - x = 36\n99x = 36\nx = 36/99 = 4/11\nTherefore, 0.36̄ = 4/11",
      topicId: "t1",
      chapter: "Real Numbers",
      topic: "Rational Numbers",
      difficulty: "medium",
      concepts: ["c1", "c6"],
      isMultiConcept: true,
      estimatedTime: 3
    },
    {
      id: "q2",
      text: "Show that 3 + 2√5 is an irrational number.",
      answer: "Assume 3 + 2√5 is rational. Then 3 + 2√5 = p/q where p, q are integers and q ≠ 0.\nRearranging: 2√5 = p/q - 3 = (p - 3q)/q\nTherefore: √5 = (p - 3q)/(2q)\nSince (p - 3q)/(2q) is rational but √5 is irrational, we have a contradiction.\nHence, 3 + 2√5 is irrational.",
      topicId: "t1",
      chapter: "Real Numbers",
      topic: "Rational Numbers",
      difficulty: "hard",
      concepts: ["c2", "c4", "c6"],
      isMultiConcept: true,
      estimatedTime: 5
    },
    {
      id: "q3",
      text: "Find the decimal expansion of 7/8.",
      answer: "To find 7/8, we divide 7 by 8:\n7 ÷ 8 = 0.875\nTherefore, 7/8 = 0.875 (terminating decimal)",
      topicId: "t1",
      chapter: "Real Numbers",
      topic: "Rational Numbers",
      difficulty: "simple",
      concepts: ["c3"],
      isMultiConcept: false,
      estimatedTime: 2
    },
    {
      id: "q4",
      text: "Prove that √2 is an irrational number.",
      answer: "Proof by contradiction:\nAssume √2 is rational. Then √2 = p/q where p, q are coprime integers.\nSquaring both sides: 2 = p²/q²\nTherefore: p² = 2q²\nThis means p² is even, so p is even. Let p = 2k.\nThen: (2k)² = 2q² → 4k² = 2q² → 2k² = q²\nThis means q² is even, so q is even.\nBut if both p and q are even, they are not coprime - contradiction!\nTherefore, √2 is irrational.",
      topicId: "t1",
      chapter: "Real Numbers",
      topic: "Rational Numbers",
      difficulty: "hard",
      concepts: ["c2", "c4"],
      isMultiConcept: true,
      estimatedTime: 6
    },
    {
      id: "q5",
      text: "Express 0.625 as a fraction in lowest terms.",
      answer: "0.625 = 625/1000\nTo simplify, find GCD of 625 and 1000:\n625 = 5⁴ and 1000 = 2³ × 5³\nGCD = 5³ = 125\n625/1000 = (625 ÷ 125)/(1000 ÷ 125) = 5/8\nTherefore, 0.625 = 5/8",
      topicId: "t1",
      chapter: "Real Numbers",
      topic: "Rational Numbers",
      difficulty: "medium",
      concepts: ["c1", "c5"],
      isMultiConcept: true,
      estimatedTime: 4
    },
    // Additional questions for better filtering demonstration
    {
      id: "q6",
      text: "Convert 1/3 to decimal form.",
      answer: "1 ÷ 3 = 0.333... = 0.3̄\nTherefore, 1/3 = 0.3̄ (non-terminating repeating decimal)",
      topicId: "t1",
      chapter: "Real Numbers",
      topic: "Rational Numbers",
      difficulty: "simple",
      concepts: ["c3"],
      isMultiConcept: false,
      estimatedTime: 1
    },
    {
      id: "q7",
      text: "Prove that √3 + √2 is irrational.",
      answer: "Assume √3 + √2 is rational = p/q.\nThen √3 = p/q - √2\nSquaring: 3 = (p/q)² - 2(p/q)√2 + 2\n1 = (p/q)² - 2(p/q)√2\n√2 = [(p/q)² - 1] / [2(p/q)]\nThis makes √2 rational, which is a contradiction.\nTherefore, √3 + √2 is irrational.",
      topicId: "t1",
      chapter: "Real Numbers",
      topic: "Rational Numbers",
      difficulty: "hard",
      concepts: ["c2", "c4", "c6"],
      isMultiConcept: true,
      estimatedTime: 7
    }
  ]
};

export const adSubjects = ["ad1", "ad2"];
export const adChapters = ["ad3"];

export function isAd(id: string): boolean {
  return adSubjects.includes(id) || adChapters.includes(id);
}