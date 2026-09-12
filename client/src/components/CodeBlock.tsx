import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const languageAliases: Record<string, string> = {
  TypeScript: "typescript",
  JavaScript: "javascript",
  PostgreSQL: "sql",
  SQL: "sql",
  Python: "python",
  "C#": "csharp",
  PHP: "php",
  HTML: "html",
  CSS: "css",
  Bash: "bash",
};

export function CodeBlock({ code, language, compact = false }: { code: string; language: string; compact?: boolean }) {
  return (
    <SyntaxHighlighter
      language={languageAliases[language] ?? "text"}
      style={oneDark}
      showLineNumbers={!compact}
      wrapLongLines={false}
      customStyle={{
        margin: 0,
        borderRadius: "12px",
        background: "#09111c",
        border: "1px solid #1d2a3b",
        padding: compact ? "14px" : "16px",
        fontSize: compact ? "12px" : "13px",
        minHeight: compact ? "132px" : undefined,
        maxHeight: compact ? "148px" : "420px",
        overflow: "auto",
      }}
      lineNumberStyle={{ color: "#526075", minWidth: "2.2em" }}
    >
      {code}
    </SyntaxHighlighter>
  );
}
