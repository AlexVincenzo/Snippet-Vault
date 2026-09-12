import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import type { Snippet, SnippetInput } from "../types/snippet";

const languages = ["TypeScript", "JavaScript", "PostgreSQL", "Python", "C#", "PHP", "HTML", "CSS", "Bash"];

const emptyForm: SnippetInput = {
  title: "",
  description: "",
  language: "TypeScript",
  code: "",
  tags: [],
  favorite: false,
};

export function SnippetModal({
  open,
  snippet,
  onClose,
  onSubmit,
}: {
  open: boolean;
  snippet: Snippet | null;
  onClose: () => void;
  onSubmit: (input: SnippetInput) => Promise<void>;
}) {
  const [form, setForm] = useState<SnippetInput>(emptyForm);
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (snippet) {
      setForm({
        title: snippet.title,
        description: snippet.description,
        language: snippet.language,
        code: snippet.code,
        tags: snippet.tags,
        favorite: snippet.favorite,
      });
      setTags(snippet.tags.join(", "));
    } else {
      setForm(emptyForm);
      setTags("");
    }
  }, [snippet, open]);

  if (!open) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const field = "w-full rounded-xl border border-[#26354a] bg-[#0c1522] px-3.5 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-600 focus:border-indigo-500";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <form onSubmit={submit} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#243247] bg-[#0e1724] p-5 shadow-2xl shadow-black/50 sm:p-6">
        <div className="mb-5 flex items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">{snippet ? "Edit snippet" : "New snippet"}</h2>
            <p className="mt-1 text-xs text-slate-500">Keep it short, searchable and reusable.</p>
          </div>
          <button type="button" onClick={onClose} className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-white/5 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-slate-400">Title</span><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={field} placeholder="Sleep helper" /></label>
          <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-slate-400">Description</span><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={field} placeholder="Pause execution for a given time" /></label>
          <label><span className="mb-1.5 block text-xs font-medium text-slate-400">Language</span><select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className={field}>{languages.map((language) => <option key={language}>{language}</option>)}</select></label>
          <label><span className="mb-1.5 block text-xs font-medium text-slate-400">Tags</span><input value={tags} onChange={(e) => setTags(e.target.value)} className={field} placeholder="utils, async" /></label>
          <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-medium text-slate-400">Code</span><textarea required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className={`${field} min-h-56 resize-y font-mono text-xs leading-6`} placeholder={'const sleep = (ms: number) =>\n  new Promise(resolve => setTimeout(resolve, ms));'} /></label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl border border-[#27354a] px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5">Cancel</button>
          <button disabled={saving} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-60">{saving ? "Saving..." : snippet ? "Save changes" : "Create snippet"}</button>
        </div>
      </form>
    </div>
  );
}
