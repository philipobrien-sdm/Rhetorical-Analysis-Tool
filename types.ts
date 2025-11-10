// types.ts

export interface PersuasiveTechnique {
  technique: string;
  example: string;
  explanation: string;
  rhetoricalHeat: number;
}

export interface LogicalFallacy {
  fallacy: string;
  example: string;
  explanation: string;
  rhetoricalHeat: number;
}

export interface SliderPositions {
  professionalism: number;
  emotionality: number;
  proximity: number;
  intensity: number;
}

export interface HeatmapPoint {
  segment: string;
  speaker?: string;
  intensity: number; // 1-10
  reasoning: string;
}

export interface ConversationAnalysis {
  heatmap: HeatmapPoint[];
}

export interface PersonalizedFeedback {
  potentialTriggers: string[];
  identityAppeals: string[];
  generalObservations: string;
}

// Re-framing of the analysis for different audiences
export interface SimplifiedAnalysis {
    simplifiedThesis: string;
    simplifiedTechniques: { friendlyName: string; example: string; simpleExplanation: string; }[];
    simplifiedFallacies: { friendlyName: string; example: string; simpleExplanation: string; }[];
    keyTakeaway: string;
}

export interface PlainLanguageAnalysis {
    plainThesis: string;
    plainTechniques: { name: string; example: string; explanation: string; }[];
    plainFallacies: { name: string; example: string; explanation: string; }[];
    mainPoint: string;
}

export interface NeurodivergentAnalysis {
    literalThesis: string;
    explainedTechniques: { name: string; example: string; literalExplanation: string; }[];
    explainedFallacies: { name: string; example: string; literalExplanation: string; }[];
    socialCueSummary: string;
}


export interface TextAnalysis {
  overallThesis: string;
  keyClaims: string[];
  persuasiveTechniques: PersuasiveTechnique[];
  logicalFallacies: LogicalFallacy[];
  targetAudience: string;
  potentialBiases: string[];
  socraticQuestions: string[];
  neutralizedText: string;
  initialSliderPositions: SliderPositions;
  personalizedFeedback?: PersonalizedFeedback;
  simplifiedAnalysis: SimplifiedAnalysis;
  plainLanguageAnalysis: PlainLanguageAnalysis;
  neurodivergentAnalysis: NeurodivergentAnalysis;
}

// A single analysis result can be one or the other.
export interface AnalysisResult {
  isConversation: boolean;
  textAnalysis?: TextAnalysis;
  conversationAnalysis?: ConversationAnalysis;
}


export interface HistoryEntry {
  id: string;
  name: string;
  input: string;
  analysis: AnalysisResult;
  createdAt: string; // ISO string
}

export type RewriteParams = SliderPositions;

export interface UserProfile {
  age: string;
  gender: string;
  nationality: string;
  religion: string;
  other: string;
}