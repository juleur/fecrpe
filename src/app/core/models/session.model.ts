export enum Type {
  Lesson = 'Lesson',
  Exercise = 'Exercise'
}

export interface Session {
  id?: number;
  title?: string;
  type?: Type;
  description?: string;
  part?: boolean;
  recordedOn?: string;
  createdAt?: string;
  updatedAt?: string;
  refresherCourseId?: number;
}
