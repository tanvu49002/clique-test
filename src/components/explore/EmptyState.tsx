import React from "react";

interface EmptyStateProps {
  icon: string | React.ReactNode;
  iconBgColor?: string;
  title: string;
  titleColor?: string;
  description: string;
}

export default function EmptyState({
  icon,
  title,
  titleColor = "text-gray-900",
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col flex-1 justify-center items-center bg-white shadow-xl px-6 py-10 md:py-20 border border-gray-100 rounded-[2rem] text-center">
      <div
        className={`flex justify-center items-center mb-6 rounded-full w-24 h-24 text-4xl bg-gray-100`}
      >
        {icon}
      </div>
      <h3 className={`mb-2 font-bold text-xl ${titleColor}`}>{title}</h3>
      <p className="mt-1 max-w-[250px] text-gray-500 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
