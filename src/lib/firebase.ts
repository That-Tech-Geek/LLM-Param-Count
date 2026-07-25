import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { NeuralResults } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyBm8PNIbKxuVtGjvo8rE4DXzmx0_el3OEg",
  authDomain: "how-llm-am-i.firebaseapp.com",
  projectId: "how-llm-am-i",
  storageBucket: "how-llm-am-i.firebasestorage.app",
  messagingSenderId: "940904933151",
  appId: "1:940904933151:web:3841f832af5b49bcc3f22a",
  measurementId: "G-KWNX4YRBZV"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

export interface CommunityResultDoc {
  id?: string;
  finalParamsBillions: number;
  archetypeTitle: string;
  archetypeCode: string;
  contextWindowValue: number;
  attentionHeadsValue: number;
  layerDepthValue: number;
  temperatureValue: number;
  topPValue: number;
  isSyntheticOverride: boolean;
  timestamp: number;
}

export interface GlobalStats {
  totalAssessments: number;
  averageParamsBillions: number;
  medianParamsBillions: number;
  avgContextWindow: number;
  avgAttentionHeads: number;
  avgTemperature: number;
  parameterHistogram: Array<{ bucket: string; count: number }>;
  archetypeDistribution: Array<{ archetype: string; count: number; percentage: number }>;
  temperatureDistribution: Array<{ range: string; count: number }>;
}

export async function saveAnonymizedResult(results: NeuralResults): Promise<boolean> {
  try {
    const finalParamsBillions = Number((results.finalParams / 1_000_000_000).toFixed(2));
    await addDoc(collection(db, 'assessment_results'), {
      finalParamsBillions,
      archetypeTitle: results.archetypeTitle,
      archetypeCode: results.architectureCode,
      contextWindowValue: results.contextWindowValue,
      attentionHeadsValue: results.attentionHeadsValue,
      layerDepthValue: results.layerDepthValue,
      temperatureValue: results.temperatureValue,
      topPValue: results.topPValue,
      isSyntheticOverride: results.isSyntheticOverride,
      timestamp: Date.now(),
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.warn('Firestore write warning:', err);
    return false;
  }
}

export async function fetchGlobalCommunityStats(): Promise<GlobalStats | null> {
  try {
    const q = query(collection(db, 'assessment_results'), orderBy('timestamp', 'desc'), limit(500));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const docs: CommunityResultDoc[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as CommunityResultDoc;
      docs.push(data);
    });

    const totalAssessments = docs.length;
    const totalParamsSum = docs.reduce((acc, d) => acc + (d.finalParamsBillions || 0), 0);
    const averageParamsBillions = Number((totalParamsSum / totalAssessments).toFixed(1));

    const sortedParams = [...docs].map((d) => d.finalParamsBillions).sort((a, b) => a - b);
    const medianParamsBillions = sortedParams[Math.floor(sortedParams.length / 2)] || averageParamsBillions;

    const avgContextWindow = Math.round(
      docs.reduce((acc, d) => acc + (d.contextWindowValue || 32), 0) / totalAssessments
    );
    const avgAttentionHeads = Math.round(
      docs.reduce((acc, d) => acc + (d.attentionHeadsValue || 32), 0) / totalAssessments
    );
    const avgTemperature = Number(
      (docs.reduce((acc, d) => acc + (d.temperatureValue || 0.7), 0) / totalAssessments).toFixed(2)
    );

    // 1. Parameter Histogram Buckets
    const buckets: Record<string, number> = {
      '<10B': 0,
      '10B-50B': 0,
      '50B-100B': 0,
      '100B-300B': 0,
      '300B-500B': 0,
      '500B+': 0,
    };

    docs.forEach((d) => {
      const p = d.finalParamsBillions;
      if (p < 10) buckets['<10B']++;
      else if (p < 50) buckets['10B-50B']++;
      else if (p < 100) buckets['50B-100B']++;
      else if (p < 300) buckets['100B-300B']++;
      else if (p < 500) buckets['300B-500B']++;
      else buckets['500B+']++;
    });

    const parameterHistogram = Object.entries(buckets).map(([bucket, count]) => ({
      bucket,
      count,
    }));

    // 2. Archetype Breakdown
    const archetypeCounts: Record<string, number> = {};
    docs.forEach((d) => {
      const title = d.archetypeTitle || 'Unknown Archetype';
      archetypeCounts[title] = (archetypeCounts[title] || 0) + 1;
    });

    const archetypeDistribution = Object.entries(archetypeCounts)
      .map(([archetype, count]) => ({
        archetype,
        count,
        percentage: Number(((count / totalAssessments) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count);

    // 3. Temperature Ranges
    const tempRanges: Record<string, number> = {
      'Low (<0.5)': 0,
      'Balanced (0.5-0.75)': 0,
      'High (>0.75)': 0,
    };
    docs.forEach((d) => {
      const t = d.temperatureValue || 0.7;
      if (t < 0.5) tempRanges['Low (<0.5)']++;
      else if (t <= 0.75) tempRanges['Balanced (0.5-0.75)']++;
      else tempRanges['High (>0.75)']++;
    });

    const temperatureDistribution = Object.entries(tempRanges).map(([range, count]) => ({
      range,
      count,
    }));

    return {
      totalAssessments,
      averageParamsBillions,
      medianParamsBillions,
      avgContextWindow,
      avgAttentionHeads,
      avgTemperature,
      parameterHistogram,
      archetypeDistribution,
      temperatureDistribution,
    };
  } catch (err) {
    console.warn('Error fetching Firestore stats:', err);
    return null;
  }
}
