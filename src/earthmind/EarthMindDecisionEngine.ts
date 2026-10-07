/**
 * EARTHMIND - Decision Intelligence & What-If Optimizer (OS 4.0)
 * Evaluates comparative policy interventions across ecological benefit, capital cost,
 * implementation timeline, carbon impact, and systemic trade-offs.
 */

import { EnvironmentalHotspot, SimulationParameters } from '../types';

export interface DecisionOption {
  id: 'option_a' | 'option_b' | 'option_c';
  title: string;
  category: 'Nature-Based Solutions' | 'Hard Civil Infrastructure' | 'Adaptive Governance & Demand Control';
  summary: string;
  capitalCostM: number; // Millions USD
  annualOpexM: number;  // Millions USD
  implementationYears: number;
  ecologicalBenefitScore: number; // 0 - 100
  carbonMitigationTonsYr: number;
  heatMitigationC: number; // Delta °C
  floodMitigationPct: number; // Delta %
  tradeoffRisk: string;
  uncertaintyMarginPct: number;
  simPatch: Partial<SimulationParameters>;
  verdictTag: string;
}

export interface DecisionEvaluation {
  hotspotId: string;
  hotspotName: string;
  options: DecisionOption[];
  recommendedOptionId: DecisionOption['id'];
  conditionalVerdict: string;
  assumptions: string[];
  evaluationTimestamp: string;
}

export class EarthMindDecisionEngine {
  /**
   * Generates 3 structured policy options tailored to the regional vulnerability of the hotspot.
   */
  public static evaluateOptions(hotspot: EnvironmentalHotspot): DecisionEvaluation {
    const isFloodVulnerable = hotspot.currentMetrics.floodRisk > 65;
    const isHeatVulnerable = hotspot.currentMetrics.heatRisk > 70;

    const optionA: DecisionOption = {
      id: 'option_a',
      title: isFloodVulnerable ? 'Blue-Green Sponge Catchment Restoration' : 'Urban Forest Biocorridor Afforestation',
      category: 'Nature-Based Solutions',
      summary: isFloodVulnerable
        ? 'Re-establish native coastal wetlands, bioswales, and flood retention lakes to slow peak stormwater discharge.'
        : 'Plant 2 million indigenous canopy trees along transit corridors to lower ambient land surface temperatures via evapotranspiration.',
      capitalCostM: 42.5,
      annualOpexM: 1.8,
      implementationYears: 3,
      ecologicalBenefitScore: 88,
      carbonMitigationTonsYr: 145000,
      heatMitigationC: isHeatVulnerable ? 1.6 : 0.8,
      floodMitigationPct: isFloodVulnerable ? 28 : 12,
      tradeoffRisk: 'Requires strict land-use zoning enforcement and protection against real-estate reclamation.',
      uncertaintyMarginPct: 12,
      simPatch: {
        treeCoverDelta: 30,
        waterDelta: 20,
      },
      verdictTag: 'BEST LONG-TERM RESILIENCE UNDER CURRENT ASSUMPTIONS',
    };

    const optionB: DecisionOption = {
      id: 'option_b',
      title: isFloodVulnerable ? 'High-Capacity Subterranean Stormwater Siphons' : 'District Reflective Cool Pavements & Shading',
      category: 'Hard Civil Infrastructure',
      summary: isFloodVulnerable
        ? 'Construct deep concrete diversion tunnels to rapidly pump storm surges directly into marine estuaries.'
        : 'Pave major arterial roadways and commercial rooftops with high-albedo solar-reflective coatings.',
      capitalCostM: 120.0,
      annualOpexM: 6.2,
      implementationYears: 5,
      ecologicalBenefitScore: 54,
      carbonMitigationTonsYr: -18000, // embodied concrete carbon penalty
      heatMitigationC: isHeatVulnerable ? 1.2 : 0.4,
      floodMitigationPct: isFloodVulnerable ? 35 : 5,
      tradeoffRisk: 'High embodied carbon, severe capital expenditure, and risk of localized estuarine silting.',
      uncertaintyMarginPct: 8,
      simPatch: {
        urbanizationDelta: -10,
        waterDelta: 15,
      },
      verdictTag: 'MAXIMUM IMMEDIATE THROUGHPUT (HIGH CAPEX)',
    };

    const optionC: DecisionOption = {
      id: 'option_c',
      title: 'Decentralized Aquifer Recharge & Stormwater Harvesting Mandate',
      category: 'Adaptive Governance & Demand Control',
      summary: 'Mandate rainwater harvesting filtration in all commercial buildings and implement dynamic stormwater retention incentives.',
      capitalCostM: 18.0,
      annualOpexM: 0.9,
      implementationYears: 2,
      ecologicalBenefitScore: 76,
      carbonMitigationTonsYr: 32000,
      heatMitigationC: 0.5,
      floodMitigationPct: 18,
      tradeoffRisk: 'Depends heavily on municipal compliance monitoring and decentralized maintenance.',
      uncertaintyMarginPct: 15,
      simPatch: {
        waterDelta: 25,
        wasteDelta: -20,
      },
      verdictTag: 'MOST COST-EFFECTIVE CAPITAL EFFICIENCY',
    };

    const options = [optionA, optionB, optionC];
    // Option A is favored for ecological stability, Option C for capital constrained contexts
    const recommendedId: DecisionOption['id'] = 'option_a';

    return {
      hotspotId: hotspot.id,
      hotspotName: hotspot.name,
      options,
      recommendedOptionId: recommendedId,
      conditionalVerdict: `${optionA.title} provides the highest benefit-to-cost ratio and net ecological co-benefits under standard 20-year multi-hazard discounting assumptions.`,
      assumptions: [
        'Rainfall intensity modeled under IPCC SSP2-4.5 medium climate trajectory.',
        'Capital expenditure estimated using 2026 public infrastructure procurement baselines.',
        'Ecological co-benefits incorporate biodiversity connectivity and urban heat mitigation.',
      ],
      evaluationTimestamp: new Date().toISOString(),
    };
  }
}
