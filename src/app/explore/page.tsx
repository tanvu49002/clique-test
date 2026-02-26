"use client";

import { useEffect, useState } from "react";
import { User, LikeRecord, MatchRecord, ScheduleRecord } from "@/types";
import {
  getUsers,
  getLikes,
  getMatches,
  saveLike,
  getPasses,
  savePass,
  getRejects,
  saveReject,
  getSchedules,
} from "@/libs/storage";

import ProfileCard from "@/components/explore/ProfileCard";
import EmptyState from "@/components/explore/EmptyState";
import ViewProfileModal from "@/components/explore/ViewProfileModal";
import ScheduleModal from "@/components/explore/ScheduleModal";
import { ExploreHeader } from "@/components/explore/ExploreHeader";
import { ExploreTabs } from "@/components/explore/ExploreTabs";
import MatchedTabContent from "@/components/explore/MatchedTabContent";

export default function ExplorePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [likes, setLikes] = useState<LikeRecord[]>([]);
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [schedules, setSchedules] = useState<ScheduleRecord[]>([]);
  const [passes, setPasses] = useState<
    { fromEmail: string; toEmail: string }[]
  >([]);
  const [rejects, setRejects] = useState<
    { fromEmail: string; toEmail: string }[]
  >([]);

  const [activeTab, setActiveTab] = useState<
    "explore" | "liked" | "passed" | "matched"
  >("explore");
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  const [schedulingProfile, setSchedulingProfile] = useState<User | null>(null);

  useEffect(() => {
    const initData = setTimeout(() => {
      const loadedUsers = getUsers();
      setUsers(loadedUsers);
      setLikes(getLikes());
      setMatches(getMatches());
      setPasses(getPasses());
      setRejects(getRejects());
      setSchedules(getSchedules());
      if (loadedUsers.length > 0) {
        setCurrentUserEmail(loadedUsers[0].email);
      }
    }, 0);
    return () => clearTimeout(initData);
  }, []);

  const handleLike = (targetEmail: string) => {
    if (!currentUserEmail) return;
    saveLike(currentUserEmail, targetEmail);
    setLikes(getLikes());
    setMatches(getMatches());
  };

  const handlePass = (targetEmail: string) => {
    if (!currentUserEmail) return;
    if (activeTab === "passed" || activeTab === "liked") {
      saveReject(currentUserEmail, targetEmail);
      setRejects(getRejects());
    } else {
      savePass(currentUserEmail, targetEmail);
      setPasses(getPasses());
    }
  };

  const currentPassedEmails = passes
    .filter((p) => p.fromEmail === currentUserEmail)
    .map((p) => p.toEmail);

  const currentRejectedEmails = rejects
    .filter((r) => r.fromEmail === currentUserEmail)
    .map((r) => r.toEmail);

  const matchedEmails = matches.flatMap((m) =>
    m.user1Email === currentUserEmail
      ? [m.user2Email]
      : m.user2Email === currentUserEmail
        ? [m.user1Email]
        : [],
  );

  const matchedProfiles = matchedEmails
    .map((email) => users.find((u) => u.email === email))
    .filter((u): u is User => u !== undefined);

  const pendingLikedMeProfiles = users.filter((u) => {
    const theyLikedMe = likes.some(
      (l) => l.fromEmail === u.email && l.toEmail === currentUserEmail,
    );
    const isMatched = matchedEmails.includes(u.email);
    const isRejected = currentRejectedEmails.includes(u.email);
    return theyLikedMe && !isMatched && !isRejected;
  });

  const profilesToShow = users.filter(
    (u) =>
      u.email !== currentUserEmail &&
      !likes.some(
        (l) => l.fromEmail === currentUserEmail && l.toEmail === u.email,
      ) &&
      !currentPassedEmails.includes(u.email),
  );

  const passedProfilesToShow = currentPassedEmails
    .filter(
      (email) =>
        !currentRejectedEmails.includes(email) &&
        !likes.some(
          (l) => l.fromEmail === currentUserEmail && l.toEmail === email,
        ) &&
        !matchedEmails.includes(email),
    )
    .map((email) => users.find((u) => u.email === email))
    .filter((u): u is User => u !== undefined)
    .reverse();

  return (
    <main className="flex flex-col items-center bg-gray-50 p-4 sm:p-6 min-h-[100dvh]">
      <ExploreHeader
        users={users}
        currentUserEmail={currentUserEmail}
        onChangeRole={(email) => {
          setCurrentUserEmail(email);
          setLikes(getLikes());
          setMatches(getMatches());
          setPasses(getPasses());
          setRejects(getRejects());
          setActiveTab("explore");
        }}
      />

      <ExploreTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        likedCount={pendingLikedMeProfiles.length}
        matchedCount={matchedProfiles.length}
      />

      <div className="flex flex-col flex-1 w-full max-w-[380px] animate-in duration-300 fade-in">
        {activeTab === "explore" && (
          <div className="flex flex-col flex-1 justify-center slide-in-from-left-4 animate-in duration-300 fade-in">
            {profilesToShow[0] ? (
              <ProfileCard
                profile={profilesToShow[0]}
                onPass={handlePass}
                onLike={handleLike}
              />
            ) : (
              <EmptyState
                icon="✨"
                title="Đã hết hồ sơ!"
                description="Bạn đã khám phá hết mọi người xung quanh. Hãy thử quay lại sau nhé."
              />
            )}
          </div>
        )}

        {activeTab === "liked" && (
          <div className="slide-in-from-right-4 flex flex-col flex-1 justify-center animate-in duration-300 fade-in">
            {pendingLikedMeProfiles.length > 0 ? (
              <ProfileCard
                profile={pendingLikedMeProfiles[0]}
                onPass={handlePass}
                onLike={handleLike}
              />
            ) : (
              <EmptyState
                icon="💔"
                title="Chưa có ai ở đây"
                description="Bạn hãy tích cực thả tim để tăng cơ hội nhé!"
              />
            )}
          </div>
        )}

        {activeTab === "passed" && (
          <div className="slide-in-from-right-4 flex flex-col flex-1 justify-center animate-in duration-300 fade-in">
            {passedProfilesToShow.length > 0 ? (
              <ProfileCard
                profile={passedProfilesToShow[0]}
                onPass={handlePass}
                onLike={handleLike}
              />
            ) : (
              <EmptyState
                icon="⏪"
                title="Chưa có ai ở đây"
                description="Những người bạn lỡ tay bỏ qua sẽ hiện ở đây."
              />
            )}
          </div>
        )}

        {activeTab === "matched" &&
          (matchedProfiles.length > 0 ? (
            <MatchedTabContent
              currentUserEmail={currentUserEmail}
              matchedProfiles={matchedProfiles}
              schedules={schedules}
              onViewProfile={setViewingProfile}
              onSchedule={setSchedulingProfile}
            />
          ) : (
            <EmptyState
              icon="💞"
              title="Chưa ghép đôi với ai"
              titleColor="text-pink-500"
              description="Bạn hãy tích cực thả tim để tăng cơ hội nhé!"
            />
          ))}
      </div>

      {viewingProfile && (
        <ViewProfileModal
          profile={viewingProfile}
          onClose={() => setViewingProfile(null)}
        />
      )}

      {schedulingProfile && (
        <ScheduleModal
          profile={schedulingProfile}
          currentUserEmail={currentUserEmail}
          onClose={() => {
            setSchedulingProfile(null);
            setSchedules(getSchedules());
          }}
        />
      )}
    </main>
  );
}
