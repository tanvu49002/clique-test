interface ExploreTabsProps {
  activeTab: string;
  setActiveTab: (tab: "explore" | "liked" | "passed" | "matched") => void;
  likedCount: number;
  matchedCount: number;
}

export function ExploreTabs({
  activeTab,
  setActiveTab,
  likedCount,
  matchedCount,
}: ExploreTabsProps) {
  const tabs = [
    { id: "explore", label: "Khám phá" },
    { id: "liked", label: `Đã thích (${likedCount})` },
    { id: "passed", label: "Lịch sử" },
    { id: "matched", label: `Đã ghép đôi (${matchedCount})` },
  ];

  return (
    <div className="gap-1 grid grid-cols-4 bg-gray-200/60 shadow-inner mb-6 p-1.5 rounded-full w-full max-w-[420px]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={() => setActiveTab(tab.id as any)}
          className={`py-2 text-[11px] sm:text-xs font-bold rounded-full transition-all duration-300 z-10 cursor-pointer whitespace-nowrap ${
            activeTab === tab.id
              ? "bg-white text-pink-500 shadow-md scale-100"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 scale-95"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
