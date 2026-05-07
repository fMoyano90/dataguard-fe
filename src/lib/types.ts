export type Scenario = "credito_trampa" | "app_estafa" | "galpon" | "atd_software";

export type Severity = "Bajo" | "Medio" | "Alto";

export type RiskLabel = "Bajo" | "Medio" | "Medio-alto" | "Alto";

export type AgentName =
  | "intake"
  | "regulatory"
  | "risk"
  | "recommendation"
  | "validator";

export interface Citation {
  articulo: string;
  ley: string;
  url: string;
}

export interface PillarItem {
  title: string;
  detail: string;
  citation?: Citation;
  severity?: Severity;
}

export interface Pillars {
  good: PillarItem[];
  bad: PillarItem[];
  red: PillarItem[];
}

export interface Source {
  name: string;
  type: "legal" | "public" | "document" | "mock";
  snippet?: string;
  url?: string;
}

export interface AgentRun {
  agent: AgentName;
  model: string;
  durationMs: number;
  status: "done" | "warn";
}

export interface AnalysisResult {
  id: string;
  scenario: Scenario;
  riskScore: number;
  riskLabel: RiskLabel;
  resultTitle: string;
  resultText: string;
  pillars: Pillars;
  plan: string[];
  letters: {
    bank?: string;
    sernac?: string;
  };
  sources: Source[];
  agentRuns: AgentRun[];
  meta: {
    processedAt: string;
    zeroStorage: true;
    piiRedacted: boolean;
    mocked: boolean;
  };
}

export interface CreateAnalysisInput {
  scenario: Scenario;
  text: string;
  language: "es" | "en";
  entity?: string;
  documentType: "contract" | "tos" | "rental" | "dpa";
  caseContext?: string;
}

export class NotAContractError extends Error {
  readonly code = "NOT_A_CONTRACT";
  constructor(message: string) {
    super(message);
    this.name = "NotAContractError";
  }
}

export interface ExtractDocumentResult {
  text: string;
  charCount: number;
  piiRedacted: boolean;
  mimetype: string;
  model: string;
}

export interface EntityCheckInput {
  name?: string;
  url?: string;
}

export interface PhishTankResult {
  in_database: boolean;
  verified: boolean;
  valid_phish: boolean;
  phish_detail_url?: string;
}

export interface EntityCheckResult {
  name?: string;
  registered: boolean;
  isImitator: boolean;
  source: string;
  evidence?: string;
  phishtank?: PhishTankResult;
  _mocked: boolean;
}
