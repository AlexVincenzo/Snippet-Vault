export type Snippet = {
  id: string;
  title: string;
  description: string;
  language: string;
  code: string;
  tags: string[];
  favorite: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
};

export type SnippetInput = Omit<Snippet, "id" | "usageCount" | "createdAt" | "updatedAt">;
