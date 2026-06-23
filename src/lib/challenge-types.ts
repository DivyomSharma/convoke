export const challengeTypes = [
  { value: "HACKATHON", label: "Hackathon" },
  { value: "IDEATHON", label: "Ideathon" },
  { value: "CASE_STUDY", label: "Case Study" },
  { value: "QUIZ", label: "Quiz" },
  { value: "CODING_CHALLENGE", label: "Coding Challenge" },
  { value: "HIRING_CHALLENGE", label: "Hiring Challenge" },
  { value: "TREASURE_HUNT", label: "Treasure Hunt" },
  { value: "BUSINESS_PITCH", label: "Business Pitch" },
  { value: "CHALLENGE", label: "Challenge" },
] as const;

export type ChallengeType = (typeof challengeTypes)[number]["value"];

export function isChallengeType(type?: string | null) {
  return challengeTypes.some((entry) => entry.value === type);
}

