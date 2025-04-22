export interface GratitudeEntry {
  _id: string;
  date: string;
  mainStory: string;
  dayRating: number;
  emotions: string[];
  learnings: string;
  gratitudeList: string;
  mistakes: string;
  peopleInMind: string[];
  goodHabits: string[];
  badHabits: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateGratitudeEntryDto {
  date: string;
  mainStory: string;
  dayRating: number;
  emotions: string[];
  learnings: string;
  gratitudeList: string;
  mistakes: string;
  peopleInMind: string[];
  goodHabits: string[];
  badHabits: string[];
}
