import { User } from "@/types";
import ProfileCard from "./ProfileCard";

interface ViewProfileModalProps {
  profile: User;
  onClose: () => void;
}

export default function ViewProfileModal({
  profile,
  onClose,
}: ViewProfileModalProps) {
  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 p-4 transition-opacity">
      <div className="relative w-full max-w-[350px] animate-in duration-200 zoom-in-95">
        <button
          onClick={onClose}
          className="-top-4 -right-4 z-10 absolute bg-white hover:bg-gray-100 shadow-xl p-2 border border-gray-200 rounded-full text-gray-500 transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <ProfileCard
          profile={profile}
          onPass={() => {}}
          onLike={() => {}}
          hideActions={true}
        />
      </div>
    </div>
  );
}
