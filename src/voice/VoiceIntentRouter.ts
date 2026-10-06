import { ParsedVoiceCommand, VoiceSettingsConfig } from './VoiceTypes';
import { DEFAULT_VOICE_SETTINGS } from './VoiceSettings';

export interface RouteResult {
  actionable: boolean;
  requiresConfirmation: boolean;
  confirmationMessage?: string;
  responseSpeech: string;
  spokenResponse?: string;
  responseText: string;
  executionNote: string;
}

export function routeVoiceIntent(command: ParsedVoiceCommand, settings: VoiceSettingsConfig = DEFAULT_VOICE_SETTINGS): RouteResult {
  const result = routeVoiceIntentInternal(command, settings);
  if (!result.spokenResponse) {
    result.spokenResponse = result.responseSpeech;
  }
  return result;
}

function routeVoiceIntentInternal(command: ParsedVoiceCommand, settings: VoiceSettingsConfig): RouteResult {
  // 1. Confidence evaluation
  if (command.confidence < 0.4) {
    const hint = 'I did not catch that command clearly. Try saying "Show flood risk", "Open What-If", or "Increase tree cover by 20 percent".';
    return {
      actionable: false,
      requiresConfirmation: false,
      responseSpeech: 'I did not catch that command. Please try again.',
      responseText: hint,
      executionNote: `Low confidence (${Math.round(command.confidence * 100)}%)`,
    };
  }

  // Medium confidence: if between 0.4 and threshold, ask confirmation
  if (command.confidence < settings.confidenceThreshold && command.intent !== 'UNKNOWN') {
    const msg = `Did you mean: ${command.explanation}?`;
    return {
      actionable: false,
      requiresConfirmation: true,
      confirmationMessage: msg,
      responseSpeech: msg,
      responseText: msg,
      executionNote: 'Uncertain intent confidence',
    };
  }

  // 2. Destructive command check
  if (settings.requireConfirmationForDestructive && command.params.requiresConfirmation) {
    const confirmPrompt = command.params.confirmationPrompt || 'This action requires confirmation. Proceed?';
    return {
      actionable: false,
      requiresConfirmation: true,
      confirmationMessage: confirmPrompt,
      responseSpeech: confirmPrompt,
      responseText: confirmPrompt,
      executionNote: 'Destructive operation confirmation required',
    };
  }

  // 3. Map Intent to scientific, concise EarthMind spoken responses
  switch (command.intent) {
    case 'NAVIGATE': {
      const v = command.params.targetView || 'overview';
      const label = v.charAt(0).toUpperCase() + v.slice(1);
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: `Opening ${label}.`,
        responseText: `Navigated to ${label} view.`,
        executionNote: `Routed to ${v}`,
      };
    }

    case 'SELECT_LOCATION': {
      const name = command.params.locationName || 'selected region';
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: `Targeting ${name}.`,
        responseText: `Centered Earth digital twin on ${name}.`,
        executionNote: `Targeted hotspot: ${command.params.locationId}`,
      };
    }

    case 'SELECT_LAYER': {
      const layer = command.params.layer || 'health';
      const layerLabel = layer.replace('_', ' ');
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: `${layerLabel} overlay enabled.`,
        responseText: `Multispectral ${layerLabel} overlay activated.`,
        executionNote: `Overlay layer: ${layer}`,
      };
    }

    case 'HIDE_LAYERS': {
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: 'Hiding all multispectral layers.',
        responseText: 'Environmental layers disabled.',
        executionNote: 'All layers hidden',
      };
    }

    case 'SELECT_YEAR': {
      if (command.params.year) {
        return {
          actionable: true,
          requiresConfirmation: false,
          responseSpeech: `Viewing historical epoch ${command.params.year}.`,
          responseText: `Reconstructed planetary state for ${command.params.year}.`,
          executionNote: `Year set to ${command.params.year}`,
        };
      }
      const playState = command.params.enable ? 'Timelapse playback started.' : 'Timelapse paused.';
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: playState,
        responseText: playState,
        executionNote: 'Timeline playback toggled',
      };
    }

    case 'SET_SIMULATION_VARIABLE': {
      const name = command.params.variableName || 'Variable';
      const delta = command.params.delta || 0;
      const formattedDelta = delta > 0 ? `+${delta}%` : `${delta}%`;
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: `${name} adjusted to ${formattedDelta}. Simulation updated.`,
        responseText: `${name} shifted by ${formattedDelta}. Coupled biophysical feedback updated.`,
        executionNote: `${command.params.variable}: ${formattedDelta}`,
      };
    }

    case 'RUN_SIMULATION': {
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: 'Running the coupled simulation.',
        responseText: 'Biophysical simulation re-converged. Updated environmental health calculated.',
        executionNote: 'Simulation executed',
      };
    }

    case 'RESET_SIMULATION': {
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: 'Simulation reset to baseline.',
        responseText: 'All policy variables restored to baseline 0%.',
        executionNote: 'Simulation reset',
      };
    }

    case 'SAVE_SCENARIO': {
      const name = command.params.scenarioName || 'Custom Policy';
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: `Scenario ${name} saved to comparison matrix.`,
        responseText: `Scenario "${name}" recorded into persistent scenario lab.`,
        executionNote: `Saved scenario: ${name}`,
      };
    }

    case 'COMPARE_SCENARIOS': {
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: 'Opening scenario comparison lab.',
        responseText: 'Scenario comparison matrix loaded.',
        executionNote: 'Navigated to comparison lab',
      };
    }

    case 'ROTATE_EARTH': {
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: 'Resuming Earth rotation.',
        responseText: '3D Earth auto-rotation enabled.',
        executionNote: 'Earth rotation resumed',
      };
    }

    case 'STOP_ROTATE_EARTH': {
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: 'Earth rotation paused.',
        responseText: '3D Earth auto-rotation paused.',
        executionNote: 'Earth rotation stopped',
      };
    }

    case 'RESET_EARTH': {
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: 'Earth camera reset.',
        responseText: 'Default orbital camera orientation restored.',
        executionNote: 'Camera orientation reset',
      };
    }

    case 'ZOOM_EARTH': {
      const dir = command.params.zoomDirection || 'in';
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: dir === 'in' ? 'Zooming in.' : 'Zooming out.',
        responseText: `Adjusted camera zoom distance ${dir}.`,
        executionNote: `Zoom ${dir}`,
      };
    }

    case 'TOGGLE_ATMOSPHERE': {
      const on = command.params.enable ?? true;
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: on ? 'Atmosphere enabled.' : 'Atmosphere hidden.',
        responseText: `Atmospheric scattering shell ${on ? 'visible' : 'hidden'}.`,
        executionNote: `Atmosphere: ${on}`,
      };
    }

    case 'TOGGLE_CLOUDS': {
      const on = command.params.enable ?? true;
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: on ? 'Clouds enabled.' : 'Clouds hidden.',
        responseText: `Cloud layer ${on ? 'visible' : 'hidden'}.`,
        executionNote: `Clouds: ${on}`,
      };
    }

    case 'TOGGLE_NIGHT_LIGHTS': {
      const on = command.params.enable ?? true;
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: on ? 'Night lights enabled.' : 'Night lights hidden.',
        responseText: `Nocturnal city lights ${on ? 'visible' : 'hidden'}.`,
        executionNote: `Night lights: ${on}`,
      };
    }

    case 'GENERATE_REPORT': {
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: 'Generating environmental intelligence report.',
        responseText: 'Executive report dossier assembled with verified data lineage.',
        executionNote: 'Report generator opened',
      };
    }

    case 'EXPORT_REPORT': {
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: 'Exporting report dossier.',
        responseText: 'Report PDF export initiated.',
        executionNote: 'Report exported',
      };
    }

    case 'OPEN_EXHIBITION': {
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: 'Starting Science Expo exhibition mode.',
        responseText: 'Science Expo Presentation Mode activated for judges.',
        executionNote: 'Exhibition mode started',
      };
    }

    case 'CLOSE_EXHIBITION': {
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: 'Exiting exhibition mode.',
        responseText: 'Closed exhibition presentation overlay.',
        executionNote: 'Exhibition mode closed',
      };
    }

    case 'EXHIBITION_NEXT': {
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: 'Next section.',
        responseText: 'Advanced to next presentation slide.',
        executionNote: 'Exhibition next',
      };
    }

    case 'EXHIBITION_PREV': {
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: 'Previous section.',
        responseText: 'Navigated to previous presentation slide.',
        executionNote: 'Exhibition previous',
      };
    }

    case 'EXHIBITION_EXPLAIN': {
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: 'Displaying scientific methodology and data provenance.',
        responseText: 'Presented biophysical coupling equations and satellite lineage.',
        executionNote: 'Methodology shown',
      };
    }

    case 'COMPOUND': {
      const subNotes = command.subCommands?.map((s) => s.explanation).join('; ') || 'Sequential actions';
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: 'Executing compound actions.',
        responseText: `Applying sequential commands: ${subNotes}`,
        executionNote: `Compound: ${command.subCommands?.length || 2} steps`,
      };
    }

    case 'START_DEMO': {
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: 'Starting automated guided demonstration.',
        responseText: 'Guided demo sequence initiated.',
        executionNote: 'Demo mode started',
      };
    }

    case 'STOP_DEMO': {
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: 'Guided demo ended.',
        responseText: 'Demo playback stopped.',
        executionNote: 'Demo mode stopped',
      };
    }

    case 'STOP_SPEAKING': {
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: '',
        responseText: 'Speech synthesis halted.',
        executionNote: 'Speech stopped',
      };
    }

    case 'SET_SPEECH_SPEED': {
      const rate = command.params.speechRate || 1.0;
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: `Speech speed set to ${rate}x.`,
        responseText: `Voice rate adjusted to ${rate}x.`,
        executionNote: `Rate: ${rate}x`,
      };
    }

    case 'ASK_AI': {
      const q = command.params.question || 'Explain this area';
      return {
        actionable: true,
        requiresConfirmation: false,
        responseSpeech: 'Consulting EarthMind AI intelligence.',
        responseText: `Consulting AI with question: "${q}"`,
        executionNote: 'Dispatched to AI Assistant',
      };
    }

    default:
      return {
        actionable: false,
        requiresConfirmation: false,
        responseSpeech: 'I did not recognize that command. Try "Open What If" or "Show flood risk".',
        responseText: `Unrecognized command: "${command.rawText}"`,
        executionNote: 'Unknown intent',
      };
  }
}
