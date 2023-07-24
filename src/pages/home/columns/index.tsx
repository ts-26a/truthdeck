export * from './timeline';
export * from './userStatuses';
import { ItemInterface } from 'react-sortablejs';

interface TimelineColumnType {
  name: 'Timeline';
}

interface UserStatusesColumnType {
  name: 'UserStatuses';
  userId: string;
}

export type ColumnType = ItemInterface &
  (TimelineColumnType | UserStatusesColumnType);
