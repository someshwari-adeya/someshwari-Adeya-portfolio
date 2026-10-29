"use client";

import React from "react";

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  frontend: { bg: "rgba(59, 130, 246, 0.12)", text: "#60a5fa", border: "rgba(59, 130, 246, 0.25)" },
  backend:  { bg: "rgba(16, 185, 129, 0.12)", text: "#34d399", border: "rgba(16, 185, 129, 0.25)" },
  database: { bg: "rgba(249, 115, 22, 0.12)", text: "#fb923c", border: "rgba(249, 115, 22, 0.25)" },
  infra:    { bg: "rgba(139, 92, 246, 0.12)", text: "#c084fc", border: "rgba(139, 92, 246, 0.25)" },
  ai:       { bg: "rgba(244, 63, 94, 0.12)", text: "#fb7185", border: "rgba(244, 63, 94, 0.25)" },
  mobile:   { bg: "rgba(20, 184, 166, 0.12)", text: "#2dd4bf", border: "rgba(20, 184, 166, 0.25)" },
};

export interface TechBadgeProps {
  name: string;
  category: "frontend" | "backend" | "database" | "infra" | "ai" | "mobile";
  size?: "sm" | "md";
}

export function TechBadge({ name, category, size = "sm" }: TechBadgeProps) {
  const colors = categoryColors[category] ?? categoryColors.frontend;
  const textSize = size === "md" ? "text-xs" : "text-[10px]";
  const padding = size === "md" ? "px-3 py-1.5" : "px-2.5 py-0.5";

  return (
    <span
      className={`inline-flex items-center ${padding} rounded-full ${textSize} font-medium border transition-colors select-none`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      {name}
    </span>
  );
}

