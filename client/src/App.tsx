import { useEffect, useState } from "react";
import { Braces } from "lucide-react";
import { DetailsPanel } from "./components/DetailsPanel";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { SnippetCard } from "./components/SnippetCard";
import { SnippetModal } from "./components/SnippetModal";
import { useSnippets } from "./hooks/useSnippets";
import type { Snippet } from "./types/snippet";

export default function App() {
  const {
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
  } = useSnippets();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Snippet | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.querySelector<HTMLInputElement>('input[placeholder^="Search"]')?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const copySelected = async () => {
    if (!selected) return;
    await navigator.clipboard.writeText(selected.code);
    await registerUse(selected.id);
    setToast("Code copied to clipboard");
  };

  const deleteSelected = async () => {
    if (!selected) return;
    if (!window.confirm(`Delete “${selected.title}”?`)) return;
    await deleteSnippet(selected.id);
    setToast("Snippet deleted");
  };

  return (
    <div className="flex min-h-screen bg-[#090f18] text-slate-100">
      <Sidebar snippets={snippets} view={view} onView={setView} language={language} onLanguage={setLanguage} />

      <div className="min-w-0 flex-1">
        <Header
          search={search}
          onSearch={setSearch}
          onNew={() => { setEditing(null); setModalOpen(true); }}
        />

        <div className="flex">
          <main className="h-[calc(100vh-77px)] min-w-0 flex-1 overflow-y-auto px-5 py-6 lg:px-7">
            <div className="mb-6 flex items-start justify-between gap-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Your Code Snippets</h1>
                <p className="mt-1.5 text-sm text-slate-400">A better way to save and organize your code snippets.</p>
              </div>
              <blockquote className="hidden max-w-[270px] text-right text-sm italic leading-6 text-slate-500 lg:block">“Good developers reuse code.<br />Great developers organize it.”</blockquote>
            </div>

            {error && <div className="mb-5 rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-300">{error}</div>}

            {loading ? (
              <div className="grid min-h-[45vh] place-items-center text-sm text-slate-500">Loading snippets...</div>
            ) : filtered.length === 0 ? (
              <div className="grid min-h-[45vh] place-items-center rounded-2xl border border-dashed border-[#233145] bg-[#0d1521] p-8 text-center">
                <div>
                  <Braces className="mx-auto h-10 w-10 text-indigo-500" />
                  <h2 className="mt-4 text-lg font-semibold text-white">No snippets found</h2>
                  <p className="mt-1 text-sm text-slate-500">Try another search or create a new snippet.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 2xl:grid-cols-3">
                {filtered.map((snippet) => (
                  <SnippetCard
                    key={snippet.id}
                    snippet={snippet}
                    selected={selectedId === snippet.id}
                    onSelect={() => setSelectedId(snippet.id)}
                    onFavorite={() => void toggleFavorite(snippet.id)}
                  />
                ))}
              </div>
            )}
          </main>

          <DetailsPanel
            snippet={selected}
            onClose={() => setSelectedId(null)}
            onFavorite={() => selected && void toggleFavorite(selected.id)}
            onCopy={() => void copySelected()}
            onEdit={() => { if (selected) { setEditing(selected); setModalOpen(true); } }}
            onDelete={() => void deleteSelected()}
          />
        </div>
      </div>

      <SnippetModal
        open={modalOpen}
        snippet={editing}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={async (input) => {
          if (editing) {
            await updateSnippet(editing.id, input);
            setToast("Snippet updated");
          } else {
            await createSnippet(input);
            setToast("Snippet created");
          }
        }}
      />

      {toast && <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-xl border border-[#2a3850] bg-[#101a29] px-4 py-2.5 text-sm text-slate-200 shadow-xl shadow-black/30">{toast}</div>}
    </div>
  );
}
