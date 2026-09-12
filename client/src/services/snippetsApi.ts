import type { Snippet, SnippetInput } from "../types/snippet";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const snippetsApi = {
  list: () => request<Snippet[]>("/snippets"),
  create: (data: SnippetInput) =>
    request<Snippet>("/snippets", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: Partial<SnippetInput>) =>
    request<Snippet>(`/snippets/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: string) =>
    request<{ ok: true }>(`/snippets/${id}`, { method: "DELETE" }),
  toggleFavorite: (id: string) =>
    request<Snippet>(`/snippets/${id}/favorite`, { method: "POST" }),
  incrementUsage: (id: string) =>
    request<Snippet>(`/snippets/${id}/use`, { method: "POST" }),
};
