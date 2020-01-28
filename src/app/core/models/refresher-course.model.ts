import { User } from './user.model';
import { SubjectEnum } from './enums.model';

export interface RefresherCourse {
    id?: number;
    subject?: SubjectEnum;
    year?: string;
    isFinished?: boolean;
    price?: number;
    createdAt?: string;
    updatedAt?: string;
    totalDuration?: string;
    isPurchased?: boolean;
    teachers?: User[];
}
