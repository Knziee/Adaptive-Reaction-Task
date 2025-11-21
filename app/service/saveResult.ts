// app/lib/saveResult.ts
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export interface TrialData {
  correct?: boolean;
  rt?: number;
  [key: string]: unknown; 
}
export async function saveResult(data: {
  participantId: string;
  accuracy: number;
  meanRT: number;
  rawTrials: TrialData[];
  advanced: boolean;
}) {
  await addDoc(collection(db, "results"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}
