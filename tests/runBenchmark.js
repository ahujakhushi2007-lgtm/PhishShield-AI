import { BENCHMARK_CASES } from './testCases.js';
import { analyzeUrl } from '../shared/urlAnalyzer.js';
import { analyzeText } from '../shared/textAnalyzer.js';
import { analyzeEmail } from '../shared/emailAnalyzer.js';

export function runBenchmark() {
  console.log('\n============================================================');
  console.log('🛡️  PHISHSHIELD AI — RULE ENGINE BENCHMARK SUITE');
  console.log('============================================================\n');

  let truePositives = 0;  // Malicious correctly identified as DANGEROUS/SUSPICIOUS
  let falsePositives = 0; // Safe wrongly identified as DANGEROUS/SUSPICIOUS
  let trueNegatives = 0;  // Safe correctly identified as SAFE
  let falseNegatives = 0; // Malicious wrongly identified as SAFE

  const results = [];

  for (const tc of BENCHMARK_CASES) {
    let result;
    if (tc.type === 'url') {
      result = analyzeUrl(tc.input);
    } else if (tc.type === 'text') {
      result = analyzeText(tc.input);
    } else if (tc.type === 'email') {
      result = analyzeEmail(tc.input);
    }

    const predictedVerdict = result.verdict;
    const isExpectedMalicious = tc.expectedVerdict === 'DANGEROUS' || tc.expectedVerdict === 'SUSPICIOUS';
    const isPredictedMalicious = predictedVerdict === 'DANGEROUS' || predictedVerdict === 'SUSPICIOUS';

    let pass = false;
    if (isExpectedMalicious && isPredictedMalicious) {
      truePositives++;
      pass = true;
    } else if (!isExpectedMalicious && !isPredictedMalicious) {
      trueNegatives++;
      pass = true;
    } else if (!isExpectedMalicious && isPredictedMalicious) {
      falsePositives++;
    } else if (isExpectedMalicious && !isPredictedMalicious) {
      falseNegatives++;
    }

    results.push({
      id: tc.id,
      category: tc.category,
      type: tc.type,
      expected: tc.expectedVerdict,
      predicted: predictedVerdict,
      score: result.riskScore,
      pass
    });
  }

  // Print results table
  console.table(results.map(r => ({
    ID: r.id,
    Type: r.type,
    Category: r.category,
    Expected: r.expected,
    Predicted: r.predicted,
    Score: r.score,
    Status: r.pass ? '✅ PASS' : '❌ FAIL'
  })));

  const total = BENCHMARK_CASES.length;
  const accuracy = ((truePositives + trueNegatives) / total) * 100;
  const precision = truePositives + falsePositives > 0 ? (truePositives / (truePositives + falsePositives)) * 100 : 0;
  const recall = truePositives + falsePositives > 0 ? (truePositives / (truePositives + falseNegatives)) * 100 : 0;
  const f1 = precision + recall > 0 ? (2 * (precision * recall)) / (precision + recall) : 0;

  console.log('\n--- PERFORMANCE EVALUATION METRICS ---');
  console.log(`Total Samples Evaluated: ${total}`);
  console.log(`True Positives (TP):     ${truePositives}`);
  console.log(`True Negatives (TN):     ${trueNegatives}`);
  console.log(`False Positives (FP):    ${falsePositives}`);
  console.log(`False Negatives (FN):    ${falseNegatives}`);
  console.log('--------------------------------------');
  console.log(`Accuracy:   ${accuracy.toFixed(2)}%`);
  console.log(`Precision:  ${precision.toFixed(2)}%`);
  console.log(`Recall:     ${recall.toFixed(2)}%`);
  console.log(`F1 Score:   ${f1.toFixed(2)}%`);
  console.log('============================================================\n');

  return {
    total,
    truePositives,
    trueNegatives,
    falsePositives,
    falseNegatives,
    accuracy: Number(accuracy.toFixed(2)),
    precision: Number(precision.toFixed(2)),
    recall: Number(recall.toFixed(2)),
    f1: Number(f1.toFixed(2)),
    results
  };
}

if (process.argv[1]?.endsWith('runBenchmark.js')) {
  runBenchmark();
}

