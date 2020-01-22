import { Video } from './video.model';
import { User } from './user.model';

export enum Type {
  LESSON = 'Leçon',
  EXERCISE = 'Exercice'
}

export enum Section {
  SCIENTIFIC = 'Scientifique',
  DIALECTICAL = 'Dialectique'
}

export interface Session {
  id?: number;
  title?: string;
  type?: Type;
  section?: Session;
  description?: string;
  sessionNumber?: number;
  recordedOn?: string;
  createdAt?: string;
  updatedAt?: string;
  video?: Video;
  refresherCourseId?: number;
  teacher?: User;
}
