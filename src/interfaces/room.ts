import { User } from '.';

export interface Room {
  id: string;
  users: Array<User>;
  settings: {
    mode: 'default' | 'mission';
    seconds: number;
    turn: number;
    memberLimit: number;
  }
}
