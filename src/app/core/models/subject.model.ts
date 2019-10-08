import { RefresherCourse } from './refresher-course.model';

export interface Subject {
  id?: number;
  name?: string;
  active?: boolean;
  refresherCourse?: RefresherCourse;
  createdAt?: string;
  updatedAt?: string;
}
