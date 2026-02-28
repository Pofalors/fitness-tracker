export interface Follow {
  userId: string;
  followerId: string;
  createdAt: Date;
}

export interface Like {
  id?: string;
  workoutId: string;
  userId: string;
  createdAt: Date;
}

export interface Comment {
  id?: string;
  workoutId: string;
  userId: string;
  text: string;
  createdAt: Date;
}