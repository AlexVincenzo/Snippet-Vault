import { useCallback, useEffect, useMemo, useState } from "react";
import { snippetsApi } from "../services/snippetsApi";
import type { Snippet, SnippetInput } from "../types/snippet";

export type ViewMode = "all" | "favorites" | "recent";

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await snippetsApi.list();
      setSnippets(data);
      setSelectedId((current) => current ?? data[0]?.id ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load snippets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = useMemo(
    () => snippets.find((snippet) => snippet.id === selectedId) ?? null,
    [snippets, selectedId],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return snippets
      .filter((snippet) => {
        if (view === "favorites" && !snippet.favorite) return false;
        if (view === "recent") {
          const age = Date.now() - new Date(snippet.updatedAt).getTime();
          if (age > 1000 * 60 * 60 * 24 * 14) return false;
        }
        if (language && snippet.language !== language) return false;
        if (!term) return true;
        const haystack = [
          snippet.title,
          snippet.description,
          snippet.language,
          snippet.code,
          ...snippet.tags,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [snippets, search, language, view]);

  const createSnippet = async (input: SnippetInput) => {
    const created = await snippetsApi.create(input);
    setSnippets((items) => [created, ...items]);
    setSelectedId(created.id);
  };

  const updateSnippet = async (id: string, input: Partial<SnippetInput>) => {
    const updated = await snippetsApi.update(id, input);
    setSnippets((items) => items.map((item) => (item.id === id ? updated : item)));
  };

  const deleteSnippet = async (id: string) => {
    await snippetsApi.remove(id);
    setSnippets((items) => items.filter((item) => item.id !== id));
    setSelectedId((current) => (current === id ? null : current));
  };

  const toggleFavorite = async (id: string) => {
    const updated = await snippetsApi.toggleFavorite(id);
    setSnippets((items) => items.map((item) => (item.id === id ? updated : item)));
  };

  const registerUse = async (id: string) => {
    const updated = await snippetsApi.incrementUsage(id);
    setSnippets((items) => items.map((item) => (item.id === id ? updated : item)));
  };

  return {
    snippets,
    filtered,
    selected,
    selectedId,
    setSelectedId,
    search,
    setSearch,
    language,
    setLanguage,
    view,
    setView,
    loading,
    error,
    createSnippet,
    updateSnippet,
    deleteSnippet,
    toggleFavorite,
    registerUse,
  };
}
