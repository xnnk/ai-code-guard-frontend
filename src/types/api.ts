export interface WebResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface LoginRequest {
  account: string;
  password: string;
}

export interface RegisterRequest {
  account: string;
  password: string;
  name: string;
}

export interface CodeGenerationRequest {
  prompt: string;
  language: string;
  modelType?: string;
}

export interface CodeGenerationResponse {
  codeId: string;
  content: string;
  language: string;
  modelUsed: string;
}

export interface GeneratedCodeDocument {
  id: string;
  content: string;
  language: string;
  prompt: string;
  aiModel: string;
  userId: number;
  createdAt: string;
  scanStatus: string;
  isVisible: boolean;
}

export interface VulnerabilityReport {
  id: string;
  codeId: string;
  scanTime: string;
  vulnerabilities: Vulnerability[];
  summary: string;
  securityScore: number;
}

export interface Vulnerability {
  type: string;
  description: string;
  line: number;
  codeSnippet: string;
  suggestion: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface EnhancedCodeAnalysisResult {
  generatedCodeId: string;
  generatedCodeContent: string;
  language: string;
  modelUsedForGeneration: string;
  knowledgeGraphCypherQueries: string[];
  knowledgeGraphDataRetrieved: {
    'v.name': string;
    'v.description': string | null;
    'v.severity': string;
  }[];
  analysisReport: {
    id: string;
    codeId: string;
    scanTime: number[];
    scanType: string | null;
    vulnerabilities: Vulnerability[];
    summary: string;
    securityScore: number;
  };
  modelUsedForAnalysis: string;
}
