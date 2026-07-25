import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { NeuralResults } from '../types';

export interface AssessmentRecord {
  id?: string;
  timestamp: number;
  finalParams: number;
  formattedParams: string;
  archetypeTitle: string;
  architectureCode: string;
  contextWindowValue: number;
  contextWindowFormatted: string;
  attentionHeadsValue: number;
  layerDepthValue: number;
  temperatureValue: number;
  topPValue: number;
  lexicalRichness: number;
}

export interface GlobalAggregates {
  totalAssessments: number;
  averageParamsBillion: number;
  medianParamsBillion: number;
  paramDistribution: Array<{ range: string; count: number; percentage: number }>;
  archetypeCounts: Array<{ archetype: string; count: number; percentage: number }>;
  temperatureDistribution: Array<{ tier: string; count: number }>;
  contextWindowDistribution: Array<{ label: string; count: number }>;
  userPercentile: number; // Percentile of user's params relative to global
}

// Anonymously record test completion
export async function logAssessmentToFirestore(results: NeuralResults): Promise<string | null> {
  try {
    const recordDoc = {
      createdAt: serverTimestamp(),
      timestamp: Date.now(),
      finalParams: results.finalParams,
      formattedParams: results.formattedParams,
      archetypeTitle: results.archetypeTitle,
      architectureCode: results.architectureCode,
      contextWindowValue: results.contextWindowValue,
      contextWindowFormatted: results.contextWindowFormatted,
      attentionHeadsValue: results.attentionHeadsValue,
      layerDepthValue: results.layerDepthValue,
      temperatureValue: results.temperatureValue,
      topPValue: results.topPValue,
      lexicalRichness: results.linguisticMetrics.lexicalRichness || 0,
    };

    const docRef = await addDoc(collection(db, 'assessments'), recordDoc);
    return docRef.id;
  } catch (err) {
    console.warn('Firestore telemetry log error (continuing seamlessly):', err);
    return null;
  }
}

// Fetch global aggregate statistics across all recorded assessments
export async function fetchGlobalAssessmentStats(currentUserParams?: number): Promise<GlobalAggregates> {
  try {
    const q = query(collection(db, 'assessments'), orderBy('timestamp', 'desc'), limit(500));
    const snapshot = await getDocs(q);

    const records: AssessmentRecord[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      records.push({
        id: doc.id,
        timestamp: data.timestamp || Date.now(),
        finalParams: data.finalParams || 70000000000,
        formattedParams: data.formattedParams || '70.0 Billion',
        archetypeTitle: data.archetypeTitle || 'Standard LLM',
        architectureCode: data.architectureCode || 'INTJ-70B',
        contextWindowValue: data.contextWindowValue || 32,
        contextWindowFormatted: data.contextWindowFormatted || '32k',
        attentionHeadsValue: data.attentionHeadsValue || 32,
        layerDepthValue: data.layerDepthValue || 32,
        temperatureValue: data.temperatureValue || 0.7,
        topPValue: data.topPValue || 0.9,
        lexicalRichness: data.lexicalRichness || 0.5,
      });
    });

    // If no documents in database yet, provide benchmark initial seeds
    if (records.length === 0) {
      return getFallbackGlobalAggregates(currentUserParams);
    }

    const total = records.length;
    const allParamsB = records.map((r) => r.finalParams / 1e9);
    const sumParamsB = allParamsB.reduce((a, b) => a + b, 0);
    const avgParamsB = sumParamsB / total;

    // Sort params for median and percentile
    const sortedParams = [...allParamsB].sort((a, b) => a - b);
    const medianParamsB = sortedParams[Math.floor(sortedParams.length / 2)] || avgParamsB;

    // Compute user percentile
    let userPercentile = 50;
    if (currentUserParams) {
      const userB = currentUserParams / 1e9;
      const countBelow = sortedParams.filter((p) => p <= userB).length;
      userPercentile = Math.round((countBelow / total) * 100);
    }

    // Parameter distribution buckets
    const paramBuckets = [
      { range: '< 50B', min: 0, max: 50, count: 0 },
      { range: '50B - 100B', min: 50, max: 100, count: 0 },
      { range: '100B - 200B', min: 100, max: 200, count: 0 },
      { range: '200B - 400B', min: 200, max: 400, count: 0 },
      { range: '400B+', min: 400, max: Infinity, count: 0 },
    ];

    records.forEach((r) => {
      const b = r.finalParams / 1e9;
      const bucket = paramBuckets.find((p) => b >= p.min && b < p.max);
      if (bucket) bucket.count++;
    });

    const paramDistribution = paramBuckets.map((b) => ({
      range: b.range,
      count: b.count,
      percentage: Math.round((b.count / total) * 100),
    }));

    // Archetype breakdown
    const archetypeMap: Record<string, number> = {};
    records.forEach((r) => {
      const title = r.archetypeTitle || 'Unknown';
      archetypeMap[title] = (archetypeMap[title] || 0) + 1;
    });

    const archetypeCounts = Object.entries(archetypeMap)
      .map(([archetype, count]) => ({
        archetype,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    // Temperature distribution
    const tempTiers = [
      { tier: 'Deterministic (<0.4)', min: 0, max: 0.4, count: 0 },
      { tier: 'Grounded (0.4-0.6)', min: 0.4, max: 0.6, count: 0 },
      { tier: 'Balanced (0.6-0.8)', min: 0.6, max: 0.8, count: 0 },
      { tier: 'High Entropy (>0.8)', min: 0.8, max: 2.0, count: 0 },
    ];

    records.forEach((r) => {
      const t = r.temperatureValue;
      const tier = tempTiers.find((p) => t >= p.min && t < p.max);
      if (tier) tier.count++;
    });

    // Context window distribution
    const contextMap: Record<string, number> = {};
    records.forEach((r) => {
      const cw = r.contextWindowFormatted || '32k';
      contextMap[cw] = (contextMap[cw] || 0) + 1;
    });

    const contextWindowDistribution = Object.entries(contextMap).map(([label, count]) => ({
      label,
      count,
    }));

    return {
      totalAssessments: total,
      averageParamsBillion: Math.round(avgParamsB * 10) / 10,
      medianParamsBillion: Math.round(medianParamsB * 10) / 10,
      paramDistribution,
      archetypeCounts,
      temperatureDistribution: tempTiers.map((t) => ({ tier: t.tier, count: t.count })),
      contextWindowDistribution,
      userPercentile,
    };
  } catch (err) {
    console.warn('Error querying Firestore global stats, using local fallback:', err);
    return getFallbackGlobalAggregates(currentUserParams);
  }
}

function getFallbackGlobalAggregates(currentUserParams?: number): GlobalAggregates {
  const userB = currentUserParams ? currentUserParams / 1e9 : 175;
  return {
    totalAssessments: 1248,
    averageParamsBillion: 168.4,
    medianParamsBillion: 145.0,
    paramDistribution: [
      { range: '< 50B', count: 187, percentage: 15 },
      { range: '50B - 100B', count: 349, percentage: 28 },
      { range: '100B - 200B', count: 424, percentage: 34 },
      { range: '200B - 400B', count: 199, percentage: 16 },
      { range: '400B+', count: 89, percentage: 7 },
    ],
    archetypeCounts: [
      { archetype: 'Overfitted Specialist', count: 312, percentage: 25 },
      { archetype: 'Hyper-Creative Hallucinator', count: 262, percentage: 21 },
      { archetype: 'Precision Deductive Engine', count: 224, percentage: 18 },
      { archetype: 'Ultra-Deep Multimodal Agent', count: 212, percentage: 17 },
      { archetype: 'Balanced Frontier Model', count: 238, percentage: 19 },
    ],
    temperatureDistribution: [
      { tier: 'Deterministic (<0.4)', count: 180 },
      { tier: 'Grounded (0.4-0.6)', count: 410 },
      { tier: 'Balanced (0.6-0.8)', count: 450 },
      { tier: 'High Entropy (>0.8)', count: 208 },
    ],
    contextWindowDistribution: [
      { label: '8k', count: 120 },
      { label: '16k', count: 240 },
      { label: '32k', count: 410 },
      { label: '64k', count: 310 },
      { label: '128k', count: 168 },
    ],
    userPercentile: Math.min(99, Math.max(1, Math.round((userB / 350) * 85))),
  };
}
