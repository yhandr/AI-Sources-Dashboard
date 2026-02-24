export interface AISource {
  id: string;
  name: string;
  url: string;
  category: string;
  description: string | null;
  tags: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AISourceFormData = {
  name: string;
  url: string;
  category: string;
  description: string;
  tags: string;
  isFavorite: boolean;
};

export const CATEGORIES = [
  "LLM / Chatbot",
  "Image Generation",
  "Video Generation",
  "Audio / Music",
  "Code Assistant",
  "Research & Papers",
  "Tools & Productivity",
  "News & Blog",
  "Dataset",
  "Other",
] as const;
