/**
 * EARTHMIND - Simulation Tools & What-If Engine Bridge
 * Provides deterministic simulation parameter manipulation, bounds checking,
 * and biophysical metric calculation.
 */

import { AppActionContext } from '../voice/VoiceActionExecutor';
import { SimulationParameters, SimulationResultMetrics } from '../types';
import { BASELINE_PARAMETERS, BASELINE_METRICS, computeSimulationMetrics } from '../domains/simulation/SimulationEngine';
import { InputValidator } from '../security/InputValidator';

export class SimulationTools {
  public static setVariable(
    variable: string,
    value: number,
    ctx: AppActionContext
  ): { success: boolean; message: string; params?: SimulationParameters; metrics?: SimulationResultMetrics } {
    const valid = InputValidator.validateSimulationVariable(variable, value);
    if (!valid.valid) {
      return { success: false, message: valid.error || 'Invalid simulation variable' };
    }

    const current = { ...ctx.simParams };
    const normalizedKey = variable.endsWith('Delta') ? variable : `${variable}Delta`;

    if (normalizedKey in current) {
      (current as any)[normalizedKey] = valid.normalizedValue;
      ctx.onUpdateSimParams(current);

      const metrics = computeSimulationMetrics(current);
      return {
        success: true,
        message: `${variable} adjusted to ${valid.normalizedValue > 0 ? '+' : ''}${valid.normalizedValue}%. Modeled biophysical metrics updated.`,
        params: current,
        metrics,
      };
    }

    return { success: false, message: `Unknown simulation variable: ${variable}` };
  }

  public static run(ctx: AppActionContext): { success: boolean; metrics: SimulationResultMetrics; message: string } {
    const metrics = computeSimulationMetrics(ctx.simParams);
    return {
      success: true,
      metrics,
      message: `Coupled simulation executed. Environmental Health Score: ${metrics.environmentalHealth}, Flood Exposure: ${metrics.floodRisk}, Heat Risk: ${metrics.heatRisk}.`,
    };
  }

  public static reset(ctx: AppActionContext): { success: boolean; params: SimulationParameters; message: string } {
    ctx.onUpdateSimParams({ ...BASELINE_PARAMETERS });
    return {
      success: true,
      params: BASELINE_PARAMETERS,
      message: 'All What-If simulation parameters have been reset to default scientific baseline.',
    };
  }

  public static simulateWhatIf(
    variable: string,
    delta: number,
    ctx: AppActionContext
  ): {
    success: boolean;
    baseline: typeof BASELINE_METRICS;
    scenario: SimulationResultMetrics;
    change: Record<string, number>;
    uncertainty: {
      provenance: string;
      confidence: number;
      marginOfErrorPct: number;
      disclaimer: string;
    };
    explanation: string;
    spokenSummary: string;
  } {
    // Apply variable update
    this.setVariable(variable, delta, ctx);
    const scenario = computeSimulationMetrics(ctx.simParams);
    const baseline = BASELINE_METRICS;

    const change = {
      environmentalHealth: Math.round((scenario.environmentalHealth - baseline.environmentalHealth) * 10) / 10,
      floodRisk: Math.round((scenario.floodRisk - baseline.floodRisk) * 10) / 10,
      heatRisk: Math.round((scenario.heatRisk - baseline.heatRisk) * 10) / 10,
      pollution: Math.round((scenario.pollution - baseline.pollution) * 10) / 10,
      waterStress: Math.round((scenario.waterStress - baseline.waterStress) * 10) / 10,
    };

    const deltaSign = change.floodRisk > 0 ? '+' : '';
    const spokenSummary = `In this EARTHMIND simulation, a ${delta > 0 ? '+' : ''}${delta}% shift in ${variable} adjusted flood risk from baseline ${baseline.floodRisk} to ${scenario.floodRisk} (${deltaSign}${change.floodRisk} delta). Uncertainty margin is ±16% based on coupled biophysical assumptions.`;

    const explanation = `BASELINE: Environmental Health ${baseline.environmentalHealth}, Flood Risk ${baseline.floodRisk}, Heat Risk ${baseline.heatRisk}. | SCENARIO: Health ${scenario.environmentalHealth}, Flood ${scenario.floodRisk}, Heat ${scenario.heatRisk}. | CHANGE: Health ${change.environmentalHealth}, Flood ${deltaSign}${change.floodRisk}, Heat ${change.heatRisk}. | UNCERTAINTY: ±16% modeled variance.`;

    return {
      success: true,
      baseline,
      scenario,
      change,
      uncertainty: {
        provenance: 'SIMULATED',
        confidence: 0.84,
        marginOfErrorPct: 16,
        disclaimer: 'In this EarthMind simulation, under current parameter assumptions,',
      },
      explanation,
      spokenSummary,
    };
  }

  public static explainResultChange(ctx: AppActionContext): {
    activeDeltas: Record<string, number>;
    strongestDriver: string;
    explanation: string;
  } {
    const params = ctx.simParams;
    const diffs: { key: string; delta: number; absDelta: number }[] = [];

    if (params.treeCoverDelta !== 0) diffs.push({ key: 'Tree Canopy Cover', delta: params.treeCoverDelta, absDelta: Math.abs(params.treeCoverDelta) });
    if (params.rainfallDelta !== 0) diffs.push({ key: 'Precipitation Intensity', delta: params.rainfallDelta, absDelta: Math.abs(params.rainfallDelta) });
    if (params.urbanizationDelta !== 0) diffs.push({ key: 'Urbanization Sprawl', delta: params.urbanizationDelta, absDelta: Math.abs(params.urbanizationDelta) });
    if (params.wasteDelta !== 0) diffs.push({ key: 'Municipal Waste', delta: params.wasteDelta, absDelta: Math.abs(params.wasteDelta) });
    if (params.waterDelta !== 0) diffs.push({ key: 'Water Retention', delta: params.waterDelta, absDelta: Math.abs(params.waterDelta) });
    if (params.trafficDelta !== 0) diffs.push({ key: 'Combustion Traffic', delta: params.trafficDelta, absDelta: Math.abs(params.trafficDelta) });
    if (params.energyEfficiencyDelta !== 0) diffs.push({ key: 'Energy Efficiency', delta: params.energyEfficiencyDelta, absDelta: Math.abs(params.energyEfficiencyDelta) });

    diffs.sort((a, b) => b.absDelta - a.absDelta);
    const strongest = diffs[0] ? diffs[0].key : 'Baseline Equilibrium';

    const activeDeltas: Record<string, number> = {};
    diffs.forEach((d) => { activeDeltas[d.key] = d.delta; });

    let explanation = '';
    if (diffs.length === 0) {
      explanation = 'The simulation is currently aligned with the default scientific baseline (0% policy deviations). No counterfactual changes have been applied.';
    } else {
      const top = diffs[0];
      explanation = `The simulation result shifted primarily due to ${top.key} (${top.delta > 0 ? '+' : ''}${top.delta}%). In this biophysical coupled model, this altered surface runoff infiltration and microclimate thermal absorption.`;
    }

    return {
      activeDeltas,
      strongestDriver: strongest,
      explanation,
    };
  }
}
