import { TypeEnum, SectionEnum } from './enums.model';

export interface Session {
  id?: number;
  title?: string;
  section?: SectionEnum;
  type?: TypeEnum;
  description?: string;
  sessionNumber?: number;
  recordedOn?: string;
  createdAt?: string;
  updatedAt?: string;
}
