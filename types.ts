
export enum ToneType {
  NATURAL = 'Natural',
  CASUAL = 'Casual',
  ACADEMIC = 'Academic',
  PROFESSIONAL = 'Professional',
  CREATIVE = 'Creative',
  CONVERSATIONAL = 'Conversational'
}

export interface HumanizeResult {
  originalText: string;
  humanizedText: string;
  wordCount: number;
  readingTime: number;
  humanScore: number;
}

export interface Settings {
  tone: ToneType;
  intensity: number; // 1-100
}
