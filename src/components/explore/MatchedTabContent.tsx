import Image from "next/image";
import { User, ScheduleRecord } from "@/types";
import { findMutualDate, formatDate } from "@/utils/date";

interface TabMatchedProps {
  currentUserEmail: string;
  matchedProfiles: User[];
  schedules: ScheduleRecord[];
  onViewProfile: (u: User) => void;
  onSchedule: (u: User) => void;
}

export default function TabMatched({
  currentUserEmail,
  matchedProfiles,
  schedules,
  onViewProfile,
  onSchedule,
}: TabMatchedProps) {
  const confirmedDates: { profile: User; schedule: ScheduleRecord }[] = [];
  const pendingProfiles: User[] = [];

  matchedProfiles.forEach((profile) => {
    const mutual = findMutualDate(currentUserEmail, profile.email, schedules);
    if (mutual) confirmedDates.push({ profile, schedule: mutual });
    else pendingProfiles.push(profile);
  });

  if (matchedProfiles.length === 0) return null;

  return (
    <div className="flex flex-col mt-2 pb-10 w-full animate-in duration-300 fade-in">
      {confirmedDates.length > 0 && (
        <div className="mb-6">
          <p className="flex items-center gap-2 mb-3 px-2 font-bold text-pink-500 text-xs uppercase tracking-wider">
            Lịch hẹn đã chốt ({confirmedDates.length})
          </p>
          <div className="flex flex-col gap-3">
            {confirmedDates.map(({ profile, schedule }) => (
              <div
                key={`confirmed-${profile.id}`}
                className="group flex flex-col bg-gradient-to-br from-pink-50 to-rose-50 shadow-md p-1 border border-pink-200 rounded-3xl cursor-pointer"
                onClick={() => onViewProfile(profile)}
              >
                <div className="bg-white p-3 rounded-[1.3rem]">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="relative border-2 border-pink-300 rounded-full w-14 h-14 overflow-hidden shrink-0">
                      <Image
                        src={profile.image || "/default-image.png"}
                        alt={profile.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 pr-2 min-w-0">
                      <h4 className="text-[14px] text-gray-700 line-clamp-2 leading-snug">
                        Chúc mừng, bạn và{" "}
                        <span className="font-bold text-gray-900">
                          {profile.name}
                        </span>{" "}
                        đã có lịch rảnh trùng nhau
                      </h4>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-xl text-white">
                    <div>
                      <p className="font-medium text-[11px] text-pink-100 uppercase">
                        Thời gian gặp mặt
                      </p>
                      <p className="font-bold text-[17px] leading-tight">
                        {schedule.startTime} - {schedule.endTime}
                      </p>
                      <p className="font-medium text-pink-50 text-sm">
                        Ngày {formatDate(schedule.dateStr)}
                      </p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                      >
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pendingProfiles.length > 0 && (
        <div>
          <p className="mb-3 px-2 font-bold text-gray-400 text-xs uppercase tracking-wider">
            Đang chờ lên lịch ({pendingProfiles.length})
          </p>
          <div className="flex flex-col gap-3">
            {pendingProfiles.map((profile) => {
              const hasSchedule = schedules.some(
                (s) =>
                  s.fromEmail === currentUserEmail &&
                  s.toEmail === profile.email,
              );
              return (
                <div
                  key={profile.id}
                  className="bg-white shadow-sm p-3 border border-gray-100 rounded-2xl"
                  onClick={() => onViewProfile(profile)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`relative border-2 rounded-full w-14 h-14 overflow-hidden ${hasSchedule ? "border-emerald-100" : "border-pink-100"}`}
                    >
                      <Image
                        src={profile.image || "/default-image.png"}
                        alt={profile.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 pr-2 min-w-0">
                      <h4 className="text-[14px] text-gray-600 line-clamp-1 leading-snug">
                        Bạn và{" "}
                        <span className="font-bold text-gray-900">
                          {profile.name}
                        </span>{" "}
                        đã được ghép đôi
                      </h4>
                      <p
                        className={`font-semibold text-[12px] mt-1 ${hasSchedule ? "text-emerald-500" : "text-pink-500"}`}
                      >
                        {hasSchedule
                          ? "Đã tạo lịch rảnh, chờ đối phương"
                          : "Hãy tạo lịch rảnh ngay nhé"}
                      </p>
                    </div>
                  </div>
                  <hr className="my-3 border-gray-50" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSchedule(profile);
                    }}
                    className={`cursor-pointer py-2 rounded-xl w-full font-bold text-sm ${hasSchedule ? "bg-emerald-50 text-emerald-600" : "bg-pink-50 text-pink-600"}`}
                  >
                    {hasSchedule ? "Chỉnh sửa lịch rảnh" : "Tạo lịch rảnh"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
