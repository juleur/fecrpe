import { Video } from './video.model';

export enum Type {
  LESSON = 'Leçon',
  EXERCISE = 'Exercice'
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
  video: Video;
  refresherCourseId?: number;
}
