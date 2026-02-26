import Link from "next/link";
import { User } from "@/types";

interface ExploreHeaderProps {
  users: User[];
  currentUserEmail: string;
  onChangeRole: (email: string) => void;
}

export function ExploreHeader({
  users,
  currentUserEmail,
  onChangeRole,
}: ExploreHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4 w-full max-w-md">
      <Link
        href="/"
        className="flex items-center gap-1 font-medium text-gray-400 hover:text-pink-500 text-sm transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        <span className="hidden sm:inline">Profile</span>
      </Link>

      <div className="flex items-center gap-2 bg-white shadow-sm px-3 py-1.5 border border-gray-100 rounded-full">
        <span className="text-gray-400 text-xs shrink-0">Đóng vai:</span>
        <select
          value={currentUserEmail}
          onChange={(e) => onChangeRole(e.target.value)}
          className="bg-transparent outline-none max-w-[120px] sm:max-w-[150px] font-semibold text-gray-800 text-sm truncate cursor-pointer"
        >
          {users.map((u) => (
            <option key={u.id} value={u.email}>
              {u.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
