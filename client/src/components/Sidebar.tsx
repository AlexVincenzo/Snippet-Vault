import {
  Clock3,
  Code2,
  FolderCode,
  Settings,
  Star,
  Trash2,
} from "lucide-react";
import type { Snippet } from "../types/snippet";
import type { ViewMode } from "../hooks/useSnippets";

const languageBadge: Record<string, string> = {
  TypeScript: "TS",
  JavaScript: "JS",
  PostgreSQL: "SQL",
  SQL: "SQL",
  Python: "PY",
  "C#": "C#",
  PHP: "PHP",
  HTML: "HTML",
  CSS: "CSS",
  Bash: ">_",
};

export function Sidebar({
  snippets,
  view,
  onView,
  language,
  onLanguage,
}: {
  snippets: Snippet[];
  view: ViewMode;
  onView: (view: ViewMode) => void;
  language: string | null;
  onLanguage: (language: string | null) => void;
}) {
  const counts = snippets.reduce<Record<string, number>>((acc, snippet) => {
    acc[snippet.language] = (acc[snippet.language] ?? 0) + 1;
    return acc;
  }, {});

  const tags = snippets
    .flatMap((snippet) => snippet.tags)
    .reduce<Record<string, number>>((acc, tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1;
      return acc;
    }, {});

  const topTags = Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const nav = [
    { id: "all" as const, label: "All Snippets", icon: FolderCode, count: snippets.length },
    { id: "favorites" as const, label: "Favorites", icon: Star, count: snippets.filter((s) => s.favorite).length },
    { id: "recent" as const, label: "Recent", icon: Clock3, count: snippets.filter((s) => Date.now() - new Date(s.updatedAt).getTime() <= 1000 * 60 * 60 * 24 * 14).length },
  ];

  return (
    <aside className="hidden h-screen w-[278px] shrink-0 border-r border-[#1b2636] bg-[#080d16] xl:flex xl:flex-col">
      <div className="px-6 pb-7 pt-6">
        <div className="flex items-center gap-3">
          <Code2 className="h-9 w-9 text-indigo-500" strokeWidth={2.4} />
          <div>
            <div className="text-[27px] font-bold tracking-tight text-white">
              Snippet<span className="text-indigo-500">Vault</span>
            </div>
            <div className="mt-0.5 text-xs text-slate-400">Save. Organize. Code Faster.</div>
          </div>
        </div>
      </div>

      <nav className="space-y-1 px-3">
        {nav.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => { onView(id); onLanguage(null); }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
              view === id && !language
                ? "bg-gradient-to-r from-indigo-600/40 to-indigo-500/20 text-white ring-1 ring-inset ring-indigo-500/25"
                : "text-slate-300 hover:bg-white/5"
            }`}
          >
            <Icon className="h-5 w-5 text-slate-300" />
            <span className="flex-1 text-left">{label}</span>
            <span className="rounded-full bg-[#172235] px-2 py-0.5 text-xs text-slate-300">{count}</span>
          </button>
        ))}
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-500">
          <Trash2 className="h-5 w-5" />
          <span className="flex-1 text-left">Trash</span>
          <span className="rounded-full bg-[#172235] px-2 py-0.5 text-xs">0</span>
        </button>
      </nav>

      <div className="mx-6 my-4 border-t border-[#1b2636]" />
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
        <div className="mb-3 text-[11px] font-medium uppercase tracking-widest text-slate-500">Languages</div>
        <div className="space-y-1">
          {Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([name, count]) => (
            <button
              key={name}
              onClick={() => onLanguage(language === name ? null : name)}
              className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition ${language === name ? "bg-white/7 text-white" : "text-slate-300 hover:bg-white/5"}`}
            >
              <span className="grid h-5 min-w-5 place-items-center rounded bg-indigo-500/20 px-1 text-[10px] font-bold text-indigo-300">
                {languageBadge[name] ?? "<>"}
              </span>
              <span className="flex-1 text-left">{name}</span>
              <span className="rounded-full bg-[#172235] px-2 py-0.5 text-xs text-slate-400">{count}</span>
            </button>
          ))}
        </div>

        <div className="my-5 border-t border-[#1b2636]" />
        <div className="mb-3 text-[11px] font-medium uppercase tracking-widest text-slate-500">Tags</div>
        <div className="flex flex-wrap gap-2">
          {topTags.map(([tag, count]) => (
            <span key={tag} className="rounded-full bg-[#152033] px-3 py-1.5 text-xs text-slate-300">
              {tag} <span className="ml-1 text-slate-500">{count}</span>
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
