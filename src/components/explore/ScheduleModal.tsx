import { useState } from "react";
import { User, ScheduleRecord } from "@/types";
import { getSchedules, saveSchedule, removeSchedule } from "@/libs/storage";
import toast from "react-hot-toast";

interface ScheduleModalProps {
  currentUserEmail: string;
  profile: User;
  onClose: () => void;
}

const generateNext21Days = () => {
  const days = [];
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const today = new Date();

  for (let i = 0; i < 21; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    days.push({
      dateStr: nextDate.toISOString().split("T")[0],
      dayName:
        i === 0
          ? "Hôm nay"
          : i === 1
            ? "Ngày mai"
            : dayNames[nextDate.getDay()],
      dateNum: nextDate.getDate(),
      monthNum: nextDate.getMonth() + 1,
    });
  }
  return days;
};

const generateTimeSlots = () => {
  const times = [];
  for (let h = 0; h <= 23; h++) {
    const hour = h < 10 ? `0${h}` : `${h}`;
    times.push(`${hour}:00`);
    times.push(`${hour}:30`);
  }
  times.push("24:00");
  return times;
};

export default function ScheduleModal({
  currentUserEmail,
  profile,
  onClose,
}: ScheduleModalProps) {
  const availableDays = generateNext21Days();
  const timeSlots = generateTimeSlots();

  const [schedules, setSchedules] = useState<ScheduleRecord[]>(getSchedules);
  const [selectedDate, setSelectedDate] = useState<string>(
    availableDays[0].dateStr,
  );

  const [startTime, setStartTime] = useState<string>(() => {
    const exist = getSchedules().find(
      (s: ScheduleRecord) =>
        s.fromEmail === currentUserEmail &&
        s.toEmail === profile.email &&
        s.dateStr === availableDays[0].dateStr,
    );
    return exist ? exist.startTime : "19:00";
  });

  const [endTime, setEndTime] = useState<string>(() => {
    const exist = getSchedules().find(
      (s: ScheduleRecord) =>
        s.fromEmail === currentUserEmail &&
        s.toEmail === profile.email &&
        s.dateStr === availableDays[0].dateStr,
    );
    return exist ? exist.endTime : "21:00";
  });

  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  const handleDateSelect = (newDateStr: string) => {
    setSelectedDate(newDateStr);
    const existingSchedule = schedules.find(
      (s) =>
        s.fromEmail === currentUserEmail &&
        s.toEmail === profile.email &&
        s.dateStr === newDateStr,
    );

    if (existingSchedule) {
      setStartTime(existingSchedule.startTime);
      setEndTime(existingSchedule.endTime);
      setIsAddingNew(false);
    } else {
      setStartTime("19:00");
      setEndTime("21:00");
      setIsAddingNew(false);
    }
  };

  const handleConfirm = () => {
    saveSchedule({
      fromEmail: currentUserEmail,
      toEmail: profile.email,
      dateStr: selectedDate,
      startTime,
      endTime,
    });
    setSchedules(getSchedules());
    toast.success(`Đã lưu lịch ngày ${selectedDate}`, { icon: "✅" });
    setIsAddingNew(false);
  };

  const handleDelete = () => {
    removeSchedule(currentUserEmail, profile.email, selectedDate);
    toast.success("Đã xóa lịch rảnh ngày này!");
    setSchedules(getSchedules());
    setIsAddingNew(false);
  };

  const hasExistingScheduleForSelectedDate = schedules.some(
    (s) =>
      s.fromEmail === currentUserEmail &&
      s.toEmail === profile.email &&
      s.dateStr === selectedDate,
  );

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-end sm:items-center bg-black/60 p-0 sm:p-4 transition-opacity">
      <div className="slide-in-from-bottom-full sm:slide-in-from-bottom-0 flex flex-col bg-gray-50 shadow-2xl sm:rounded-[2rem] rounded-t-[2rem] w-full max-w-md overflow-hidden animate-in duration-300 sm:zoom-in-95">
        <div className="z-10 flex justify-between items-center bg-white shadow-sm px-6 py-4 border-gray-100 border-b shrink-0">
          <h2 className="flex items-center gap-2 font-bold text-gray-900 text-base">
            <span className="text-xl">📅</span> Đặt lịch với {profile.name}
          </h2>
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-gray-400 cursor-pointer"
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6 p-6 overflow-y-auto">
          <div>
            <p className="mb-3 font-bold text-gray-500 text-xs uppercase tracking-wider">
              1. Chọn ngày
            </p>
            <div className="flex gap-3 -mx-2 px-2 pb-2 overflow-x-auto snap-x hide-scrollbar">
              {availableDays.map((day) => {
                const isSelected = selectedDate === day.dateStr;
                const isScheduled = schedules.some(
                  (s) =>
                    s.fromEmail === currentUserEmail &&
                    s.toEmail === profile.email &&
                    s.dateStr === day.dateStr,
                );
                return (
                  <button
                    key={day.dateStr}
                    onClick={() => handleDateSelect(day.dateStr)}
                    className={`flex flex-col justify-center items-center rounded-xl w-16 h-16 transition-all duration-200 snap-center shrink-0 cursor-pointer relative ${
                      isSelected
                        ? "bg-pink-500 text-white shadow-md scale-105"
                        : "bg-white text-gray-600 shadow-sm border border-gray-200"
                    }`}
                  >
                    <span
                      className={`text-[10px] font-semibold uppercase ${isSelected ? "text-pink-100" : "text-gray-400"}`}
                    >
                      {day.dayName}
                    </span>
                    <span className="font-bold text-lg leading-tight">
                      {day.dateNum}/{day.monthNum}
                    </span>
                    {isScheduled && (
                      <span
                        className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-pink-500"}`}
                      ></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-3 font-bold text-gray-500 text-xs uppercase tracking-wider">
              2. Thời gian rảnh
            </p>
            {hasExistingScheduleForSelectedDate || isAddingNew ? (
              <div className="bg-white shadow-sm p-4 border border-gray-100 rounded-2xl animate-in duration-200 fade-in zoom-in-95">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col flex-1">
                    <label className="mb-1 font-bold text-[10px] text-gray-400 uppercase">
                      Từ
                    </label>
                    <select
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="bg-gray-50 p-3 border border-gray-100 focus:border-pink-300 rounded-xl outline-none font-bold text-gray-800"
                    >
                      {timeSlots.slice(0, -1).map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-5 font-bold text-gray-300">-</div>
                  <div className="flex flex-col flex-1">
                    <label className="mb-1 font-bold text-[10px] text-gray-400 uppercase">
                      Đến
                    </label>
                    <select
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="bg-gray-50 p-3 border border-gray-100 focus:border-pink-300 rounded-xl outline-none font-bold text-gray-800"
                    >
                      {timeSlots.map((t, i) => (
                        <option
                          key={t}
                          value={t}
                          disabled={i <= timeSlots.indexOf(startTime)}
                        >
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-gray-50 border-t">
                  {hasExistingScheduleForSelectedDate ? (
                    <>
                      <button
                        onClick={handleDelete}
                        className="flex-1 bg-red-50 hover:bg-red-100 py-2.5 rounded-xl font-bold text-red-500 text-sm transition-colors cursor-pointer"
                      >
                        Xóa lịch
                      </button>
                      <button
                        onClick={handleConfirm}
                        className="flex-[2] bg-emerald-500 hover:bg-emerald-600 shadow-sm py-2.5 rounded-xl font-bold text-white text-sm transition-colors cursor-pointer"
                      >
                        Cập nhật
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsAddingNew(false)}
                        className="flex-1 bg-gray-100 py-2.5 rounded-xl font-bold text-gray-500 text-sm cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleConfirm}
                        className="flex-[2] bg-pink-500 hover:bg-pink-600 shadow-sm py-2.5 rounded-xl font-bold text-white text-sm transition-colors cursor-pointer"
                      >
                        Lưu
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div
                onClick={() => setIsAddingNew(true)}
                className="group flex flex-col justify-center items-center bg-white p-8 border-2 border-gray-200 hover:border-pink-300 border-dashed rounded-2xl transition-all cursor-pointer"
              >
                <div className="flex justify-center items-center bg-pink-50 mb-2 rounded-full w-10 h-10 text-pink-500 group-hover:scale-110 transition-transform">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <p className="font-bold text-gray-700">
                  Thêm lịch cho ngày này
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white px-6 py-4 border-gray-100 border-t">
          <button
            onClick={onClose}
            className="bg-gray-900 hover:bg-black shadow-lg py-4 rounded-2xl w-full font-bold text-white active:scale-[0.98] transition-all cursor-pointer"
          >
            Hoàn tất & Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
