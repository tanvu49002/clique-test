import { User } from "@/types";
import { LikeRecord, MatchRecord, ScheduleRecord } from "@/types";

const USERS_KEY = "dating_users";
const LIKED_KEY = "liked_list";
const MATCHED_KEY = "matched_list";
const PASSED_KEY = "passed_list";
const REJECTED_KEY = "rejected_list";
const SCHEDULES_KEY = "dating_schedules";
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUser = (newUser: User): void => {
  if (typeof window === "undefined") return;

  const users = getUsers();
  const existingUserIndex = users.findIndex((u) => u.email === newUser.email);

  if (existingUserIndex >= 0) {
    users[existingUserIndex] = newUser;
  } else {
    users.push(newUser);
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getLikes = (): LikeRecord[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(LIKED_KEY);
  return data ? JSON.parse(data) : [];
};

export const getMatches = (): MatchRecord[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(MATCHED_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLike = (fromEmail: string, toEmail: string): boolean => {
  if (typeof window === "undefined") return false;

  const likes = getLikes();

  const alreadyLiked = likes.some(
    (l) => l.fromEmail === fromEmail && l.toEmail === toEmail,
  );
  if (!alreadyLiked) {
    likes.push({ fromEmail, toEmail });
    localStorage.setItem(LIKED_KEY, JSON.stringify(likes));
  }

  const isMatch = likes.some(
    (l) => l.fromEmail === toEmail && l.toEmail === fromEmail,
  );

  if (isMatch) {
    const matches = getMatches();
    const alreadyMatched = matches.some(
      (m) =>
        (m.user1Email === fromEmail && m.user2Email === toEmail) ||
        (m.user1Email === toEmail && m.user2Email === fromEmail),
    );

    if (!alreadyMatched) {
      matches.push({
        id:
          window.crypto && window.crypto.randomUUID
            ? window.crypto.randomUUID()
            : Date.now().toString(),
        user1Email: fromEmail,
        user2Email: toEmail,
        matchedAt: Date.now(),
      });
      localStorage.setItem(MATCHED_KEY, JSON.stringify(matches));
    }
    return true;
  }

  return false;
};

export const getPasses = () => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(PASSED_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePass = (fromEmail: string, toEmail: string) => {
  if (typeof window === "undefined") return;
  const passes = getPasses();

  const alreadyPassed = passes.some(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p: any) => p.fromEmail === fromEmail && p.toEmail === toEmail,
  );

  if (!alreadyPassed) {
    passes.push({ fromEmail, toEmail });
    localStorage.setItem(PASSED_KEY, JSON.stringify(passes));
  }
};

export const getRejects = () => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(REJECTED_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveReject = (fromEmail: string, toEmail: string) => {
  if (typeof window === "undefined") return;
  const rejects = getRejects();

  const alreadyRejected = rejects.some(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (r: any) => r.fromEmail === fromEmail && r.toEmail === toEmail,
  );
  if (!alreadyRejected) {
    rejects.push({ fromEmail, toEmail });
    localStorage.setItem(REJECTED_KEY, JSON.stringify(rejects));
  }
};

export const getSchedules = (): ScheduleRecord[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(SCHEDULES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveSchedule = (record: ScheduleRecord) => {
  const schedules = getSchedules();
  const newSchedules = schedules.filter(
    (s) =>
      !(
        s.fromEmail === record.fromEmail &&
        s.toEmail === record.toEmail &&
        s.dateStr === record.dateStr
      ),
  );
  newSchedules.push(record);
  localStorage.setItem(SCHEDULES_KEY, JSON.stringify(newSchedules));
};

export const removeSchedule = (
  fromEmail: string,
  toEmail: string,
  dateStr: string,
) => {
  const schedules = getSchedules();
  const newSchedules = schedules.filter(
    (s) =>
      !(
        s.fromEmail === fromEmail &&
        s.toEmail === toEmail &&
        s.dateStr === dateStr
      ),
  );
  localStorage.setItem(SCHEDULES_KEY, JSON.stringify(newSchedules));
};
