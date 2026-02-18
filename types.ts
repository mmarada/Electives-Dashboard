
export interface Review {
  id: string;
  courseId: string; // e.g., "FIN 579"
  courseTitleContext?: string; // e.g., "Alphanomics" (important for special topics)
  professor: string;
  year: string;
  content: string;
  author?: string;
}

export interface GradingItem {
  item: string;
  weight: string;
}

export interface Syllabus {
  description: string;
  learningObjectives: string[];
  grading: GradingItem[];
  books?: string[];
}

export interface Course {
  sln: string;
  code: string; // e.g. "ACCTG 579"
  section: string; // e.g. "A/B"
  title: string;
  credits: number;
  instructor: string;
  room: string;
  days: string;
  time: string;
  quarter: string; // e.g., "Spring 2026"
  info?: string; // e.g., "MBA-MS", "INTL"
  prerequisites?: string;
  syllabusLink?: string; // Placeholder link
  syllabus?: Syllabus;
  courseCatalogLink?: string; // Link to UW Course Catalog
}

export type DayFilter = 'All' | 'Mon/Wed' | 'Tue/Thu' | 'Evening' | 'Friday';
