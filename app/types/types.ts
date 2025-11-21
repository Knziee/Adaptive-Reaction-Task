export interface TrialData {
  response: string;
  correct_response: string;
  correct?: boolean;
  rt?: number;
  [key: string]: unknown; 
}

export interface ExperimentResult {
  id: string;
  participantId: string;
  accuracy: number;
  meanRT: number;
  rawTrials: unknown[];
  advanced: boolean;
  createdAt: Date | null;
}
