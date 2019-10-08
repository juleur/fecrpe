import { Subject } from './subject.model';
import { Session } from './session.model';

export interface RefresherCourse {
    id?: number;
    year?: string;
    isFinished?: boolean;
    price?: number;
    subject?: Subject;
    sessions?: Session[];
    createdAt?: string;
    updatedAt?: string;
}
