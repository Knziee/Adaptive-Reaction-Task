import { db } from "./firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { ExperimentResult } from "../types/types";

export async function getRecentResults(): Promise<ExperimentResult[]> {
  const q = query(collection(db, "results"), orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  const results: ExperimentResult[] = snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      participantId: data.participantId,
      accuracy: data.accuracy,
      meanRT: data.meanRT,
      rawTrials: Array.isArray(data.rawTrials) ? data.rawTrials : [],
      advanced: data.advanced,
      createdAt: data.createdAt?.toDate() ?? null,
    };
  });

  return results;
}
