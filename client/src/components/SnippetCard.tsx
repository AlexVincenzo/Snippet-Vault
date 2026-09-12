import { Copy, Star } from "lucide-react";
import type { Snippet } from "../types/snippet";
import { CodeBlock } from "./CodeBlock";

function timeAgo(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const days = Math.max(0, Math.floor(diff / 86_400_000));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
}

export function SnippetCard({
  snippet,
  selected,
  onSelect,
  onFavorite,
}: {
  snippet: Snippet;
  selected: boolean;
  onSelect: () => void;
  onFavorite: () => void;
}) {
  return (
    <article
      onClick={onSelect}
      className={`group cursor-pointer rounded-xl border bg-[#0f1826] p-3.5 transition hover:-translate-y-0.5 hover:border-slate-600/80 hover:bg-[#111c2b] ${
        selected ? "border-indigo-500 ring-1 ring-indigo-500/40" : "border-[#1c293a]"
      }`}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <span className="grid h-6 min-w-6 place-items-center rounded-md bg-indigo-500/20 px-1 text-[10px] font-bold text-indigo-300">{snippet.language.slice(0, 3).toUpperCase()}</span>
        <span className="truncate text-xs text-slate-400">{snippet.language}</span>
        <button
          onClick={(event) => { event.stopPropagation(); onFavorite(); }}
          className="ml-auto rounded-md p-1 text-slate-500 hover:bg-white/5 hover:text-amber-300"
          aria-label="Toggle favorite"
        >
          <Star className={`h-4.5 w-4.5 ${snippet.favorite ? "fill-amber-400 text-amber-400" : ""}`} />
        </button>
      </div>

      <h3 className="truncate text-[15px] font-semibold text-white">{snippet.title}</h3>
      <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-slate-400">{snippet.description}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {snippet.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full border border-[#21314a] bg-[#16243a] px-2.5 py-1 text-[11px] text-slate-300">{tag}</span>
        ))}
      </div>

      <div className="mt-3 overflow-hidden rounded-xl">
        <CodeBlock code={snippet.code} language={snippet.language} compact />
      </div>

      <div className="mt-3 flex items-center text-[11px] text-slate-500">
        <span>{timeAgo(snippet.updatedAt)}</span>
        <span className="ml-auto flex items-center gap-1.5"><Copy className="h-3.5 w-3.5" /> {snippet.usageCount}</span>
      </div>
    </article>
  );
}
