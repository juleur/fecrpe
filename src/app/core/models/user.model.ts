import { RefresherCourse } from './refresher-course.model';

export interface User {
  id?: number;
  username?: string;
  fullname?: string;
  email?: string;
  phoneNumber?: string;
  isTeacher?: boolean;
  createdAt?: string;
  updatedAt?: string;
  refresherCourses: RefresherCourse[];
}
