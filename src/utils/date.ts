import { ScheduleRecord } from "@/types";

export const findMutualDate = (
  email1: string,
  email2: string,
  allSchedules: ScheduleRecord[],
) => {
  const user1Scheds = allSchedules.filter(
    (s) => s.fromEmail === email1 && s.toEmail === email2,
  );
  const user2Scheds = allSchedules.filter(
    (s) => s.fromEmail === email2 && s.toEmail === email1,
  );

  const mutualDates: ScheduleRecord[] = [];

  user1Scheds.forEach((s1) => {
    user2Scheds.forEach((s2) => {
      if (
        s1.dateStr === s2.dateStr &&
        s1.startTime === s2.startTime &&
        s1.endTime === s2.endTime
      ) {
        mutualDates.push(s1);
      }
    });
  });

  if (mutualDates.length === 0) return null;

  mutualDates.sort((a, b) => {
    if (a.dateStr !== b.dateStr) return a.dateStr.localeCompare(b.dateStr);
    return a.startTime.localeCompare(b.startTime);
  });

  return mutualDates[0];
};

export const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};
