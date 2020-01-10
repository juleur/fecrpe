import { Subject } from './subject.model';
import { Session } from './session.model';
import { User } from './user.model';

export interface RefresherCourse {
    id?: number;
    year?: string;
    isFinished?: boolean;
    price?: number;
    subject?: Subject;
    sessions?: Session[];
    createdAt?: string;
    updatedAt?: string;
    isPurchased?: boolean;
    author?: User;
}
