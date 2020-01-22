import { Subject } from './subject.model';
import { Session } from './session.model';
import { User } from './user.model';

export interface RefresherCourse {
    id?: number;
    year?: string;
    isFinished?: boolean;
    price?: number;
    createdAt?: string;
    updatedAt?: string;
    subject?: Subject;
    sessions?: Session[];
    totalDuration?: string;
    isPurchased?: boolean;
    teachers?: User[];
}
