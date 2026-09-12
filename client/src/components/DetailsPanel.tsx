import { Copy, Ellipsis, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import type { Snippet } from "../types/snippet";
import { CodeBlock } from "./CodeBlock";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function DetailsPanel({
  snippet,
  onClose,
  onEdit,
  onDelete,
  onFavorite,
  onCopy,
}: {
  snippet: Snippet | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onFavorite: () => void;
  onCopy: () => void;
}) {
  if (!snippet) {
    return (
      <aside className="hidden w-[390px] shrink-0 border-l border-[#1b2636] bg-[#0b121d] 2xl:grid 2xl:place-items-center">
        <div className="px-8 text-center text-sm text-slate-500">Select a snippet to see its details.</div>
      </aside>
    );
  }

  return (
    <aside className="hidden h-[calc(100vh-77px)] w-[390px] shrink-0 overflow-y-auto border-l border-[#1b2636] bg-[#0b121d] 2xl:block">
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="grid h-7 min-w-7 place-items-center rounded-md bg-indigo-500/20 px-1 font-bold text-indigo-300">{snippet.language.slice(0, 3).toUpperCase()}</span>
          <span>{snippet.language}</span>
          <button onClick={onFavorite} className="ml-auto p-1.5 text-slate-500 hover:text-amber-400">
            <Star className={`h-5 w-5 ${snippet.favorite ? "fill-amber-400 text-amber-400" : ""}`} />
          </button>
          <button onClick={onClose} className="p-1.5 text-slate-500 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <h2 className="mt-5 text-2xl font-semibold tracking-tight text-white">{snippet.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">{snippet.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {snippet.tags.map((tag) => <span key={tag} className="rounded-full bg-[#17243a] px-3 py-1.5 text-xs text-slate-300">{tag}</span>)}
        </div>

        <div className="mt-5"><CodeBlock code={snippet.code} language={snippet.language} /></div>

        <div className="mt-4 grid grid-cols-[1.2fr_.8fr_.8fr] gap-2">
          <button onClick={onCopy} className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-3 text-sm font-medium text-white hover:bg-indigo-500"><Copy className="h-4 w-4" /> Copy Code</button>
          <button onClick={onEdit} className="flex items-center justify-center gap-2 rounded-lg border border-[#243247] bg-[#172233] px-3 py-3 text-sm text-slate-200 hover:bg-[#1c2a3f]"><Pencil className="h-4 w-4" /> Edit</button>
          <button onClick={onDelete} className="flex items-center justify-center gap-2 rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-3 text-sm text-red-400 hover:bg-red-950/60"><Trash2 className="h-4 w-4" /> Delete</button>
        </div>
      </div>

      <div className="border-t border-[#1b2636] p-5">
        <h3 className="mb-4 text-sm font-semibold text-white">Details</h3>
        <dl className="space-y-4 text-sm">
          <div className="grid grid-cols-[110px_1fr] gap-3"><dt className="text-slate-500">Language</dt><dd className="text-slate-200">{snippet.language}</dd></div>
          <div className="grid grid-cols-[110px_1fr] gap-3"><dt className="text-slate-500">Tags</dt><dd className="flex flex-wrap gap-1.5">{snippet.tags.map((tag) => <span key={tag} className="rounded-full bg-[#17243a] px-2 py-1 text-xs text-slate-300">{tag}</span>)}<button className="grid h-6 w-6 place-items-center rounded-full bg-[#17243a] text-slate-400"><Plus className="h-3.5 w-3.5" /></button></dd></div>
          <div className="grid grid-cols-[110px_1fr] gap-3"><dt className="text-slate-500">Created</dt><dd className="text-slate-300">{formatDate(snippet.createdAt)}</dd></div>
          <div className="grid grid-cols-[110px_1fr] gap-3"><dt className="text-slate-500">Last updated</dt><dd className="text-slate-300">{formatDate(snippet.updatedAt)}</dd></div>
          <div className="grid grid-cols-[110px_1fr] gap-3"><dt className="text-slate-500">Usage count</dt><dd className="text-slate-300">{snippet.usageCount}</dd></div>
        </dl>
      </div>
    </aside>
  );
}
