import cors from "cors";
import express from "express";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.PORT ?? 3001);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../data");
const dataFile = path.join(dataDir, "snippets.json");

type Snippet = {
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

type SnippetInput = Omit<Snippet, "id" | "usageCount" | "createdAt" | "updatedAt">;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

async function readSnippets(): Promise<Snippet[]> {
  await mkdir(dataDir, { recursive: true });
  try {
    const raw = await readFile(dataFile, "utf8");
    return JSON.parse(raw) as Snippet[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await writeSnippets([]);
      return [];
    }
    throw error;
  }
}

async function writeSnippets(snippets: Snippet[]) {
  await mkdir(dataDir, { recursive: true });
  const temp = `${dataFile}.tmp`;
  await writeFile(temp, JSON.stringify(snippets, null, 2), "utf8");
  await rename(temp, dataFile);
}

function isSnippetInput(value: unknown): value is SnippetInput {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.title === "string" && item.title.trim().length > 0 &&
    typeof item.description === "string" &&
    typeof item.language === "string" && item.language.trim().length > 0 &&
    typeof item.code === "string" && item.code.trim().length > 0 &&
    Array.isArray(item.tags) && item.tags.every((tag) => typeof tag === "string") &&
    typeof item.favorite === "boolean"
  );
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/snippets", async (_req, res, next) => {
  try {
    res.json(await readSnippets());
  } catch (error) {
    next(error);
  }
});

app.post("/api/snippets", async (req, res, next) => {
  try {
    if (!isSnippetInput(req.body)) {
      res.status(400).send("Invalid snippet payload");
      return;
    }

    const snippets = await readSnippets();
    const now = new Date().toISOString();
    const snippet: Snippet = {
      ...req.body,
      id: randomUUID(),
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    snippets.unshift(snippet);
    await writeSnippets(snippets);
    res.status(201).json(snippet);
  } catch (error) {
    next(error);
  }
});

app.patch("/api/snippets/:id", async (req, res, next) => {
  try {
    const snippets = await readSnippets();
    const index = snippets.findIndex((snippet) => snippet.id === req.params.id);
    if (index === -1) {
      res.status(404).send("Snippet not found");
      return;
    }

    const patch = req.body as Partial<SnippetInput>;
    const candidate: SnippetInput = {
      title: patch.title ?? snippets[index].title,
      description: patch.description ?? snippets[index].description,
      language: patch.language ?? snippets[index].language,
      code: patch.code ?? snippets[index].code,
      tags: patch.tags ?? snippets[index].tags,
      favorite: patch.favorite ?? snippets[index].favorite,
    };

    if (!isSnippetInput(candidate)) {
      res.status(400).send("Invalid snippet payload");
      return;
    }

    snippets[index] = { ...snippets[index], ...candidate, updatedAt: new Date().toISOString() };
    await writeSnippets(snippets);
    res.json(snippets[index]);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/snippets/:id", async (req, res, next) => {
  try {
    const snippets = await readSnippets();
    const nextSnippets = snippets.filter((snippet) => snippet.id !== req.params.id);
    if (nextSnippets.length === snippets.length) {
      res.status(404).send("Snippet not found");
      return;
    }
    await writeSnippets(nextSnippets);
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

app.post("/api/snippets/:id/favorite", async (req, res, next) => {
  try {
    const snippets = await readSnippets();
    const snippet = snippets.find((item) => item.id === req.params.id);
    if (!snippet) {
      res.status(404).send("Snippet not found");
      return;
    }
    snippet.favorite = !snippet.favorite;
    snippet.updatedAt = new Date().toISOString();
    await writeSnippets(snippets);
    res.json(snippet);
  } catch (error) {
    next(error);
  }
});

app.post("/api/snippets/:id/use", async (req, res, next) => {
  try {
    const snippets = await readSnippets();
    const snippet = snippets.find((item) => item.id === req.params.id);
    if (!snippet) {
      res.status(404).send("Snippet not found");
      return;
    }
    snippet.usageCount += 1;
    await writeSnippets(snippets);
    res.json(snippet);
  } catch (error) {
    next(error);
  }
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).send("Internal server error");
});

app.listen(port, () => {
  console.log(`SnippetVault API running on http://localhost:${port}`);
});
