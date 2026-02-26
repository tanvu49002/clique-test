import Image from "next/image";
import { User } from "@/types";

interface ProfileCardProps {
  profile: User;
  onPass: (email: string) => void;
  onLike: (email: string, name: string) => void;
  hideActions?: boolean;
}

export default function ProfileCard({
  profile,
  onPass,
  onLike,
  hideActions = false,
}: ProfileCardProps) {
  return (
    <div className="w-full">
      <div className="relative bg-gray-200 shadow-xl mb-6 border border-gray-100 rounded-[2rem] w-full aspect-[4/5] overflow-hidden">
        <Image
          src={profile.image || "/default-image.png"}
          alt={profile.name}
          fill
          className="object-cover"
          priority
        />
        <div className="bottom-0 absolute inset-x-0 bg-gradient-to-t from-black/20 to-transparent h-1/2 pointer-events-none"></div>

        <div className="right-4 bottom-4 left-4 absolute flex flex-col bg-white/50 shadow-lg backdrop-blur-md p-4 border border-white/40 rounded-[1.5rem] max-h-[70%]">
          <div className="flex justify-between items-center mb-1 shrink-0">
            <h2 className="flex items-center gap-2 font-bold text-gray-900 text-xl">
              {profile.name}
            </h2>
          </div>
          <p className="flex items-center gap-1.5 mb-2 font-medium text-[13px] text-gray-600 shrink-0">
            {profile.age} <span className="font-bold text-gray-600">•</span>
            {profile.address} <span className="font-bold text-gray-600">•</span>
            {profile.gender === "Female"
              ? "Nữ"
              : profile.gender === "Male"
                ? "Nam"
                : "LGBT"}
          </p>
          <div className="pr-1 max-h-[60px] overflow-y-auto text-[13px] text-gray-800 leading-snug">
            {profile.bio}
          </div>
        </div>
      </div>

      {!hideActions && (
        <div className="flex justify-center gap-8 mt-4">
          <button
            onClick={() => onPass(profile.email)}
            className="flex justify-center items-center bg-white shadow-md border border-gray-100 rounded-full w-16 h-16 text-gray-400 hover:text-red-500 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-7 h-7"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <button
            onClick={() => onLike(profile.email, profile.name)}
            className="flex justify-center items-center bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg rounded-full w-16 h-16 text-white hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
