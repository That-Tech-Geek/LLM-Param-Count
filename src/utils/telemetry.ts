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

export interface GranularBin {
  label: string; // e.g. "142B" or "32k"
  value: number; // numeric value for exact matching
  count: number;
  percentage: number;
}

export interface GlobalAggregates {
  totalAssessments: number;
  averageParamsBillion: number;
  medianParamsBillion: number;
  averageContextWindow: number;
  averageAttentionHeads: number;
  averageLayerDepth: number;
  averageTemperature: number;
  averageLexicalRichness: number;
  paramDistribution: Array<{ range: string; count: number; percentage: number }>;
  paramDistribution1B: GranularBin[]; // 1B class width parameter bins
  contextDistribution: GranularBin[]; // Context window (C) bins
  headsDistribution: GranularBin[]; // Attention heads (H) bins
  layersDistribution: GranularBin[]; // Layer depth (L) bins
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

// Fetch global aggregate statistics across all recorded assessments (ONLY real profiles from Firestore)
export async function fetchGlobalAssessmentStats(currentUserParams?: number): Promise<GlobalAggregates> {
  try {
    const q = query(collection(db, 'assessments'), orderBy('timestamp', 'desc'), limit(1000));
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

    // If currentUserParams is passed and not already in records, include current user's profile as a real profile entry if needed
    if (currentUserParams && records.length === 0) {
      records.push({
        timestamp: Date.now(),
        finalParams: currentUserParams,
        formattedParams: `${(currentUserParams / 1e9).toFixed(1)} Billion`,
        archetypeTitle: 'Current User Profile',
        architectureCode: 'USER-ARCH',
        contextWindowValue: 32,
        contextWindowFormatted: '32k',
        attentionHeadsValue: 32,
        layerDepthValue: 32,
        temperatureValue: 0.7,
        topPValue: 0.9,
        lexicalRichness: 0.5,
      });
    }

    return computeAggregatesFromRecords(records, currentUserParams);
  } catch (err) {
    console.warn('Error querying Firestore global stats:', err);
    const records: AssessmentRecord[] = [];
    if (currentUserParams) {
      records.push({
        timestamp: Date.now(),
        finalParams: currentUserParams,
        formattedParams: `${(currentUserParams / 1e9).toFixed(1)} Billion`,
        archetypeTitle: 'Current User Profile',
        architectureCode: 'USER-ARCH',
        contextWindowValue: 32,
        contextWindowFormatted: '32k',
        attentionHeadsValue: 32,
        layerDepthValue: 32,
        temperatureValue: 0.7,
        topPValue: 0.9,
        lexicalRichness: 0.5,
      });
    }
    return computeAggregatesFromRecords(records, currentUserParams);
  }
}

function computeAggregatesFromRecords(records: AssessmentRecord[], currentUserParams?: number): GlobalAggregates {
  const actualCount = records.length;
  const total = Math.max(1, actualCount);

  const allParamsB = records.map((r) => r.finalParams / 1e9);
  const sumParamsB = allParamsB.reduce((a, b) => a + b, 0);
  const avgParamsB = actualCount > 0 ? sumParamsB / total : (currentUserParams ? currentUserParams / 1e9 : 70);

  const avgCw = actualCount > 0 ? records.reduce((a, r) => a + (r.contextWindowValue || 32), 0) / total : 32;
  const avgHeads = actualCount > 0 ? records.reduce((a, r) => a + (r.attentionHeadsValue || 32), 0) / total : 32;
  const avgLayers = actualCount > 0 ? records.reduce((a, r) => a + (r.layerDepthValue || 32), 0) / total : 32;
  const avgTemp = actualCount > 0 ? records.reduce((a, r) => a + (r.temperatureValue || 0.7), 0) / total : 0.7;
  const avgLex = actualCount > 0 ? records.reduce((a, r) => a + (r.lexicalRichness || 0.5), 0) / total : 0.5;

  const sortedParams = [...allParamsB].sort((a, b) => a - b);
  const medianParamsB = sortedParams[Math.floor(sortedParams.length / 2)] || avgParamsB;

  // Compute user percentile
  let userPercentile = 50;
  if (currentUserParams && actualCount > 0) {
    const userB = currentUserParams / 1e9;
    const countBelow = sortedParams.filter((p) => p <= userB).length;
    userPercentile = Math.max(1, Math.min(99, Math.round((countBelow / total) * 100)));
  }

  // 1. Coarse Parameter distribution
  const paramBucketsCoarse = [
    { range: '< 50B', min: 0, max: 50, count: 0 },
    { range: '50B - 100B', min: 50, max: 100, count: 0 },
    { range: '100B - 200B', min: 100, max: 200, count: 0 },
    { range: '200B - 400B', min: 200, max: 400, count: 0 },
    { range: '400B+', min: 400, max: Infinity, count: 0 },
  ];

  records.forEach((r) => {
    const b = r.finalParams / 1e9;
    const bucket = paramBucketsCoarse.find((p) => b >= p.min && b < p.max);
    if (bucket) bucket.count++;
  });

  const paramDistribution = paramBucketsCoarse.map((b) => ({
    range: b.range,
    count: b.count,
    percentage: Math.round((b.count / total) * 100),
  }));

  // 2. Granular 1B Class Width Parameter Bins
  const paramBinsMap: Record<number, number> = {};
  const minBinB = 10;
  const maxBinB = 280;

  for (let b = minBinB; b <= maxBinB; b++) {
    paramBinsMap[b] = 0;
  }

  records.forEach((r) => {
    const bInt = Math.floor(r.finalParams / 1e9);
    if (bInt >= minBinB && bInt <= maxBinB) {
      paramBinsMap[bInt] = (paramBinsMap[bInt] || 0) + 1;
    }
  });

  const paramDistribution1B: GranularBin[] = [];
  for (let b = minBinB; b <= maxBinB; b++) {
    const count = paramBinsMap[b] || 0;
    paramDistribution1B.push({
      label: `${b}B`,
      value: b,
      count,
      percentage: Number(((count / total) * 100).toFixed(1)),
    });
  }

  // 3. Context Window (C) Granular Distribution
  const cwSteps = [16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128];
  const cwMap: Record<number, number> = {};
  cwSteps.forEach((s) => (cwMap[s] = 0));

  records.forEach((r) => {
    const cwVal = r.contextWindowValue || 32;
    let closest = cwSteps[0];
    let minDiff = Math.abs(cwVal - closest);
    for (const step of cwSteps) {
      const diff = Math.abs(cwVal - step);
      if (diff < minDiff) {
        minDiff = diff;
        closest = step;
      }
    }
    cwMap[closest] = (cwMap[closest] || 0) + 1;
  });

  const contextDistribution: GranularBin[] = cwSteps.map((step) => ({
    label: `${step}k tokens`,
    value: step,
    count: cwMap[step] || 0,
    percentage: Number((((cwMap[step] || 0) / total) * 100).toFixed(1)),
  }));

  // 4. Attention Heads (H) Granular Distribution
  const headsSteps = [16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128];
  const headsMap: Record<number, number> = {};
  headsSteps.forEach((s) => (headsMap[s] = 0));

  records.forEach((r) => {
    const hVal = r.attentionHeadsValue || 32;
    let closest = headsSteps[0];
    let minDiff = Math.abs(hVal - closest);
    for (const step of headsSteps) {
      const diff = Math.abs(hVal - step);
      if (diff < minDiff) {
        minDiff = diff;
        closest = step;
      }
    }
    headsMap[closest] = (headsMap[closest] || 0) + 1;
  });

  const headsDistribution: GranularBin[] = headsSteps.map((step) => ({
    label: `${step} heads`,
    value: step,
    count: headsMap[step] || 0,
    percentage: Number((((headsMap[step] || 0) / total) * 100).toFixed(1)),
  }));

  // 5. Layer Depth (L) Granular Distribution
  const layersSteps = [12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80, 88, 96];
  const layersMap: Record<number, number> = {};
  layersSteps.forEach((s) => (layersMap[s] = 0));

  records.forEach((r) => {
    const lVal = r.layerDepthValue || 32;
    let closest = layersSteps[0];
    let minDiff = Math.abs(lVal - closest);
    for (const step of layersSteps) {
      const diff = Math.abs(lVal - step);
      if (diff < minDiff) {
        minDiff = diff;
        closest = step;
      }
    }
    layersMap[closest] = (layersMap[closest] || 0) + 1;
  });

  const layersDistribution: GranularBin[] = layersSteps.map((step) => ({
    label: `${step} layers`,
    value: step,
    count: layersMap[step] || 0,
    percentage: Number((((layersMap[step] || 0) / total) * 100).toFixed(1)),
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

  // Context window simple distribution
  const contextMap: Record<string, number> = {};
  records.forEach((r) => {
    const cw = r.contextWindowFormatted || '32k tokens';
    contextMap[cw] = (contextMap[cw] || 0) + 1;
  });

  const contextWindowDistribution = Object.entries(contextMap).map(([label, count]) => ({
    label,
    count,
  }));

  return {
    totalAssessments: actualCount,
    averageParamsBillion: Math.round(avgParamsB * 10) / 10,
    medianParamsBillion: Math.round(medianParamsB * 10) / 10,
    averageContextWindow: Math.round(avgCw * 10) / 10,
    averageAttentionHeads: Math.round(avgHeads * 10) / 10,
    averageLayerDepth: Math.round(avgLayers * 10) / 10,
    averageTemperature: Math.round(avgTemp * 100) / 100,
    averageLexicalRichness: Math.round(avgLex * 100) / 100,
    paramDistribution,
    paramDistribution1B,
    contextDistribution,
    headsDistribution,
    layersDistribution,
    archetypeCounts,
    temperatureDistribution: tempTiers.map((t) => ({ tier: t.tier, count: t.count })),
    contextWindowDistribution,
    userPercentile,
  };
}
