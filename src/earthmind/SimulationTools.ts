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
}
