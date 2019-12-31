import { RefresherCourse } from './refresher-course.model';

export interface User {
  id?: number;
  username?: string;
  phoneNumber?: string;
  email?: string;
  isTeacher?: boolean;
  createdAt?: string;
  updatedAt?: string;
  refresherCourses: RefresherCourse[];
}
