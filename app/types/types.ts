export interface TrialData {
  response: string;
  correct_response: string;
  correct?: boolean;
  rt?: number;
  [key: string]: unknown; 
}
