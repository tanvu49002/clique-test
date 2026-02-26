export type Gender = "Male" | "Female" | "LGBT";

export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
}

export interface User {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  bio: string;
  address: string;
  image?: string;
  email: string;
  availabilities?: TimeSlot[];
}

export interface LikeRecord {
  fromEmail: string;
  toEmail: string;
}

export interface MatchRecord {
  id: string;
  user1Email: string;
  user2Email: string;
  matchedAt: number;
}

export interface ScheduleRecord {
  fromEmail: string;
  toEmail: string;
  dateStr: string;
  startTime: string;
  endTime: string;
}
export interface PassRecord {
  fromEmail: string;
  toEmail: string;
}
