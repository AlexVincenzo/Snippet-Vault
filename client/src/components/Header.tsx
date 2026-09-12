import { Moon, Plus, Search } from "lucide-react";

export function Header({
  search,
  onSearch,
  onNew,
}: {
  search: string;
  onSearch: (value: string) => void;
  onNew: () => void;
}) {
  return (
    <header className="flex items-center gap-4 border-b border-[#172131] bg-[#0b111c]/90 px-5 py-4 backdrop-blur lg:px-7">
      <label className="relative flex max-w-[850px] flex-1 items-center">
        <Search className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400" />
        <input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search snippets, tags, or code..."
          className="h-11 w-full rounded-xl border border-[#202d40] bg-[#0e1724] pl-12 pr-20 text-sm text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-indigo-500/70 focus:ring-2 focus:ring-indigo-500/10"
        />
        <kbd className="absolute right-3 hidden rounded-md border border-[#243247] bg-[#152033] px-2 py-1 text-[11px] text-slate-400 sm:block">Ctrl K</kbd>
      </label>
      <button className="grid h-11 w-11 place-items-center rounded-xl border border-[#202d40] bg-[#101a29] text-slate-300 hover:bg-[#162235]">
        <Moon className="h-5 w-5" />
      </button>
      <button
        onClick={onNew}
        className="flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 font-medium text-white shadow-lg shadow-indigo-950/30 transition hover:brightness-110 sm:px-5"
      >
        <Plus className="h-5 w-5" />
        <span className="hidden sm:inline">New Snippet</span>
      </button>
    </header>
  );
}
