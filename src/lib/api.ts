import type {
  AnalysisResult,
  CreateAnalysisInput,
  EntityCheckInput,
  EntityCheckResult,
  ExtractDocumentResult,
} from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export async function checkEntity(input: EntityCheckInput): Promise<EntityCheckResult> {
  if (USE_MOCK) {
    const { checkEntityMock } = await import("./mockApi");
    return checkEntityMock(input);
  }

  try {
    const res = await fetch(`${BASE}/api/entity-check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(`Backend error ${res.status}`);
    return res.json() as Promise<EntityCheckResult>;
  } catch {
    const { checkEntityMock } = await import("./mockApi");
    return checkEntityMock(input);
  }
}

export async function runAnalysis(input: CreateAnalysisInput): Promise<AnalysisResult> {
  if (USE_MOCK) {
    const { runAnalysisMock } = await import("./mockApi");
    return runAnalysisMock(input);
  }

  try {
    const res = await fetch(`${BASE}/api/analyses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(`Backend error ${res.status}`);
    return res.json() as Promise<AnalysisResult>;
  } catch {
    const { runAnalysisMock } = await import("./mockApi");
    return runAnalysisMock(input);
  }
}

export async function extractDocument(file: File): Promise<ExtractDocumentResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE}/api/analyses/extract-document`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: `Error ${res.status}` }));
    const message = Array.isArray(errorBody?.message)
      ? errorBody.message.join(", ")
      : errorBody?.message || `Error ${res.status}`;
    throw new Error(message);
  }

  return res.json() as Promise<ExtractDocumentResult>;
}

export async function checkHealth(): Promise<{ claude: "ok" | "down"; pinecone: "ok" | "down"; mongo: "ok" | "down" }> {
  if (USE_MOCK) return { claude: "ok", pinecone: "ok", mongo: "ok" };

  try {
    const res = await fetch(`${BASE}/api/health/ai`);
    if (!res.ok) throw new Error(`Backend error ${res.status}`);
    return res.json() as Promise<{ claude: "ok" | "down"; pinecone: "ok" | "down"; mongo: "ok" | "down" }>;
  } catch {
    return { claude: "down", pinecone: "down", mongo: "down" };
  }
}
