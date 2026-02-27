export type NotificationType = 'follow' | 'like' | 'comment' | 'achievement';

export interface Notification {
  id?: string;
  userId: string;
  fromUserId: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: Date;
  link?: string;
}